<template>
<div class="foot">
  <span v-if="btns[0]" @click="handler('切换')" class="btn">切换</span>
  <span v-if="btns[1]" @click="handler('确认提交')" class="btn">确认提交</span>
  <span v-if="btns[2]" @click="handler('返回')" class="btn">返回</span>
</div>
</template>

<script>
export default {
  name: 'foot',
  data(){
    return {

    }
  },
  props:{
    btns: {
      type: Array,
      default: () => []
    }
  },
  methods:{
    handler(val){
      this.$emit('footHandler', val)
    }
  }
}
</script>

<style scoped>
  .foot{
    position: fixed;
    height: 50px;
    bottom: 20px;
    width: 100%;
    right: 0;
    padding-right: 20px;
    text-align: right;
  }
  .foot span{
    display: inline-block;
    min-width: 80px;
    line-height: 50px;
    border-radius: 4px;
    color: #fff;
    margin-left: 10px;
    padding: 0 15px;
    text-align: center;
  }
</style>