// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';
import VueResource from 'vue-resource';


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.component('Icon', Icon);
Vue.use(VueResource);

// Vue.http.options.emulateJSON = true
/* eslint-disable no-new */
//路由验证
router.beforeEach((to, from, next) => {

  console.log(to);

  var token = sessionStorage.getItem("accessToken");
  if (token) {
    console.log(1);
    if (to.path == "/") {
      next("/layout/dashboard");
    } else {
      next();
    }
  } else {
    if (to.path == "/login") {
      console.log(2);
      next();
    } else {
      console.log(3);
      next("/login");
    }
  }
});
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
