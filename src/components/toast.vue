<template>
<div class="toast" v-show="show">
  <div class="con">
    <div class="title">提示</div>
    <div class="info">{{ msg }}</div>
    <div class="btns">
      <span @click="confirm">确认</span>
      <span @click="show = !show">取消</span>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'toast',
  props:{
    value: {
      type: Boolean,
      default: false
    },
    msg: {
      typ: String,
      default: '信息采集完成，确认提交'
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
  },
  methods:{
    confirm(){
      this.$emit('toastConfirm', false)
    }
  }
}
</script>

<style scoped>
  .toast{
    position: fixed;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.3);
    top: 0;
    left: 0;
  }
  .toast .con{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 350px;
    transform: translate(-50%,-50%);
    background-color: #fff;
    border-radius: 10px;
  }
  .toast .con .title{font-size: 20px; line-height: 50px;border-bottom: 1px solid #ddd;}
  .toast .con .info{
    font-size: 16px;
    padding: 20px 10px;
  }
  .toast .con .btns{
    padding: 20px;
    text-align: center;
    cursor: default
  }
  .toast .con .btns span{
    display: inline-block;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
  }
  .toast .con .btns span:first-child{
    background-color: #0070c0;
    color: #fff;
  }
  .toast .con .btns span:last-child{
    background-color: #ddd;
    margin-left: 10px;
  }
</style>