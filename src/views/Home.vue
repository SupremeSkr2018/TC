<template>
  <div class="home">
    <h1 class="title">{{ title }}</h1>

    <div class="nav">
      <a v-for="(item, index) in nav" :key="index" :class="item.bgc" @click="handler(index)" class="btn">
        {{ item.value }}
      </a>
    </div>
    
    <div class="footBtn">
      <div class="goback">返回</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data(){
    return {
      title: '数据采集',
      nav: [
        { value: '注浆采集', bgc: 'bgcRed' },
        { value: '收坯采集', bgc: 'bgcBlue1' },
        { value: '损坯采集', bgc: 'bgcGreen' },
        { value: '挑瓷采集', bgc: 'bgcBlue2' },
        { value: '试水采集', bgc: 'bgcPurple' },
        { value: '库存采集', bgc: 'bgcYellow' },
        { value: '订单管理', bgc: 'bgcGreen1' },
        { value: '综合业务', bgc: 'bgcBlue' },
      ],
    }
  },
  created(){
    this.changeDate(this.getTime())
    // this.getData();
  },
  methods: {
    // getData(){
    //   let that = this
    //   localforage.getItem('selectQualityAll').then(function(value) {
    //     // 当离线仓库中的值被载入时，此处代码运行
    //     if(!value){//indexedDB中数据为空时请求接口重新获取数据
    //       let url = 'http://212.64.40.177://mobile/selectQualityAll'
    //       that.axios.get(url, {}).then(res => {// 成功回调
    //         if(res && res.status==200){
    //           localforage.setItem('selectQualityAll', res.data.data);
    //         }
    //       }, res => {})
    //     }else{
    //       //indexedDB中有数据时
    //     }
    //   }).catch(function(err) {
    //       // 当出错时，此处代码运行
    //   });
    // },
    handler(index){
      this.queryTo('Staff', {'type': index})
    },
    getTime(){
      let d = new Date();
      let yyyy = d.getFullYear();
      let mm = d.getMonth()+1;
      if(mm < 10) mm = '0'+ mm
      let dd = d.getDate();
      if(dd < 10) dd = '0' + dd
      let date = yyyy + '-' + mm + '-' + dd;
      sessionStorage.setItem('dateCJ', date)
      return date;
    }
  }
}
</script>
<style scoped>
.home{ height: 100vh;}
.title{
  height: 10vh;
  line-height: 10vh;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.nav{
  width: 400px;
  height: 75vh;
  margin: 0 auto;
}
.nav a{
  float: left;
  width: 160px;
  height: 80px;
  line-height: 80px;
  margin: 20px;
}


</style>
