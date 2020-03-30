import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import $ from 'jquery'

Vue.prototype.axios = axios;

import devMixin from './mixins/mixins-dev'
Vue.mixin(devMixin)

Vue.config.productionTip = false;
Vue.config.devtools = true;//true：开启devtools开发调试工具； false:关闭

axios.defaults.baseURL = 'https://ema.biyaoema.com/productionSystem-webLogin' //正式
// axios.defaults.baseURL = 'http://d.biyaoema.com/productionSystem-webLogin' //测试  
// axios.defaults.baseURL = 'http://qgxx5u.natappfree.cc' //测试  
// axios.defaults.baseURL = 'http://172.20.10.13:8091' //测试


//拦截判断当前页面是否需要登陆，登陆后才可查看
router.beforeEach((to, from, next) => {
  const type = to.meta.type;// 判断该路由是否需要登录权限
  // next()
  if (type === 'login') {
    //需要登陆
    if(document.cookie.indexOf('tokenSupply_ema_TAOCI') > -1){ //正式
    // if(document.cookie.indexOf('tokenSupply_demo_TAOCI') > -1){ //测试
      next()
    }else{
      next('/')
    }
  } else {
    next()
  }
  
   /* 路由发生变化修改页面meta */
 if(to.meta.content){
  let head = document.getElementsByTagName('head');
  let meta = document.createElement('meta');
  meta.content = to.meta.content;
  head[0].appendChild(meta)
 }
  if (to.meta.title) {
    document.title = to.meta.title;
   }
   next()  
})

// 获取地址栏参数
String.prototype.myQueryUrlParameter = function myQueryUrlParameter() {
  let reg = /[?&]([^?&=]+)(?:=([^?&=]*))?/g, obj = {};
  this.replace(reg, (...arg) => {
    let [, key, value] = arg;
    obj[key] = decodeURIComponent(value); //=> 此处获取的时候可以进行解码
  });
  return obj;
}

window.addEventListener("online",function() {
  //alert("网络连接已建立");
  sessionStorage.setItem('online', true);
});
window.addEventListener("offline",function() {
  //alert("网络连接已断开");
  sessionStorage.setItem('online', false);
});

new Vue({
  render: h => h(App),
  router,
  store,
  $
}).$mount('#app')
