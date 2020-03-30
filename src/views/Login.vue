<template>
  <div class="login">
    <div class="logo">
      <img :src="img" alt>
    </div>
    <div class="formBox">
      <div>
        <h1>登录账号</h1>
        <div class="item">
          <img :src="icon.code" alt="">
          <input type="text" v-model="code" placeholder="公司编号">
        </div>
        <div class="item">
           <img :src="icon.name" alt="">
          <input type="text" v-model="name" placeholder="登录名">
        </div>
        <div class="item">
           <img :src="icon.pwd" alt="">
          <input type="password" v-model="pwd" placeholder="密码">
        </div>
        
        
        <div class="submit" @click="submit">登录</div>
        <div class="jilu">记住公司编号和登录名 <input id="savechk" type="checkbox"></div>
        <div class="beian">沪ICP备 17009970号-1</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      title: "登录",
      img: require("../assets/logo_white.png"),
      code: "",
      name: "",
      pwd: "",
      icon:{
        code: require("../assets/icon1.png"),
        name: require("../assets/icon2.png"),
        pwd: require("../assets/icon3.png"),
      }
    };
  },
  computed:{
    cookieVal(){
      return this.$store.state.cookieVal;
    }
  },
  created() {
    if(document.cookie.indexOf(this.cookieVal) > -1){
      // this.linkTo('Staff')
      this.template()
    }
  },
  mounted(){
    this.template()
  },
  methods: {

    template(){
      let that = this
      let url = '/mobile/selectQualityTemplate'
      that.axios.get(url,{}).then(res=>{
        if(res && res.status == 200){
            let result = res.data.data
            if(result == 1){
              that.linkTo('Staff')
            }                 
            if(result != 1){
              that.linkTo('ProductTemplate');
            }       
        }
      })
    },

    submit() {
      let that = this;
      let param = {
        CodeStr: that.code,
        UserName: that.name,
        PassWord: that.pwd,
        OpenId: ''
      };
      let dat = encodeURIComponent(encodeURIComponent(JSON.stringify(param)));
      let url = "/lzLogin?data=" + dat
      that.axios.post(url, param).then( res => {
          // 成功回调
          if (res && res.status==200 && res.data.s) {
            sessionStorage.clear()
            that.getTime()
            localStorage.setItem('userCode', that.code)
            // that.linkTo('ProductTemplate')
            that.template()
          }else {
            alert('登陆失败，请稍后重试');
          }
        },() => {
          alert('网络服务有误');
        }
      );
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
    }
  }
};
</script>
<style scoped>
.login {
  height: 100%;
}
.logo {
  height: 100px;
  background-color: #00a3e8;
  text-align: center;
}
.logo img {
  height: 70px;
  margin-top: 15px;
}
.formBox {
  height: calc(100% - 100px);
  overflow: hidden;
  background-color: #ddd;
  border: 10px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}
.formBox>div{
  width: 80%;
  max-width: 300px;
}
.formBox .item {
  width: 100%;
  height: 52px;
  line-height: 50px;
  margin-bottom: 10px;
  background-color: #eee;
  border: 1px solid #ccc;
  display: flex;
  overflow: hidden;
}
.formBox .item img{
  margin: 13px 20px 0;
  height: 20px;
}
.formBox .item input{
  outline: none;
  font-size: 18px;
  flex: 1;
  height: 48px;
  background-color: transparent;
}
input:-webkit-autofill {
  transition: background-color 5000s ease-in-out 0s;/*通过延时渲染背景色变相去除背景颜色*/
}
.formBox h1 {
  margin: 20px 0px 25px;
  font-size: 30px;
  font-weight: normal;
  text-align: center;
}
.formBox .submit {
  line-height: 40px;
  background-color: #00a3e8;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  font-size: 18px;
  margin-bottom: 10px;
}
.jilu{
  color: rgb(0,163,232);
  text-align: center;
  font-size: 18px;
}
.jilu input{
  width: auto;
  display: inline-block;
  vertical-align: middle;
}
.beian{
  padding-top: 30px;
  text-align: center;
  font-size: 13px;
}
@media screen and (max-width:450px) {
  .logo img{
    height: 50px;
    margin-top: 25px;
  }
}
</style>
