<template>
<!-- 添加质量问题 -->
  <div class="wrap">
    <my-head :yaoluId="yaoluId" :showWork="false" :yaoluList="yaoluList" @newyaoluId="newyaoluId"></my-head>
    <div class="content">
      <div class="block">
        <p>请选择操作工种:</p>
        <ul class="goods clearfix">
          <li v-for="(item, index) in listWorker" :key="index" class="btn"
            :class="{bgcRed1: item.isCheckedNum, bgcRed: index==currentWork}"
            @click="worksHandler(index)" >
              {{ item.gongzhongName }}
            </li>
        </ul>
      </div>

      <div class="block" v-show="listWorker[currentWork] && listWorker[currentWork].gongzhongName!='成型工'">
        <p>请选择分组：</p>
        <div class="colors">
          <div class="btn bgcGreen" v-for="(item, index) in listGroup[currentWork]" :key="index"
            :class="{bgcRed: index==teamLeader[currentWork]}" @click="groupHandler(index)" >
              <div>{{ item.employee_no }}</div>
              <div>{{ item.name }}</div>
          </div>
        </div>
      </div>

      <div class="block" v-show="showQuestion">
        <p>请选择问题类型：</p>
        <div class="level">
          <div v-for="(item, index) in listQuestion[currentWork]" :key="index">
            <div class="item btn bgcGreen" :class="{bgcRed1: item.showNum,bgcRed: index==currentQuestion}"
              @click="questionHandler(index)" >
              {{ item.issue_name }}
            </div>
            <div class="num" v-show="item.showNum">
              <span class="sub" @click="sub(index)" onselectstart="return false">-</span>
              <input type="number" v-model.number="item.number" min="0">
              <span class="add" @click="add(index)" onselectstart="return false">+</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footBtn">
      <div class="save1" @click="submit(1)">保存并添加该工人</div>
      <div class="save2" @click="submit(2)">保存添加其他人</div>
      <div class="goback" @click="$router.go(-1)">返回</div>
    </div>

    <toast v-model="showToast" @toastConfirm="toastConfirm"></toast>

    <msg v-model="showMsg" :msg="msg"></msg>

  </div>
</template>

<script>
import myHead from "@/components/my-head";
import toast from "@/components/toast";
import msg from "@/components/msg";
export default {
  name: "AddQI",
  data() {
    return {
      title: "数据采集",
      currentWork: 0,//工种
      listWorker: [],
      chengxinggong: null,//成型工的索引位置
      //分组
      listGroup:[],
      showGroup: true,
      currentGroup: 0,
      teamLeader: [],
      //问题类型
      listQuestion:[],
      showQuestion: true,
      currentQuestion: null,

      showToast: false,
      showAddQ: false,
      submitType: null,

      indexedDB: null,
      gongzhongName:[],//所有工种的名字 ',,,,,,'
      gongzhongId:[],//所有工种的id ',,,,,,'
      problemId: [],//所有问题id ',,,,,,'
      problemName:[],//所有问题name ',,,,,,'

      yaoluId: '',
      yaoluList:[],
      localData:[],
      showMsg: false,
      msg:'',
      inspectId:'',
      nowTime: '',    //当前系统时间
    };
  },
  computed:{
    baseURL(){
      return this.axios.defaults.baseURL
    },
    userCode(){
      return localStorage.getItem('userCode');
    }
  },
  mounted(){
    this.getCookie("userSupply_ema_TAOCI")
    // this.getCookie("userSupply_demo_TAOCI")
  },
  created() {
    let that = this;
    localforage.getItem(that.baseURL + that.userCode).then(function(value) {
      if(sessionStorage.getItem('yaoluId')){
        that.yaoluId = sessionStorage.getItem('yaoluId');
      }else{
        that.yaoluId = value.ce_kiln[0].id+'';
      }
      that.yaoluList = value.ce_kiln;
      //获取本地数据
      that.indexedDB = value;
      //根据所有问题列表获取工种名字
      for(let i=0, len=value.ce_quality_issue.length; i<len; i++){
        if(that.gongzhongName.indexOf(value.ce_quality_issue[i].resp_pos_id) < 0){
          that.gongzhongName.push(value.ce_quality_issue[i].resp_pos_id);
        }
      }
      if(that.gongzhongName[0] != '成型工'){
        let index=null;
        for(let i=0; i<that.gongzhongName.length; i++){
          if(that.gongzhongName[i] == '成型工'){
            index = i;
          }
        }
        let str = that.gongzhongName.splice(index, 1);
        that.gongzhongName.unshift(str[0])
      }
      //根据工种名字获取 工种的id和  设置list的数据结构
      for(let i=0,len=that.gongzhongName.length; i<len; i++){
        if(that.gongzhongName[i] == '成型工'){
          that.currentWork = i
          that.chengxinggong = i
        }
        for(let j=0,len=value.t_partner_role_def.length; j<len; j++){
          if(that.gongzhongName[i] == value.t_partner_role_def[j].name){
            that.gongzhongId.push(value.t_partner_role_def[j].id)
            that.listWorker.push({
              gongzhongId: value.t_partner_role_def[j].id,
              gongzhongName: that.gongzhongName[i],
              isCheckedNum: false,//是否添加过问题类型 （number大于零）
            })
            that.listGroup.push([]);
            that.listQuestion.push([]);
            that.teamLeader.push(0)
          }
        }
      }
      //问题
      for(let i=0,len=that.listWorker.length; i<len; i++){
        for(let k=0,len=value.t_contact.length; k<len; k++){
          if(that.listWorker[i].gongzhongName == value.t_contact[k].job_pos_name){
            that.listGroup[i].push(value.t_contact[k])
          }
        }

        for(let j=0, len=value.ce_quality_issue.length; j<len; j++){
          if(that.listWorker[i].gongzhongName == value.ce_quality_issue[j].resp_pos_id){
            value.ce_quality_issue[j].showNum = false;
            let obj = {number:0, ...value.ce_quality_issue[j]};
            that.listQuestion[i].push(obj)
            that.problemId.push(value.ce_quality_issue[j].id)
            that.problemName.push(value.ce_quality_issue[j].issue_name)
          }
        }
      }
      
    }).catch(function() {
        // 当出错时，此处代码运行
    });
  },
  watch:{
    currentGroup(n){
      this.teamLeader.splice(this.currentWork, 1, n)
    }
  },
  methods: {
    newyaoluId(n){
      sessionStorage.setItem('yaoluId', n)
    },
    worksHandler(index) {
      this.showGroup = true;
      this.currentWork = index;
      this.currentGroup = 0
      this.currentQuestion = null;
    },
    groupHandler(index) {
      this.currentGroup = index;
      this.showQuestion = true;
    },
    questionHandler(index) {
      this.currentQuestion = index;
      this.listQuestion[this.currentWork].map((item,index)=>{
        if(item.number>0) {
          item.showNum = true
        } else{
          item.showNum = false
        }
      })
      this.listQuestion[this.currentWork][index].showNum = true;
      if(this.listQuestion[this.currentWork][index].number == 0){
        this.listQuestion[this.currentWork][index].number = 1
      }
      this.listWorker[this.currentWork].isCheckedNum = true
    },
    //加
    add(i) {
      let j = this.currentWork
      this.listQuestion[j][i].number += 1;
      if(this.listQuestion[j][i].number > 0){
        this.listWorker[j].isCheckedNum = true
      }
    },
    //减
    sub(i) {
      let j = this.currentWork
      if (this.listQuestion[j][i].number == 0) return;
      this.listQuestion[j][i].number -= 1;
      if(this.listQuestion[j][i].number == 0){
        this.listWorker[j].isCheckedNum = false
      }
    },
    submit(n) {
      this.getNowFormatDate()
      this.showToast = true;
      this.submitType = n;      
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
          that.inspectId = inspect
      }else{
        that.inspectId = ""
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

    //弹窗确定回调方法
    toastConfirm(n) {
      let that = this;
      console.log(that.nowTime)
      let newParam = JSON.parse(sessionStorage.getItem('newParam'))
      let problemStyleCol = [];//各工种下面有几种问题 ',,,,'
      let data = [], problemNumber=[], problemEmployeeId=[], problemEmployeeName=[];
      for(let i=0,len=that.listQuestion.length; i<len; i++){
        let arr = that.listQuestion[i]
        for(let j=0,len=arr.length; j<len; j++){
          arr[j].number==0 ? problemNumber.push('') : problemNumber.push(arr[j].number)
        }
        problemStyleCol.push(arr.length+1)
      }
      for(let i=0,len=that.listGroup.length; i<len; i++){
        if(!that.listGroup[i][that.teamLeader[i]]){
          problemEmployeeId.push('')
          problemEmployeeName.push('')
        } else {
          if(that.chengxinggong==i){
            problemEmployeeId.push('')
            problemEmployeeName.push('')
          } else{
            problemEmployeeId.push(that.listGroup[i][that.teamLeader[i]].partner_id)
            problemEmployeeName.push(that.listGroup[i][that.teamLeader[i]].name)
          }
        }
      }
      let kiln_name;
      that.yaoluList.map(item => {
        if(item.id == sessionStorage.getItem('yaoluId')){
          kiln_name = item.kiln_name
        }
      })
      let newProblemStyleCol=null;
      if(problemStyleCol.length != that.gongzhongName.length){
        newProblemStyleCol = problemStyleCol.splice(-that.gongzhongName.length);
      }else{
        newProblemStyleCol = problemStyleCol
      }
      let workerName=[];
      that.listWorker.map(item=>{
        workerName.push(item.gongzhongName)
      })
      let param = {
        ...newParam,
        problemStyle: workerName.toString(),//所有工种name
        problemStyleCol: newProblemStyleCol.toString(),//各工种下面有多少种问题
        problemId: that.problemId.toString(),//所有问题id
        problemName: that.problemName.toString(),//所有问题name
        problemNumber: problemNumber.toString(),//采集的问题数量
        problemEmployeeId: problemEmployeeId.toString(),//组长id
        problemEmployeeName: problemEmployeeName.toString(),//组长name
        kilnName: kiln_name,
        inspectId:that.inspectId,
        time: new Date(sessionStorage.getItem('dateCJ')),
        createTime: that.nowTime,   //点击保存的时间
      }
      data.push(param);
      console.log(param);
      that.showToast = false;

      let url = '/Collection/insertIpadData';
      that.axios.post(url, data).then(res => {// 成功回调
        if(res && res.status==200){
          that.msg = '保存成功';
          that.showMsg = true;
          setTimeout(()=>{
            that.showMsg = false;
            if (that.submitType == 1) {
              window.history.back(-1)
            } else {
              // 保存并添加其他工人
              that.linkTo("Staff");
            }
          },1000)
        }
      }, res => {
        //无网络
        localforage.getItem('local' + that.baseURL + that.userCode).then(function(value) {
          let res = JSON.parse(value)
          if(!res){
            let arr = []
            arr.push(param)
            console.log(param)
            localforage.setItem('local' + that.baseURL + that.userCode, JSON.stringify(arr)).then(function () {
                // 当值被存储后，可执行其他操作
            }).catch(function() {
                // 当出错时，此处代码运行
            });
          }else{
            that.localData = JSON.parse(value).concat();
            that.localData.push(param)
            localforage.removeItem('local' + that.baseURL + that.userCode).then(function() {
              localforage.setItem('local' + that.baseURL + that.userCode, JSON.stringify(that.localData)).then(function () {
                // 当值被存储后，可执行其他操作
              }).catch(function() {
                  // 当出错时，此处代码运行
              });
            }).catch(function() {

            });
          }
        }).catch(function() {
            // 当出错时，此处代码运行
        })
        that.msg = '当前无网络，数据已保存本地';
        that.showMsg = true;
        setTimeout(()=>{
          that.showMsg = false;
          if (that.submitType == 1) {
            window.history.back(-1)
          } else {
            //保存并添加其他工人
            that.linkTo("Staff");
          }
        },2000)
      })
    }
  },
  components: {
    myHead,
    toast, msg
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
.goods li {
  float: left;
  height: 60px;
  padding: 15px;
  font-size: 20px;
  color: #fff;
  background-color: #409EFF;
}
.goods li i{
  position: absolute;
  width: 10px;
  height: 10px;
  top: -4px;
  right: 10px;
  background-color: red;
  border-radius: 2rem;
  border: 1px solid #fff;
}
.goods li.bgcRed1 {
  background-color: #e50000;
}
/* .goods li:first-of-type{
  background-color: #C0504D;
} */
.colors,
.level {
  display: flex;
  flex-wrap: wrap;
}
.colors .btn{
  padding: 10px 30px;
}
.level .item{
  padding: 10px 15px;
  height: 42px;
}
.num {
  height: 44px;
  padding: 0!important;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.num span {
  float: left;
  width: 30%;
  text-align: center;
  line-height: 42px;
  font-size: 24px;
  -moz-user-select:none;
}
.num .sub{border-right: 1px solid #ccc;}
.num .add{border-left: 1px solid #ccc;}
.num input {
  float: left;
  width: 40%;
  text-align: center;
  line-height: 40px;
  border: none;
  outline: none;
}
</style>
