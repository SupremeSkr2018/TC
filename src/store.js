import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    date: '',
    cookieVal: 'tokenSupply_ema_TAOCI',//正式
    // cookieVal: 'tokenSupply_demo_TAOCI',//测试
  },
  getters:{},
  mutations:{
    changeDate(state, param){
      state.date = param
    }
  },
  actions:{}
})