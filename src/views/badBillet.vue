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
            <p>请选择责任部门: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button class="distinguish" @click="disting()">不区分</button>
            </p>
            <ul class="clearfix">
                <li
                    v-for="(item) in factoryAndGroupList"
                    :key="item.id"
                    class="btn group"
                    :class="{bgRed: item.factoryAndShop === selectedFactoryAndGroup}"
                    style="background: limegreen"
                    @click="selectList1(item)">
                    {{ item.factoryAndShop }}
                </li>
            </ul>
            </div>
            <div class="block">
            <p>请选择责任人:</p>
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
            <p>请选择责任人:</p>
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
            <p>请选择产品类型:</p>
            <ul class="worker clearfix step2">
                <li
                    v-for="(item) in productTypeList"
                    :key="item.code"
                    class="btn"
                    :class="{bgRed: item === selectedProtype}"
                    @click="selectProtype(item)"
                    style="height:57px"
                >
                <div>{{ item }}</div>         
                </li>
            </ul>
            </div>          
            <div class="block">
            <p>请选择产品型号: </p>
            <ul class="clearfix" :style="{heihgt:moudelId == null?'150px':'380px'}">
                <li
                    v-for="(item,index) in selectedModelList"
                    :key="item.prodCodeAll"
                    class="btn product"
                    :class="{bgRed: modelDataList.includes(item.id),bgRed:modelData == item}"                    
                    >   
                     <div class="liList" @click="selectedProduct(item,index)" style="height:60px">{{ item }}</div></li>            
                    <div style="clear:both;float:left">
                    <!-- :class="{bgGreen:pList[modelData.proCode].length >1,h132:pList[modelData.proCode].length == 1}"   -->
                    <div class="level con"                     
                     v-for="(res,index) in pList[modelData]" 
                     :key="res.proCodeAll"
                     v-show="res.proName" 
                     >
                        <div class="tbText tb" v-show="res.proName" :class="{bgRed:productDataList.includes(res.proCodeAll),bgcRed:prodIndex == index}" @click="selectList3(res,index)">{{res.specification+ '-' +res.proName}}</div>                                            
                    </div>
                    </div>
            </ul>
            </div>
            <div class="block">
            <p>请选择成型工:</p>
            <div class="level">
                <div
                    v-for="(item,index) in selectedWorkerAll"
                    :key="item.code"
                >
                <div
                    class="btn bgcGreen"
                    :class="{bgRed: item.workerCode === selectedWork.workerCode}"
                    @click="selectworker(item,index)"                
                >
                  <div>{{ item.workerCode }}</div>
                  <div>{{ item.workerName }}</div>
                </div>
                <div class="num" v-show="workerIndex == index">
                    <span class="sub" @click="workerNumSub(item,index)" onselectstart="return false">-</span>
                    <input type="number" v-model="workerNumber" min="0" @change="workerNumChange($event,index)" />
                    <span class="add" @click="workerNumAdd(item,index)" onselectstart="return false">+</span>
                </div>                 
                </div>
                
            </div>
            </div>
        </div>
        
        </div>
        <div class="footBtn">
            <div class="save2" v-show="step > 1" @click="submit()" style="background: limegreen">保存</div>
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
    name: "badBillet",
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
        factoryAndGroupList:[],
        productTypeList:[],
        selectedProtype:'',
        workerIndex:null,
        selectedWork:{},
        workerNumber:0,
        selectedWorkerAll:[],
        selectedworkerArray:{},
        inspectId:'',
        selectedPro:'',
        testList:[]
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
        } else {
            this.step -= 1;
            this.modelDataList = []
            this.modelIndex = null
            this.moudelId = null
            this.prodCode = ''
            this.workerNumber = null
            this.modelData = ''
            this.pList[this.modelData.proCode] = []
            this.prodCodeAll = ''
            this.selectedWorkName = ''
            this.selectedFactoryWorker = '' 
            this.workerIndex = null
            this.selectedProtype = ''
            this.selectedWork = ''
            this.selectedModelList = []
            this.selectedWorkerAll = []
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
    },
    checkPostLocalData() {
      let that = this;
      localforage
        .getItem("local15" + that.baseURL + that.userCode)
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
      let url = "/MobileCollection/saveSunPi";
      let tempArr = [...that.localData];
      let isUploadAll = false;      
      for (let i = 0, len = that.localData.length; i < len; i++) {
        let data = that.localData[i]
        console.log(data)  
        await that.axios.post(url, [data]).then(res => {// 成功回调
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
                localforage.removeItem("local15" + that.baseURL + that.userCode).then(function() {

                }).catch(function() {});
                that.localData.list = null;
                isUploadAll = true;
              }
              tempArr = tempArr.filter(res => res != data);
              if (!isUploadAll && tempArr.length > 0) {
                localforage.setItem('local15' + that.baseURL + that.userCode,JSON.stringify(tempArr))
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
            //         localforage.setItem('local15' + that.baseURL + that.userCode,JSON.stringify(tempArr))
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
            //         localforage.setItem('local15' + that.baseURL + that.userCode,JSON.stringify(tempArr))
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

      that.showLoading = false;      
    },                        
        selectList1(item) {
            const that = this;
            let arrList = [];
            this.selectedFactoryAndGroup = item.factoryAndShop;
            this.selectedFactory = item
            localforage.getItem("badBilletList"+that.baseURL + that.userCode ).then(function(value) {
                let res = JSON.parse(value);
            }).catch(function(err) {
            });
            for(let ele of this.workListAll){
                if(item.mjFactoryId == ele.mjFactoryId && item.workShopId == ele.workShopId){
                    arrList.push(ele)
                }
            }                            
            this.selectedWorkerList = arrList
        },
        selectList2(item) {
            let arrList2 = []
            this.selectedFactoryWorker = item.workerId;
            this.selectedWorker = item
            this.selectedWorkName = item.workerName
            this.step = 2;
            sessionStorage.setItem('selectedWorkName',item.workerName);
          for(let i of this.modelList ){
                arrList2.push(i.proTypeName)
          } 
          this.productTypeList = new Set(arrList2)
        },
        selectworker(item,index){
          this.workerIndex = index
          this.selectedWork = item
          this.workerNumber = 0
          this.workerNumber += 1;         
        },
        selectedProduct(ele,index){
            let that = this
            let item = ''
            let arrlist = []
            let array = {}
            let list = []
            that.modelList.map(a =>{
                if(ele == a.proCode){
                    item = a
                }
            })
            item = ele
            this.tbMainShow = true
            // this.mouldNumber = item.modelNumber
            this.modelIndex = index
            this.modelData = item
            this.moudelId = item.id
            this.prodCode = item
            this.prodIndex = null

            if(that.pList[item].length == 1){
              that.prodCodeAll = that.pList[item][0].prodCodeAll
            }            
            that.selectedProductList = that.pList[item]

            for(let ele of that.modelList){
                if(!array[ele.proCode]){
                    array[ele.proCode] = []
                }
                // if(arrlist.indexOf(ele.proCode) < 0){
                    // arrlist.push(ele.proCode)
                    // for(let res of that.productList){  
                        if(ele.proCode == item){
                            array[ele.proCode].push(ele)
                        }
                    // }
                // }
            }
            list = array[item]
            let cList = []
            list.map(a => {
                that.workListAll.map(b =>{
                    if(a.workerName == b.workerName){
                        cList.push(b)
                    }
                })
            })
            that.selectedWorkerAll = cList
            that.workerIndex = null
        },
        selectProtype(item){
          let arrList = []
          let arrList2 = []
          this.selectedProtype = item
            for(let res of this.modelList){             
                if(item == res.proTypeName){
                   if(!arrList2.includes(res.proCode)){
                       arrList2.push(res.proCode)
                   }
                   
                }
            }
            this.selectedModelList = arrList2          
        },
        selectList3(res,index){
            let that = this
            that.prodIndex = index
            that.prodCodeAll = res.proCodeAll
            that.selectedPro = res
            this.productShow = true
        },
        workerNumAdd: function(ele,i) {
          let that = this
          that.workerNumber += 1;
        },
        workerNumSub: function(ele,i) {
        let that = this
        if(that.workerNumber === 0)
          return           
        that.workerNumber -= 1;
        },                          
        
        workerNumChange:function(e,i){
            let val = null
            let that = this
            val = Number(e.target.value)
            if(val < 0){
                val = 0
                alert('不能输入负数')
            }
            if(! /^\d+$/.test(val)){
                val = 1
                alert('不能输入小数')
            }
            that.workerNumber = val                       
        },        

        submit(){
            let that = this
            that.nowTime = new Date()
            if(that.selectedProtype == ''){
                alert('请选择产品类型！')
                return
            }
            else if(that.prodCodeAll == ''){
                alert('请选择产品型号！')
                return
            }
            else if(that.selectedWork == ''){
                alert('请选择成型工！')
                return
            }            
            else if(that.workerNumber == 0){
                alert('请添加数量！')
                return
            }else{
               this.showToast = true; 
            }
        },
        toastConfirm(){
            let that = this            
            let arr = []
            let productAll = ''
            that.selectedModelList.map(item=>{
                if(that.modelDataList.includes(item.id)){
                    arr.push(item)
                }
            })
            if(that.selectedPro == ''){
                productAll = that.prodCode
            }
            if(that.selectedPro != ''){
                if(that.selectedPro.specification == ''){
                    productAll = that.prodCode
                }else{
                    productAll = that.prodCode +'#'+ that.selectedPro.specification
                }               
            }                                  
            let param = {                           
                resDep: that.selectedWorker.factoryAndShop?that.selectedWorker.factoryAndShop:'',  //责任部门
                liableCode: that.selectedWorker.workerCode,  //责任人代号
                liableName: that.selectedWorker.workerName,  //责任人姓名
                typeName: that.selectedProtype,  //产品类型
                code: productAll,   //产品代号
                workerCode: that.selectedWork.workerCode,   //成型工工号
                workerName: that.selectedWork.workerName,   //成型工名称
                number: that.workerNumber,  //成型工数量
                name: that.selectedPro?that.selectedPro.proName:'',
                time: new Date(sessionStorage.getItem("dateCJ")),
                createTime: that.nowTime,   //点击保存的时间
                collectId:that.inspectId,                          
            }                                                  
            console.log(param)
            console.log(JSON.stringify([param]))
            // console.log(data)
            let url = "/MobileCollection/saveSunPi";
            that.axios.post(url, [param]).then(
                res => {
                // 成功回调
                if (res && res.data.status == 200) {
                    that.msg = "保存成功";
                    that.showMsg = true;
                    setTimeout(() => {
                    that.showMsg = false;
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
                        that.workerNumber = null
                        that.modelData = ''
                        that.pList[that.modelData.proCode] = []
                        that.prodCodeAll = ''
                        that.selectedWorkName = ''
                        that.selectedFactoryWorker = '' 
                        that.workerIndex = null
                        that.selectedProtype = ''
                        that.selectedWork = ''
                        that.selectedModelList = [] 
                        that.selectedPro = ''          
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
                // if(res && res.data.status == 400){
                //     alert(res.data.msg)
                //     setTimeout(() => {
                //     that.showMsg = false;
                //     }, 1000);
                //     that.showToast = false
                //     return
                // }                
                // if(res && res.data.status == 500){
                //     that.showToast = false;
                // localforage.getItem("local15" + that.baseURL + that.userCode)
                //     .then(function(value) {
                //     let res = value;
                //     if (!res) {
                //         let arr = [];
                //         arr.push(param);
                //         localforage
                //         .setItem("local15" + that.baseURL + that.userCode,JSON.stringify(arr))
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
                //         .removeItem("local15" + that.baseURL + that.userCode)
                //         .then(function() {
                //             localforage
                //             .setItem(
                //                 "local15" + that.baseURL + that.userCode,JSON.stringify(that.localData))
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
                localforage.getItem("local15" + that.baseURL + that.userCode)
                    .then(function(value) {
                    let res = value;
                    if (!res) {
                        let arr = [];
                        arr.push(param);
                        localforage
                        .setItem("local15" + that.baseURL + that.userCode,JSON.stringify(arr))
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
                        .removeItem("local15" + that.baseURL + that.userCode)
                        .then(function() {
                            localforage
                            .setItem(
                                "local15" + that.baseURL + that.userCode,JSON.stringify(that.localData))
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
                        that.workerNumber = null
                        that.modelData = ''
                        that.pList[that.modelData.proCode] = []
                        that.prodCodeAll = ''
                        that.selectedWorkName = ''
                        that.selectedFactoryWorker = ''
                        that.workerIndex = null
                        that.selectedProtype = ''       
                        that.selectedWork = ''
                        that.selectedModelList = []
                        that.selectedPro = ''     
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
                .getItem("badBilletList")
                .then(function (value) {
                    if (!value) {
                        that.updateData();
                        return null;
                    }
                    // 本地初始化网络数据5
                    try {
                        that.factoryAndGroupList = value.factoryAndShop || [];
                        that.workList = value.workList || [];
                        that.workListAll = value.workerList || [];
                        that.modelList= value.modelList||[];
                        that.productList= value.productList||[];
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
                        localforage.removeItem("badBilletList").then(function () {
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
            await that.axios.get("/MobileCollection/selectDataOfMobileSunPi", {}).then(
                res => {
                    if (res && res.status == 200) {
                        const wList = {}
                        const pList = {}
                        result = res.data.data || [];
                        that.factoryAndGroupList = result.factoryAndShop || [];
                        that.workList = result.workList || [];
                        that.workListAll = result.workerList || [];
                        that.modelList=result.modelList||[];
                        that.productList=result.productList||[];
                        that.xiuPiList = result.xiuPiList || []
                        that.chaYouList = result.chaYouList || []
                        that.banJianList = result.banJianList || []
                        that.shangShuiList = result.shangShuiList || []
                        that.testList = result.testList || []
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
                localforage.setItem("badBilletList",result);
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
        padding: 0 20px;
        height: 60px;
        line-height: 29px;
    }
    .level .num {
        height: 44px;
        padding: 0;
        border: 1px solid #ccc;
        border-radius: 8px;
    }
    .level .num span {
      float: left;
      width: 30%;
      text-align: center;
      line-height: 42px;
      font-size: 24px;
      cursor: pointer;
      -moz-user-select: none;
    }
    .sub {
        border-right: 1px solid #ccc;
    }
    .add {
        border-left: 1px solid #ccc;
    }
    .level .num input {
        float: left;
        width: 40%;
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