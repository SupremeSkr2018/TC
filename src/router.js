import Vue from 'vue'
import Router from 'vue-router'
//组件模块
import Home from './views/Home'
import Staff from './views/Staff'
import Goods from './views/Goods'
import AddQI from './views/AddQI'
import Products from './views/Products'
import Detail from './views/Detail'
import Login from './views/Login'
import ProductTemplate from './views/ProductTemplate';
import halfGreenjadeIn from './views/halfGreenjadeIn';
import halfGreenjadeOut from './views/halfGreenjadeOut';
import glazeGreenjadeIn from './views/glazeGreenjadeIn';
import climbingKilnWhiteIn from './views/climbingKilnWhiteIn';
import climbingKilnWhiteOut from './views/climbingKilnWhiteOut';
import whiteInventory from './views/whiteInventory';
import greenInventory from './views/greenInventory';
import greenBadCollection from './views/greenBadCollection';
import halfBadCollection from './views/halfBadCollection';
import whiteBadCollection from './views/whiteBadCollection';
import glazeBadCollection from './views/glazeBadCollection';
import grouting from './views/Grouting';
import Receipt from './views/Receipt';
import badBillet from './views/badBillet';



Vue.use(Router)

export default new Router ({
  routes: [
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/Staff',
      name: 'Staff',
      component: Staff,
      meta:{
        title:'必要-质量采集',
        content:'',
        type: 'login',
      }
    },
    {
      path: '/Goods',
      name: 'Goods',
      component: Goods,
      meta:{
        title:'必要-质量采集',
        content:'',
        type: 'login',
      }
    },
    {
      path: '/AddQI',
      name: 'AddQI',
      component: AddQI,
      meta:{
        title:'必要-质量采集',
        content:'',
        type: 'login',
      }
    },
    {
      path: '/ProductTemplate',
      name: 'ProductTemplate',
      component: ProductTemplate,
      meta: {
        title:'必要-质量采集',
        content:'',
        type: 'login',
      },
    },
    {
      path: '/Products',
      name: 'Products',
      component: Products,
      meta:{
        title:'必要-质量采集',
        content:'',
        type: 'login',
      }
    },
    {
      path: '/Detail',
      name: 'Detail',
      component: Detail,
      meta:{
        title:'必要-质量采集',
        content:'',
        type: 'login',
      }
    },
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta:{
        title:'必要-质量采集',
        content:'',
        type: '',
      }
    },
    {
      path: '/halfGreenjadeIn',
      name: 'halfGreenjadeIn',
      component: halfGreenjadeIn,
      meta: {
        title:'必要-质量采集',
        content:'',
        type: '',
      },
    },
    {
      path: '/halfGreenjadeOut',
      name: 'halfGreenjadeOut',
      component: halfGreenjadeOut,
      meta: {
        title:'必要-质量采集',
        content:'',
        type: '',
      },
    },
    {
      path: '/glazeGreenjadeIn',
      name: 'glazeGreenjadeIn',
      component: glazeGreenjadeIn,
      meta: {
        title:'必要-质量采集',
        content:'',
        type: '',
      },
    },    
    {
      path: '/climbingKilnWhiteIn',
      name: 'climbingKilnWhiteIn',
      component: climbingKilnWhiteIn,
      meta: {
        title:'必要-质量采集',
        content:'',
        type: '',
      },
    },
    {
      path: '/climbingKilnWhiteOut',
      name: 'climbingKilnWhiteOut',
      component: climbingKilnWhiteOut,
      meta: {
        title:'必要-质量采集',
        content:'',
        type: '',
      },
    },    
    {
      path: '/whiteInventory',
      name: 'whiteInventory',
      component: whiteInventory,
      meta: {
        title:'必要-质量采集',
        content:'',
        type: '',
      },
    },
    {
      path: '/greenInventory',
      name: 'greenInventory',
      component: greenInventory,
      meta: {
        title:'必要-质量采集',
        content:'',
        type: '',
      },
    },    
    {
      path: '/greenBadCollection',
      name: 'greenBadCollection',
      component: greenBadCollection,
      meta: {
        title:'必要-质量采集',
        content:'',
        type: '',
      },
    },
    {
      path: '/halfBadCollection',
      name: 'halfBadCollection',
      component: halfBadCollection,
      meta: {
        title:'必要-质量采集',
        content:'',
        type: '',
      },
    },
    {
      path: '/whiteBadCollection',
      name: 'whiteBadCollection',
      component: whiteBadCollection,
      meta: {
        title:'必要-质量采集',
        content:'',
        type: '',
      },
    },
    {
      path: '/glazeBadCollection',
      name: 'glazeBadCollection',
      component: glazeBadCollection,
      meta: {
        title:'必要-质量采集',
        content:'',
        type: '',
      },
    },
    {
      path: '/grouting',
      name: 'grouting',
      component: grouting,
      meta: {        
        title:'必要-注浆采集',
        content:'',
        type: '',
      },
    },
    {
      path: '/Receipt',
      name: 'Receipt',
      component: Receipt,
      meta: {
        title:'必要-收坯采集',
        content:'',
        type: '',
      },
    },
    {
      path: '/badBillet',
      name: 'badBillet',
      component: badBillet,
      meta: {
        title:'必要-损坯采集',
        content:'',
        type: '',
      },
    },        
  ]
})