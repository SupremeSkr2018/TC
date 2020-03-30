<template>
  <div class="addForm" v-show="show">
    <div class="con">
      <div class="title">{{title}}</div>
      <div class="row">
        <div class="l">代号：</div>
        <div class="r">
          <input type="text" v-model="formData.code"/>
        </div>
      </div>
      <div class="row">
        <div class="l">颜色：</div>
        <div class="r">
          <input type="text" v-model="formData.color"/>
        </div>
      </div>
      <div class="btns">
        <span @click="confirm">确定</span>
        <span @click="show = false">取消</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myform',
  data(){
    return{

    }
  },
  props:{
    value:{
      type: Boolean,
      default: ()=> false
    },
    title:{
      type: String,
      default:()=>'标题'
    },
    formData:{
      type: Object,
      default: ()=> {}
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
      this.$emit('formConfirm', this.formData)
      this.show = false
    }
  }
}
</script>
<style scoped>
.addForm{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 999;
}
.addForm .con{
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.addForm .con .title{
  line-height: 50px;
  border-bottom: 1px solid #ddd;
  font-size: 15px;
  margin-bottom: 40px;
}
.addForm .con .row{
  padding: 0 30px 20px 0;
  display: flex;
}
.addForm .con .row .l{
  width: 100px;
  line-height: 40px;
  text-align: right;
}
.addForm .con .row .r{
  width: 220px;
}
.addForm .con .row input{
  display: block;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px 10px;
  width: 100%;
}
.addForm .con .btns{
  margin: 40px 20px;
  text-align: right;
}
.addForm .con .btns span{
  padding: 12px 15px;
  border-radius: 4px;
  color: #fff;
  margin-left: 10px;
}
.addForm .con .btns span:first-of-type{
  background-color: #0070c0;
}
.addForm .con .btns span:last-of-type{
  background-color: #ddd;
}
</style>
