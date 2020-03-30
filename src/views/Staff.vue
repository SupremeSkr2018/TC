<template>
  <div class="wrap">


    <my-head :showWorker="false" :showWork="false" :showHome="true"
      :yaoluId="yaoluId" :yaoluList="yaoluList" 
      @newyaoluId="newyaoluId">
    </my-head>
    <div v-if="distinguish === 1">
    <div class="block" style="padding: 20px">
        <button class="distinguish" @click="disting()">区分</button>
    </div>
    <div class="content">
      <ul class="clearfix h500" style="overflow:scroll;">
        <li v-for='(item, index) in list' :key="index" class="btn" @click="checkedStaff(item)">
          <div>{{ item.employee_no }}</div>
          <div>{{ item.name }}</div>
        </li>
      </ul>
    </div>
    </div>
            <div v-if='distinguish === 2'>
            <div class="block" style="padding: 20px 0 0 20px;">
            <p class="text_left">请选择成型工组别: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button class="distinguish" @click="disting()" style="position:relative;left:100px">不区分</button>
            </p>
            <ul class="clearfix">
                <li
                    v-for="(item) in workShopList"
                    :key="item.id"
                    class="btn"
                    :class="{bgRed: item.factoryAndShop === selectedFactoryAndShop}"
                    @click="selectList1(item)"
                    style="width: 120px;line-height: 60px"
                >
                    {{ item.factoryAndShop }}
                </li>
            </ul>
            </div>
            <div class="block" style="padding: 20px 0 0 20px;">
            <p class="text_left">请选择成型工:</p>
            <ul class="worker clearfix step2">
                <li
                    v-for="(item) in selectedWorkerList"
                    :key="item.code"
                    class="btn"
                    :class="{bgRed: item.workerId === selectedFactoryWorker}"
                    @click="checkedStaff(item)"
                >
                <div>{{ item.workerCode }}</div>
                <div>{{ item.workerName }}</div>
                </li>
            </ul>
            </div>                
            </div>
    <loading v-model="showLoading"></loading>

    <toast v-model="showToast" @toastConfirm="toastConfirm" :msg="toastMsg"></toast>

    <msg v-model="showMsg" :msg="msg"></msg>

  </div>
</template>

<script>
import myHead from '@/components/my-head'
import toast from '@/components/toast'
import msg from '@/components/msg'
import loading from '@/components/loading'
export default {
  name: 'Staff',
  data(){
    return {
      title: '数据采集',
      list: [],//这里默认展示的都是成型工
      showLoading: true,
      yaoluId: '',
      yaoluList:[],
      showToast: false,
      toastMsg: '本地有未提交的数据，是否重新上传',
      localData: null,
      showMsg: false,
      msg:'',

      cameraImg: null,
      distinguish:1,  //区分车间
      workShopList: [],//初始化的车间
      workerList:[],//初始化的工人列表
      modelList:[],//初始化模具信息
      productList:[],//初始化模具对应的产品信息
      selectedWorkerList: [],
      selectedFactoryWorker:''
    }
  },
  created(){
    let that = this;
    window.addEventListener("online",function() {
      //alert("网络连接已建立");
      that.updateLocalData();
    });
    if (sessionStorage.getItem('online') == 'true') {
      that.updateLocalData();
    }

    that.getData();
    that.getFactoryAndShop()
  },
  activated(){
    let id = sessionStorage.getItem('yaoluId')
    if(id) this.yaoluId = id;
  },
  computed:{
    baseURL(){
      return this.axios.defaults.baseURL
    },
    userCode(){
      return localStorage.getItem('userCode');
    }
  },
  methods:{
    cameraChange(n){
      console.log(n.target.value)
      this.cameraImg = n.target.value
    },
    //日期格式化
    formatdate(n){
        let d = new Date(n)
        let yyyy = d.getFullYear();
        let mm = ("0" + (d.getMonth() + 1)).slice(-2);
        let dd = ("0" + d.getDate()).slice(-2);
        return yyyy + '-' + mm + '-' + dd
    },    
    disting(){
        if(this.distinguish === 1){
            this.distinguish += 1
            this.selectedFactoryAndShop = ''
            this.selectedFactoryWorker = ''
        }else{
            this.distinguish -= 1
            this.selectedFactoryAndShop = ''
            this.selectedFactoryWorker = ''
            // this.selectedWorkerList = []
        }               
    },    
    //获取数据
    getData(){
      let that = this
      localforage.getItem(that.baseURL + that.userCode).then(function(value) {
        // 当离线仓库中的值被载入时，此处代码运行
        if(!value){//indexedDB中数据为空时请求接口重新获取数据
          let url = '/mobile/selectQualityAll'
          that.axios.get(url, {}).then(res => {// 成功回调
            if(res && res.status==200 && res.data.data){
              that.showLoading = false
              let result = res.data.data
              localforage.setItem(that.baseURL + that.userCode, result);
              for(let i=0,len=result.t_partner_role_def.length; i<len; i++){
                if(result.t_partner_role_def[i].name == '成型工'){
                  for(let j=0,len=result.t_contact.length; j<len; j++){
                    if(result.t_contact[j] && result.t_contact[j].role_code == result.t_partner_role_def[i].roleCode){
                      that.list.push(result.t_contact[j])
                    }
                  }
                }
              }
              //升序排序
              that.list.sort((n1,n2) => {
                  return n1.employee_no - n2.employee_no
              })
              that.$nextTick(()=>{
                let _width = document.body.offsetWidth - 40;
                let allli = document.querySelectorAll('li');
                for(let i=0,len=allli.length; i<len; i++){
                  if(_width < 360){
                    allli[i].style.width = _width/4 + 'px';
                  }else if(_width >=360 && _width < 460){
                    allli[i].style.width = _width/5 + 'px';
                  }else if(_width >= 460 && _width < 560){
                    allli[i].style.width = _width/6 + 'px';
                  }
                }
              })
              that.yaoluId = result.ce_kiln[0].id+'';
              that.yaoluList = result.ce_kiln;
            }
          }, () => {})
        }else{
          //indexedDB中有数据时 
          that.update(value);
        }
      }).catch(function() {
          // 当出错时，此处代码运行
      });
    },
    async getFactoryAndShop(){
            const that = this;
            let isonline = true;
            let result = null;
            let arrlist = []
            await that.axios.get("/MobileCollection/selectDataOfMobileZhuJiang", {}).then(
                res => {
                    if (res && res.status == 200) {
                        const pList = {}
                        result = res.data.data || [];
                        that.workShopList = result.factoryAndShop || [];
                        that.workerList = result.workerList || [];
                        that.modelList=result.modelList||[];
                        that.productList=result.productList||[];
                        for(let ele of that.modelList){
                            if(!pList[ele.proCode]){
                                pList[ele.proCode] = []
                            }
                            if(arrlist.indexOf(ele.proCode) < 0){
                                arrlist.push(ele.proCode)
                                for(let res of that.productList){  
                                    if(ele.proCode == res.proCode){
                                        pList[ele.proCode].push(res)                                         
                                    }                              
                                }                                
                            }                                                            

                        }
                        that.pList = pList
                        that.modelList.map(res=>{
                            if(res.createTime){
                                res.createTime = that.formatdate(res.createTime)
                            }
                        })    
                    }
                    
                },
                () => {
                    that.showLoading = false;
                    isonline = false;
                }

            );
    },
    //上传之前因为无网络暂存在本地的数据
    updateLocalData(){
      let that = this;
      localforage.getItem('local' + that.baseURL + that.userCode).then(function(value) {
        let res = JSON.parse(value)
        // alert(value)
        if(res && res.length>0){
          that.localData = res;
          // that.showToast = true;
          that.toastConfirm()
        }
      }).catch(function() {
          // 当出错时，此处代码运行
      })
    },
    //toast弹窗确认回调
    async toastConfirm(){
      const that = this;
      // that.showToast = n;
      that.showLoading = true;
      let num = 0;
      let url = '/Collection/insertIpadData';
      console.log(that.localData)
      let tempArr = [...that.localData];
      let isUploadAll = false;
      for(let i=0,len=that.localData.length; i< len; i++){
        let data = that.localData[i];
        await that.axios.post(url, [data]).then(res => {// 成功回调
          if(res && res.status==200){
            num++;
            if(num == len){                
              that.showLoading = false;
              that.msg = '保存成功';
              that.showMsg = true;
              setTimeout(()=>{
                that.showMsg = false;
              },1000)
              localforage.removeItem('local' + that.baseURL + that.userCode).then(function() {

              }).catch(function() {

              });
              that.localData = null;
              isUploadAll = true;
            }
            tempArr = tempArr.filter(res => res != data);
            if (!isUploadAll && tempArr.length > 0) {
              localforage.setItem('local' + that.baseURL + that.userCode,JSON.stringify(tempArr))
            }                     
          }         
        }, () => {
          that.showLoading = false;
          // that.msg = '保存失败';
          // that.showMsg = true;
          // setTimeout(()=>{
          //   that.showMsg = false;
          // },1000)
        });
      }

      that.showLoading = false;
    },
    newyaoluId(n){
      sessionStorage.setItem('yaoluId', n)
    },
    checkedStaff(item){
      sessionStorage.setItem('worker',JSON.stringify(item));
      if(this.distinguish == 1){
        this.queryTo('Goods',{name: item.name, employee_no:item.employee_no})
      }else{
        this.selectedFactoryWorker = item.workerId        
        this.queryTo('Goods',{name: item.workerName, employee_no:item.workerCode}) 
      }
      
    },
    selectList1(item) {
        const that = this;
        let arrList = [];
        this.selectedFactoryAndShop = item.factoryAndShop;
        this.selectedFactory = item
        localforage.getItem("local"+that.baseURL + that.userCode ).then(function(value) {
            let res = JSON.parse(value);
        }).catch(function(err) {
        });
        for(let res of this.workerList){
            if(item.mjFactoryId == res.mjFactoryId && item.workShopId == res.workShopId){
                arrList.push(res)
            }
        }                            
        this.selectedWorkerList = arrList
    },    
    //更新数据
    async update(value){
      let that = this;
      let ce_kiln,t_contact,ce_mold_asgmt,ce_color,ce_quality_grade,ce_quality_issue,ce_material_model,ce_zhujiang_worker;
      let isonline = true;
      //窑炉列表
      let url1 = '/mobile/selectQityBatch'
      await that.axios.get(url1, {}).then(res => {// 成功回调
        if(res && res.status==200){
          let result = res.data.data
          ce_kiln = result
        }
      }, () => {
        that.showLoading = false;
        isonline = false;
      })
      //员工列表
      let url2 = '/mobile/selectContact'
      await that.axios.get(url2, {}).then(res => {// 成功回调
        if(res && res.status==200){
          let result = res.data.data
          t_contact = result
        }
      }, () => {})
      //型号列表
      let url3 = '/mobile/selectModel'
      await that.axios.get(url3, {}).then(res => {// 成功回调
        if(res && res.status==200){
          let result = res.data.data
          ce_mold_asgmt = result
        }
      }, () => {})
      //颜色列表
      let url4 = '/mobile/selectColors'
      await that.axios.get(url4, {}).then(res => {// 成功回调
        if(res && res.status==200){
          let result = res.data.data
          ce_color = result
        }
      }, () => {})
      //等级列表
      let url5 = '/mobile/selectGrade'
      await that.axios.get(url5, {}).then(res => {// 成功回调
        if(res && res.status==200){
          let result = res.data.data
          ce_quality_grade = result
        }
      }, () => {})
      //问题列表
      let url6 = '/mobile/selectIssue'
      await that.axios.get(url6, {}).then(res => {// 成功回调
        if(res && res.status==200){
          let result = res.data.data
          ce_quality_issue = result
        }
      }, () => {})
      //物料型号
      let url7 = '/mobile/selectMaterialModel';
      await that.axios.get(url7, {}).then(res => {// 成功回调
        if(res && res.status==200){
          let result = res.data.data
          ce_material_model = result
        }
      }, () => {})
      //区分组别
      let url8 = '/MobileCollection/selectDataOfMobileZhuJiang';
      await that.axios.get(url8, {}).then(res => {// 成功回调
        if(res && res.status==200){
          let result = res.data.data
          ce_zhujiang_worker = result
        }
      }, () => {})      
      if(isonline){
        value.ce_kiln = ce_kiln;
        value.t_contact = t_contact;
        value.ce_mold_asgmt = ce_mold_asgmt;
        value.ce_color = ce_color;
        value.ce_quality_grade = ce_quality_grade;
        value.ce_quality_issue = ce_quality_issue;
        value.ce_material_model = ce_material_model;
        value.ce_zhujiang_worker = ce_zhujiang_worker;
        localforage.setItem(that.baseURL + that.userCode, value);
      }
      that.list = [];
      for(let i=0,len=value.t_partner_role_def.length; i<len; i++){
        if(value.t_partner_role_def[i].name == '成型工'){
          for(let j=0,len=value.t_contact.length; j<len; j++){
            if(value.t_contact[j] && value.t_contact[j].role_code == value.t_partner_role_def[i].roleCode){
              that.list.push(value.t_contact[j])
            }
          }
        }
      }
      //升序排序
      that.list.sort((n1,n2) => {
          return n1.employee_no - n2.employee_no
      })
      this.$nextTick(()=>{
        let _width = document.body.offsetWidth - 40;
        let allli = document.querySelectorAll('li');
        for(let i=0,len=allli.length; i<len; i++){
          if(_width < 360){
            allli[i].style.width = _width/4 + 'px';
          }else if(_width >=360 && _width < 460){
            allli[i].style.width = _width/5 + 'px';
          }else if(_width >= 460 && _width < 560){
            allli[i].style.width = _width/6 + 'px';
          }
        }
      })
      if(sessionStorage.getItem('yaoluId')){
        that.yaoluId = sessionStorage.getItem('yaoluId');
      }else{
        that.yaoluId = value.ce_kiln[0].id+'';
      }
      that.yaoluList = value.ce_kiln;
      that.showLoading = false;
    }
  },
  components: {
    myHead,
    loading,
    toast,
    msg
  }
}
</script>
<style scoped>
.content{
  /* height: calc(100% - 60px); */
}
li{
  float: left;
  width: 80px;
  height: 80px;
  padding-top: 8px;
  color: #fff;
  background-color: #409EFF;
}
li div:first-of-type{
  font-size: 18px;
}
li:last-of-type p{
  font-weight: bold;
}
.distinguish{
    background: limegreen;
    border: 1px solid limegreen;
    border-radius: 5px;
    padding: 2px;
    color: white;
    width: 60px;
    cursor: pointer;        
}
.text_left{
  text-align: left;
  font-size: 15px;
  font-weight: 700;  
}
@media screen and (min-width : 320px){
  .h500{
    height: 500px !important;
  }
}
@media screen and (min-width : 768px) {
  .h500{
    height: 800px !important;
  }
}
</style>
