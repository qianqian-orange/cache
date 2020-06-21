<template>
  <div>
    <p>
      与第一类不同的是设置deep为true，那么意味着修改缓存数据会重新定时，那么页面改变后我们切回首页，
      等待4s后在切回来，那么控制台没有打印set cache, 说明缓存数据还在
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
    if (cache.get('B')) {
      this.list = cache.get('B')
      return
    }
    console.log('set cache')
    this.list = ['zhangsan', 'lisi']
    cache.set('B', this.list, {
      deep: true,
      maxAge: 1000 * 8,
    })
    setTimeout(() => {
      this.list.push('sdfds')
    }, 6000)
  },
}
</script>