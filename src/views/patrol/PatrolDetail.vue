<template>
  <div class="patrol-detail">
    <!-- 这个是查看巡查轨迹详情和添加轨迹详情的页面 -->
    <div>
      <base-nav title="巡查轨迹详情"></base-nav>
      <van-cell-group>
        <!--添加模块----------- 扫码巡查-->
        <div v-if="type === 2 && !id">
          <base-form @codeInfo="getAddress" :form="form" :form-list="formList"></base-form>
          <van-cell-group v-if="form.patrolAddress">
            <van-cell title="巡查地址">{{ form.patrolAddress }}</van-cell>
            <van-cell title="巡查系统">{{ form.fireSystemName }}</van-cell>
          </van-cell-group>
        </div>
        <!--添加模块-----------一般巡查----------->
        <div v-else-if="type !== 2 && !id">
          <div class="patrolAddress_box">
            <span>巡查地点</span>
            <van-cell class="build_floor">
              <van-cell-group>
                <van-field
                  v-model="form.architectureName"
                  right-icon="diamond"
                  placeholder="请选择建筑"
                  @click-right-icon="selectBuild_floor('build')"
                />

                <van-field
                  v-model="form.floorName"
                  right-icon="diamond"
                  placeholder="请选择楼层"
                  @click-right-icon="selectBuild_floor('floor')"
                />
              </van-cell-group>
              <van-cell-group>
                <van-field
                  v-model="form.patrolAddress"
                  placeholder="请输入地点名称"
                />
              </van-cell-group>
            </van-cell>
          </div>
          

          <van-popup
            v-model="show"
            position="bottom"
            :style="{ height: '40%' }"
          >
              <van-picker 
                show-toolbar title="请选择所在建筑" 
                :columns="build_floorcolumns" 
                @cancel="onCancel" 
                @confirm="onConfirm" 
              />
          </van-popup>
          
          <!-- <base-form :form="form" :form-list="formList1"></base-form> -->
        </div>


        <!-- --------------------------------------------------------------------------- -->

        <!--查看模块巡查轨迹详情-->
        <div class="showBox" v-else>
          <van-cell title="巡查时间">{{ form.creationTime }}</van-cell>
          <van-cell title="巡查地点">{{ form.patrolAddress }}</van-cell>
          <van-cell title="巡查结果">
            <div :style="{ color: $store.state.getStatusColor[form.patrolStatus] }">
              {{ $store.state.getStatus[form.patrolStatus] }}
            </div>
          </van-cell>
          <!--查看模块-------情况描述模块-->
          <describe-qusetion  :isEdit="id" :time="form.voiceLength" :voice="form.remarkVioce" :content="form.remakeText"></describe-qusetion>
        </div>
    
        <!-- ------------------------------------------------------------------------------- -->

        <!--添加模块-------是否发现问题-->
        <van-switch-cell v-if="!id" v-model="form.hasMatter" title="发现问题"></van-switch-cell>
        <div v-show="form.hasMatter && !id">
          <!-- 2019/11/6暂停使用 -->
          <!-- 2019/12/30使用 -->
           <describe-qusetion @voiceBase64="voiceBase64" v-model="question"></describe-qusetion>

          <!-- 2019/12/30暂停使用 -->
          <!-- <describe-qusetion v-model="question"></describe-qusetion> -->
          <van-switch-cell
            v-model="form.isSolve"
            title="是否已解决"
          ></van-switch-cell>
        </div>
        <!--添加模块+查看模块------ 现场照片 -->
        <van-cell title="现场照片">
          <!--添加模块----------------添加照片    -->
         <!--  <shot-photo v-if="!id" slot="label" :base64list.sync="base64list" v-model="photoList"></shot-photo> -->
           <shot-photo
            :disabled="id"
            slot="label"
            v-model="base64list"
            v-if="!id"
          ></shot-photo>
          <!--查看模块----------------查看照片  -->
          <shot-photo v-else slot="label" :disabled="id" :truePhoto="form.truePhoto" v-model="form.photoList"></shot-photo>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 添加数据的按钮模块 -->
    <div class="patrol-detail-but" v-if="!id">
      <base-button @click="submit" v-if="type == 1">保存巡查轨迹点</base-button>
      <!-- ---------------2019/12/31暂停使用----------------------------- -->
      <!-- <base-button @click="update" v-if="type == 3">修改巡查轨迹点</base-button> -->
    </div>


  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/7/2 09:39
 *  1,常量从js文件引入，不要定义魔术变量
 */
import shotPhoto from "../../components/ShotPhoto";
import DescribeQusetion from "../../components/DescribeQusetion";
import { DropdownItem,Toast  } from 'vant';
export default {
  name: "PatrolDetail",
  components: {
    shotPhoto,
    DescribeQusetion
  },
  props: {},
  data() {
    return {
      build_floor_flag:'',
      allbuild:[],//所有建筑和楼层
      build_floorcolumns: [],
      buildcolumns:[],
      floorscolumns:[],
      show: false,
      tmid: "", // 定时器
      unitList: [],
      type: 0,
      id: 0,
      photoList: [],
      base64list: [],
      question: {},
      form: {
        patrolAddress: "",
        fireSystemName: "",
        systemId: [],
        photoList: [],
        photoListFile: [],
        systemList: [],
        equiNo: "",
        architectureId:"",
        floorId:""

        
      },
      formList: [
        {
          label: "设施编码",
          remind: "输入或扫描设施编码",
          value: "equiNo",
          mySolt: "scan "
        }
      ],
      voiceFile:'',
    };
  },
  computed: {},
  watch: {
    "form.equiNo": function(val) {
      let that = this;
      window.clearTimeout(that.tmid);
      if (val) {
        that.tmid = setTimeout(() => {
          that.getAddress(val);
        }, 500);
      }
    }
  },
  created() {
    console.log("巡查轨迹详情页面的路由参数",this.$route.params)
    //type为巡查方式，id为是否为添加状态（0）或则查看状态（）
    let { id, type } = this.$route.params;
    this.id = +id;
    this.type = +type;
    // !+id ? this.getUnit() : "";  //2019/12/27暂停使用
    !+id ? this.getBuild() : "";  //2019/12/27暂停使用


    /* if(this.type == 3){//---------------2019/12/31暂停使用-----------------------------
      this.GetPatrolDetailInfo();
    } */

  },
  mounted() {},
  methods: {
    //获取建筑列表
    getBuild(){
      let fireunitId = this.$store.state.userInfo.fireUnitID
      this.$axios.get(this.$api.GetListByFireUnitId,{params:{fireunitId}}).then(res=>{
        console.log("res",res)
        this.allbuild = res.result
        for(let arr of res.result){
          this.buildcolumns.push(arr.name)
        }
        
      }).catch(err=>{
        console.log("err",err)
      })
    },
    //打开选择建筑或则楼层的弹窗
    selectBuild_floor(val){
      this.show =true;
      this.build_floor_flag = val
      if(val == 'build'){
        this.build_floorcolumns = this.buildcolumns;
      }else if(val == 'floor'){
        this.build_floorcolumns = this.floorscolumns;
      }
    },
    //点击取消关闭弹窗
    onCancel(){
      this.show = false;
    },
    //点击确认
    onConfirm(value, index){
      
      console.log("value",value)
      // console.log("this.form.ArchitectureId",this.form.ArchitectureId)
      this.show = false;
      if(this.build_floor_flag == 'build'){
        console.log("buildbuildbuild")
        this.form.architectureName = value
        for(let arr of this.allbuild){
          if(value == arr.name){
            this.form.architectureId = arr.id;
            for(let i of arr.floors){
              this.floorscolumns.push(i.name);
            }
          }
        }
      }else if(this.build_floor_flag == 'floor'){
         console.log("floorfloorfloorfloor")
         this.form.floorName = value
          for(let arr of this.allbuild){
            if(this.form.architectureId == arr.id){
              for(let i of arr.floors){
                if(value == i.name){
                  this.form.floorId = i.id;
                }
                
              }
            }
          }

          console.log("dddf", this.form.architectureId,this.form.floorId)
      }
    },

    //获取未提交的巡查轨迹点的详情---------------2019/12/31暂停使用-----------------------------
    /* GetPatrolDetailInfo(){
      let patrolDetailId = this.$store.state.patrolArrayDetail.patrolDetailId
      this.$axios.get(this.$api.GetPatrolDetailInfo,{params:{patrolDetailId}}).then(res=>{
        console.log("获取未提交的巡查轨迹点的详情",res)
         this.form = res.result
        if( res.result.patrolStatus == 1){
          this.$set(this.form, 'hasMatter', false)
        }else if(res.result.patrolStatus == 2){
          this.$set(this.form, 'hasMatter', true)
          this.$set(this.form, 'isSolve', true)
        }else if(res.result.patrolStatus == 3){
          this.$set(this.form, 'hasMatter', true)
          this.$set(this.form, 'isSolve', false)
        }
        //语音
        if(res.result.problemRemark){
          this.$set(this.question, 'content', res.result.problemRemark)
        }else if(res.result.problemVoiceUrl){
          let voice = `${this.$url}${res.result.problemVoiceUrl}`
          this.$set(this.question, 'voice', voice)
        }
        //照片
        if(res.result.patrolPhtosPath){
          for(let arr of res.result.patrolPhtosPath){
            console.log("arr1",arr)
            arr = `${this.$url}${arr}`
            this.base64list.push(arr)
          }
        
          
        }
        
        
      })
    }, */

    //  todo 获取消防系统----------暂停使用2019/12/27-----------
    /* getUnit() {
      let fireUnitId = this.$store.state.userInfo.fireUnitID
      console.log("获取消防系统getUnit")
      this.$axios.get(this.$api.GetFireUnitSystem,{params:{FireUnitID:fireUnitId}}).then(res => {
        if (res.success) {
          console.log("res.result",res.result)
          this.unitList = res.result;
        }
      });
    }, */
    // -------------------201/11/6暂停使用---------------------------------------
    // -------------------201/12/30使用---------------------------------------
    //获取录音的base64文件
    voiceBase64(voiceBase64){
      this.voiceFile =  this.base64ToFile(voiceBase64,'voice')
    },
    // todo 根据条码获取地址信息
    getAddress(code) {
      this.form.equiNo= code
      this.$axios.get(this.$api.GET_EQUIPMENTNO_INFO, {
          params: { EquiNo: code }
        }).then(res => {
          if (res.success) {
            console.log("巡查轨迹详情",res.result)
            this.form.patrolAddress = res.result.address;
            this.form.fireSystemName = res.result.fireSystemName;
          }
        });
    },
    // 获取当前时间
    getCurrnetTime() {
      let now = new Date();
      return now.getTime();
    },
    //base64文件格式转file文件对象
    base64ToFile(base64, flga) {
      let that = this;
      let arr, mime, bstr, n, u8arr;
      if (flga == "photo") {
        let fileList = [];
        for (let fileArr of base64) {

            arr = fileArr.split(",");
            mime = arr[0].match(/:(.*?);/)[1];
            console.log("mime", mime);
            bstr = atob(arr[1]); // 解码base-64编码的数据
            n = bstr.length;
            u8arr = new Uint8Array(n); // 无符号整型数组
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            //转换成file对象
            let filename = that.getCurrnetTime();
            let filetest = new File([u8arr], filename, { type: mime });
            fileList.push(filetest);
          
        }
        return fileList;
      } else if (flga == "voice") {
        
        console.log("执行语音转file的文件");

        arr = base64.split(",");
        mime = arr[0].match(/:(.*?);/)[1];
        console.log("mime", mime);
        bstr = atob(arr[1]); // 解码base-64编码的数据
        n = bstr.length;
        u8arr = new Uint8Array(n); // 无符号整型数组
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        //转换成file对象
        let filename = that.getCurrnetTime();
        let filetest = new File([u8arr], filename, { type: mime });
        let fileList2 = filetest;
        return fileList2;
      }
    },
    // 提交轨迹点
    submit(val1) {
      let f = this.form;
      let formdata = new FormData();
     
      if (!f.patrolAddress && (!f.architectureId && !f.floorId)) {
        this.$toast("请输入地点或选择建筑名称");
        return;
      }
      this.photoList = this.base64ToFile(this.base64list,'photo');
      //是一个巡查轨迹点的第一次提交
      if(localStorage.getItem('PatrolId')){
          console.log("不是第一次")
          f.PatrolId = localStorage.getItem('PatrolId');//巡查记录Id
      }else{
        console.log("是第一次")
        f.PatrolId = 0;//巡查记录Id
        f.UserId = this.$store.state.userInfo.userId;//巡查用户Id
        f.PatrolType = this.type;//巡查模式
        f.FireUnitId = this.$store.state.userInfo.fireUnitID;//防火单位Id
      
        // f.UserBelongUnitId = 
      
        formdata.append("UserId",f.UserId)//巡查用户Id
        formdata.append("PatrolType",f.PatrolType)//巡查模式
        formdata.append("FireUnitId",f.FireUnitId)//防火单位Id
        formdata.append("UserBelongUnitId",f.FireUnitId)//巡查人员归属的单位Id
      }
      console.log("this.formthis.formthis.form",f);
      formdata.append("PatrolId",f.PatrolId)//巡查记录Id
      f.PatrolStatus = f.hasMatter ? (f.isSolve ? 2 : 3) : 1;//记录状态
      formdata.append("PatrolAddress",f.patrolAddress);
      if(f.architectureId){
        formdata.append("ArchitectureId",f.architectureId);
        
      }
      if(f.floorId){
        formdata.append("FloorId",f.floorId);
      }
      
      formdata.append("PatrolStatus",f.PatrolStatus);
      //现场照片
      if (this.photoList.length) {
        for (let i in this.photoList) {
          formdata.append(`LivePicture${Number(i) + 1}`, this.photoList[i]);
        }
      }
      //ProblemRemark
      if(this.question.content){
        formdata.append("ProblemRemark", this.question.content);
      }
      //ProblemVoice
      if(this.voiceFile){
        formdata.append("ProblemVoice", this.voiceFile);
      }
      if(this.question.duration){
        console.log("(this.question.duration",this.question.duration);
        formdata.append("VoiceLength", this.question.duration);
      }

      for (var [a, b] of formdata.entries()) {
          console.log(a, b);
      }
      Toast.loading({
        duration: 0,
        mask: true,
        message: "提交中"
      });
      this.$axios.post(this.$api.SubmitPatrolDetail, formdata).then(res => {
        console.log("提交回馈", res);
        Toast.clear();
        this.$toast.success("提交成功");
        this.$router.push({
          path:`/PatrolRecord/${res.result}`
        })
        localStorage.setItem('PatrolId',res.result)
      });
      
    },
    //修改---------------2019/12/31暂停使用-----------------------------
    /* update(){
      this.photoList = this.base64ToFile(this.base64list,'photo');
  
        this.photoList = this.base64ToFile(this.base64list,'photo');
        console.log("this.formthis.formthis.form",this.form);
        let updateformdata = new FormData();
        updateformdata.append('PatrolDetailId',this.form.patrolDetailId)//巡查轨迹点Id
        updateformdata.append('PatrolAddress',this.form.patrolAddress)//巡查地点
        updateformdata.append('ArchitectureId',this.form.architectureId)//巡查地点
        updateformdata.append('FloorId',this.form.floorId)//巡查地点
        let PatrolStatus = this.form.hasMatter ? (this.form.isSolve ? 2 : 3) : 1;//记录状态
        updateformdata.append('PatrolStatus',PatrolStatus)//巡查地点
        if (this.photoList.length) {
          for (let i in this.photoList) {
            updateformdata.append(`LivePicture${Number(i) + 1}`, this.photoList[i]);
          }
        }
        //ProblemRemark
      if(this.question.content){
        updateformdata.append("ProblemRemark", this.question.content);
      }
      //ProblemVoice
      if(this.voiceFile){
        updateformdata.append("ProblemVoice", this.voiceFile);
      }
      if(this.question.duration){
        console.log("(this.question.duration",this.question.duration);
        updateformdata.append("VoiceLength", this.question.duration);
      }
      for (var [a, b] of updateformdata.entries()) {
          console.log(a, b);
      }

      this.$axios.put(this.$api.UpdatePatrolDetail,updateformdata).then(res=>{
        console.log("修改数据成功",res)
        this.$router.back()

      }).catch(err=>{
        console.log("修改数据失败",err)
      })

    } */
  }
};
</script>

<style lang="scss">
@import "../../style/app";
.patrol-detail {
  @include my-flex();
  background-color: #fff;
  &-but {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    & > div {
      width: 100%;
    }
    & > :nth-child(1) {
      button {
        background-color: #00b7e4;
        border-color: #00b7e4;
      }
    }
  }
  .patrolAddress_box{
    display: flex;
    padding-left: 15px;
    align-items: center;
    span{
      font-size: 14px;
      color: #323233;
    }
    .build_floor {
      width: 80%;
      .van-cell-group {
        border: none;
        display: flex;
        .van-cell{
          .van-cell__title{
            width: 50px;
          }
          padding: 10px 2px;
          &:nth-of-type(2){
            margin-left: 16px;
          }
        }
      }
    }

  }
  .fireSystem{
    .van-cell__title{
      flex: 1;
    }
    .van-cell__value{
       flex: 2;
      width: 100%;
      p{
        width: 100%;
      }
    }
  }
  
  

  /* jst */
  .showBox{
    .van-cell{
      .van-cell__value{
        flex: 3
      }
    }
  }
}
</style>
