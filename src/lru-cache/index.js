import observe from './observe'
import run from './scheduler'

const config = {
  maxAge: 1000 * 60, // 默认一分钟
}

class Cache {
  constructor({ maxAge } = {}) {
    // 缓存时间
    this.maxAge = maxAge || config.maxAge
    // 存储缓存数据
    this.cache = {}
  }
    
  // 开启一个定时器
  timing(key, maxAge) {
    return setTimeout(() => {
      // 超过指定时间清除缓存数据
      delete this.cache[key]
    }, maxAge)
  }
    
  // 重置定时器
  retiming(key) {
    if (!this.cache[key]) return
    const { id, maxAge } = this.cache[key]
    clearTimeout(id)
    this.cache[key].id = this.timing(key, maxAge)
  }
    
  get(key) {
    if (!this.cache[key]) return null
    run(() => {
      this.retiming(key)
    })
    return this.cache[key].value
  }
    
  // 这里注意option
  // optiion有两个可选属性，maxAge和deep
  // maxAge可以单独设置某个key的数据缓存时间
  // deep默认为false, 也就是调用get的时候才会重置定时器
  // 如果设置为true, 那么会对数据做响应式处理
  // 效果是当我们访问或修改缓存数据的某个属性时也会重置定时器
  set(key, value, option = {}) {
    // 对于基本数据类型和函数是不做缓存的，您也可以按需更改
    if (typeof value === 'object' && value !== null) {
      // 如果key重复，那么先清除定时器和缓存数据
      if (this.cache[key]) {
        const id = this.cache[key].id
        clearTimeout(id)
        delete this.cache[key]
      }
      // 当deep为true时，会对value做响应式处理, 在访问或修改数据时
      // 会触发get或set方法(注意这里的get和set是调用Object.defineProperty
      // 时设置的存取描述符get，set方法)，那么就会调用这个handler方法
      // 先记住有这个么handler函数就行，后面代码会用到，到时候就清楚了
      const handler = () => {
        console.log(1)
        this.retiming(key)
      }
      // 如果没有配置option的maxAge属性，那么使用默认值
      const maxAge = option.maxAge || this.maxAge
      this.cache[key] = {
        maxAge,
        id: this.timing(key, maxAge),
        value: option.deep ? observe(value, handler) : value,
      }
    }
  }
}

export default Cache