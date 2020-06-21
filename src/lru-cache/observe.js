import run from './scheduler'
import protoAugment from './array'

// 遍历数组元素做响应式处理
function observeArray(array, handler) {
  for (let i = 0; i < array.length; i += 1) {
    observe(array[i], handler)
  }
}

// 对对象做响应式处理
function defineReactive(obj, key, value, handler) {
  // 如果value是对象或者数组那么递归observe
  observe(value)
  // 这里获取obj对应key属性的属性描述符
  // 如果这个obj已经是响应式对象，那么我们要获取它get和set
  // 然后对get和set做一层包装，注入一些逻辑
  const descriptor = Object.getOwnPropertyDescriptor(obj, key)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 这里调用run方法将handler作为参数传入
      // 这个函数的实现逻辑后面讲，这里先不管
      run(handler)
      return descriptor.get ? descriptor.get() : value
    },
    set(newVal) {
      run(handler)
      // 这里需要注意执行的先后顺序，需要先执行descriptor.set,
      // 然后在对newVal进行observe
      // 首先需要明白的是，如果obj已经是响应式对象，那我们的响应式处理
      // 是在原始的get, set上在进行一次包装而已
      // 所以newVal需要先经过原始的set处理后成为一个响应式对象(以Vue为例)，然后在这基础上在进行observe.
      // 如果先observe，在调用原始的set，那么observe所做的事情都没有
      // 意义，因为newVal的get, set函数的逻辑只取决于原始的set函数，
      // observe的所做的事情会被覆盖掉
      // 举个例子，有一个树，我们要将它做成一把锤子，那么原始的set逻辑
      // 就是要将树做成锤子的形状，observe的逻辑就是在以有的锤子基础上
      // 加一些着色和雕饰，这样的逻辑就是正常的
      // 如果我们先着色和雕饰，那么是没有意义的，因为莫得了个锤子
      if (descriptor.set) descriptor.set(newVal)
      if (value === newVal) return
      value = observe(newVal)
    },
  })
}

// 注意hanlder这个参数，如果不清楚handler是什么可以看一下index.js那部分
function observe(obj, handler) {
  if (typeof obj === 'object' && obj !== null) {
    // 注意这里我们将handler绑定到obj的__cache__属性上
    // 它会在对数组类型做响应式处理的时候用到，这里先记住有这个东西
    obj.__cache__ = handler
    if (Array.isArray(obj)) {
      // 这个分支就是负责数组的响应式处理, 这里先不用管
      protoAugment(obj, Object.getPrototypeOf(obj))
      observeArray(obj)
    } else {
      Object.keys(obj).forEach((key) => {
        defineReactive(obj, key, obj[key], handler)
      })
    }
  }
  return obj
}

export default observe