<template>
<div class="msg" v-show="show">
  <div class="box">{{ msg }}</div>
</div>
</template>

<script>
export default {
  name: 'msg',
  props:{
    value: {
      type: Boolean,
      default: false
    },
    msg: {
      typ: String,
      default: '保存成功'
    }
  },
  computed:{
    show:{
      get(){
        return this.value
      },
      set(n){
        this.$emit('input', n)
      }
    }
  }
}
</script>

<style scoped>
  .msg{
    position: fixed;
    z-index: 99;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .msg .box{
    position: absolute;
    padding: 20px 40px;
    border-radius: 5px;
    background-color: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 5px rgba(0,0,0,0.2);
  }
</style>