<template>
    <div class="wrap">
    <div>
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
    </div>       
        <div class="content">            
        <div v-if="step === 1">
            <div v-if='distinguish === 2'>
            <div class="block">
            <p>请选择成型工组别: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button class="distinguish" @click="disting()">不区分</button>
            </p>
            <ul class="clearfix">
                <li
                    v-for="(item) in factoryAndGroupList"
                    :key="item.id"
                    class="btn group"
                    :class="{bgRed: item.factoryAndGroup === selectedFactoryAndGroup}"
                    style="background: limegreen"
                    @click="selectList1(item)">
                    {{ item.factoryAndGroup }}
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
                    v-for="(item) in workListAll"
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
            <div class="block">
            <p>请选择产品型号: </p>
            <ul class="clearfix" :style="{heihgt:moudelId == null?'150px':'380px'}">
                <li
                    v-for="(item,index) in selectedModelList"
                    :key="item.prodCodeAll"
                    class="btn product"
                    :class="{bgRed: modelDataList.includes(item.id),bgcRed:modelIndex == index}"                    
                    >   
                     <div class="liList" @click="selectedProduct(item,index)" style="height:60px">{{ item.proCode }}</div></li>            
                    <div style="clear:both;float:left">
                    <div class="level con" 
                    :class="{bgGreen:pList[modelData.proCode].length >1,h132:pList[modelData.proCode].length == 1}"
                     v-show="moudelId != null" 
                     v-for="(res,index) in pList[modelData.proCode]" 
                     :key="res.proCodeAll"
                     :style="{height:prodCodeAll== ''?'60px':'192px'}"
                     >                        
                        <div class="tbText tb" v-show="pList[modelData.proCode].length >1" :class="{bgRed:productDataList.includes(res.proCodeAll),bgcRed:prodIndex == index}" @click="selectList3(res,index)">{{res.specification+ '-' +res.proName}}</div>
                        
                        <div class="num" v-show="res.badNum > 0 || res.goodNum >0 || res.deductionNum>0 || prodIndex == index || pList[modelData.proCode].length > 0">
                            <span class="sub" @click="goodNumSub(res,index)" onselectstart="return true">-</span>
                            <input type="number" v-model="res.goodNum" min="0" placeholder="好坯" @change="goodNumChange($event,index)"/>
                            <span class="add" @click="goodNumAdd(res,index)" onselectstart="return true">+</span>
                        </div>                    
                        <div class="num" v-show="res.badNum > 0 || res.goodNum >0 || res.deductionNum>0 || prodIndex == index || pList[modelData.proCode].length > 0">
                            <span class="sub" @click="badNumSub(res,index)" onselectstart="return false">-</span>
                            <input type="number" v-model="res.badNum" placeholder="坏坯" min="0" @change="badNumChange($event,index)" />
                            <span class="add" @click="badNumAdd(res,index)" onselectstart="return false">+</span>
                        </div>
                        <div class="num" v-show="res.badNum > 0 || res.goodNum >0 || res.deductionNum>0 || prodIndex == index || pList[modelData.proCode].length > 0">
                            <span class="sub" @click="deductionSub(res,index)" onselectstart="return false">-</span>
                            <input type="number" v-model="res.deductionNum" placeholder="扣坯" min="0" @change="deductionNumChange($event,index)" />
                            <span class="add" @click="deductionAdd(res,index)" onselectstart="return false">+</span>
                        </div>                                            
                    </div>                         
                    </div>
                               
            </ul>
            </div>            
            <div class="block" v-if="banJianList.length > 1">
            <p>请选择半检组:</p>
            <ul class="worker clearfix step2">
                <li
                    v-for="(item) in banJianList"
                    :key="item.code"
                    class="btn"
                    :class="{bgRed: item.code === banjianWorker.code}"
                    @click="selectBanjian(item)"
                >
                <div>{{ item.code }}</div>
                <div>{{ item.name }}</div>
                </li>
            </ul>
            </div>
            <div class="block" v-if="xiuPiList.length > 1">
            <p>请选择修坯组:</p>
            <ul class="worker clearfix step2">
                <li
                    v-for="(item) in xiuPiList"
                    :key="item.code"
                    class="btn"
                    :class="{bgRed: item.code === xiupiWorker.code}"
                    @click="selectXiupi(item)"
                >
                <div>{{ item.code }}</div>
                <div>{{ item.name }}</div>
                </li>
            </ul>
            </div>
            <div class="block" v-if="chaYouList.length > 1">
            <p>请选择查油组:</p>
            <ul class="worker clearfix step2">
                <li
                    v-for="(item) in chaYouList"
                    :key="item.code"
                    class="btn"
                    :class="{bgRed: item.code === chayouWorker.code}"
                    @click="selectChayou(item)"
                >
                <div>{{ item.code }}</div>
                <div>{{ item.name }}</div>
                </li>
            </ul>
            </div>
            <div class="block" v-if="shangShuiList.length > 1">
            <p>请选择上水组:</p>
            <ul class="worker clearfix step2">
                <li
                    v-for="(item) in shangShuiList"
                    :key="item.code"
                    class="btn"
                    :class="{bgRed: item.code === shangshuiWorker.code}"
                    @click="selectShangshui(item)"
                >
                <div>{{ item.code }}</div>
                <div>{{ item.name }}</div>
                </li>
            </ul>
            </div>                
        </div>
        
        </div>
        <div class="footBtn">
            <div class="save2" v-show="step > 1" @click="submit(1)" style="background: limegreen">保存并添加同一员工产品</div>
            <div class="save2" v-show="step > 1" @click="submit(2)" style="background: #409eff">保存并添加其它员工产品</div>
            <div class="goback" v-show="step > 1" @click="goBack">返回</div>
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
export default {
    name: "Receipt",
    components: {
        myHead,
        loading,
        toast,
        msg
    },
data: function () {
    return {
        step: 1,
        selectedFactoryAndGroup: '',
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
        newSetModelList:[],
        workList:[],
        workListAll:[],
        banJianList:[],
        shangShuiList:[],
        xiuPiList:[],
        chaYouList:[],
        banjianWorker:'',
        shangshuiWorker:'',
        xiupiWorker:'',
        chayouWorker:'',
        submitNum:null,
        factoryAndGroupList:[]
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
            this.banjianWorker = ''
            this.shangshuiWorker = ''
            this.xiupiWorker = ''
            this.chayouWorker = ''
            this.pList[this.modelData.proCode].every(res =>{
                res.badNum = null
                res.goodNum = null
                res.deductionNum = null
                res.moudelNum = null
            })
            this.modelData = []      
            this.modelDataList = []
            this.productDataList = []
            this.submitNum = null  
        }
    },
    disting(){
        if(this.distinguish === 1){
            this.distinguish += 1
            this.selectedFactoryAndGroup = ''
            this.selectedFactoryWorker = ''
        }else{
            this.distinguish -= 1
            this.selectedFactoryAndGroup = ''
            this.selectedFactoryWorker = ''
            this.selectedWorkerList = []
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
    },
    checkPostLocalData() {
      let that = this;
      localforage
        .getItem("local14" + that.baseURL + that.userCode)
        .then(function(value) {
          let res = JSON.parse(value);
          if (res && res.length > 0) {
            that.localData = res;
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
      let url = "/MobileCollection/insertMobilePi";
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
                localforage.removeItem("local14" + that.baseURL + that.userCode).then(function() {

                }).catch(function() {});
                that.localData.list = null;
                isUploadAll = true;
              }
              tempArr = tempArr.filter(res => res != data);
                if (!isUploadAll && tempArr.length > 0) {
                    localforage.setItem('local14' + that.baseURL + that.userCode,JSON.stringify(tempArr))
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
            //         localforage.setItem('local14' + that.baseURL + that.userCode,JSON.stringify(tempArr))
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
            //         localforage.setItem('local14' + that.baseURL + that.userCode,JSON.stringify(tempArr))
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
          });
      }
    //   if (!isUploadAll && tempArr.length > 0) {
    //     localforage.setItem('local14' + that.baseURL + that.userCode,JSON.stringify(tempArr))
    //   }
      that.showLoading = false;      
    },                        
        selectList1(item) {
            const that = this;
            let arrList = [];
            this.selectedFactoryAndGroup = item.factoryAndGroup;
            this.selectedFactory = item
            localforage.getItem("ReceiptList"+that.baseURL + that.userCode ).then(function(value) {
                let res = JSON.parse(value);
            }).catch(function(err) {
            });
            for(let res of this.workList){
                if(item.mjFactoryId == res.mjFactoryId && item.mjGroupId == res.mjGroupId){
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
        selectBanjian(item){
            this.banjianWorker = item
        },
        selectChayou(item){
            this.chayouWorker = item
        },
        selectShangshui(item){
            this.shangshuiWorker = item
        },
        selectXiupi(item){
            this.xiupiWorker = item
        }, 

        selectedProduct(item,index){
            let that = this
            let arrList = []
            this.tbMainShow = true
            // this.mouldNumber = item.modelNumber
            this.modelIndex = index
            this.modelData = item
            this.moudelId = item.id
            this.prodCode = item.proCode
            this.prodIndex = null
            if(that.pList[that.modelData.proCode].length == 1){
              that.prodCodeAll = that.pList[that.modelData.proCode][0].prodCodeAll
            }            
            // for(let res of this.productList){
            //     if(item.proCode == res.proCode){
            //         arrList.push(res)
            //     }
            // }
            // this.pList[item.proCode].map(res=>{
            //     if('number' in res){
                    
            //     }
            //     else{
                    
            //     }
            // })
            that.selectedProductList = that.pList[item.proCode]
            if(that.pList[item.proCode].length >1){
                that.prodCodeAll = 1
            }          
        },

        selectList3(res,index){
            let that = this
            that.prodIndex = index
            that.prodCodeAll = res.proCodeAll
            this.productShow = true
            // const data = [...this.selectedProductList]
            // data[index].number =1
        },
    
        badNumAdd: function(ele,i) {
        const data = [...this.pList[this.modelData.proCode]];
        if (!data[i].badNum) {
            data[i].badNum = 0;
        }
        data[i].badNum += 1;
        this.pList[this.modelData.proCode] = data;
        if(data[i].badNum > 0){
            this.modelDataList.push(this.modelData.id)
            this.productDataList.push(ele.proCodeAll)
            this.newSetArr = Array.from(new Set(this.productDataList))
            this.newSetModelList = Array.from(new Set(this.modelDataList))
        }       
        },
        badNumSub: function(ele,i) {
        let arr = []
        let arr2 = []
        let num = 0
        let that = this
        if (!this.pList[this.modelData.proCode][i].badNum || this.pList[this.modelData.proCode][i].badNum == 0)
            return;      
    
        const data = [...this.pList[this.modelData.proCode]];
        data[i].badNum -= 1;
        this.pList[this.modelData.proCode] = data;
        let n1 = this.pList[this.modelData.proCode].every(item => {
            return item.badNum == 0;
            
        });
        if (n1) this.showSubmit = false;
        let n2 = this.pList[this.modelData.proCode].slice(1).every(item => {
            return item.badNum == 0;
        });
        if (n2) this.showAddQ = false;
        if(data[i].badNum>0){
            this.modelDataList.push(this.modelData.id)
            this.productDataList.push(ele.proCodeAll)
            this.newSetArr = Array.from(new Set(this.productDataList))
            this.newSetModelList = Array.from(new Set(this.modelDataList))
        }         
        if((ele.goodNum == 0 || !ele.goodNum) && (ele.badNum == 0 || !ele.badNum) && (ele.deductionNum == 0 || !ele.deductionNum)){
            arr2 = this.productDataList.filter(res=> res != ele.proCodeAll);
            this.productDataList = arr2;            
        }
        let t = false
        let n3 = this.pList[this.modelData.proCode].map(item => {
            if((item.goodNum == 0 || !item.goodNum) && (item.badNum == 0 || !item.badNum) && (item.deductionNum == 0 || !item.deductionNum)){
                num ++
                t = true
            }
            if(t == true && num == this.pList[this.modelData.proCode].length){
                arr = this.modelDataList.filter(res=> res != this.modelData.id);
                this.modelDataList = arr;                 
            }           
        })
        },
        deductionAdd: function(ele,i) {
        const data = [...this.pList[this.modelData.proCode]];
        if (!data[i].deductionNum) {
            data[i].deductionNum = 0;
        }
        data[i].deductionNum += 1;
        this.pList[this.modelData.proCode] = data;
        let arr = []
        if(data[i].deductionNum > 0){
            this.modelDataList.push(this.modelData.id)
            this.productDataList.push(ele.proCodeAll)
            this.newSetArr = Array.from(new Set(this.productDataList))
            this.newSetModelList = Array.from(new Set(this.modelDataList))
        }
        },
        deductionSub: function(ele,i) {
        let arr = []
        let arr2 = []
        let num = 0
        let that = this
        if (!this.pList[this.modelData.proCode][i].deductionNum || this.pList[this.modelData.proCode][i].number == 0)
            return;      
    
        const data = [...this.pList[this.modelData.proCode]];
        data[i].deductionNum -= 1;
        this.pList[this.modelData.proCode] = data;
        let n1 = this.pList[this.modelData.proCode].every(item => {
            return item.deductionNum == 0;
            
        });
        if (n1) this.showSubmit = false;
        let n2 = this.pList[this.modelData.proCode].slice(1).every(item => {
            return item.deductionNum == 0;
        });
        if(! /^\d+$/.test(data[i].deductionNum)){
            data[i].deductionNum = data[i].deductionNum.toFixed(1)
        }        
        if(data[i].deductionNum < 0){
            data[i].deductionNum = 0
        }
        if (n2) this.showAddQ = false;
        if(data[i].deductionNum>0){
            this.modelDataList.push(this.modelData.id)
            this.productDataList.push(ele.proCodeAll)
            this.newSetArr = Array.from(new Set(this.productDataList))
            this.newSetModelList = Array.from(new Set(this.modelDataList))
        }         
        if((ele.goodNum == 0 || !ele.goodNum) && (ele.badNum == 0 || !ele.badNum) && (ele.deductionNum == 0 || !ele.deductionNum)){
            arr2 = this.productDataList.filter(res=> res != ele.proCodeAll);
            this.productDataList = arr2;            
        }
        let t = false
        let n3 = this.pList[this.modelData.proCode].map(item => {
            if((item.goodNum == 0 || !item.goodNum) && (item.badNum == 0 || !item.badNum) && (item.deductionNum == 0 || !item.deductionNum)){
                num ++
                t = true
            }
            if(t == true && num == this.pList[this.modelData.proCode].length){
                arr = this.modelDataList.filter(res=> res != this.modelData.id);
                this.modelDataList = arr;                 
            }           
        })
        },        
        goodNumAdd: function(ele,i) {           
        const data = [...this.pList[this.modelData.proCode]];
        if (!data[i].goodNum) {
            data[i].goodNum = 0;
        }
        data[i].goodNum += 1;
        this.pList[this.modelData.proCode] = data;
        this.goodNum = data[i].goodNum
        if(data[i].goodNum > 0){
            this.modelDataList.push(this.modelData.id)
            this.productDataList.push(ele.proCodeAll)
            this.newSetArr = Array.from(new Set(this.productDataList))
            this.newSetModelList = Array.from(new Set(this.modelDataList))
            console.log(this.newSetModelList)
        }        
        },
        goodNumSub: function(ele,i) {     
        if (!this.pList[this.modelData.proCode][i].goodNum || this.pList[this.modelData.proCode][i].goodNum == 0)
            return;      
        const data = [...this.pList[this.modelData.proCode]];
        data[i].goodNum -= 1;
        this.pList[this.modelData.proCode] = data;
        let n1 = this.pList[this.modelData.proCode].every(item => {
            return item.goodNum == 0;
            
        });
        if (n1) this.showSubmit = false;
        let n2 = this.pList[this.modelData.proCode].slice(1).every(item => {
            return item.goodNum == 0;
        });
        if (n2) this.showAddQ = false;
        this.goodNum = data[i].goodNum
        if(data[i].goodNum>0){
            this.modelDataList.push(this.modelData.id)
            this.productDataList.push(ele.proCodeAll)
            this.newSetArr = Array.from(new Set(this.productDataList))
            this.newSetModelList = Array.from(new Set(this.modelDataList))
        }   
        let arr = []
        let arr2 = []
        let num = 0
        let that = this
        if((ele.goodNum == 0 || !ele.goodNum) && (ele.badNum == 0 || !ele.badNum) && (ele.deductionNum == 0 || !ele.deductionNum)){
            arr2 = this.productDataList.filter(res=> res != ele.proCodeAll);
            this.productDataList = arr2;            
        }
        let t = false
        let n3 = this.pList[this.modelData.proCode].map(item => {
            if((item.goodNum == 0 || !item.goodNum) && (item.badNum == 0 || !item.badNum) && (item.deductionNum == 0 || !item.deductionNum)){
                num ++
                t = true
            }
            if(t == true && num == this.pList[this.modelData.proCode].length){
                arr = this.modelDataList.filter(res=> res != this.modelData.id);
                this.modelDataList = arr;                 
            }           
        })
        },                          

        badNumChange:function(e,i){
            let val = null
            let arr = []
            let arr2 = []
            let num = 0
            let that = this
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
            if(data[i].badNum == 0 || data[i].badNum == null){
                data[i].badNum = 0
            }
            data[i].badNum = val; 
            if(val >0){
                this.modelDataList.push(this.modelData.id)
                this.productDataList.push(data[i].proCodeAll)
                this.newSetArr = Array.from(new Set(this.productDataList))
                this.newSetModelList = Array.from(new Set(this.modelDataList))

            }
            if((data[i].goodNum == 0 || !data[i].goodNum) && (data[i].badNum == 0 || !data[i].badNum) && (data[i].deductionNum == 0 || !data[i].deductionNum)){
                arr2 = this.productDataList.filter(res=> res != data[i].proCodeAll);
                this.productDataList = arr2;            
            }
        let t = false
        let n3 = this.pList[this.modelData.proCode].map(item => {
            if((item.goodNum == 0 || !item.goodNum) && (item.badNum == 0 || !item.badNum) && (item.deductionNum == 0 || !item.deductionNum)){
                num ++
                t = true
            }
            if(t == true && num == this.pList[this.modelData.proCode].length){
                arr = this.modelDataList.filter(res=> res != this.modelData.id);
                this.modelDataList = arr;                 
            }           
        })          
        },

        goodNumChange:function(e,i){
            let val = null
            let arr = []
            let arr2 = []
            let num = 0
            let that = this
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
            if(data[i].goodNum == 0 || data[i].goodNum == null){
                data[i].goodNum = 0
            }
            data[i].goodNum = val; 
            if(val >0){
                this.modelDataList.push(this.modelData.id)
                this.productDataList.push(data[i].proCodeAll)
                this.newSetArr = Array.from(new Set(this.productDataList))
                this.newSetModelList = Array.from(new Set(this.modelDataList))
            }
            if((data[i].goodNum == 0 || !data[i].goodNum) && (data[i].badNum == 0 || !data[i].badNum) && (data[i].deductionNum == 0 || !data[i].deductionNum)){
                arr2 = this.productDataList.filter(res=> res != data[i].proCodeAll);
                this.productDataList = arr2;            
            }
            let t = false
            let n3 = this.pList[this.modelData.proCode].map(item => {
                if((item.goodNum == 0 || !item.goodNum) && (item.badNum == 0 || !item.badNum) && (item.deductionNum == 0 || !item.deductionNum)){
                    num ++
                    t = true
                }
                if(t == true && num == this.pList[this.modelData.proCode].length){
                    arr = this.modelDataList.filter(res=> res != this.modelData.id);
                    this.modelDataList = arr;                 
                }           
            })            
        },
        
        deductionNumChange:function(e,i){
            let val = null
            let arr = []
            let arr2 = []
            let num = 0
            let that = this
            val = Number(e.target.value)
            const data = [...this.pList[this.modelData.proCode]];
            if(val < 0){
                val = 0
                alert('不能输入负数')
            }
            if(data[i].deductionNum == 0 || data[i].deductionNum == null){
                data[i].deductionNum = 0
            }
            data[i].deductionNum = val; 
            if(val >0){
                this.modelDataList.push(this.modelData.id)
                this.productDataList.push(data[i].proCodeAll)
                this.newSetArr = Array.from(new Set(this.productDataList))
                this.newSetModelList = Array.from(new Set(this.modelDataList))
            }
            if((data[i].goodNum == 0 || !data[i].goodNum) && (data[i].badNum == 0 || !data[i].badNum) && (data[i].deductionNum == 0 || !data[i].deductionNum)){
                arr2 = this.productDataList.filter(res=> res != data[i].proCodeAll);
                this.productDataList = arr2;            
            }
            let t = false
            let n3 = this.pList[this.modelData.proCode].map(item => {
                if((item.goodNum == 0 || !item.goodNum) && (item.badNum == 0 || !item.badNum) && (item.deductionNum == 0 || !item.deductionNum)){
                    num ++
                    t = true
                }
                if(t == true && num == this.pList[this.modelData.proCode].length){
                    arr = this.modelDataList.filter(res=> res != this.modelData.id);
                    this.modelDataList = arr;                 
                }           
            })            
        },        

        submit(num){
            let that = this
            that.nowTime = new Date()
            if(that.prodCode == ''){
                alert('请选择产品型号！')
                return
            }
            if(that.banJianList.length>1 && that.banjianWorker == ''){
                alert('请选择半检组！')
                return
            }
            if(that.shangShuiList.length>1 && that.shangshuiWorker == ''){
                alert('请选择上水组！')
                return
            } 
            if(that.chaYouList.length>1 && that.chayouWorker == ''){
                alert('请选择查油组！')
                return
            }
            if(that.xiuPiList.length>1 && that.xiupiWorker == ''){
                alert('请选择修坯组！')
                return
            }                                    
            if(this.modelDataList.length == 0){
                alert('请添加数量！')
                return
            }else{
               this.showToast = true; 
            }
            that.submitNum = num
        },
        toastConfirm(num){
            let that = this            
            let arr = []
            that.selectedModelList.map(item=>{
                if(that.modelDataList.includes(item.id)){
                    arr.push(item)
                }
            })
            if(that.banJianList.length == 1){
                that.banjianWorker = that.banJianList[0]
            }
            if(that.shangShuiList.length == 1){
                that.shangshuiWorker = that.shangShuiList[0]
            }
            if(that.chaYouList.length == 1){
                that.chayouWorker = that.chaYouList[0]
            } 
             if(that.xiuPiList.length == 1){
                that.xiupiWorker = that.xiuPiList[0]
            }                      
            // let param = []
            let param = {
                list : []
            }
            console.log(arr)
            arr.map(res =>{
                that.pList[res.proCode].map(item =>{
                    // if(item.number> 0){
                            param.list.push({
                            mjFactoryId: that.selectedWorker.mjFactoryId,  //厂区id    
                            proTypeName: res.proTypeName,   //产品代号
                            remark: res.remark,   //产线编号
                            modelNumber: res.modelNumber,   //模具数量
                            workCode: that.selectedWorker.workerCode,   //员工code
                            workName: that.selectedWorker.workerName,   //员工姓名
                            proCodeAll: item.proCodeAll,   //产品code
                            goodNum: item.goodNum?item.goodNum:null,    //好坯
                            badNum: item.badNum?item.badNum:null,    //坏坯
                            kouNum: item.deductionNum?item.deductionNum:null,    //扣坯
                            groupIds: that.selectedWorker.mjGroupId || null,  //员工组别
                            banJianId: that.banjianWorker? that.banjianWorker.partnerId : null,   //半检工
                            xiuPiId: that.xiupiWorker? that.xiupiWorker.partnerId : null,   //修坯工
                            chaYouId: that.chayouWorker? that.chayouWorker.partnerId : null,   //查油工
                            shangShuiId: that.shangshuiWorker? that.shangshuiWorker.partnerId : null,  //上水工
                            caijiTime: new Date(sessionStorage.getItem("dateCJ")),
                            createTime: that.nowTime,   //点击保存的时间
                        })                                                       
                    // }
                        
                })
                
            })
            console.log(param)
            // let data = {param};
            // console.log(data)
            let url = "/MobileCollection/insertMobilePi";
            that.axios.post(url, param).then(
                res => {
                // 成功回调
                if (res && res.data.status == 200) {
                    that.msg = "保存成功";
                    that.showMsg = true;
                    setTimeout(() => {
                    that.showMsg = false;
                    if(that.submitNum == 1){
                        if(that.distinguish == 1){
                            that.distinguish = 1
                        }else{
                            that.distinguish = 2
                        }
                        that.step = 2
                        that.modelDataList = []
                        that.modelIndex = null
                        that.moudelId = null
                        that.prodCode = ''
                        that.pList[that.modelData.proCode].map(res=>{
                            res.goodNum = null
                            res.badNum = null
                            res.deductionNum = null
                        })
                        that.modelData = ''
                        that.pList[that.modelData.proCode] = []
                        that.banjianWorker = ''
                        that.shangshuiWorker = ''
                        that.xiupiWorker = ''
                        that.chayouWorker = ''
                        that.prodCodeAll = ''
                    }
                    if(that.submitNum == 2){
                        if(that.distinguish == 1){
                            that.distinguish = 1
                        }else{
                            that.distinguish = 2
                        }
                        that.step = 1
                        that.modelDataList = []
                        that.modelIndex = null
                        that.moudelId = null
                        that.prodCode = ''
                        that.pList[that.modelData.proCode].map(res=>{
                            res.goodNum = null
                            res.badNum = null
                            res.deductionNum = null
                        })
                        that.modelData = ''
                        that.pList[that.modelData.proCode] = []
                        that.banjianWorker = ''
                        that.shangshuiWorker = ''
                        that.xiupiWorker = ''
                        that.chayouWorker = ''
                        that.selectedFactoryWorker = ''
                        that.selectedModelList = []
                        that.prodCodeAll = ''
                        that.selectedWorkName = ''
                    }                    
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
                // localforage.getItem("local14" + that.baseURL + that.userCode)
                //     .then(function(value) {
                //     let res = value;
                //     if (!res) {
                //         let arr = [];
                //         arr.push(param);
                //         localforage
                //         .setItem("local14" + that.baseURL + that.userCode,JSON.stringify(arr))
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
                //         .removeItem("local14" + that.baseURL + that.userCode)
                //         .then(function() {
                //             localforage
                //             .setItem(
                //                 "local14" + that.baseURL + that.userCode,JSON.stringify(that.localData))
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
                localforage.getItem("local14" + that.baseURL + that.userCode)
                    .then(function(value) {
                    let res = value;
                    if (!res) {
                        let arr = [];
                        arr.push(param);
                        localforage
                        .setItem("local14" + that.baseURL + that.userCode,JSON.stringify(arr))
                        .then(function() {
                            // 当值被存储后，可执行其他操作
                        })
                        .catch(function(err) {
                            // 当出错时，此处代码运行
                        });
                    } else {
                        that.localData = JSON.parse(value).concat();
                        that.localData.push(param);
                        localforage
                        .removeItem("local14" + that.baseURL + that.userCode)
                        .then(function() {
                            localforage
                            .setItem(
                                "local14" + that.baseURL + that.userCode,
                                JSON.stringify(that.localData)
                            )
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
                    if(that.submitNum == 1){
                        if(that.distinguish == 1){
                            that.distinguish = 1
                        }else{
                            that.distinguish = 2
                        }
                        that.step = 2
                        that.modelDataList = []
                        that.modelIndex = null
                        that.moudelId = null
                        that.prodCode = ''
                        that.pList[that.modelData.proCode].map(res=>{
                            res.goodNum = null
                            res.badNum = null
                            res.deductionNum = null
                        })
                        that.modelData = ''
                        that.pList[that.modelData.proCode] = []
                        that.banjianWorker = ''
                        that.shangshuiWorker = ''
                        that.xiupiWorker = ''
                        that.chayouWorker = ''
                        that.prodCodeAll = ''
                    }
                    if(that.submitNum == 2){
                        if(that.distinguish == 1){
                            that.distinguish = 1
                        }else{
                            that.distinguish = 2
                        }
                        that.step = 1
                        that.modelDataList = []
                        that.modelIndex = null
                        that.moudelId = null
                        that.prodCode = ''
                        that.pList[that.modelData.proCode].map(res=>{
                            res.goodNum = null
                            res.badNum = null
                            res.deductionNum = null
                        })
                        that.modelData = ''
                        that.pList[that.modelData.proCode] = []
                        that.banjianWorker = ''
                        that.shangshuiWorker = ''
                        that.xiupiWorker = ''
                        that.chayouWorker = ''
                        that.selectedFactoryWorker = ''
                        that.selectedModelList = []
                        that.prodCodeAll = ''
                    } 
                }, 2000);
                }
            );                
        },
        async initData() {
            const that = this;
            const wList = {}
            const pList = {}
            let arrlist = []                
            await localforage
                .getItem("ReceiptList")
                .then(function (value) {
                    if (!value) {
                        that.updateData();
                        return null;
                    }
                    // 本地初始化网络数据5
                    try {
                        that.factoryAndGroupList = value.factoryAndGroup || [];
                        that.workList = value.workList || [];
                        that.workListAll = value.workListAll || [];
                        that.modelList=value.modelList||[];
                        that.productList=value.productList||[];
                        that.xiuPiList = value.xiuPiList || []
                        that.chaYouList = value.chaYouList || []
                        that.banJianList = value.banJianList || []
                        that.shangShuiList = value.shangShuiList || []
                        for(const item of that.factoryAndGroupList){
                            for(let work of that.workList){
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
                        localforage.removeItem("ReceiptList").then(function () {
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
            await that.axios.get("/MobileCollection/selectDataOfMobilePi", {}).then(
                res => {
                    if (res && res.status == 200) {
                        const wList = {}
                        const pList = {}
                        result = res.data.data || [];
                        that.factoryAndGroupList = result.factoryAndGroup || [];
                        that.workList = result.workList || [];
                        that.workListAll = result.workListAll || [];
                        that.modelList=result.modelList||[];
                        that.productList=result.productList||[];
                        that.xiuPiList = result.xiuPiList || []
                        that.chaYouList = result.chaYouList || []
                        that.banJianList = result.banJianList || []
                        that.shangShuiList = result.shangShuiList || []
                        for(const item of that.factoryAndGroupList){
                            for(let work of that.workList){
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
                        for(let ele of that.productList){
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
                localforage.setItem("ReceiptList",result);
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
    /* .clearfix li {
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
    } */
    .liList{
        float: left;
        /* height: 60px; */
        padding: 0 15px;
        display: flex;
        align-items: center;
        font-size: 15px;
        color: #fff;
        /* background-color: #409eff; */
        border-radius: 5px;
        margin-bottom: 5px;        
    }
    .product{
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
        border-radius: 9px;
        float: left;
        margin-right: 5px;
        height: 60px;
        cursor: default
    }
    .tb{
    width: 150px;
    height: 60px;
    background: limegreen;
    border-radius: 9px;
    cursor: default;
    font-size: 15px;
    color: #fff;
    line-height: 60px;
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
    .h132{
        height: 132px !important;
    }
    .group{
        float: left;
        min-width: 80px;
        height: 50px;
        padding-top: 8px;
        color: #fff;
        font-size: 14px;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        line-height: 30px;        
    }  
</style>