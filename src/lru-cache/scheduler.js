// 搜集handler
const queue = []
let wait = false

// 将callback函数的执行时机放到下一个微任务中
function nextTick(callback) {
  Promise.resolve().then(callback)
}

function resetSchedulerState() {
  queue.length = 0
  wait = false
}

function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i += 1) queue[i]()
  resetSchedulerState()
}

function run(handler) {
  // 如果队列中已经有handler了，那不需要重复添加
  if (!queue.includes(handler)) queue.push(handler)
  if (!wait) {
    wait = true
    nextTick(flushSchedulerQueue)
  }
}

export default run