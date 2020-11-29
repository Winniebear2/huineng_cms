import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect:'/Login',
    },
    {
      path:'/Login',
      component: resolve => require(['../components/Login.vue'], resolve),
    },
    {
      path:'/Home',
      component: resolve => require(['../components/Home.vue'], resolve),
      children:[
        {
          path:'/News',
          component:resolve => require(['../components/News.vue'], resolve),
        },
        {
          path:'/Product',
          component:resolve => require(['../components/Product.vue'], resolve),
        },
        {
          path:'/Project',
          component:resolve => require(['../components/Project.vue'], resolve),
        },
        {
          path:'/Message',
          component:resolve => require(['../components/Message.vue'], resolve),
        },
        {
          path:'/Changepw',
          component:resolve => require(['../components/Changepw.vue'], resolve),
        },
        {
          path:'/Honor',
          component:resolve => require(['../components/Honor.vue'], resolve),
        },
        {
          path:'/Address',
          component:resolve => require(['../components/Address.vue'], resolve),
        },
        {
          path:'/upload',
          component:resolve => require(['../components/upload.vue'], resolve),
        }
      ]
    }
  ]
})

router.beforeEach((to,from,next)=>{
  const username = window.sessionStorage.getItem('save_username')
  if(to.path == '/Login') return next()
  if(!username){
    next('/Login')
  }
  else{
    next();
  }
})

export default router
