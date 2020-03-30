<template>
<!-- 施釉车间-坏柸采集 -->
  <div class="wrap">
    <my-head
      :showWorker="false"
      :showHome="true"
      :yaoluId="yaoluId"
      :yaoluList="yaoluList"
      :showTitle="true"
      :selectedProCode="selectedProCode"
      @newyaoluId="newyaoluId"
    ></my-head>
    <div class="content">

      <div>
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
        </div>
      </div>

      <div>
        <div class="block">
          <p>请选择半检工:</p>
          <div class="level">
            <div v-for="(item, index) in selectedWorkerList" :key="item.employee_no">
              <div
                class="btn bgcGreen"
                :class="{bgRed:item.number > 0, bgcRed: operateWorkerIndex === index}"
                @click="selectWorker(item.name,index)"
                :style="{'line-height': 'unset', height: '80px', 'padding': '8px 15px 0'}"
              >
                <div :style="{'font-size': '30px'}">{{ item.employee_no }}</div>
                <div :style="{'font-size': '14px'}">{{ item.name }}</div>
              </div>
              <div class="num" v-show="item.number > 0 || operateWorkerIndex === index">
                <span class="sub" @click="workerSub(index)" onselectstart="return false">-</span>
                <input type="number" v-model.number="item.number" min="0" />
                <span class="add" @click="workerAdd(index)" onselectstart="return false">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footBtn">
      <div class="save1"  @click="submit()">保存</div>
      <!-- <div class="goback" @click="goback">返回</div> -->
    </div>

    <toast v-model="showToast"  @toastConfirm="toastConfirm"></toast>
    <toast v-model="showToast2" @toastConfirm="postLocalData"></toast>

    <msg v-model="showMsg" :msg="msg"></msg>
  </div>
</template>
<script>
import myHead from "@/components/head-assembly";
import toast from "@/components/toast";
import msg from "@/components/msg";
import loading from "@/components/loading";
export default {
  name: "glazeBadCollection",
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
      showMsg: false,
      showToast: false,
      showToast2: false,
      count: "",

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
      submitType:'',

      selectedProType: "",
      selectedProCode: "",

      selectedWorker: "",
      selectedColor: "",
      selectQuestion: [],
      selectGroup: [],
      operateGradeIndex: null,
      selectedGrade: [],
      selectedTradeMark: "",
      selectedResPos: "",
      selectedRespPosGroup: "",
      operateIssueIndex: null,
      selectedIssue: [],
      work_list:[],
      createUid:"",
      selectedWorkerList: [], // 新需求工人可以多选
      operateWorkerIndex: null           
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
    that.updateData()
  },
  mounted(){
    // this.updateData()
    this.getCookie("userSupply_ema_TAOCI")
    // this.getCookie("userSupply_demo_TAOCI")       
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
      return this.workerList[this.selectedProCode] || [];
    },
    colorShowList: function() {

      const data = this.proCodeColor[this.selectedProCode];
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
    baseURL() {
      return this.axios.defaults.baseURL;
    },
    userCode() {
      return localStorage.getItem("userCode");
    }
  },
  methods: {
    newyaoluId(n) {
      let that = this
      that.yaoluId = n
      sessionStorage.setItem("yaoluId", n);
    },
    getCookie(name){
      let that = this
      let allcookies = document.cookie;
      let cookie_pos = allcookies.indexOf(name);   //索引的长度
  
    // 如果找到了索引，就代表cookie存在，
    // 反之，就说明不存在。
      if (cookie_pos != -1){
          // 把cookie_pos放在值的开始，只要给值加1即可。
          cookie_pos += name.length + 1;      //这里容易出问题，所以请大家参考的时候自己好好研究一下
          let cookie_end = allcookies.indexOf(";", cookie_pos);
    
          if (cookie_end == -1)
          {
              cookie_end = allcookies.length;
          }
    
          let inspect = unescape(allcookies.substring(cookie_pos, cookie_end));    //这里就可以得到你想要的cookie的值了
          that.createUid = inspect
      }else{
        that.createUid = ""
      }      
    },       
    checkPostLocalData() {
      let that = this;
      localforage
        .getItem("local5" + that.baseURL + that.userCode)
        .then(function(value) {
          let res = JSON.parse(value);
          if (res && res.length > 0) {
            that.localData = res;
            that.showToast2 = true;
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
      let url = "/adobeBadRecord/save";
      for (let i = 0, len = that.localData.length; i < len; i++) {
        let data = [that.localData[i]];
        await that.axios.post(url, data).then(
          res => {
            // 成功回调
            if (res && res.status == 200) {
              num++;
              if (num == len) {
                that.showLoading = false;
                that.msg = "保存成功";
                that.showMsg = true;
                setTimeout(() => {
                  that.showMsg = false;
                }, 2000);
                localforage
                  .removeItem("local5" + that.baseURL + that.userCode)
                  .then(function() {})
                  .catch(function() {});
                that.localData = null;
              }
            }
          },
          () => {
            that.showLoading = false;
            that.msg = "保存失败";
            that.showMsg = true;
            setTimeout(() => {
              that.showMsg = false;
            }, 2000);
          }
        );
      }
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
            
            if (sessionStorage.getItem("yaoluId")) {
              that.yaoluId = sessionStorage.getItem("yaoluId");
            } else {
              that.yaoluId = (that.yaoluList && that.yaoluList[0].id + "") || "";
            }
  
          }
           catch (error) {
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
      const that = this;
      let isonline = true;
      let result = null;
      //获取产品类型、产品型号
      await that.axios.get("/mobile/selectNewModel", {}).then(
        res => {
          if (res && res.status == 200) {
            result = res.data.data || [];
            const proTypeNameList = [];
            const proCodeList = {};
            const proCodeColor = {};
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
            }
            that.proTypeNameList = Array.from(new Set(proTypeNameList));
            that.proCodeList = proCodeList;
            that.proCodeColor = proCodeColor;
          }
        },
        () => {
          that.showLoading = false;
          isonline = false;
        }
      );
      //获取半检工
      await that.axios.get("/mobile/selectInspectionWorker", {}).then(
        res => {
          if (res && res.status == 200) {
            result = res.data.data || [];
            const workerList = {};
            // for (const item of result) {
            //   // 成型工
            //   if (!workerList[item.pro_code]) {
            //     workerList[item.pro_code] = [];
            //   }
            //   workerList[item.pro_code].push({
            //     id: item.partner_id,
            //     code: item.employee_no,
            //     name: item.name
            //   });
            // }
            that.selectedWorkerList = result;
          }
        },
        () => {
          that.showLoading = false;
          isonline = false;
        }
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

    submit() {
      let that = this
      if(that.selectedProType==''){
          alert("请选择产品类型!");
          return;
       }
      if(that.selectedProCode==''){
          alert("请选择产品型号!");
          return;
       }
      if(that.yaoluId==''){
          alert("请选择窑炉");
          return;
       }
      let isSelectedWorker = false;
      that.selectedWorkerList.map(item => {
        if (item.number) {
          isSelectedWorker = true;
        }
        return;
      });
      if (
        !that.selectedWorkerList ||
        that.selectedWorkerList.length === 0 ||
        !isSelectedWorker
      ) {
        alert("请选择半检工!");
        return;
      }                  
      that.showToast = true;       
    },

    toastConfirm() {
      let that = this;
      let trademark = "";
      if (that.tradeMarkList[that.selectedTradeMark]) {
        trademark = that.tradeMarkList[that.selectedTradeMark].clientFullName;
      } else {
        trademark = null;
      }
                    
      let list = Array.from(new Set(that.work_list));

      let param = [];
      that.selectedWorkerList.map(res =>{
        if(res.number){
            param.push({
            code: that.selectedProCode, //产品型号
            typeName: that.selectedProType,//产品类型
            workCode: res.employee_no, //工号
            workName: res.name, //工人姓名
            trademark: null,    //商标
            formCode: '050',   //青坯传入050，白坯传入020
            moveType: '1',   //入库传入1,出库传入2  
            slocId: 3,   //库存地点id
            colorCode: null,   //颜色
            createUid: that.createUid,   //从缓存中取出的
            number: res.number,   //数量
            paramNumber:null,   //裂、修糙、毛坯
            time: new Date(sessionStorage.getItem("dateCJ"))           
            })          
        }
      })                
      list.map(res=>{

      })


      let data = param;
      let url = "/adobeBadRecord/save";
      that.axios.post(url, data).then(
        res => {
          // 成功回调
          if (res && res.status == 200) {
            that.msg = "保存成功";
            that.showMsg = true;
            setTimeout(() => {
              that.showMsg = false;
              window.location.reload();
            }, 1000);
            that.showToast = false;
          }
        },
        res => {
          that.showToast = false;
          localforage
            .getItem("local5" + that.baseURL + that.userCode)
            .then(function(value) {
              let res = JSON.parse(value);
              if (!res) {
                let arr = [];
                arr.push(param);
                localforage
                  .setItem(
                    "local5" + that.baseURL + that.userCode,
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
                  .removeItem("local5" + that.baseURL + that.userCode)
                  .then(function() {
                    localforage
                      .setItem(
                        "local5" + that.baseURL + that.userCode,
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
              window.location.reload();
          }, 2000);
        }
      );
    },

    selectProType: function(value) {
      if (this.selectedProType === value) {
        return;
      }
      this.selectedProType = value;

      this.selectedProCode = "";
      if (this.selectedWorkerList && this.selectedWorkerList.length > 0) {
        this.selectedWorkerList.map(item => {
          item.number = 0;
          return;
        });
      }
      // this.selectedWorkerList = [];
      this.operateWorkerIndex = "";
    },
    selectProCode: function(value) {
      let that = this
      this.selectedProCode = value;
      this.operateGradeIndex = null;
      this.showSubmit = false;
      sessionStorage.setItem("selectedProCode",value);
      // if (this.selectedWorkerList && this.selectedWorkerList.length > 0) {
      //   this.selectedWorkerList.map(item => {
      //     item.number = 0;
      //     return;
      //   });
      // }
      // this.selectedWorkerList = this.selectedWorkerList;
      // this.operateWorkerIndex = "";      
    },
    selectWorker: function(value,index) {
      this.selectedWorker = value;
      this.operateIssueIndex = index;
      const data = [...this.selectedWorkerList];
      data[index].number = 1;
      this.selectedWorkerList = data;
      this.showSubmit = true;    
    },
    selectTradeMark: function(value) {
      this.selectedTradeMark = value;
    },
    selectResPosGroup: function(value) {
      this.selectedRespPosGroup = value;
      this.issueNameList[this.selectedResPos].map(item => {      
        if (this.selectedRespPosGroup){      
          this.selectGroup.push(this.selectedRespPosGroup)
          console.log(this.selectedRespPosGroup)          
        }
      });          
    },
    workerAdd: function(i) {
      const data = [...this.selectedWorkerList];
      if (!data[i].number) {
        data[i].number = 0;
      }
      data[i].number += 1;
      this.selectedWorkerList = data;
      this.selectedWorkerList.map((item, index) => {
        if (index != 0 && item.number > 0) this.showAddQ = true;
        if (item.number > 0) {
          this.showSubmit = true;
        }
      });
    },
    workerSub: function(i) {
      if (
        !this.selectedWorkerList[i].number ||
        this.selectedWorkerList[i].number == 0
      )
        return;
      const data = [...this.selectedWorkerList];
      data[i].number -= 1;
      this.selectedWorkerList = data;
      let n1 = this.selectedWorkerList.every(item => {
        return item.number == 0;
      });
      if (n1) this.showSubmit = false;

      let n2 = this.selectedWorkerList.slice(1).every(item => {
        return item.number == 0;
      });
      if (n2) this.showAddQ = false;
    },
    addQI: function(value) {
      this.step = 3;
    },
    goback: function() {
      this.step = this.step > 1 ? this.step - 1 : 1;
    },
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
</style>