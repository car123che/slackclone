// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import firebase from "firebase/app"; //esta en node_modules i do not have to put the complete path it is there
import store from "./store";
import auth from "firebase/auth";

Vue.config.productionTip = false;

//initialize firebase
var firebaseConfig = {
  apiKey: "AIzaSyDmrI-RNSxdQ7I0HCHmAV50bkJ8Dc55TI8",
  authDomain: "vue-slackclone.firebaseapp.com",
  projectId: "vue-slackclone",
  storageBucket: "vue-slackclone.appspot.com",
  messagingSenderId: "259421703334",
  appId: "1:259421703334:web:a5f19668823bbb79fbf867"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
window.firebase = firebase; //with this i do not have to import firebase in all modules

const unsubscribe = firebase.auth().onAuthStateChanged(user => {
  store.dispatch("setUser", user);

  new Vue({
    el: "#app",
    router,
    store,
    components: { App },
    template: "<App/>"
  });

  unsubscribe();
});
