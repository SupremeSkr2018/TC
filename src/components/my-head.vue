<template>
  <header class="head">
    <div class="left">
      <a :href="axios.defaults.baseURL" v-if="showHome">
        <img :src="img" alt="">
      </a>
      <a :href="axios.defaults.baseURL + todayUrl" v-if="showHome" class="today">当日记录</a>
      <span v-if="showWorker" class="workerName"><label>当前员工：</label>{{ worker.name }}</span>
      <span v-if="showWork" class="workerName"><label>当前员工：</label><input type="text" v-model="selectedWorkName" style="width:66px;display:inline-block"></span>
      <span v-if="showProductName" class="workerName">当前产品：<input type="text" v-model="selectedProCode" style="width:100px;display:inline-block"></span>
    </div>

    <div class="middle" :class="{none : this.$route.name == 'Receipt' || this.$route.name == 'grouting' || this.$route.name == 'badBillet'}">
      <select v-model="yalu">
        <option :value="item.id" v-for="(item, index) in yaoluList" :key="index" :selected='index == 0' >
          {{ item.kiln_name }}
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
  name: 'my-head',
  data(){
    return {
      msg: '当日质检详情',
      dateCJ: '',
      worker:{},
      img: require("../assets/home.png"),
      todayUrl: null
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
    showWork:{
      type: Boolean,
      default:()=> true
    },    
    showHome:{
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
    selectedWorkName:{
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
    if(this.$route.name == 'Grouting' || this.$route.name == 'grouting'){
        this.todayUrl = '/Collection/showZhuJiangCollectPage' + '/' + yyyy + '-' + mm + '-' + dd
      }
    else if(this.$route.name == 'Receipt' || this.$route.name == 'receipt'){
        this.todayUrl = '/Collection/showPeiCollectPage' + '/' + yyyy + '-' + mm + '-' + dd
      }
    else if(this.$route.name == 'badBillet'){
        this.todayUrl = '/adobeDamageRecord/selectSunPiEditNewPage' + '/' + yyyy + '-' + mm + '-' + dd
      }else{
        this.todayUrl = '/Collection/qualityEdit/' + dd + '?month=' + yyyy + '-' + mm
    }  
    

    //员工
    if(sessionStorage.getItem('worker')){
      this.worker =  JSON.parse(sessionStorage.getItem('worker'))
    }
    //时间
    // if(sessionStorage.getItem('dateCJ')){
      // this.dateCJ = sessionStorage.getItem('dateCJ')
    // } else {
      this.dateCJ = this.getTime()
    // }
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
  .none{
    display: none
  }
  @media screen and (max-width:500px) {
    .head{padding: 10px 10px 0;}
    .head .middle{width: 90px;}
    .head .right{width: 160px;}
    .workerName label{display: none;}
  }
</style>