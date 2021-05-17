import Vue from "vue";
import Router from "vue-router";


//pages
import Chat from '@/pages/Chat';
import Login from '@/pages/Login';


//firebase
import auth from 'firebase/auth'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Chat",
      component: Chat,
      beforeEnter: (to, from, next) => {
        if (!firebase.auth().currentUser) {
            next('/login');
        }else{
          next();
        }
      }
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    }
  ],
  mode: "history"
});
