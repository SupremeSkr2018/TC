<template>
  <div class="wrap">
    <my-head></my-head>
    <div class="content">
      <h1>历史产品</h1>
      <ul class="clearfix">
        <li v-for='(item, index) in list' 
          :key="index" class="btn">
          <div>{{ item.name }}</div>
          <div></div>
        </li>
        <li class="btn">
          <div>+</div>
          <div @click="showForm = true">添加产品</div>
        </li>
      </ul>
    </div>
    <myform title="新建产品" v-model="showForm" @formConfirm="formConfirm" :formData="formData"></myform>
    <div class="footBtn">
      <div class="goback" @click="$router.go(-1)">返回</div>
    </div>
  </div>
</template>

<script>
import myHead from '@/components/my-head'
import myform from '@/components/myform'
export default {
  name: 'Products',
  data(){
    return {
      title: '数据采集',
      list: [
        { name: '111', code: '01' },
        { name: '222', code: '02' },
        { name: '333', code: '03' },
        { name: '444', code: '04' },
        { name: '343243', code: '05' },
        { name: '3132', code: '06' },
        { name: '546576', code: '07' },
        { name: '4232-3332', code: '08' },
        { name: '13156', code: '09' },
        { name: '546653', code: '10' },
        { name: '243241', code: '11' },
        { name: '111212', code: '12' },
        { name: '4455', code: '13' },
        { name: '98777', code: '14' },
        { name: '8765', code: '15' },
        { name: '5543', code: '16' },
        { name: '234', code: '17' },
      ],
      showForm: false,
      formData:{
        code: '',
        color: ''
      }
    }
  },
  created(){

  },
  methods:{
    Handler(val){
      console.log(val)
    },
    formConfirm(n){
      console.log(n)
    }
  },
  components: {
    myHead,myform
  }
}
</script>
<style scoped>
.content{
  position: relative;
  padding-top: 57px;
}
h1{
  position: absolute;
  top: 0;
  width: 100%;
  font-weight: normal;
  padding: 10px;
}
li{
  float: left;
  width: auto;
  height: 80px;
  padding: 0 10px;
  color: #fff;
  background-color: #0070c0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
li div:first-of-type{
  font-size: 30px;
}
li:last-of-type{
  background-color: #ccc;
}
li:last-of-type p{
  font-weight: bold;
}


</style>
