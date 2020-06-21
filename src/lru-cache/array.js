import observe from './observe'
import run from './scheduler'

const methodsToPatch = [
  'pop',
  'push',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
]

// 如果obj不是经过vue处理的数组，那么arrayProto一般就是Array.prototype
// 如果是，那么是一个原型指向Array.prototype的对象，这个对象对数组的一些
// 方法进行了重写
function protoAugment(obj, arrayProto) {
  if (protoAugment.proto) {
    Object.setPrototypeOf(obj, protoAugment.proto)
    return
  }
  const proto = Object.create(arrayProto)
  methodsToPatch.forEach((method) => {
    Object.defineProperty(proto, method, {
      configurable: true,
      enumerable: true,
      writable: false,
      value: function (...args) {
        // 重点, 调用数组的push等方法时需要取出handler然后调用run方法
        // run函数的逻辑后面讲，先不管
        const handler = this.__cache__
        run(handler)
        const origin = arrayProto[method]
        const result = origin.apply(this, args)
        // 保存新增的数组元素
        let inserted
        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args
            break
          case 'splice':
            inserted = args.slice(2)
            break
        }
        // 对于新增元素，需要进行observe
        // 需要注意先调用原型上对应的method方法，然后在执行observe
        // 原因是因为Vue会对新增元素进行响应式处理，所以observe逻辑
        // 要放在其后面
        if (inserted) observe(inserted)
        return result
      }
    })
  })
  Object.setPrototypeOf(obj, proto)
  protoAugment.proto = proto
}

export default protoAugment