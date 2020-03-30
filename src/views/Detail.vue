<template>
  <div class="wrap">
    <my-head></my-head>
    
    <div class="content">
      <div class="tabs">
        <div class="l">
          <div v-for="(item,index) in yao" :key="index" class="btn"
           :class="{bgcRed: index==active1}" @click="yaoHandler(index)">
            {{item.name}}
           </div>
        </div>
        <div class="r">
          <div v-for="(item,index) in level" :key="index" class="btn" 
          :class="{bgcRed: index==active2}" @click="levelHandler(index)">
            {{item.name}}
          </div>
        </div>
      </div>

      <div class="list">
        <div class="item" v-for="(item,index) in list" :key="index" @click="handler(index)">
          <div class="l btn">{{item.name}}</div>
          <div class="m btn" :class="'level'+item.level">{{getLevel(item.level)}}</div>
          <div class="r btn">{{item.number}}</div>
        </div>
      </div>
    </div>

    <myform title="修改信息" v-model="showForm" @formConfirm="formConfirm" :formData="formData"></myform>
    
    <div class="footBtn">
      <div class="goback" @click="linkTo('Home')">返回</div>
    </div>
  </div>
</template>

<script>
import myHead from '@/components/my-head'
import myform from '@/components/myform'
export default {
  name: 'Detail',
  data(){
    return {
      title: '数据采集',
      yao: [
        {name: "全部", id: 1},
        {name: "1号窑炉", id: 2},
        {name: "2号窑炉", id: 3},
        {name: "隧道窑", id: 4},
      ],
      level:[
        {name: "优等品", id: 1},
        {name: "合格品", id: 2},
        {name: "机补品", id: 3},
        {name: "废品", id: 4},
        {name: "全部", id: 5},
      ],
      active1: 0,
      active2: 0,
      list:[
        {name: '18-朱先生 9999-9000', level: 1, number: 12},
        {name: '18-朱先生 9999-9000', level: 2, number: 12},
        {name: '18-朱先生 9999-9000', level: 3, number: 66},
        {name: '18-朱先生 9999-9000', level: 4, number: 77},
        {name: '18-朱先生 9999-9000', level: 3, number: 33},
        {name: '18-朱先生 9999-9000', level: 2, number: 12},
        {name: '18-朱先生 9999-9000', level: 1, number: 44},
        {name: '18-朱先生 9999-9000', level: 1, number: 12},
        {name: '18-朱先生 9999-9000', level: 3, number: 213},
        {name: '18-朱先生 9999-9000', level: 4, number: 88},
        {name: '18-朱先生 9999-9000', level: 1, number: 12},
        {name: '18-朱先生 9999-9000', level: 1, number: 44},
      ],
      showForm: false,
      formData:{
        code:'',
        number:''
      }
    }
  },
  created(){

  },
  methods:{
    yaoHandler(i){
      this.active1 = i
    },
    levelHandler(i){
      this.active2 = i
    },
    getLevel(id){
      for (let index of this.level) {
        if (index.id === id) return index.name;
      }
    },
    handler(i){
      this.showForm = true;
      // this.list[i].show = !this.list[i].show
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
  line-height: 40px;
}
.tabs{
  display: flex;
}
.tabs>div{
  flex: 1;
  display: flex;
}
.tabs>div>div{
  background-color: #0070c0;
  min-width: 80px;
}
.tabs .r{
  justify-content: flex-end;
}
.list{
  width: 100%;
  padding: 10px 0;
  overflow: hidden;
  overflow-y: auto;
} 
.list .item{
  float: left;
  width: 32.6%;
  overflow: hidden;
  margin: 0 0.5%
}
.list .item:nth-of-type(3n+1){
  margin-left: 0;
}
.list .item:nth-of-type(3n+3){
  margin-right: 0;
}
.list .item>div{
  float: left;
}
.list .item .l{
  width: 55%;
  height: 44px;
  background-color: #7f7f7f;
}
.list .item .m{
  width: 25%;
  height: 44px;
}
.list .item .r{
  width: 20%;
  height: 44px;
  background-color: #7f7f7f;
}
.list .level1{
  background-color: #00b050;
}
.list .level2{
  background-color: #00b0f0;
}
.list .level3{
  background-color: #ffc000;
}
.list .level4{
  background-color: #ff0000;
}
</style>
