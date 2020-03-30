export default {
  data(){
    return{

    }
  },
  methods: {
    // 页面跳转
    linkTo(name) {
      this.$router.push({ name })
    },
    // 页面跳转query传参方式 
    queryTo(name, query) {
      this.$router.push({ name, query })
    },
    //使用路由返回上一级
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    //改变采集时间
    changeDate(param){
      sessionStorage.setItem('dateCJ', param);
      this.$store.commit('changeDate', param);
    }
  },
}