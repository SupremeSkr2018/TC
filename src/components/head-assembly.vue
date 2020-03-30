<template>
  <header class="head">
    <div class="left">
      <a :href="axios.defaults.baseURL"  v-if="showHome">
        <img :src="img" alt="">
      </a>
      <a @click="baseUrl()" v-if="showHome" class="today">当日记录</a>
      <span v-if="showWorker" class="workerName"><label>当前员工：</label>{{ worker.name }}</span>
      <!-- <span v-if="showProductName" class="workerName">当前产品：<input type="text" v-model="selectedProCode" style="width:100px;display:inline-block"></span> -->
    </div>

    <div class="middle" v-show="showTitle">
      <p class="title">{{title}}</p>
    </div>

    <div class="middle" v-show="showWare">
      <select v-model="ware" @change="setWare">
        <option v-for="(item, index) in wareHouse" :key="index">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="middle" v-show="showWhite">
      <select v-model="ware2" @change="setWare2">
        <option v-for="(item, index) in whiteWareHouse" :key="index">
          {{ item.name }}
        </option>
      </select>
    </div>    

    <div class="right">
      <input class="btn date" type="date" v-model="dateCJ" />
    </div>
  </header>
</template>

<script>
import { stringify } from 'querystring';
export default {
  name: 'head-assembly',
  data(){
    return {
      msg: '当日质检详情',
      dateCJ: '',
      worker:{},
      img: require("../assets/home.png"),
      todayUrl: null,
      urlPrefix:'http://d.biyaoema.com:8091/productionSystem-webLogin/',
      // urlPrefix:'https://ema.biyaoema.com/productionSystem-webLogin/',
      urlName:'',
      urlData:{},
      title:'',
      ware:'',
      ware2:'',
      sloc:null,
      wareHouse:[
        {name:'青坯库半检车间',id:2},
        {name:'青坯库施釉车间',id:3}
      ],
      whiteWareHouse:[
        {name:'白坯库',id:2},
      ],            
    }
  },
  props:{
    btns: {
      type: Array,
      default: () => []
    },
    show:{
      type: Boolean,
      default:()=> true
    },
    yaoluId:{
      type: (Number,String),
      default:()=> ''
    },
    yaoluList:{
      type: Array,
      default:()=>[]
    },
    showWorker:{
      type: Boolean,
      default:()=> true
    },
    showHome:{
      type: Boolean,
      default:()=> false
    },
    showWare:{
      type: Boolean,
      default:()=> false
    },
    showWhite:{
      type: Boolean,
      default:()=> false
    },    
    showTitle:{
      type: Boolean,
      default:()=> false
    },        
    showProductName:{
      type: Boolean,
      default:()=> false
    },
    selectedProCode:{
      type: (Number,String),
      default:()=> ''
    },       
  },

  created(){
    let d = new Date();
    let yyyy = d.getFullYear();
    let mm = d.getMonth()+1;
    if(mm < 10) mm = '0'+ mm
    let dd = d.getDate();
    if(dd < 10) dd = '0' + dd;
    this.todayUrl = '/Collection/qualityEdit/' + dd + '?month=' + yyyy + '-' + mm

    //员工
    if(sessionStorage.getItem('worker')){
      this.worker = JSON.parse(sessionStorage.getItem('worker'))
    }
    //时间
    if(sessionStorage.getItem('dateCJ')){
      this.dateCJ = sessionStorage.getItem('dateCJ')
    } else {
      this.dateCJ = this.getTime()
    }
  },
  computed:{
    yalu:{
      get () {
        return this.yaoluId
      },
      set (n) {
        sessionStorage.setItem('yaoluId', n)
        this.$emit('newyaoluId', n)
      }
    },     
  },
  mounted(){
    this.getUrlName()
  },
  methods:{
    getTime(){
      let d = new Date();
      let yyyy = d.getFullYear();
      let mm = d.getMonth()+1;
      if(mm < 10) mm = '0'+ mm
      let dd = d.getDate();
      if(dd < 10) dd = '0' + dd
      let date = yyyy + '-' + mm + '-' + dd;
      return date
    },
    setWare(){
      this.$emit('ware',this.ware)
    },
    setWare2(){
      this.$emit('ware2',this.ware2)
    },    
    getUrlName(){
      if(this.$route.name == 'whiteBadCollection'){
          let dat = {
              formCode:'020',
              slocId:4,
              time:'1',
              pageNumber:1
          }
        this.urlData = dat = encodeURIComponent(encodeURIComponent(JSON.stringify(dat)));                  
        return this.urlName = 'adobeDamageRecord/selectAdobeDamageRecord'
      }
      if(this.$route.name == 'whiteInventory'){
        this.title = '白坯盘点'
          let dat = {
              slocId:4,
              time:'1',
              formCode:'020',
              pageNumber:1
          }
        this.urlData = dat = encodeURIComponent(encodeURIComponent(JSON.stringify(dat)));                  
        return this.urlName = 'stockRecord/selectInventoryRecord'
      }
      if(this.$route.name == 'greenInventory'){
        this.title = '青坯盘点'   
          let dat = {
              time:'1',
              formCode:'050',
              pageNumber:1
          }
        this.urlData = dat = encodeURIComponent(encodeURIComponent(JSON.stringify(dat)));                  
        return this.urlName = 'stockRecord/selectInventoryRecord'
      }      
      if(this.$route.name == 'climbingKilnWhiteOut'){
        this.title = '白坯出库'
          let dat = {
              moveType:2,
              formCode:'020',
              slocId:4,
              time:'1',
              pageNumber:1
          }
        this.urlData = dat = encodeURIComponent(encodeURIComponent(JSON.stringify(dat)));                  
        return this.urlName = 'stockRecord/selectStockRecord'
      }
      if(this.$route.name == 'climbingKilnWhiteIn'){
        this.title = '白坯入库'
          let dat = {
              moveType:1,
              formCode:'020',
              slocId:4,
              time:'1',
              pageNumber:1
          }
        this.urlData = dat = encodeURIComponent(encodeURIComponent(JSON.stringify(dat)));                  
        return this.urlName = 'stockRecord/selectStockRecord'
      }   
      if(this.$route.name == 'glazeGreenjadeIn'){
        this.title = '施釉车间-青坯入库'
          let dat = {
              moveType:1,
              formCode:'050',
              slocId:3,
              time:'1',
              pageNumber:1
          }
        this.urlData = dat = encodeURIComponent(encodeURIComponent(JSON.stringify(dat)));                  
        return this.urlName = 'stockRecord/selectStockRecord'
      }
      if(this.$route.name == 'halfGreenjadeOut'){
        this.title = '半检车间-青坯出库'
          let dat = {
              moveType:2,
              formCode:'050',
              slocId:2,
              time:'1',
              pageNumber:1
          }
        this.urlData = dat = encodeURIComponent(encodeURIComponent(JSON.stringify(dat)));                  
        return this.urlName = 'stockRecord/selectStockRecord'
      }
      if(this.$route.name == 'halfGreenjadeIn'){
        this.title = '半检车间-青坯入库'
          let dat = {
              moveType:1,
              formCode:'050',
              slocId:2,
              time:'1',
              pageNumber:1
          }
        this.urlData = dat = encodeURIComponent(encodeURIComponent(JSON.stringify(dat)));                  
        return this.urlName = 'stockRecord/selectStockRecord'
      }
      if(this.$route.name == 'glazeBadCollection'){
        this.title = '施釉车间-坏坯采集'
          let dat = {
              formCode:'050',
              slocId:3,
              time:'1',
              pageNumber:1
          }
        this.urlData = dat = encodeURIComponent(encodeURIComponent(JSON.stringify(dat)));                  
        return this.urlName = 'adobeBadRecord/selectAdobeBadRecord'
      }
      if(this.$route.name == 'halfBadCollection'){
        this.title = '半检车间-坏坯采集'
          let dat = {
              formCode:'050',
              slocId:2,
              time:'1',
              pageNumber:1
          }
        this.urlData = dat = encodeURIComponent(encodeURIComponent(JSON.stringify(dat)));                  
        return this.urlName = 'adobeBadRecord/selectAdobeBadRecord'
      }
      if(this.$route.name == 'whiteBadCollection'){
        if(this.ware2 == '白坯库') this.sloc = 4;
        if(this.ware2 == null) this.sloc = null;        
        this.title = '白坯-损坯采集'
          let dat = {
              formCode:'020',
              slocId:this.sloc,
              time:'1',
              pageNumber:1
          }
        this.urlData = dat = encodeURIComponent(encodeURIComponent(JSON.stringify(dat)));                  
        return this.urlName = 'adobeDamageRecord/selectAdobeDamageRecord'
      }
      if(this.$route.name == 'greenBadCollection'){
        this.title = '青坯-损坯采集'
        if(this.ware == '青坯库半检车间') this.sloc = 2;
        if(this.ware == '青坯库施釉车间') this.sloc = 3;
        if(this.ware == null) this.sloc = null;          
          let dat = {
              formCode:'050',
              slocId:this.sloc,
              time:'1',
              pageNumber:1
          }
        this.urlData = dat = encodeURIComponent(encodeURIComponent(JSON.stringify(dat)));                  
        return this.urlName = 'adobeDamageRecord/selectAdobeDamageRecord'
      }                                                                     
    },
    baseUrl(){
      let url = this.urlPrefix+ this.urlName + "?data=" + this.urlData
      window.location.href = url;
    } 
  },
  watch:{
    dateCJ(n){
      sessionStorage.setItem('dateCJ', n)
    },
    yalu(n){
      sessionStorage.setItem('yaoluId', n)
    },    
  }
}
</script>

<style scoped>
  .head{
    height: 60px;
    padding: 10px 20px 0;
    border-bottom: 1px solid #ddd;
    display: flex;
  }
  .head > div{
    float: left;
    width: 33.33%;
  }
  .head .left{
    text-align: left;
    flex: 1;
    display: flex;
  }
  .left a{
    display: inline-block;
    width: 44px;
    height: 44px;
    justify-content: center;
    align-items: center;
  }
  .left a img{display: block; width: 80%;}
  .left .today{
    width: 80px;
    height: 40px;
    line-height: 40px;
    background-color: #409eff;
    color: #fff;
    border-radius: 5px;
    text-align: center;
    margin-left: 10px;
    cursor: default
  }
  .head > div span,select{
    display: inline-block;
    vertical-align: bottom;
    height: 40px;
    line-height: 40px;
    padding: 0 5px; 
  }
  .head .left span.workerName{padding:0; font-size:16px;}
  select{
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    width: 100%;
    max-width: 100px;
  }
  .head .middle{
    text-align: center;
    flex: 1;
  }
  .head .right{
    float: right;
    width: 33.33%;
    min-width: 150px;
    text-align: right;
  }
  .date{
    width: 100%;
    max-width: 180px;
    height: 40px;
    padding: 0 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #333;
  }
  .title{
    height: 40px;
    line-height: 40px;
    color: deepskyblue;
    font-size: 17px;
    font-weight: 800;
  }
  @media screen and (max-width:500px) {
    .head{padding: 10px 10px 0;}
    .head .middle{width: 90px;}
    .head .right{width: 160px;}
    .workerName label{display: none;}
  }
</style>