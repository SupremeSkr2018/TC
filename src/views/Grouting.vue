<template>
    <div class="wrap">
    <div v-if="step == 1">
    <my-head
      :showWork="false"
      :showWorker="false"
      :showHome="true"
      :selectedWorkName="selectedWorkName"
    ></my-head>        
    </div>
    <div v-if="step == 2">
        <my-head
        :showWork="true"
        :showWorker="false"
        :showHome="false"
        :selectedWorkName="selectedWorkName"
        ></my-head>        
    </div>        
        <div class="content">            
        <div v-if="step === 1">
            <div v-if='distinguish === 2'>
            <div class="block">
            <p>请选择车间: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button class="distinguish" @click="disting()">不区分</button>
            </p>
            <ul class="clearfix">
                <li
                    v-for="(item) in workShopList"
                    :key="item.id"
                    class="btn"
                    :class="{bgRed: item.factoryAndShop === selectedFactoryAndShop}"
                    @click="selectList1(item)"
                >
                    {{ item.factoryAndShop }}
                </li>
            </ul>
            </div>
            <div class="block">
            <p>请选择成型工:</p>
            <ul class="worker clearfix step2">
                <li
                    v-for="(item) in selectedWorkerList"
                    :key="item.code"
                    class="btn"
                    :class="{bgRed: item.workerId === selectedFactoryWorker}"
                    @click="selectList2(item)"
                >
                <div>{{ item.workerCode }}</div>
                <div>{{ item.workerName }}</div>
                </li>
            </ul>
            </div>                
            </div>
            <div v-if="distinguish === 1">
            <div class="block" style="padding-bottom:0">
                <button class="distinguish" @click="disting()">区分</button>
            </div>
            <div class="block">
            <p>请选择成型工:</p>
            <ul class="worker clearfix step2">
                <li
                    v-for="(item) in workerList"
                    :key="item.code"
                    class="btn"
                    :class="{bgRed: item.workerId === selectedFactoryWorker}"
                    @click="selectList2(item)"
                >
                <div>{{ item.workerCode }}</div>
                <div>{{ item.workerName }}</div>
                </li>
            </ul>
            </div>                
            </div>

        </div>
        <div v-if="step === 2">
            <div class="tbHead">
                <div class="tbText">产品代号</div>
                <div class="tbText">产线编号</div>
                <div class="tbText">模具数量</div>
                <div class="tbText">模具使用次数</div>
                <div class="tbText">上线时间</div>
            </div>
            <ul class="tbMain">
                <li v-for="(item,index) in selectedModelList" :key="item.id" style="float:none;padding:0;cursor:default">
                    <div class="liList" :class="{bgRed:modelDataList.includes(item.id),bgcRed:modelIndex == index}" style="width:100%;height:60px" @click="prodShow(item,index)">
                        <div class="tbText">{{item.proCode}}</div>
                        <div class="tbText">{{item.remark}}</div>
                        <div class="tbText">{{item.modelNumber}}</div>
                        <div class="tbText">{{item.modelCount}}</div>
                        <div class="tbText">{{item.createTime}}</div>                    
                    </div>
                    <div v-show="item.id == moudelId" :class="{minH149:item.id == moudelId}" :style="{height:pList[item.proCode].length >1?'149px':'87px'}">
                    <div class="level con" :class="{bgGreen:pList[modelData.proCode].length >1}" v-show="item.id == moudelId" v-for="(res,index) in pList[modelData.proCode]" :key="res.proCodeAll">                        
                        <div class="tbText tb" v-if="pList[modelData.proCode].length >1" :class="{bgRed:productDataList.includes(res.proCodeAll)}" @click="selectList3(res,index)">{{res.specification+ '-' +res.proName}}</div>
                        <div class="num" v-if="res.number > 0 || res.moudelNum >0 || prodCodeAll == res.proCodeAll || mouldNumber || mouldNumber != null">
                            <span class="sub" @click="modelNumSub(res,index)" onselectstart="return false">-</span>
                            <input type="number" v-model="res.moudelNum || mouldNumber" min="0" placeholder="好坯"  @change="modelNumChange($event,index)"/>
                            <span class="add" @click="modelNumAdd(res,index)" onselectstart="return false">+</span>
                        </div>                    
                        <div class="num" v-if="res.number > 0 || res.moudelNum >0 || prodCodeAll == res.proCodeAll || mouldNumber || mouldNumber != null">
                            <span class="sub" @click="issueSub(res,index)" onselectstart="return false">-</span>
                            <input type="number" v-model.number="res.number" placeholder="坏坯" min="0" @change="badNumChange($event,index)"/>
                            <span class="add" @click="issueAdd(res,index)" onselectstart="return false">+</span>
                        </div>                    
                    </div>                        
                    </div>                                                    
                </li>
             
            </ul>
        </div>

        </div>
        <div class="footBtn">
            <div class="save2" v-show="step > 1" @click="submit()">保存并添加其它员工产品</div>
            <div class="goback" @click="goBack">返回</div>
        </div>
        <toast v-model="showToast" @toastConfirm="toastConfirm"></toast>
        <toast v-model="showToast2" :msg="showToast2msg" @toastConfirm="postLocalData"></toast>
        <msg v-model="showMsg" :msg="msg"></msg>        
    </div>
</template>
<script>
import myHead from "@/components/my-head";
import toast from "@/components/toast";
import msg from "@/components/msg";
import loading from "@/components/loading";
// import func from '../../vue-temp/vue-editor-bridge';
export default {
    name: "Grouting",
    components: {
        myHead,
        loading,
        toast,
        msg
    },
data: function () {
    return {
        step: 1,
        selectedFactoryAndShop: '',
        selectedFactoryWorker: '',
        selectedList4: '',

        msg:'',
        distinguish:1,  //区分车间

        localData:[],
        showMsg: false,
        showToast: false,
        showToast2: false,
        showToast2msg: "本地有未提交的数据，是否重新上传",
        showLoading: true,
        showSubmit: false,
        tbMainShow:false,
        workShopList: [],//初始化的车间
        workerList:[],//初始化的工人列表
        modelList:[],//初始化模具信息
        productList:[],//初始化模具对应的产品信息
        selectedWorkShop:"",//选中车间的值
        selectedWorkers: [], //选中车间出现的员工列表
        wList:{},
        selectedWorkerList: [], // 工人多选
        pList:{},
        selectedWorker:'',   //选中的工人
        selectedWorkName:"",
        selectedFactory:'',   //选中的车间
        selectedProductList:[],  //型号多选
        mouldNumber:null,  //模具数量
        selectedModelList:[],
        prodIndex:null,
        productShow:false,
        modelIndex:null,
        modelData:'',
        modelDataList:[],
        productDataList:[],
        nowTime: '',    //当前系统时间
        prodCode:'',
        moudelId:'',
        prodCodeAll:'',
        newSetArr:[],
        newSetModelList:[]
    }
},
created() {
    let that = this;
    window.addEventListener("online", function () {
        that.checkPostLocalData();
    });
    if (sessionStorage.getItem("online") == "true") {
        that.checkPostLocalData();
    }
    that.initData();
    that.updateData();
},
mounted() {
    this.getCookie("userSupply_ema_TAOCI")
    // this.getCookie("userSupply_demo_TAOCI");
},
computed:{
    baseURL() {
    return this.axios.defaults.baseURL;
    },
    userCode() {
    return localStorage.getItem("userCode");
    },    
},
methods: {
    goBack() {
        if (this.step - 1  < 1) {
            // 跳转回页面
            // window.location.href="http://d.biyaoema.com/productionSystem-webLogin/Collection/showZhuJiangCollectNewPage" 
            window.location.href="https://ema.biyaoema.com/productionSystem-webLogin/Collection/showZhuJiangCollectNewPage" 
        } else {
            this.step -= 1;
            this.selectedProductList = []
            this.selectedWorker = ''
            this.selectedWorkName= ''
            this.selectedFactory = ''
            this.prodIndex = null
            this.modelIndex = null
            this.proCode = ''
            this.moudelId = ''
            this.prodCodeAll = ''
            this.selectedFactoryWorker = ''
            this.pList[this.modelData.proCode] || [].map(res =>{
                res.number = 0
                res.moudelNum = null
            })
            this.modelData = []      
            this.modelDataList = []
            this.productDataList = []      
        }
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

    getCookie(name) {
      let that = this;
      let allcookies = document.cookie;
      let cookie_pos = allcookies.indexOf(name); //索引的长度
      // 如果找到了索引，就代表cookie存在，
      if (cookie_pos != -1) {
        cookie_pos += name.length + 1; 
        let cookie_end = allcookies.indexOf(";", cookie_pos);
        if (cookie_end == -1) {
          cookie_end = allcookies.length;
        }
        let inspect = unescape(allcookies.substring(cookie_pos, cookie_end)); //得到cookie值
        that.inspectId = inspect;
      } else {
        that.inspectId = "";
      }
    },     
    //日期格式化
    formatdate(n){
        let d = new Date(n)
        let yyyy = d.getFullYear();
        let mm = ("0" + (d.getMonth() + 1)).slice(-2);
        let dd = ("0" + d.getDate()).slice(-2);
        return yyyy + '-' + mm + '-' + dd
    },
    // 获取当前系统时间
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
              + " " + date.getHours() + seperator2 + date.getMinutes()
              + seperator2 + date.getSeconds();
      this.nowTime = date
    },
    checkPostLocalData() {
      let that = this;
      localforage
        .getItem("local13" + that.baseURL + that.userCode)
        .then(function(value) {
          let res = JSON.parse(value);
          if (res && res.length > 0) {
            that.localData = res;
            // that.showToast2 = true;
            that.postLocalData()   
          }
        })
        .catch(function() {
          // 当出错时，此处代码运行
        });
    },
    async postLocalData() {
      let that = this;
      that.showLoading = true;
      let num = 0;
      let url = "/MobileCollection/insertMobileZhuJiang";
      let tempArr = [...that.localData];
      let isUploadAll = false;      
      for (let i = 0, len = that.localData.length; i < len; i++) {
        let data = that.localData[i]
        let param = {
            list:data.list
        }
        console.log(param)
        await that.axios.post(url, param).then(res => {// 成功回调
            if(res && res.data.status == 200){
              num++;
              if (num == len) {
                that.showLoading = false;
                that.showToast = false
                that.showToast2 = false;
                that.msg = "保存成功";
                that.showMsg = true;
                setTimeout(() => {
                  that.showMsg = false;
                }, 1000);                            
                localforage.removeItem("local13" + that.baseURL + that.userCode).then(function() {

                }).catch(function() {});
                that.localData.list = null;
                isUploadAll = true;

              }
              tempArr = tempArr.filter(res => res != data);
                if (!isUploadAll && tempArr.length > 0) {
                    localforage.setItem('local13' + that.baseURL + that.userCode,JSON.stringify(tempArr))
                }                                                  
            }
            // if(res&& res.data.status == 304){
            //     alert(res.data.msg)
            //     setTimeout(() => {
            //     that.showMsg = false;
            //     }, 1000);
            //     that.showToast = false
            //     tempArr = tempArr.filter(res => res != data);
            //     if (!isUploadAll && tempArr.length > 0) {
            //         localforage.setItem('local13' + that.baseURL + that.userCode,JSON.stringify(tempArr))
            //     }                 
            //     return
            // }
            // if(res&& res.data.status == 400){
            //     alert(res.data.msg)
            //     setTimeout(() => {
            //     that.showMsg = false;
            //     }, 1000);
            //     that.showToast = false
            //     tempArr = tempArr.filter(res => res != data);
            //     if (!isUploadAll && tempArr.length > 0) {
            //         localforage.setItem('local13' + that.baseURL + that.userCode,JSON.stringify(tempArr))
            //     }                 
            //     return
            // }            
            // if(res&& res.data.status == 500){
            //     alert(res.data.msg)
            //     setTimeout(() => {
            //     that.showMsg = false;
            //     }, 1000);
            //     that.showToast = false

            // }             
          },
          () => {
            that.showLoading = false;
            // that.msg = "保存失败";
            // that.showMsg = true;
            // setTimeout(() => {
            //   that.showMsg = false;
            // }, 1000);
          });
      }

      that.showLoading = false;      
    },                        
        selectList1(item) {
            const that = this;
            let arrList = [];
            this.selectedFactoryAndShop = item.factoryAndShop;
            this.selectedFactory = item
            localforage.getItem("GroutingList"+that.baseURL + that.userCode ).then(function(value) {
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
        selectList2(item) {
            let arrList = []
            this.selectedFactoryWorker = item.workerId;
            this.selectedWorker = item
            this.selectedWorkName = item.workerName
            this.step = 2;
            sessionStorage.setItem('selectedWorkName',item.workerName);
            for(let res of this.modelList){
                if(item.workerCode == res.workCode){
                    arrList.push(res)
                }
            }
            this.selectedModelList = arrList
            // this.selectedModelList.map(res=>{
            //     this.selectedProductList = this.pList[res.proCode]
            // })
        },

        prodShow(item,index){
            let that = this
            let num = 0
            this.tbMainShow = true
            this.mouldNumber = item.modelNumber
            this.modelIndex = index
            this.modelData = item
            this.moudelId = item.id
            this.prodCode = item.proCode
            that.selectedProductList = that.pList[item.proCode]

            that.pList[item.proCode].map(res=>{
                if( this.modelDataList.includes(item.id)){
                    if(res.number>0 || res.moudelNum >0){
                        num ++
                        res.number = 0
                        res.moudelNum = this.mouldNumber
                        if(num == that.newSetArr.length){
                            let arr = this.modelDataList.filter(res=> res != item.id)
                            that.modelDataList = arr
                            that.prodIndex = null
                            that.modelIndex = null                          
                        }
                    }
                    if(that.pList[item.proCode].length == 1){
                        res.moudelNum = this.mouldNumber
                        if(res.number>0 || res.moudelNum >0){
                            res.number = 0
                            res.moudelNum = this.mouldNumber
                            let arr = this.modelDataList.filter(res=> res != item.id)
                            that.modelDataList = arr
                            that.prodIndex = null
                            that.modelIndex = null                                                    
                        }
                          
                    }                    
                    if(that.productDataList.includes(res.proCodeAll)){
                        let arr = that.productDataList.filter(res=> res.proCodeAll != res.proCodeAll)
                        this.prodIndex = null
                        this.modelIndex = null
                        that.productDataList = arr
                    }
                }else{
                    if(that.pList[item.proCode].length == 1 && this.mouldNumber > 0 ){               
                        res.moudelNum = this.mouldNumber
                        that.modelDataList.push(item.id)
                    }                    
                }
            })
        },

        selectList3(res,index){
            let that = this
            that.prodIndex = index
            that.prodCodeAll = res.proCodeAll
            this.productShow = true
            // const data = [...this.selectedProductList]
            // data[index].number =1
            if(that.prodCodeAll == ''){
                that.prodCodeAll = res.proCodeAll
            }
            if(this.mouldNumber >0){
                this.modelDataList.push(this.modelData.id)
            }
            const data = [...this.pList[this.modelData.proCode]];
            if (!data[index].moudelNum) {
                data[index].moudelNum = this.mouldNumber;
            }
            if (data[index].moudelNum == 0) {
                data[index].moudelNum = this.mouldNumber;
            }            
            that.productDataList.push(res.proCodeAll)
            this.newSetArr = Array.from(new Set(this.productDataList))                       
        },
    
        issueAdd: function(ele,i) {
        const data = [...this.pList[this.modelData.proCode]];
        if (!data[i].number) {
            data[i].number = 0;
        }
        data[i].number += 1;
        if(data[i].number > 0){
            this.modelDataList.push(this.modelData.id)
            this.productDataList.push(ele.proCodeAll)
            this.newSetArr = Array.from(new Set(this.productDataList))
            this.newSetModelList = Array.from(new Set(this.modelDataList))
            // data[i].moudelNum = this.mouldNumber
        }
        if(data[i].number > 0 && !data[i].moudelNum || data[i].moudelNum == this.mouldNumber){
            data[i].moudelNum = this.mouldNumber
        }
        if(data[i].moudelNum == 0){
            data[i].moudelNum = 0
        }
        this.selectedProductList = data;
        },
        issueSub: function(ele,i) {
        let arr = []
        let arr2 = []
        let num = 0
        let that = this
        if (!this.pList[this.modelData.proCode][i].number || this.pList[this.modelData.proCode][i].number == 0)
            return;      
    
        const data = [...this.pList[this.modelData.proCode]];
        data[i].number -= 1;
        this.pList[this.modelData.proCode] = data;
        let n1 = this.pList[this.modelData.proCode].every(item => {
            return item.number == 0;
            
        });
        if (n1) this.showSubmit = false;
        let n2 = this.pList[this.modelData.proCode].slice(1).every(item => {
            return item.number == 0;
        });
        if (n2) this.showAddQ = false;
        if(ele.moudelNum == 0 && ele.number == 0){
            arr2 = this.productDataList.filter(res=> res != ele.proCodeAll);
            this.productDataList = arr2;            
        }
        let n3 = this.pList[this.modelData.proCode].map(item => {
            if(item.moudelNum == 0 && item.number == 0){
                num ++
            }
        })
        if(num == that.newSetArr.length){
            arr = this.modelDataList.filter(res=> res != this.modelData.id);
            this.modelDataList = arr;
        } 
        },       
        modelNumChange:function(e,i){
            let val = null
            val = Number(e.target.value)
            const data = [...this.pList[this.modelData.proCode]];
            if(val < 0){
                val = 0
                alert('不能输入负数')
            }
            if(val == 0){
                val = 0
            }
            if(! /^\d+$/.test(val)){
                if(this.mouldNumber){
                    val = this.mouldNumber
                }else{
                    val = 1
                }
                alert('不能输入小数')
            }
            data[i].moudelNum = val; 
            if(val >0){
                this.modelDataList.push(this.modelData.id)
                this.productDataList.push(data[i].proCodeAll)
                this.newSetModelList = Array.from(new Set(this.modelDataList))
            }
        },
        badNumChange:function(e,i){
            let val = null
            val = Number(e.target.value)
            const data = [...this.pList[this.modelData.proCode]];
            if(val < 0){
                val = 0
                alert('不能输入负数')
            }
            if(! /^\d+$/.test(val)){
                val = 1
                alert('不能输入小数')
            }
            if(data[i].moudelNum == 0 || data[i].moudelNum == null){
                data[i].moudelNum = 0
            }
            data[i].number = val; 
            if(val >0){
                this.modelDataList.push(this.modelData.id)
                this.productDataList.push(data[i].proCodeAll)
                this.newSetArr = Array.from(new Set(this.productDataList))
            }
        },
        modelNumAdd: function(ele,i) {
        const data = [...this.pList[this.modelData.proCode]];
        if (!data[i].moudelNum) {
            data[i].moudelNum = this.mouldNumber;
        }
        data[i].moudelNum +=1
        // this.pList[this.modelData.proCode] = data;
        // this.moudelNum = data[i].moudelNum
        if(data[i].moudelNum > 0){
            this.modelDataList.push(this.modelData.id)
            this.productDataList.push(ele.proCodeAll)
            this.newSetArr = Array.from(new Set(this.productDataList))
            this.newSetModelList = Array.from(new Set(this.modelDataList))
            console.log(this.newSetModelList)
        }        
        },
        modelNumSub: function(ele,i) {     
        if (!this.pList[this.modelData.proCode][i].moudelNum || this.pList[this.modelData.proCode][i].moudelNum == 0)
            return;
        let that = this      
        const data = [...this.pList[this.modelData.proCode]];
        if (!data[i].moudelNum) {
            data[i].moudelNum = this.mouldNumber;
        }      
        data[i].moudelNum -= 1;
        if(data[i].moudelNum == 0){
            this.mouldNumber = 0
        }
        this.pList[this.modelData.proCode] = data;
        let n1 = this.pList[this.modelData.proCode].every(item => {
            return item.moudelNum == 0;
            
        });
        if (n1) this.showSubmit = false;
        let n2 = this.pList[this.modelData.proCode].slice(1).every(item => {
            return item.moudelNum == 0;
        });
        if (n2) this.showAddQ = false;
        // this.moudelNum = data[i].moudelNum
        if(data[i].moudelNum>0){
            this.modelDataList.push(this.modelData.id)
            this.productDataList.push(ele.proCodeAll)
            this.newSetModelList = Array.from(new Set(this.modelDataList))
        }   
        let arr = []
        let arr2 = []
        let num = 0
        if(ele.moudelNum == 0 && ele.number == 0){
            arr2 = this.productDataList.filter(res=> res != ele.proCodeAll);
            this.productDataList = arr2;            
        }        
        let n3 = this.pList[this.modelData.proCode].map(item => {
            if(item.moudelNum == 0 && item.number == 0){
                num ++
            }
        })
        if(num == that.newSetArr.length){
            arr = this.modelDataList.filter(res=> res != this.modelData.id);
            this.modelDataList = arr;
        }                                                  
        
        },                          

        submit(){
            // let that = this
            
            this.getNowFormatDate() 
            if(this.modelDataList.length == 0){
                alert('请添加数量！')
                return
            }else{
               this.showToast = true; 
            }
        },
        toastConfirm(){
            let that = this        
            let arr = []
            console.log(that.nowTime)
            that.selectedModelList.map(item=>{
                if(that.modelDataList.includes(item.id)){
                    arr.push(item)
                }
            })              
            // let param = []
            let param = {
                list : []
            }
            console.log(arr)
            arr.map(res =>{
                that.pList[res.proCode].map(item =>{
                    // if(item.number> 0 || item.moudelNum > 0){
                            param.list.push({
                            mjFactoryId: that.selectedWorker.mjFactoryId,  //厂区id    
                            workShopId: that.selectedWorker.workShopId, //车间id
                            proTypeName: res.proTypeName,   //产品代号
                            remark: res.remark,   //产线编号
                            modelNumber: res.modelNumber,   //模具数量
                            workCode: that.selectedWorker.workerCode,   //员工code
                            workName: that.selectedWorker.workerName,   //员工姓名
                            proCodeAll: item.proCodeAll,   //产品code
                            goodNum: item.moudelNum || null,    //好坯
                            badNum: item.number || null,    //坏坯
                            modelId: res.id,
                            caijiTime: new Date(sessionStorage.getItem("dateCJ")),
                            createTime: that.nowTime,   //点击保存的时间
                        })                                                       
                    // }
                        
                })
                
            })
            console.log(param)
            // let data = {param};
            // console.log(data)
            let url = "/MobileCollection/insertMobileZhuJiang";
            that.axios.post(url, param).then(
                res => {
                // 成功回调
                if (res && res.data.status == 200) {
                    that.msg = "保存成功";
                    that.showMsg = true;
                    setTimeout(() => {
                    that.showMsg = false;
                    that.step = 1;
                    if(that.distinguish == 2){
                        that.distinguish = 2
                    }else{
                        that.distinguish = 1
                    }
                    that.selectedFactoryWorker = ''
                    that.pList[that.modelData.proCode].map(res =>{
                        res.number = 0
                        res.moudelNum = null
                    })
                    that.modelData = ''   
                    that.modelDataList = []      
                    // that.selectedWorkerList = []
                    that.selectedProductList = []
                    that.productDataList = []  
                    that.selectedWorker = ''
                    that.selectedWorkName= ''
                    that.selectedFactory = ''
                    that.prodIndex = null
                    that.modelIndex = null
                    that.proCode = ''
                    that.moudelId = ''
                    that.prodCodeAll = ''                                        
                    }, 1000);
                    that.showToast = false;
                }
                // if(res && res.data.status == 304){
                //     alert(res.data.msg)
                //     setTimeout(() => {
                //     that.showMsg = false;
                //     }, 1000);
                //     that.showToast = false
                //     return
                // }                
                // if(res&& res.data.status == 400){
                //     alert(res.data.msg)
                //     setTimeout(() => {
                //     that.showMsg = false;
                //     }, 1000);
                //     that.showToast = false
                //     return
                // }
                // if(res && res.data.status == 500){
                //     that.showToast = false;
                // localforage.getItem("local13" + that.baseURL + that.userCode)
                //     .then(function(value) {
                //     let res = value;
                //     if (!res) {
                //         let arr = [];
                //         arr.push(param);
                //         localforage
                //         .setItem("local13" + that.baseURL + that.userCode,JSON.stringify(arr))
                //         .then(function() {
                //             // 当值被存储后，可执行其他操作
                //         })
                //         .catch(function(err) {
                //             // 当出错时，此处代码运行
                //         });
                //     } else {
                //         that.localData = JSON.parse(value).concat();
                //         that.localData.push(param);
                //         localforage
                //         .removeItem("local13" + that.baseURL + that.userCode)
                //         .then(function() {
                //             localforage
                //             .setItem(
                //                 "local13" + that.baseURL + that.userCode,JSON.stringify(that.localData))
                //             .then(function() {
                //                 // 当值被存储后，可执行其他操作
                //             })
                //             .catch(function(err) {
                //                 // 当出错时，此处代码运行
                //             });
                //         })
                //         .catch(function() {});
                //     }
                //     })
                //     .catch(function() {
                //     // 当出错时，此处代码运行
                //     });
                // that.msg = "当前无网络，数据已保存本地";
                // that.showMsg = true;
                // setTimeout(() =>{
                //     that.showMsg = false
                // },1000)                
                // }                
                },
                res => {
                that.showToast = false;
                localforage.getItem("local13" + that.baseURL + that.userCode)
                    .then(function(value) {
                    let res = value;
                    if (!res) {
                        let arr = [];
                        arr.push(param);
                        
                        localforage.setItem("local13" + that.baseURL + that.userCode,JSON.stringify(arr)).then(function() {
                            // 当值被存储后，可执行其他操作
                        })
                        .catch(function(err) {
                            // 当出错时，此处代码运行
                        });
                    } else {
                        that.localData = JSON.parse(value).concat();
                        that.localData.push(param);
                        localforage
                        .removeItem("local13" + that.baseURL + that.userCode)
                        .then(function() {
                            localforage
                            .setItem(
                                "local13" + that.baseURL + that.userCode,JSON.stringify(that.localData))
                            .then(function() {
                                // 当值被存储后，可执行其他操作
                            })
                            .catch(function(err) {
                                // 当出错时，此处代码运行
                            });
                        })
                        .catch(function() {});
                    }
                    })
                    .catch(function() {
                    // 当出错时，此处代码运行
                    });
                that.msg = "当前无网络，数据已保存本地";
                that.showMsg = true;
                setTimeout(() => {
                that.showMsg = false;
                that.step = 1;
                    if(that.distinguish == 2){
                        that.distinguish = 2
                    }else{
                        that.distinguish = 1
                    }
                    that.selectedFactoryWorker = ''
                    that.pList[that.modelData.proCode].map(res =>{
                        res.number = 0
                        res.moudelNum = null
                    })
                    that.modelData = ''   
                    that.modelDataList = []      
                    // that.selectedWorkerList = []
                    that.selectedProductList = []
                    that.productDataList = []  
                    that.selectedWorker = ''
                    that.selectedWorkName= ''
                    that.selectedFactory = ''
                    that.prodIndex = null
                    that.modelIndex = null
                    that.proCode = ''
                    that.moudelId = ''
                    that.prodCodeAll = ''    
                }, 1000);
                }
            );                
        },
        async initData() {
            const that = this;
            const wList = {}
            const pList = {}
            let arrlist = []                
            await localforage
                .getItem("GroutingList")
                .then(function (value) {
                    if (!value) {
                        that.updateData();
                        return null;
                    }
                    // 本地初始化网络数据5
                    try {
                        that.workShopList = value.factoryAndShop || [];
                        that.workerList = value.workerList || [];
                        that.modelList=value.modelList||[];
                        that.productList=value.productList||[];
                        for(const item of that.workShopList){
                            for(let work of that.workerList){
                                if(!wList[item.workShopId]){
                                    wList[item.workShopId] = []
                                }
                                wList[item.workShopId].push({
                                    code:work.workerCode,
                                    id:work.workerId,
                                    name:work.workerName
                                })
                            }
                        }
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
                        that.wList = wList
                        that.pList = pList                            
                    } catch (error) {
                        localforage
                            .removeItem("GroutingList")
                            .then(function () {
                                this.updateData();
                            });
                    }
                })
                .catch(function () {
                });
        },
        async updateData(){
            const that = this;
            let isonline = true;
            let result = null;
            let arrlist = []
            await that.axios.get("/MobileCollection/selectDataOfMobileZhuJiang", {}).then(
                res => {
                    if (res && res.status == 200) {
                        const wList = {}
                        const pList = {}
                        result = res.data.data || [];
                        that.workShopList = result.factoryAndShop || [];
                        that.workerList = result.workerList || [];
                        that.modelList=result.modelList||[];
                        that.productList=result.productList||[];
                        for(const item of that.workShopList){
                            for(let work of that.workerList){
                                if(!wList[item.workShopId]){
                                    wList[item.workShopId] = []
                                }
                                wList[item.workShopId].push({
                                    code:work.workerCode,
                                    id:work.workerId,
                                    name:work.workerName
                                })
                            }
                        }
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
                        that.wList = wList
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
            if (isonline) {
                localforage.setItem("GroutingList",result);
                localforage.setItem(
                    "Grouting-workShopList"+ that.baseURL + that.userCode ,
                    that.workShopList
                );                    
                localforage.setItem(
                    "Grouting-workerList"+ that.baseURL + that.userCode ,
                    that.workerList
                );
                localforage.setItem(
                    "Grouting-modelList"+ that.baseURL + that.userCode ,
                    that.modelList
                );
                localforage.setItem(
                    "Grouting-productList"+ that.baseURL + that.userCode ,
                    that.productList
                );

            }
        },

    },


}
</script>
<style scoped>
    .block {
        padding-bottom: 20px;
    }
    .block p {
        text-align: left;
        font-weight: bold;
        font-size: 18px;
        padding-bottom: 5px;
    }
    .clearfix li {
        float: left;
        height: 60px;
        padding: 0 15px;
        display: flex;
        align-items: center;
        font-size: 15px;
        color: #fff;
        background-color: #409eff;
        border-radius: 5px;
        margin-bottom: 5px;
    }
    .liList{
        float: left;
        /* height: 60px; */
        padding: 0 15px;
        display: flex;
        align-items: center;
        font-size: 15px;
        color: #fff;
        background-color: #409eff;
        border-radius: 5px;
        margin-bottom: 5px;        
    }
    li:last-of-type p {
        font-weight: bold;
    }
    .worker li {
        float: left;
        min-width: 80px;
        height: 80px;
        padding-top: 8px;
        color: #fff;
        font-size: 14px;
        flex-direction: column;
        line-height: 30px;
    }
    .worker li div:first-of-type {
        font-size: 20px;
    }
    .step2 li {
        background-color: #409eff;
    }
    .display_b {
        display: inline-block;
    }
    .level {
        display: flex;
        flex-wrap: wrap;
    }
    .colors .btn,
    .level .btn {
        padding: 0 30px;
        height: 60px;
        line-height: 60px;
    }
    .level .num {
        height: 44px;
        padding: 0;
        border: 1px solid #ccc;
        border-radius: 8px;
    }
    .level .num span {
        float: left;
        width: 20%;
        text-align: center;
        line-height: 42px;
        font-size: 24px;
        cursor: pointer;
        -moz-user-select: none;
        color: black
    }
    .sub {
        border-right: 1px solid #ccc;
    }
    .add {
        border-left: 1px solid #ccc;
    }
    .level .num input {
        float: left;
        width: 60%;
        text-align: center;
        line-height: 40px;
        border: none;
        outline: none;
    }
    .w100 {
        width:100% !important;
    }
    .tbHead {
        height: 40px;
        line-height: 40px;
        background-color: #ccc;
        font-size: 17px;
        font-weight: 600;
    }
    .tbText {
        display: inline-block;
        width: 20%;
        font-size: 16px
    }
    @media screen and (orientation: portrait) {
    .tbText {
        display: inline-block;
        width: 20%;
        font-size: 10px
    }
    .tbText:nth-of-type(2){
        width: 25% !important;
    }
    .tbText:nth-of-type(3){
        width: 15% !important;
    }    
    .liList{
        padding: 0
    }
    .minH149{
        overflow-x: scroll;
    }
    }     
    .tbMain {
        margin-top: 4px;
        height: 60px;
        line-height: 60px;
        background-color: #409eff;
        font-size: 18px;
        color:#fff;
        border-radius: 6px;
    }
    .distinguish{
        background: limegreen;
        border: 1px solid limegreen;
        border-radius: 5px;
        padding: 2px;
        color: white;
        width: 60px;        
    }
    .con{
        width: 150px;
        /* background: limegreen; */
        border-radius: 9px;
        float: left;
        margin-right: 5px;
        height: 60px;
        cursor: default
    }
    .tb{
        width:150px;
        height:60px;
        border-radius: 9px;
        cursor: default    
    }
    .minH149{
        /* min-height: 149px; */
        display: inline-flex;
        width: 100%;
        margin-bottom: 3px;
    }
    .h60{
        height: 60px !important;
    }
    .bgGreen{
       background: limegreen 
    }
    .bg_color{
        background: #00BFFF !important;
    }
    /* 消除input元素 type="number" 时默认的 加减按钮 */
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    /*** 消除input元素 type="number" 时默认的 加减按钮---moz版*/
    input[type=number] {
        -moz-appearance:textfield;
    }    
</style>