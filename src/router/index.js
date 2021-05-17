import Vue from "vue";
import Router from "vue-router";


//pages
import Chat from '@/pages/Chat';
import Login from '@/pages/Login';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Chat",
      component: Chat
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    }
  ],
  mode: "history"
});
