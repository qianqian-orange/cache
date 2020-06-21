<template>
  <div>
    <p>
      设置deep为false, maxAge为8s,
      首次加载cache中没有缓存数据，那么会设置缓存数据，此时可以看到console控制台打印set cache
      同时还设置一个定时器在6s后会修改缓存数据，当页面发生改变后我们路由切回首页，等待4s后，在切回来
      我们发现控制台打印set cache，说明缓存数据被清空了
    </p>
    <ul>
      <li v-for="item in list" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
import cache from '../cache'

export default {
  name: 'A',
  data() {
    return {
      list: [],
    }
  },
  mounted() {
    if (cache.get('A')) {
      this.list = cache.get('A')
      return
    }
    console.log('set cache')
    this.list = ['zhangsan', 'lisi']
    cache.set('A', this.list, {
      deep: false,
      maxAge: 1000 * 8,
    })
    setTimeout(() => {
      this.list.push('wangwu')
    }, 6000)
  },
}
</script>