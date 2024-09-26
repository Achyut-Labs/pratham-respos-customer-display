import { boot } from 'quasar/wrappers'

export default boot(({ router }) => {
  router.beforeEach((to, _from, next) => {
    // 1. check for restaurant configurations
    const localSocketServerIp = localStorage.getItem('localSocketServerIp')
    console.log(localSocketServerIp)
    console.log(to.fullPath)
    if(!localSocketServerIp && to.fullPath !== '/start') {
      next('/start')
    } else {
      next()
    }
  })
})
