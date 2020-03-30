<template>
  <div class="wrap">
    <my-head
      v-if="step === 1"
      :showWorker="false"
      :showWork="false"
      :showHome="true"
      :yaoluId="yaoluId"
      :yaoluList="yaoluList"
      :selectedProCode="selectedProCode"
      @newyaoluId="newyaoluId"
    ></my-head>
    <my-head
      v-if="step === 2"
      :showWorker="false"
      :showWork="false"
      :showProductName="true"
      :yaoluId="yaoluId"
      :yaoluList="yaoluList"
      :selectedProCode="selectedProCode"
      @newyaoluId="newyaoluId"
    ></my-head>
    <div class="content">
      <!-- 第一步 -->
      <div v-if="step === 1">
        <div class="block">
          <p>请选择产品类型:</p>
          <ul class="clearfix">
            <li
              v-for="(item) in proTypeNameList"
              :key="item"
              class="btn"
              :class="{bgRed: item === selectedProType}"
              @click="selectProType(item)"
            >{{ item }}</li>
          </ul>
        </div>
        <div class="block">
          <p>请选择产品型号:</p>
          <ul class="clearfix">
            <li
              v-for="(item) in proCodeShowList"
              :key="item"
              class="btn"
              :class="{bgRed: item === selectedProCode}"
              @click="selectProCode(item)"
            >{{ item }}</li>
          </ul>
        <div style="display: flex">
          <div class="tbText tb"
           v-for="(res,index) in proCodeAllList"
           :key="res.proCodeAll"           
           @click="selectList3(res,index)"
           v-show="res.proName"
           :class="{bgcRed:selectedProCodeAll == res.proCodeAll}"
           style="margin-right:5px"
           >{{res.specification+ '-' +res.proName}}</div>
        </div>          
        </div>
      </div>
      <!-- 第二步 -->
      <div v-if="step === 2">
        <div class="block">
          <p>请选择成型工:</p>
          <ul class="worker clearfix step2">
            <li
              v-for="(item) in workerShowList"
              :key="item.code"
              class="btn"
              :class="{bgRed: item === selectedWorker}"
              @click="selectWorker(item)"
            >
              <div>{{ item.code }}</div>
              <div>{{ item.name }}</div>
            </li>
          </ul>
        </div>
        <div class="block">
          <p>请选择颜色:</p>
          <ul class="clearfix step2">
            <li
              v-for="(item) in colorShowList"
              :key="item.id"
              class="btn"
              :class="{bgRed: item.color_name === selectedColor}"
              @click="selectColor(item.color_name)"
            >{{ item.color_name }}</li>
          </ul>
        </div>
        <div class="block">
          <p>请选择等级:</p>
          <div class="level">
            <div v-for="(item, index) in selectedGrade" :key="item.qlty_grade_name">
              <div
                class="btn bgcGreen"
                :class="{bgRed:item.number > 0, bgcRed: operateGradeIndex === index}"
                @click="selectGrade(item.qlty_grade_name,index)"
              >{{ item.qlty_grade_name }}</div>
              <div class="num" v-show="item.number > 0 || operateGradeIndex === index">
                <span class="sub" v-show="subAdd" @click="gradeSub(index)" onselectstart="return false">-</span>
                <input type="number" :disabled="item.qlty_grade_name == selectedVal" :class="{'w100': item.qlty_grade_name == selectedVal}" v-model.number="item.number" min="0" />
                <span class="add" v-show="subAdd" @click="gradeAdd(index)" onselectstart="return false">+</span>
              </div>
            </div>
          </div>
        </div>
        <div class="block">
          <p>请选择商标:</p>
          <ul class="clearfix step2">
            <li
              v-for="(item) in tradeList"
              :key="item.id"
              class="btn"
              :class="{bgRed: item === selectedTradeMark}"
              @click="selectTradeMark(item)"
            >{{ item.name }}</li>
          </ul>
        </div>
      </div>
      <!-- 第三步 --> 
      <div v-if="step === 3">
        <div class="block">
          <p>请选择操作工种:</p>
          <ul class="clearfix">
            <li
              v-for="(item) in respPosNameList"
              :key="item"
              class="btn"
              :class="{bgcRed: item===selectedResPos,bgRed: selectQuestion.includes(item)}"
              @click="selectResPos(item)"
            >{{ item }}</li>
          </ul>
        </div>
        <div class="block" v-show="selectedResPos && selectedResPos!='成型工'">
          <p>请选择分组：</p>
          <ul class="worker clearfix step2">
            <li
              class="btn bgcGreen"
              :style="{width: 'auto'}"
              v-for="(item, index) in respPosGroup[selectedResPos]"
              :key="index"
              :selected="index == 0"
              :class="{bgRed :selectGroup.includes(item.name)}"
              @click="selectResPosGroup(item.name)"
            >
              <div>{{ item.employee_no }}</div>
              <div>{{ item.name }}</div>
            </li>
          </ul>
        </div>
        <div class="block">
          <p>请选择问题类型:</p>
          <div class="level">
            <div v-for="(item, index) in selectedIssue" :key="item.issue_code">
              <div
                class="btn bgcGreen"
                :class="{bgcRed1: item.number > 0, bgcRed: operateIssueIndex === index}"
                @click="selectIssue(item.issue_name,index)"
              >{{ item.issue_name }}</div>
              <div class="num" v-show="item.number > 0 || operateIssueIndex === index">
                <span class="sub" @click="issueSub(item,index)" onselectstart="return false">-</span>
                <input type="number" v-model.number="item.number" min="0" />
                <span class="add" @click="issueAdd(item,index)" onselectstart="return false">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="step === 4">
        <div class="block">
          <p>请选择操作工种:</p>
          <ul class="clearfix">
            <li
              v-for="(item) in nameList"
              :key="item"
              class="btn"
              :class="{bgcRed: item===selectedResPos,bgRed: nameData.includes(item)}"
              @click="selectResPos(item)"
            >{{ item }}</li>
          </ul>
        </div>
        <div class="block" v-show="selectedResPos && selectedResPos!='成型工'">
          <p>请选择分组：</p>
          <ul class="worker clearfix step2">
            <li
              class="btn bgcGreen"
              :style="{width: 'auto'}"
              v-for="(item, index) in respPosGroup[selectedResPos]"
              :key="index"
              :selected="index == 0"
              :class="{bgRed:selectGroup.includes(item.name)}"
              @click="selectResPosGroup(item.name)"
            >
              <div>{{ item.employee_no }}</div>
              <div>{{ item.name }}</div>
            </li>
          </ul>
        </div>
        <div class="block">
          <p>请选择问题类型:</p>
          <div class="level">
            <div
              v-for="(item, index) in selectedIssue.filter(a=>a.issue_name=='一级品')"
              :key="item.issue_code"
            >
              <div class="btn bgcGreen" :class="{bgRed:true}">{{ item.issue_name }}</div>
              <div
                class="num"
                v-show="goodNumber > 0 || operateIssueIndex === index"
                style="border:none"
              >
                <!-- <span class="sub" @click="issueSub(index)" onselectstart="return false">-</span> -->
                <input
                  type="text"
                  v-model="goodNumber"
                  min="0"
                  disabled
                  style="border-radius:5px;width:100%"
                />
                <!-- <span class="add" @click="issueAdd(index)" onselectstart="return false">+</span> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footBtn" v-show="step === 2 || step === 3 || step === 4">
      <div class="save1" v-show="step === 3 || step === 4" @click="submit(1)">保存并添加该产品</div>
      <div class="save2" v-show="step === 3 || step === 4" @click="submit(2)">保存并添加其它产品</div>
      <div class="save2" v-show="addQuestion || step === 2" @click="addQI">添加质量问题</div>
      <div class="goback" @click="goback">返回</div>
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
  name: "ProductTemplate",
  components: {
    myHead,
    loading,
    toast,
    msg
  },
  data: function() {
    return {
      showLoading: true,
      step: 1,
      showSubmit: false,
      addQuestion: false,
      showMsg: false,
      showToast: false,
      showToast2: false,
      showToast2msg: "本地有未提交的数据，是否重新上传",
      count: "",
      inspectId: "",

      msg: "",

      yaoluId: "",
      yaoluList: [],
      proTypeNameList: [], // String
      proCodeList: {}, // key-value
      proCodeColor: {}, // key-value
      workerList: {}, // key-value
      colorList: [], // obj
      gradeList: [], // obj
      tradeMarkList: [], // obj
      respPosNameList: [], // String
      issueNameList: {}, // key-value
      respPosGroup: {}, // 工种对应的分组 key-value
      questionList: [], // 工种对应的质量 key-value
      submitType: "",

      selectedProType: "",
      selectedProCode: "",
      selectedProCode2: "",

      selectedWorker: "", // 选择的成型工
      selectedColor: "", // 选择的颜色
      selectQuestion: [], // 选择的工种列表
      selectGroup: [], // 选择的组
      operateGradeIndex: null,
      selectedGrade: [], // 选择的等级列表
      selectedGradeName: "", // 选择的等级名称
      selectedTradeMark: "", // 选择的商标名称
      selectedResPos: "", // 选择的工种
      selectedRespPosGroup: "", // 选择的工种对应的组
      selectedIssueName: "", // 选择的问题名称
      operateIssueIndex: null, // 当前操作的问题下标
      selectedIssue: [], // 选择的问题列表
      requiredList: ["半检工", "施釉工", "登窑工"],
      nameList: [], 
      issueList: [],
      goodNumber: "",
      nameData:[],
      selectedVal:"",
      subAdd:true,
      nowTime: '',    //当前系统时间
      proList:[],
      tradeMarkArrlist:[],
      proCodeAll:{},
      selectedProCodeAll:'',
      tradeMarkArr:{},
      selectedSpecification:'',
      seleProAll:''
    };
  },

  created() {
    let that = this;
    window.addEventListener("online", function() {
      that.checkPostLocalData();
    });
    if (sessionStorage.getItem("online") == "true") {
      that.checkPostLocalData();
    }

    that.initData();
    that.updateData();
  },
  mounted() {
    // this.updateData()
    this.getCookie("userSupply_ema_TAOCI")
    // this.getCookie("userSupply_demo_TAOCI");
  },
  activated() {
    let id = sessionStorage.getItem("yaoluId");
    if (id) this.yaoluId = id;
  },
  computed: {
    proCodeShowList: function() {
      return this.proCodeList[this.selectedProType] || [];
    },  
    workerShowList: function() {
      return this.workerList[this.selectedProCode2] || [];
    },
    colorShowList: function() {
      const data = this.proCodeColor[this.selectedProCode2];
      if (!data) {
        return [];
      }
      const result = data
        .map(item => {
          for (const color of this.colorList) {
            if (String(color.id) === item) {
              return color;
            }
          }
          return null;
        })
        .filter(i => i);
      return result;
    },
    proCodeAllList: function() {
      return this.proCodeAll[this.selectedProCode2] || [];
    },
    tradeList: function() {
      let clist = []
      let arr2 = []
      let num = 0
      const data = this.tradeMarkArr[this.selectedProCode2];
      if (!data) {
        return [];
      }
      const result = data.map(item => {
            console.log(this.tradeMarkArrlist)          
          for (const trade of this.tradeMarkArrlist) {
            if(item.tradeMarkId == null){
              return [];
            }
            if(this.selectedProCode == ''){
              if(item.tradeMarkId != null && item.tradeMarkId.indexOf(",") == -1){
                if (String(trade.id) === item.tradeMarkId) {
                  return trade;
                }              
              }            
              if(item.tradeMarkId != null && item.tradeMarkId.indexOf(",") != -1){
                let trades = item.tradeMarkId.split(",")
                for (const ele of trades){
                  if(ele === String(trade.id)){
                    arr2.push(trade)
                    num++
                  }
                }
                if(num == trades.length){
                  return arr2
                }                
              }               
            }
            if(item.proCodeAll == this.selectedProCode){
              if(item.tradeMarkId != null && item.tradeMarkId.indexOf(",") == -1){
                if (String(trade.id) === item.tradeMarkId) {
                  return trade;
                }              
              }            
              if(item.tradeMarkId != null && item.tradeMarkId.indexOf(",") != -1){
                let trades = item.tradeMarkId.split(",")
                for (const ele of trades){
                  if(ele === String(trade.id)){
                    arr2.push(trade)
                    num++
                  }
                }
                if(num == trades.length){
                  return arr2
                }                
              }                
            }           
          }      
          // return null;
        })
        .filter(i => i);
        clist = result
        console.log(clist)
        if(result[0].length == 0){
          return null
        }        
        if(result[0].length > 1){
          clist = result[0]
          return clist
        }
        return clist;              
    },    
    baseURL() {
      return this.axios.defaults.baseURL;
    },
    userCode() {
      return localStorage.getItem("userCode");
    }
  },
  methods: {
    newyaoluId(n) {
      let that = this;
      that.yaoluId = n;
      sessionStorage.setItem("yaoluId", n);
    },
    getCookie(name) {
      let that = this;
      let allcookies = document.cookie;
      let cookie_pos = allcookies.indexOf(name); //索引的长度

      // 如果找到了索引，就代表cookie存在，
      // 反之，就说明不存在。
      if (cookie_pos != -1) {
        // 把cookie_pos放在值的开始，只要给值加1即可。
        cookie_pos += name.length + 1; //这里容易出问题，所以请大家参考的时候自己好好研究一下
        let cookie_end = allcookies.indexOf(";", cookie_pos);

        if (cookie_end == -1) {
          cookie_end = allcookies.length;
        }

        let inspect = unescape(allcookies.substring(cookie_pos, cookie_end)); //这里就可以得到你想要的cookie的值了
        that.inspectId = inspect;
      } else {
        that.inspectId = "";
      }
    },
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
        .getItem("local2" + that.baseURL + that.userCode)
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
      let url = "/Collection/insertIpadData";
      let tempArr = [...that.localData];
      let isUploadAll = false;      
      for (let i = 0, len = that.localData.length; i < len; i++) {
        let data = that.localData[i];    
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
                localforage.removeItem("local2" + that.baseURL + that.userCode).then(function() {

                }).catch(function() {});
                that.localData = null;
                isUploadAll = true;
              }
              tempArr = tempArr.filter(res => res != data);
              if (!isUploadAll && tempArr.length > 0) {
                localforage.setItem('local2' + that.baseURL + that.userCode,JSON.stringify(tempArr))
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
            //         localforage.setItem('local2' + that.baseURL + that.userCode,JSON.stringify(tempArr))
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
            //         localforage.setItem('local2' + that.baseURL + that.userCode,JSON.stringify(tempArr))
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
    async initData() {
      const that = this;
      await localforage
        .getItem("productTemplate" + that.baseURL + that.userCode)
        .then(function(value) {
          if (!value) {
            that.updateData();
            return null;
          }

          // 本地初始化
          try {
            that.yaoluList = value.yaoluList || [];
            that.proTypeNameList = value.proTypeNameList || [];
            that.proCodeList = value.proCodeList || {};
            that.proCodeColor = value.proCodeColor || {};
            that.workerList = value.workerList || {};
            that.colorList = value.colorList || [];
            that.gradeList = value.gradeList || [];
            that.selectedGrade = value.gradeList || [];
            that.tradeMarkList = value.tradeMarkList || [];
            that.respPosNameList = value.respPosNameList || [];
            that.issueNameList = value.issueNameList || {};
            that.respPosGroup = value.respPosGroup || {};
            that.questionList = value.questionList || [];
            that.tradeMarkArrlist = value.tradeMarkArrlist || []

            if (sessionStorage.getItem("yaoluId")) {
              that.yaoluId = sessionStorage.getItem("yaoluId");
            } else {
              that.yaoluId =
                (that.yaoluList && that.yaoluList[0].id + "") || "";
            }
          } catch (error) {
            localforage
              .removeItem("productTemplate" + that.baseURL + that.userCode)
              .then(function() {
                this.updateData();
              });
          }
        })
        .catch(function() {});
    },
    async updateData() {
      var that = this;
      let isonline = true;
      let result = null;
      //获取产品类型、产品型号、成型工
      await that.axios.get("/mobile/selectNewModelType", {}).then(
        res => {
          if (res && res.status == 200) {
            result = res.data.data || [];
            const proTypeNameList = [];
            const proCodeList = {};
            const workerList = {};

            for (const item of result) {
              // 类型
              proTypeNameList.push(item.pro_type_name);
              // 型号
              if (!proCodeList[item.pro_type_name]) {
                proCodeList[item.pro_type_name] = [];
              }
              if (proCodeList[item.pro_type_name].indexOf(item.pro_code) < 0) {
                proCodeList[item.pro_type_name].push(item.pro_code);
              }
              // 成型工
              if (!workerList[item.pro_code]) {
                workerList[item.pro_code] = [];
              }
              workerList[item.pro_code].push({
                id: item.worker_id,
                code: item.worker_code,
                name: item.worker_name
              });
            }
            that.proTypeNameList = Array.from(new Set(proTypeNameList));
            that.proCodeList = proCodeList;
            that.workerList = workerList;            
          }
        },
        () => {
          that.showLoading = false;
          isonline = false;
        }
      );
      
      await that.axios.get("/mobile/selectProductByModelType", {}).then(
        res => {
          if (res && res.status == 200) {
            that.proList = res.data.data || [];
            result = res.data.data || []
            const proCodeColor = {};
            const proCodeAll = {}
            const trademark = {}
            let arrlist = []
            let arrlist2 = []
            for(let item of result){
                // 型号对应颜色
                if (!proCodeColor[item.proCode]) {
                  proCodeColor[item.proCode] = [];
                }
                // if (item.colors) {
                  const colorsArr = item.colors.split(",");
                  for (const color of colorsArr) {
                    if (proCodeColor[item.proCode].indexOf(color) < 0) {
                      proCodeColor[item.proCode].push(color);
                    }
                  }
                // } 
                if(!proCodeAll[item.proCode]){
                  proCodeAll[item.proCode] = []
                }
                if(arrlist.indexOf(item.proCode) < 0){
                    arrlist.push(item.proCode)
                    for(let ele of result){  
                        if(item.proCode == ele.proCode){
                            proCodeAll[item.proCode].push(ele)
                        }
                    }
                }
                if(!trademark[item.proCode]){
                  trademark[item.proCode] = []
                }
                if(arrlist2.indexOf(item.proCode) < 0){
                    arrlist2.push(item.proCode)
                    for(let ele of result){  
                        if(item.proCode == ele.proCode){
                            trademark[item.proCode].push(ele)
                        }
                    }
                }                                       
            }

            that.proCodeColor = proCodeColor;
            that.proCodeAll = proCodeAll
            that.tradeMarkArr = trademark
          }

        },
        () => {}
      );

      await that.axios.get("/mobile/selectTradeMark", {}).then(
        res => {
          if (res && res.status == 200) {
            that.tradeMarkArrlist = res.data.data || [];            
          }
        },
        () => {}
      );      
      
      // 获取颜色
      await that.axios.get("/mobile/selectColors", {}).then(
        res => {
          if (res && res.status == 200) {
            that.colorList = res.data.data || [];
          }
        },
        () => {}
      );
      // 获取等级信息
      await that.axios.get("/mobile/selectGrade", {}).then(
        res => {
          if (res && res.status == 200) {
            that.gradeList = res.data.data || [];
            that.selectedGrade = res.data.data || [];
          }
        },
        () => {}
      );
      // 获取商标信息
      await that.axios.get("/mobile/selectClientTradeMark", {}).then(
        res => {
          if (res && res.status == 200) {
            that.tradeMarkList = res.data.data || [];
          }
        },
        () => {}
      );
      // 获取工种对应的分组
      await that.axios.get("/mobile/selectContact", {}).then(
        res => {
          if (res && res.status == 200) {
            result = res.data.data || [];
            const respPosGroup = {};
            const jobPosId = [];
            for (const item of result) {
              if (!respPosGroup[item.job_pos_name]) {
                respPosGroup[item.job_pos_name] = [];
              }
              if (jobPosId.indexOf(item.partner_id) < 0) {
                jobPosId.push(item.partner_id);
                respPosGroup[item.job_pos_name].push({ ...item });
              }
            }
            this.respPosGroup = respPosGroup;
          }
        },
        () => {}
      );
      // 获取质量问题及分类信息
      await that.axios.get("/mobile/selectIssue", {}).then(
        res => {
          if (res && res.status == 200) {
            result = res.data.data || [];
            that.questionList = result;
            const respPosNameList = [];
            const issueNameList = {};
            const issueCode = [];
            for (const item of result) {
              respPosNameList.push(item.resp_pos_id);
              if (!issueNameList[item.resp_pos_id]) {
                issueNameList[item.resp_pos_id] = [];
              }
              if (issueCode.indexOf(item.issue_code) < 0) {
                issueCode.push(item.issue_code);
                issueNameList[item.resp_pos_id].push({
                  id: item.id,
                  issue_name: item.issue_name,
                  issue_code: item.issue_code
                });
              }
            }
            that.respPosNameList = Array.from(new Set(respPosNameList));
            that.issueNameList = issueNameList;
          }
        },
        () => {}
      );
      // 获取窑炉
      await that.axios.get("/mobile/selectQityBatch", {}).then(
        res => {
          if (res && res.status == 200) {
            that.yaoluList = res.data.data || [];
          }
        },
        () => {}
      );

      if (isonline) {
        const value = {};
        value.yaoluList = that.yaoluList;
        value.proTypeNameList = that.proTypeNameList;
        value.proCodeList = that.proCodeList;
        value.proCodeColor = that.proCodeColor;
        value.workerList = that.workerList;
        value.colorList = that.colorList;
        value.gradeList = that.gradeList;
        value.tradeMarkList = that.tradeMarkList;
        value.respPosNameList = that.respPosNameList;
        value.issueNameList = that.issueNameList;
        value.respPosGroup = that.respPosGroup;
        value.questionList = that.questionList;
        value.tradeMarkArrlist = that.tradeMarkArrlist
        localforage.setItem(
          "productTemplate" + that.baseURL + that.userCode,
          value
        );
      }
      if (sessionStorage.getItem("yaoluId")) {
        that.yaoluId = sessionStorage.getItem("yaoluId");
      } else {
        that.yaoluId = (that.yaoluList && that.yaoluList[0].id + "") || "";
      }
    },

    submit(n) {
      this.getNowFormatDate()      
      let that = this;
      if (that.selectedWorker == "" && that.step === 2) {
        alert("请选择成型工!");
        return;
      }
      if (
        that.colorShowList.length != 0 &&
        that.selectedColor == "" &&
        that.step === 2
      ) {
        alert("请选择颜色");
        return;
      }
      if (that.selectedGradeName == "" && that.step === 2) {
        alert("请选择等级");
        return;
      }
      if (that.selectedTradeMark == "" && that.step === 2) {
        alert("请选择商标");
        return;
      }
      if (that.selectedResPos == "" && that.step === 3) {
        alert("请选择工种");
        return;
      }

      if (that.yaoluId == "") {
        alert("请选择窑炉");
        return;
      }
      if (
        !that.selectQuestion.includes("半检工") ||
        !that.selectQuestion.includes("施釉工") ||
        !that.selectQuestion.includes("登窑工")
      ) {
        alert("半检工,施釉工,登窑工必须选择!");
        return false;
      }
      if (that.selectGroup.length < 1) {
        alert("请选择分组");
        return;
      }
      // 第三步特别判断
      if (that.step === 3) {
        // 选择的工种只有半检 施釉 登窑，那么选择的等级不能都是一级品
        const isA = that.selectQuestion.includes("半检工");
        const isB = that.selectQuestion.includes("施釉工");
        const isC = that.selectQuestion.includes("登窑工");
        if (
          (isA && that.selectQuestion.length === 1) ||
          (isA && isB && that.selectQuestion.length === 2) ||
          (isA && isC && that.selectQuestion.length === 2) ||
          (isB && isC && that.selectQuestion.length === 2) ||
          (isA && isB && isC && that.selectQuestion.length === 3)
        ) {
          let tip = false;
          this.selectQuestion.map(res => {
            let d = this.issueNameList[res].filter(
              item => item.issue_name != "一级品"
            );

            d.map(ele => {
              if (ele.number) {
                tip = true;
              }
            });
          });
          if (!tip) {
            alert("请选择一个质量问题");
            return;
          }
        }
        // 质量问题
        tipArr = new Array(this.selectQuestion.length);
        this.selectQuestion.map((res, index) => {
          let d = this.issueNameList[res];
          d.map(ele => {
            if (ele.number) {
              tipArr[index] = true;
            }
          });
        });
        for (let index = 0; index < tipArr.length; index++) {
          if (!tipArr[index]) {
            alert(`请选择${this.selectQuestion[index]}对应的问题`);
            return;
          }
        }
      }
      // 选择了工种那么工种下面的分组和质量问题一定要选择
      // 分组问题
      let tipArr = new Array(this.selectQuestion.length);
      this.selectQuestion.map((res, index) => {
        let d = this.respPosGroup[res];
        if (!d || d.length === 0 || res === "成型工") {
          tipArr[index] = true;
          return;
        }
        // 每一个工种底下都需要判断是否已选择
        d.map(ele => {
          if (this.selectGroup.includes(ele.name)) {
            tipArr[index] = true;
          }
        });
      });
      for (let index = 0; index < tipArr.length; index++) {
        if (!tipArr[index]) {
          alert(`请选择${this.selectQuestion[index]}对应的分组`);
          return;
        }
      }

      that.showToast = true;
      that.submitType = n;
    },

    toastConfirm(n) {
      let that = this;
      let pro = that.proTypeNameList[that.selectedProType];
      let number = 0,
        grade_id = "",
        grade_name = "",
        grade_number = "",
        problem_style,
        problem_style_col = "",
        problem_id = "",
        problem_name = "",
        problem_number = "",
        problemEmployeeId = "",
        problemEmployeeName = "";

      that.selectedGrade.map(item => {
        grade_id += item.id + ",";
        grade_name += item.qlty_grade_name + ",";
        if (item.number) {
          grade_number += item.number + ",";
          number += item.number;
        } else {
          grade_number += ",";
        }
      });

      that.respPosNameList.map(item => {
        problem_style_col += that.issueNameList[item].length + 1 + ",";
      });

      // that.questionList.map(item => {
      // problem_id += item.id + ",";
      // problem_name += item.issue_name + ",";
      // });

      that.respPosNameList.map(item => {
        const issueData = that.issueNameList[item];
        issueData.map(res => {
          problem_id += res.id + ",";
          problem_name += res.issue_name + ",";
          if (that.step === 3) {
            if (res.number) {
              problem_number += res.number + ",";
            }
            if (!res.number) {
              problem_number += ",";
            }
          }
          if (that.step === 4) {
            if ("一级品" === res.issue_name) {
              problem_number += that.goodNumber + ",";
            } else {
              problem_number += ",";
            }
          }
        });
      });

      // 在第三步时添加质量分组
      if (that.step === 3 || that.step === 4) {
        that.respPosNameList.map(item => {
          if (item == "成型工") {
            problemEmployeeId += ",";
            problemEmployeeName += ",";
            return null;
          }
          let issueNumber = 0;
          let issueNameListData = that.issueNameList[item] || [];
          issueNameListData.map(res => {
            if (
              that.step === 4 &&
              that.requiredList.includes(item) &&
              res.issue_name === "一级品"
            ) {
              issueNumber += that.goodNumber;
            } else if (res.number) {
              issueNumber += res.number;
            }
          });

          if (issueNumber) {
            const respPosGroupData = that.respPosGroup[item] || [];
            if (respPosGroupData.length == 0) {
              problemEmployeeId += ",";
              problemEmployeeName += ",";
              return null;
            }
            let isFoundGroup = false;
            if (that.selectGroup && that.selectGroup.length > 0) {
              for (let i = 0, len = respPosGroupData.length; i < len; i++) {
                if (that.selectGroup.includes(respPosGroupData[i].name)) {
                  problemEmployeeId += respPosGroupData[i].partner_id + ",";
                  problemEmployeeName += respPosGroupData[i].name + ",";
                  isFoundGroup = true;
                }
                //  if (!that.selectGroup.includes(respPosGroupData[i].name)) {
                //     problemEmployeeId += respPosGroupData[0].partner_id + ",";
                //     problemEmployeeName += respPosGroupData[0].name + ",";
                // }
              }
            }
            if (!isFoundGroup) {
              problemEmployeeId += respPosGroupData.partner_id + ",";
              problemEmployeeName += respPosGroupData.name + ",";
            }
          }
          if (issueNumber === 0) {
            const a = that.respPosGroup[item] || [];
            if (a.length == 0) {
              problemEmployeeId += ",";
              problemEmployeeName += ",";
              return null;
            }
            if (a.length != 0) {
              // for (let i = 0, len = a.length; i < len; i++) {
              problemEmployeeId += a[0].partner_id + ",";
              problemEmployeeName += a[0].name + ",";
            }
            //  }
          }
        });
      } else {
        problemEmployeeId = ",,,,,,,";
        problemEmployeeName = ",,,,,,,";
      }

      let kiln_name;
      that.yaoluList.map(item => {
        if (item.id == sessionStorage.getItem("yaoluId")) {
          kiln_name = item.kiln_name;
        }
      });
      let color_name = "";
      if (
        that.colorList.length > 0 &&
        that.colorList[that.selectedProType] &&
        that.colorList[that.selectedProType][that.currentColors]
      ) {
        color_name =
          that.colorList[that.selectedProType][that.currentColors].color_name;
      }
      let trademark = "";
      if (that.tradeMarkList[that.selectedTradeMark]) {
        trademark = that.tradeMarkList[that.selectedTradeMark].clientFullName;
      } else {
        trademark = null;
      }

      let productAll = ''
      if(that.selectedSpecification == ''){
          productAll = that.selectedProCode2
      }
      if(that.selectedSpecification != ''){
          productAll = that.selectedProCode2 +'#'+ that.selectedSpecification
      }

      let param = {
        proCode: productAll, //产品型号
        workerCode: that.selectedWorker.code, //工号
        workerName: that.selectedWorker.name, //
        color: that.selectedColor, //颜色，传字符串
        workspace: null, //成型车间
        number: number, //当前选中等级的数量
        gradeId: grade_id.substring(0, grade_id.length - 1), //等级id
        gradeName: grade_name.substring(0, grade_name.length - 1), //等级name
        gradeNumber: grade_number.substring(0, grade_number.length - 1), //采集的各等级的数量

        problemStyle: that.respPosNameList.toString(), //所有的工种
        problemStyleCol: problem_style_col.substring(
          0,
          problem_style_col.length - 1
        ), //每个工种对应的问题总数
        problemId: problem_id.substring(0, problem_id.length - 1), //所有问题id
        problemName: problem_name.substring(0, problem_name.length - 1), //所有问题name
        problemNumber: problem_number.toString(), //采集的问题数量
        problemEmployeeId: problemEmployeeId.substring(
          0,
          problemEmployeeId.length - 1
        ), //组长id
        problemEmployeeName: problemEmployeeName.substring(
          0,
          problemEmployeeName.length - 1
        ), //组长name
        kilnName: kiln_name,
        trademark: that.selectedTradeMark.name, //商标
        inspectId: that.inspectId,
        time: new Date(sessionStorage.getItem("dateCJ")),
        createTime: that.nowTime,   //点击保存的时间
      };

      console.log(param);
      let data = [param];
      let url = "/Collection/insertIpadData";
      that.axios.post(url, data).then(
        res => {
          // 成功回调
          if (res && res.status == 200) {
            that.msg = "保存成功";
            that.showMsg = true;
            setTimeout(() => {
              that.showMsg = false;
              if (that.submitType === 2) {
                window.location.reload();
              }
              if (that.submitType != 2) {
                that.step = 2;
                that.operateGradeIndex = null;
                that.selectedWorker = "";
                that.selectedColor = "";
                that.selectedTradeMark = "";
                that.selectedResPos = "";
                that.selectedRespPosGroup = "";
                that.selectedIssue = [];
                that.operateIssueIndex = null;
                that.selectQuestion = [];
                that.selectGroup = [];
                that.selectedGrade.map(nn => {
                  nn.number = 0;
                });
                that.respPosNameList.map(item => {
                  that.issueNameList[item].map(res => {
                    res.number = null;
                  });
                });
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
          // localforage.getItem("local2" + that.baseURL + that.userCode)
          //     .then(function(value) {
          //     let res = value;
          //     if (!res) {
          //         let arr = [];
          //         arr.push(param);
          //         localforage
          //         .setItem("local2" + that.baseURL + that.userCode,JSON.stringify(arr))
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
          //         .removeItem("local2" + that.baseURL + that.userCode)
          //         .then(function() {
          //             localforage
          //             .setItem(
          //                 "local2" + that.baseURL + that.userCode,JSON.stringify(that.localData))
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
          localforage
            .getItem("local2" + that.baseURL + that.userCode)
            .then(function(value) {
              let res = JSON.parse(value);
              if (!res) {
                let arr = [];
                arr.push(param);
                localforage
                  .setItem(
                    "local2" + that.baseURL + that.userCode,
                    JSON.stringify(arr)
                  )
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
                  .removeItem("local2" + that.baseURL + that.userCode)
                  .then(function() {
                    localforage
                      .setItem(
                        "local2" + that.baseURL + that.userCode,
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
            if (that.submitType === 2) {
              //保存并添加其他工人
              that.step = 1;
              that.selectedProCode = ''
              that.operateGradeIndex = null;
              that.selectedWorker = "";
              that.selectedColor = "";
              that.selectedTradeMark = "";
              that.selectedResPos = "";
              that.selectedRespPosGroup = "";
              that.selectedIssue = [];
              that.operateIssueIndex = null;
              that.selectQuestion = [];
              that.selectGroup = [];
              that.proCodeAllList = [];
              that.selectedProCode2 = '';
              that.selectedProCodeAll = '';
              that.selectedGrade.map(nn => {
                nn.number = 0;
              });
              that.respPosNameList.map(item => {
                that.issueNameList[item].map(res => {
                  res.number = null;
                });
              });
            }
            if (that.submitType != 2) {
              //保存并继续添加当前工人
              that.step = 2;
              that.operateGradeIndex = null;
              that.selectedWorker = "";
              that.selectedColor = "";
              that.selectedTradeMark = "";
              that.selectedResPos = "";
              that.selectedRespPosGroup = "";
              that.selectedIssue = [];
              that.operateIssueIndex = null;
              that.selectQuestion = [];
              that.selectGroup = [];
              that.selectedGrade.map(nn => {
                nn.number = 0;
              });
              that.respPosNameList.map(item => {
                that.issueNameList[item].map(res => {
                  res.number = null;
                });
              });
            }
          }, 2000);
        }
      );
    },

    selectProType: function(value) {
      this.selectedProType = value;
    },
    selectProCode: function(value) {
      this.selectedProCode = value;
      this.selectedProCode2 = value;
      this.operateGradeIndex = null;
      this.showSubmit = false;
      this.addQuestion = true;
      sessionStorage.setItem("selectedProCode", value);
      if (this.selectedGradeName) {
        this.showSubmit = true;
      }
      if(this.proCodeAll[value].length == 1 && this.proCodeAll[value][0].proName == ''){
       this.step = 2; 
      }
    },
    selectList3:function (item) {
      let that = this
      this.step = 2
      this.selectedProCodeAll = item.proCodeAll
      this.selectedSpecification = item.specification
      let a = ''
      // if(item.specification == ''){
      //   that.selectedProCode = that.selectedProCode
      // }else{
      //   that.selectedProCode = that.selectedProCode +'#'+ item.specification
      // }
      that.selectedProCode = item.proCodeAll
      that.seleProAll = item
      sessionStorage.setItem("selectedProCode", item.proCodeAll);
    },
    selectWorker: function(value) {
      this.selectedWorker = value;
    },
    selectColor: function(value) {
      this.selectedColor = value;
    },
    selectGrade: function(value, index) {
      this.operateGradeIndex = index;
      const data = [...this.selectedGrade];
      data[index].number = 1;
      this.selectedGrade = data;
      this.showSubmit = true;
      this.selectedGradeName = value;
      console.log(this.selectedGrade);
      // this.selectedGrade.map(res=>{
      // if (value != "一级" && value != "磨") {
      //   let y = this.selectedGrade.filter(a => a.qlty_grade_name != value);
      //   y.map(res => {
      //     this.$delete(res, "number");
      //   });
      // }
      // if (value == "一级") {
      //   let y = this.selectedGrade.filter(a => a.qlty_grade_name != value);
      //   let x = y.filter(b => b.qlty_grade_name != "磨");
      //   x.map(res => {
      //     this.$delete(res, "number");
      //   });
      //   let z = this.selectedGrade.filter(a => a.qlty_grade_name == value);
      //   this.goodNumber = z[0].number;
      // }
      // if (value == "磨") {
      //   let y = this.selectedGrade.filter(a => a.qlty_grade_name != value);
      //   let x = y.filter(b => b.qlty_grade_name != "一级");
      //   x.map(res => {
      //     this.$delete(res, "number");
      //   });
      //   let z = this.selectedGrade.filter(a => a.qlty_grade_name == value);
      //   this.goodNumber = z[0].number;
      // }
      if (value === "优等" || value === "磨") {
        let goodNumber = 0;
        this.selectedGrade = this.selectedGrade.map(item => {
          let number = 0;
          if (
            item.qlty_grade_name === "优等" ||
            item.qlty_grade_name === "磨"
          ) {
            number = item.number || 0;
            goodNumber += number;
          }
          if (item.qlty_grade_name !== value) {
            number = 0;
          }
          return { ...item, number };
        });
        // 清洗数据
        if (!this.goodNumber) {
          this.selectQuestion = [];
          this.selectGroup = [];
          this.selectedResPos = "";
          this.selectedRespPosGroup = "";
          this.operateIssueIndex = null;
          this.selectedIssue = [];
          this.respPosNameList.map(item => {
            const issueData = this.issueNameList[item];
            issueData.map(res => {
              res.number = 0;
            });
          });
        }
        this.goodNumber = goodNumber;
        this.subAdd = true
      } else {
        if(value == '合格'|| value == '机补' || value == '废品'){
          this.selectedVal = value
        }
        this.selectedGrade = this.selectedGrade.map(item => {
          let number = item.number || 0;
          if (item.qlty_grade_name !== value) {
            number = 0;
          }
          return { ...item, number };
        });
        // 清洗数据
        if (this.goodNumber) {
          this.selectQuestion = [];
          this.selectGroup = [];
          this.selectedResPos = "";
          this.selectedRespPosGroup = "";
          this.operateIssueIndex = null;
          this.selectedIssue = [];
          this.respPosNameList.map(item => {
            const issueData = this.issueNameList[item];
            issueData.map(res => {
              res.number = 0;
            });
          });
        }
        this.goodNumber = 0;
        this.subAdd = false
      }
      // if(value == '磨'){
      //   let y = this.selectedGrade.filter(a=>a.qlty_grade_name != '磨')
      //     y.map(res=>{
      //       res.splice(res.indexOf(res.number),1)
      //     })
      // }
      // })
    },
    gradeAdd: function(i) {
      const data = [...this.selectedGrade];
      if (!data[i].number) {
        data[i].number = 0;
      }
      data[i].number += 1;
      this.selectedGrade = data;
      this.selectedGrade.map((item, index) => {
        if (index != 0 && item.number > 0) this.showAddQ = true;
        if (item.number > 0) {
          this.showSubmit = true;
        }
      });
    },
    gradeSub: function(i) {
      if (!this.selectedGrade[i].number || this.selectedGrade[i].number == 1)
        return;
      const data = [...this.selectedGrade];
      data[i].number -= 1;
      this.selectedGrade = data;
      let n1 = this.selectedGrade.every(item => {
        return item.number == 0;
      });
      if (n1) this.showSubmit = false;

      let n2 = this.selectedGrade.slice(1).every(item => {
        return item.number == 0;
      });
      if (n2) this.showAddQ = false;
    },
    selectTradeMark: function(value) {
      this.selectedTradeMark = value;
    },
    selectResPosGroup: function(value) {
      this.selectedRespPosGroup = value;
      if (!this.selectGroup.includes(value)) {
        this.selectGroup.push(this.selectedRespPosGroup);
      }

      if (this.selectGroup.length > 0) {
        let selList = this.respPosGroup[this.selectedResPos].filter(
          res => res.name != this.selectedRespPosGroup
        );
        selList.map(res => {
          if (this.selectGroup.includes(res.name)) {
            let a = this.selectGroup.filter(n => n != res.name);
            this.selectGroup = a;
          }
        });
      }
      if(this.step === 4){
          this.nameData.push(this.selectedResPos);
          this.nameData = Array.from(new Set(this.nameData));
      }
      if(this.step === 3){
      const arr = this.issueNameList[this.selectedResPos] 
      arr.map(ele=>{
        if(ele.number > 0){
           this.selectQuestion.push(this.selectedResPos) 
        }
      })
      this.selectedIssue = arr;       
      }
    },
    selectResPos: function(value) {
      let arr = []
      this.selectedResPos = value;
      this.selectedIssue = this.issueNameList[this.selectedResPos] || [];
      this.operateIssueIndex = null;    
      this.issueNameList[value].map(item =>{
        if(item.issue_name === '一级品' && item.number > 0){
          arr = this.issueNameList[value].filter(res => res != item)
        }
        arr.map(a =>{
          if(a.number > 0){
            if(item.issue_name === '一级品' && item.number > 0){
              item.number = null
            }
          }
        })
      })
    },

    selectIssue: function(value, index) {
      let that = this
      let num = 0
      this.operateIssueIndex = index;
      this.selectedIssueName = value;
      const arr = this.issueNameList[this.selectedResPos]
      arr.map(ele=>{
        ele.number = null
      })
      this.selectedIssue = arr;
    
      this.issueList.push(value);
      if (!this.selectQuestion.includes(this.selectedResPos)) {
        this.selectQuestion.push(this.selectedResPos);
      }
      const data = [...this.selectedIssue];
      data[index].number = 1;
      this.selectedIssue = data;

      if(this.selectedResPos == '成型工'){
        this.issueNameList['半检工'].map(ele =>{
          let ter1 = this.issueNameList['半检工']
          if(value == ele.issue_name){
            ter1.map(a =>{
              if(a.number >0){
                a.number = null
              }
            })      
            ele.number = data[index].number          
          }        
        })
      // this.selectedIssue =  this.issueNameList[this.selectedResPos]
      }
       
      if(this.selectedResPos == '半检工'){
        this.issueNameList['成型工'].map(ele =>{
          let ter = this.issueNameList['成型工']
          if(value == ele.issue_name){
            ter.map(a =>{
              if(a.number >0){
                a.number = null
              }
            })               
            ele.number = data[index].number 
            that.selectQuestion.push('成型工')
          }

          if(value != ele.issue_name){
             num+=1         
          }
          if(num == that.issueNameList['成型工'].length){
              if(that.selectQuestion.includes('成型工')){
               let a = that.selectQuestion.filter(i => i != '成型工')
              //  that.selectQuestion = a         
            }          
          }
        })
      // this.selectedIssue =  this.issueNameList[this.selectedResPos]          
      } 
    },
    issueAdd: function(item,i) {
      const data = [...this.selectedIssue];
      if (!data[i].number) {
        data[i].number = 0;
      }
      data[i].number += 1;
      this.selectedIssue = data;
      this.selectedIssue.map((item, index) => {
        if (index != 0 && item.number > 0) this.showAddQ = true;
        if (item.number > 0) {
          this.showSubmit = true;
        }
      });
      let that = this;
      if (!this.selectQuestion.includes(this.selectedResPos)) {
        this.selectQuestion.push(this.selectedResPos);
      }
      
      if(this.selectedResPos == '成型工'){
        this.issueNameList['半检工'].map(ele =>{
          if(item.issue_name == ele.issue_name){
            ele.number = item.number          
          }
        })
      // this.selectedIssue =  this.issueNameList[this.selectedResPos]
      }
       
      if(this.selectedResPos == '半检工'){
        this.issueNameList['成型工'].map(ele =>{
          if(item.issue_name == ele.issue_name){
            ele.number = item.number            
          }
        })
      // this.selectedIssue =  this.issueNameList[this.selectedResPos]          
      }
    
    },
    issueSub: function(item,i) {
      if (!this.selectedIssue[i].number || this.selectedIssue[i].number == 0)
        return;

      const data = [...this.selectedIssue];
      data[i].number -= 1;
      this.selectedIssue = data;
      let n1 = this.selectedIssue.every(item => {
        return !item.number;
      });
      if (n1) {
        this.showSubmit = false;
        let sel = this.selectQuestion.filter(res => res != this.selectedResPos);
        // 去的操作工种
        this.selectQuestion = sel;
        // 去掉分组
        if (this.selectedResPos !== "成型工") {
          this.respPosGroup[this.selectedResPos].map(item => {
            if (this.selectGroup.includes(item.name)) {
              this.selectGroup = this.selectGroup.filter(i => i !== item.name);
            }
          });
        }
      }
      let n2 = this.selectedIssue.slice(1).every(item => {
        return item.number == 0;
      });
      if (n2) this.showAddQ = false;
      // this.selectedIssue.map(item => {
      //   if (this.operateIssueIndex == null || item.number == 0) {
      //     // console.log(this.selectQuestion);
      //     let sel = this.selectQuestion.filter(
      //       res => res != this.selectedResPos
      //     );
      //     // console.log(sel);
      //     this.selectQuestion = sel;
      //   }
      // });
      
      if(this.selectedResPos == '成型工'){
        this.issueNameList['半检工'].map(ele =>{
          if(item.issue_name == ele.issue_name){
            ele.number = item.number
          }
        })
      }
       
      if(this.selectedResPos == '半检工'){
        this.issueNameList['成型工'].map(ele =>{
          if(item.issue_name == ele.issue_name){
            ele.number = item.number
          }
        })       
      }      
    },
    addQI: function(value) {
      if (this.selectedWorker == "" && this.step === 2) {
        alert("请选择成型工!");
        return;
      }
      if (
        this.colorShowList.length != 0 &&
        this.selectedColor == "" &&
        this.step === 2
      ) {
        alert("请选择颜色");
        return;
      }
      if (this.selectedGradeName == "" && this.step === 2) {
        alert("请选择等级");
        return;
      }
      if (this.selectedTradeMark == "" && this.step === 2) {
        alert("请选择商标");
        return;
      }
      if (this.goodNumber) {
        this.step = 4;
        this.showSubmit = true;
        this.addQuestion = false;
        this.respPosNameList.map(a => {
          if (a === "半检工" || a === "施釉工" || a === "登窑工") {
            this.nameList.push(a);
            this.nameList = Array.from(new Set(this.nameList));
          }
        });
        let that = this;
        this.goodNumber = 0;

        if (that.selectedGrade[0].number) {
          that.goodNumber = that.selectedGrade[0].number;
        }
        if (that.selectedGrade[4].number) {
          that.goodNumber = that.selectedGrade[4].number;
        }
        if (that.selectedGrade[0].number && that.selectedGrade[4].number) {
          that.goodNumber =
            that.selectedGrade[0].number + that.selectedGrade[4].number;
        }

        console.log(that.goodNumber);
        // 把三种基本工种选中
        if (this.nameList.length > 0) {
          for (let index = this.nameList.length - 1; index >= 0; index--) {
            if (!this.selectQuestion.includes(this.nameList[index])) {
              this.selectQuestion.push(this.nameList[index]);
            }
          }
          this.selectResPos(this.nameList[0]);
        }
      } else {
        this.step = 3;
        this.showSubmit = true;
        this.addQuestion = false;
      }
      this.respPosNameList.map(name =>{
        this.issueNameList[name].map(ele =>{
          if(ele.issue_name === '一级品' && ele.number > 0){
            this.selectedIssue = this.issueNameList[this.selectedResPos]
          } 
          if(ele.issue_name === '一级品' && (ele.number == null || ele.number == 0)){
            ele.number = 1
            this.selectedIssue = this.issueNameList[this.selectedResPos]
          }                  
        })        
      })
      let arr = []
      this.issueNameList[this.selectedResPos].map(a =>{
        if(a.issue_name === '一级品' && a.number > 0){
          arr = this.issueNameList[this.selectedResPos].filter(res => res != a)
        }
        arr.map(b =>{
          if(b.number > 0){
            if(a.issue_name === '一级品' && a.number > 0){
              a.number = null
            }
          }
        })        
      }) 
    },
    goback: function() {
      if (this.step === 4) {
        this.step = 2;
      } else {
        this.step = this.step > 1 ? this.step - 1 : 1;
      }
      // if(this.selectedGradeName != '' && this.step === 2){
      //   this.addQuestion = true
      // }
    }
  }
};
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
li {
  float: left;
  height: 60px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #fff;
  background-color: #409eff;
}
li:last-of-type p {
  font-weight: bold;
}
.worker li {
  float: left;
  width: 80px;
  height: 80px;
  padding-top: 8px;
  color: #fff;
  font-size: 14px;
  flex-direction: column;
}
.worker li div:first-of-type {
  font-size: 30px;
}
.step2 li {
  background-color: #28c56f;
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
.tbText {
  display: inline-block;
  width: 20%;
  font-size: 16px
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
</style>