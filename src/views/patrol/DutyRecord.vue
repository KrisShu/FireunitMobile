<template>
  <div class="duty-record">
    <base-nav title="值班记录" :active="$route.query.active"></base-nav>

    <van-cell-group>
      <van-cell title="提交时间" :value="time"></van-cell>
      <van-cell title="值班人员" :value="form.dutyUserName"></van-cell>
      <van-cell>
        <van-row slot="title" type="flex" justify="space-between">
          <van-col>值班记录</van-col>
          <van-col v-if="!id" style="color: #969799"
            >请填写纸质值班记录、并拍照存档</van-col
          >
        </van-row>
        <shot-photo
          :truePhoto="truePhoto1"
          :disabled="id"
          slot="label"
          v-model="photoList1"
        ></shot-photo>
      </van-cell>

      <van-switch-cell
        v-if="!id"
        v-model="form.hasMatter"
        title="发现问题"
      ></van-switch-cell>
      <!--  查看记录-->

      <div v-else>
        <van-cell title="发现问题">
          {{ form.status === 1 ? "否" : "是" }}
        </van-cell>

        <!--        <van-cell title="问题类型">-->
        <!--          <div :style="{ color: $store.state.getStatusColor[form.dutyStatus] }">-->
        <!--            {{ $store.state.getStatus[form.dutyStatus] }}-->
        <!--          </div>-->
        <!--        </van-cell>-->
        <describe-qusetion
          v-if="form.voice || form.content"
          :isEdit="id"
          :time="form.voiceLength"
          :voice="form.voice"
          :content.sync="form.content"
        ></describe-qusetion>
        <van-cell v-if="photoList2.length" title="现场问题图片">
          <shot-photo
            slot="label"
            :disabled="id"
            :truePhoto="truePhoto2"
            v-model="photoList2"
          ></shot-photo>
        </van-cell>
      </div>

      <!--      添加巡查记录框、语音、备注-->
      <div v-show="form.hasMatter">
        <describe-qusetion
          v-model="question"
          :voice.sync="form.voice"
          :content.sync="form.content"
          @voiceBase64="voiceBase64"
        ></describe-qusetion>
        <!-- <describe-qusetion v-model="question"></describe-qusetion> -->

        <van-switch-cell
          v-model="form.isSolve"
          title="是否已解决"
        ></van-switch-cell>

        <van-cell title="附件现场问题图片">
          <shot-photo slot="label" v-model="photoList2"></shot-photo>
        </van-cell>
      </div>
    </van-cell-group>

    <base-button @click="submit" v-if="!id">提交</base-button>
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/7/9 13:45
 *  1,常量从js文件引入，不要定义魔术变量
 */
import ShotPhoto from "../../components/ShotPhoto";
import DescribeQusetion from "../../components/DescribeQusetion";
import { Toast } from "vant";
import Vue from "vue";
Vue.use(Toast);
export default {
  name: "DutyRecord",
  components: {
    ShotPhoto,
    DescribeQusetion
  },
  props: {},
  data() {
    return {
      time: "", // 提交时间
      question: {},
      photoList1: [],
      fileList1: [],
      truePhoto1: [],
      photoList2: [],
      truePhoto2: [],
      fileList2: [],
      voicefile: "",
      form: {},
      status: 0,
      id: 0
    };
  },
  computed: {},
  watch: {},
  created() {
    console.log("巡查记录页面的参数", this.$route.params);
    let { id, status } = this.$route.params;
    this.time = this.$route.query.creationTime;
    this.status = status * 1;
    console.log("id",id)
    this.id = +id;
    +id ? this.getinfo() : (this.form.dutyUser = this.$store.state.userInfo.name); // 查看状态才进行查询
  },
  mounted() {},
  methods: {
    //  todo 获取详情
    getinfo() {
      this.$axios
        .get(this.$api.GET_DUTY_INFO, {
          params: { dutyId: this.id }
        })
        .then(res => {
          if (res.success) {
            console.log("值班记录", res.result);
            this.form = res.result;
            this.form.content = res.result.problemRemark;
            //  值班记录照片----
            //缩略图
            if (this.form.dutyPhotosBase64.length) {
              for (let i in this.form.dutyPhotosBase64) {
                this.photoList1.push(
                  `data:image/;base64,${this.form.dutyPhotosBase64[i]}`
                );
              }
            }
            //真实照片
            if (this.form.dutyPhtosPath.length) {
              for (let i in this.form.dutyPhtosPath) {
                this.truePhoto1.push(
                  `${this.$url}${this.form.dutyPhtosPath[i]}`
                );
              }
            }

            //   问题照片----------
            //真实图
            if(this.form.problemPhtosPath){
              if (this.form.problemPhtosPath.length) {
                for (let i in this.form.problemPhtosPath) {
                  this.truePhoto2.push(
                    `${this.$url}${this.form.problemPhtosPath[i]}`
                  );
                }
              }
            }
            
            //缩率图
            if (this.form.problemPhotosBase64.length) {
              for (let i in this.form.problemPhotosBase64) {
                this.photoList2.push(
                  `data:image/;base64,${this.form.problemPhotosBase64[i]}`
                );
              }
            }
            //  文字还是语音
            if (this.form.problemVoiceUrl) {
              this.form.voice = `${this.$url}${this.form.problemVoiceUrl}`;
            } else {
              this.form.content = res.result.problemRemark;
            }
            console.log(this.form);
          }
        });
    },
    //获取语音的base64
    voiceBase64(Base64voice){
      this.voicefile =  this.base64ToFile(Base64voice, "voice");
    },
    //将照片地址转码
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
    getCurrnetTime() {
      //获取当前时间戳
      let now = new Date();
      return now.getTime();
    },

    //  todo 新增值班记录
    submit() {
      let that = this;
      this.fileList1 = this.base64ToFile(this.photoList1, "photo");
      this.fileList2 = this.base64ToFile(this.photoList2, "photo");

      console.log("语音路径地址", this.question.voice, this.question.duration);
      console.log("语音file文件对象", this.voicefile);

      console.log("照片地址1：", this.fileList1);
      console.log("照片地址2：", this.fileList2);

      if (!this.photoList1.length) {
        this.$toast("值班记录不能为空！");
        return;
      }

      let param = new FormData();
      param.append("FireUnitId", this.$store.state.userInfo.fireUnitID);
      param.append("UserId", this.$store.state.userInfo.userId);
      param.append(
        "Status",
        this.form.hasMatter ? (this.form.isSolve ? 2 : 3) : 1
      );
      if(this.question.content){
        param.append("ProblemRemark", this.question.content);
      }
      if(this.voicefile){
        param.append("ProblemVoice", this.voicefile);
      }
      if(this.question.duration){
        console.log("(this.question.duration",this.question.duration);
        param.append("VoiceLength", this.question.duration);
      }
      
      // param.append("ProblemRemarkType", this.question.voice ? "2" : "1");
      
      
      //值班记录图片
      if (this.fileList1.length) {
        for (let i in this.fileList1) {
          param.append(`DutyPicture${Number(i) + 1}`, this.fileList1[i]);
        }
      }
      //现场问题图片
      if (this.fileList2.length) {
        for (let i in this.fileList2) {
          param.append(`ProblemPicture${Number(i) + 1}`, this.fileList2[i]);
        }
      }
      for (var [a, b] of param.entries()) {
          console.log(a, b);
      }
      Toast.loading({
        duration: 0,
        mask: true,
        message: "提交中"
      });
      this.$axios.post(this.$api.ADD_DUTY_INFO, param).then(res => {
        console.log("提交回馈", res);
        Toast.clear();
        that.$toast.success("提交成功");
        that.$router.back();
      });
    }
  }
};
</script>

<style lang="scss">
.duty-record {
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  & > :nth-child(2) {
    flex: 2 0 auto;
  }
}
</style>
