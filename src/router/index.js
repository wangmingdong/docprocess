import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
// import TaskList from '@/components/TaskList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    // }, {
    //   path: '/',
    //   name: 'TaskList',
    //   component: TaskList
    }
  ]
})
