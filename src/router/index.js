import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../components/Home.vue'
import signin from '../components/SignIn.vue'
import signup from '../components/SignUp.vue'
import chat from '../components/Chat.vue'
Vue.use(VueRouter)

const ifUserAuthentificated = function(to,from,next){
  if(localStorage.getItem('username')){
    next();
  }
  else{
    router.push('/signin');
  }
}

const routes = [
   {
     path: '/',
     name: 'Home',
     component: home
   },
  {
    path: '/signin',
    name: 'SignIn',
    component: signin
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: signup
  },
  {
    path: '/chat',
    name: 'Chat',
    component: chat,
    beforeEnter: ifUserAuthentificated
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
