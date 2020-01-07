<template>
  <div class="patrol-record">
    <!-- 查看和添加巡查记录页面 -->
    <base-nav title="巡查记录" :active="1"></base-nav>
    <van-cell-group>
      <van-cell>
        <div slot="title">巡查方式：{{ type[patrolType] }}</div>
        <div slot="label" v-if="id">
          <div>巡查人员：{{ userInfo.patrolUser }}</div>
        </div>
        <van-button
          v-if="patrolType && !id"
          size="mini"
          type="primary"
          @click="$router.push(`/PatrolDetail/${patrolType}/0`)"
        >
          +新增巡查轨迹
        </van-button>
        <div v-else>{{ userInfo.creationTime }}</div>
      </van-cell>

      <!--添加模块-----------------有数据状态！-->
      <div v-if="list.length">
        <van-cell title>
          <div slot="label">有效轨迹点{{ list.length }}个，发现{{hasQusetion}}个问题，现场解决{{hasDel}}个问题</div>
        </van-cell>
        <van-steps direction="vertical" :active="list.length" class="patrol-record-steps">
          <van-step v-for="(item, index) in list" :key="index">
            <van-panel @click.native="getDetail(item)" class="patrol-record-panel">
              <van-cell
                slot="header"
                :label="`巡查地点：${item.patrolAddress}`"
                :title="item.creationTime"
              >
                <div
                  :style="{ color: $store.state.getStatusColor[item.patrolStatus]}"
                >{{ $store.state.getStatus[item.patrolStatus] }}</div>
              </van-cell>
              <div class="patrol-record-steps-info">
                <!--                语音/备注-->
                <van-button
                  class="patrol-record-steps-info-but"
                  v-if="item.problemRemakeType === 2"
                  type="primary"
                  size="small"
                >
                  <img class="base-play-sound-img" alt src="../../assets/zbxc_img_04.png" />
                  <span>语音</span>
                </van-button>
                <div v-if="item.problemRemakeType === 1">{{ item.remakeText }}</div>
                <!--                照片-->
                <div>
                  <van-image
                    v-for="(y, i) in item.photoList"
                    :key="i"
                    fit="cover"
                    width="75px"
                    height="60px"
                    :src="y"
                  ></van-image>
                </div>
              </div>
            </van-panel>
            <!--            删除-->
            <van-icon
              v-if="!id"
              class="patrol-record-steps-i"
              name="clear"
              @click="deleteStep(index)"
            ></van-icon>
          </van-step>
        </van-steps>
      </div>

      <!--      todo 暂无数据！-->
      <div class="patrol-record-empty" v-else>
        <img width="5%" src="../../assets/zbxc_img_03.png" alt />
        <div>
          <img width="10%" src="../../assets/zbxc_img_02.png" alt />
          <span>还没有巡查轨迹哦！</span>
        </div>
      </div>
    </van-cell-group>

    <base-button @click="submit" v-if="list.length && !id">提交</base-button>
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/7/9 14:29
 *  1,常量从js文件引入，不要定义魔术变量
 */
import { Toast } from "vant";
import Vue from "vue";
Vue.use(Toast);
export default {
  name: "PatrolRecord",
  components: {},
  props: {},
  data() {
    return {
      hasQusetion: 0,
      hasDel: 0,
      userInfo: {}, // 查看时候的人员信息
      list: [],
      patrolType: "",
      type: {
        0: "未设置巡查方式",
        1: "一般巡查",
        2: "扫码巡查"
      },
      patrolId: 0,
      id: 0,
      takeImgsbase64: [],
      voicebase64: []
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getType();
    this.userInfo = this.$route.query;
    this.id = +this.$route.params.id;
    this.id ? this.getList() : this.getlocalList();
  },
  mounted() {},
  methods: {
    // todo  获取数量
    getNum(res) {
      res.forEach(item => {
        console.log(item.patrolStatus);
        if (item.patrolStatus > 1) {
          this.hasQusetion += 1; // 发现问题
        }
        if (item.patrolStatus === 2) {
          this.hasDel += 1; // 解决问题
        }
      });
    },
    // todo 获取巡查方式
    getType() {
      this.$axios
        .get(this.$api.GET_PATROL_TYPE, {
          params: { fireUnitId: this.$store.state.userInfo.fireUnitID }
        })
        .then(res => {
          if (res.success) {
            console.log("巡查方式", res);
            this.patrolType = res.result;
          }
        });
    },
    //  todo 获取巡查轨迹
    getList() {
      console.log("getList");
      this.$axios
        .get(this.$api.GET_PATROL_TRACK_LIST, {
          params: { PatrolId: this.id }
        })
        .then(res => {
          if (res.success) {
            console.log("巡查轨迹详情", res.result);
            this.getNum(res.result);
            this.list = res.result.reverse();
            //  照片
            for (let i of res.result) {
              i.photoList = [];
              i.truePhoto = [];
              for (let y in i.patrolPhotosPath) {
                i.truePhoto.push(`${this.$url}${i.patrolPhotosPath[y]}`);
              }
              for (let g of i.photosBase64) {
                i.photoList.push(`data:image/;base64,${g}`);
              }
            }
          }
        });
    },
    //  todo 获取本地巡查轨迹
    getlocalList() {
      console.log(
        "this.$store.state.localTrajectroy",
        localStorage.getItem("PatrolArray"),
        this.$store.state.patrolArray
      );
      if (JSON.parse(localStorage.getItem("PatrolArray"))) {
        if (JSON.parse(localStorage.getItem("PatrolArray")).length > 0) {
          this.list = this.$store.state.patrolArray;
          this.getNum(this.list);
          for (let index = 0; index < this.list.length; index++) {
            //照片处理
            if (this.list[index].photoListFile.length) {
              console.log("有照片");
              this.takeImgsbase64[index] = {};
              this.takeImgsbase64[index].file = [];
              for (let y = 0; y < this.list[index].photoListFile.length; y++) {
                this.getBase64Time(this.list[index].photoListFile[y]).then(
                  res => {
                    this.takeImgsbase64[index].file[y] = res;
                  }
                );
              }
            } else {
              console.log("没有照片");
              this.takeImgsbase64[index] = 1;
            }
            //语音转换
            if (this.list[index].remarkVioce) {
              console.log("有语音");
              this.Audio2dataURL(this.list[index].remarkVioce).then(res => {
                this.voicebase64[index] = res;
              });
            } else {
              console.log("没有语音");
              this.voicebase64[index] = 1;
            }
          }
        }
      }
    },
    //--------------------2019/11/6---- 新增开始-------------------------

    //转化为base64并且加上水印
    getBase64Time(url) {
      console.log("调用此方法", url); //这里是能获取到的
      let that = this;
      return new Promise((resolve, reject) => {
        let canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d"),
          image = new Image();
        let fontSize;
        let MAX_WH = 800;
        image.crossOrigin = "Anonymous";
        image.onload = function() {
          //这里是一个异步，所以获取到的base64文件需要用回调
          console.log("image.height", image.height);
          console.log("image.width", image.width);
          console.log("canvas.width", canvas.width);
          console.log("canvas.height", canvas.height);
          if (image.height > MAX_WH) {
            image.width *= MAX_WH / image.height;
            image.height = MAX_WH;
          }
          if (image.width > MAX_WH) {
            // 宽度等比例缩放 *=
            image.height *= MAX_WH / image.width;
            image.width = MAX_WH;
          }
          canvas.height = image.height;
          canvas.width = image.width;
          if (image.width > 100 && image.width < 500) {
            fontSize = "24px";
          } else if (image.width >= 500 && image.width < 1000) {
            fontSize = "44px";
          } else if (image.width >= 1000 && image.width < 1500) {
            fontSize = "64px";
          }
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          ctx.font = `${fontSize} Arial`;
          ctx.fillStyle = "tomato";
          let time = that.getCurrnetTime("timeSign"); //获取当前的时间
          console.log("time", time);
          ctx.textAlign = "end";
          ctx.textBaseline = "middle";
          ctx.fillText(time, canvas.width - 20, canvas.height - 60);
          let dataURL = canvas.toDataURL("image/png/jpg");
          if (dataURL) {
            resolve(dataURL);
          } else {
            reject("err");
          }
        };
        image.src = url;
      });
    },

    //获取当前时间，加水印的时间
    getCurrnetTime(flga) {
      let now = new Date(),
        year = now.getFullYear(), //得到年份
        month = now.getMonth() + 1, //得到月份
        date = now.getDate(), //得到日期
        hour = now.getHours(), //得到小时
        minu = now.getMinutes(), //得到分钟
        seconds = now.getSeconds(); //得到秒
      month = month < 10 ? "0" + month : month;
      date = date < 10 ? "0" + date : date;
      hour = hour < 10 ? "0" + hour : hour;
      minu = minu < 10 ? "0" + minu : minu;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      if (flga == "timeSign") {
        return year + "-" + month + "-" + date + " " + hour + ":" + minu;
      } else if (flga == "name") {
        //返回时间戳
        return now.getTime();
      }
    },
    //语音地址转base64
    Audio2dataURL(vociePath) {
      let that = this;
      return new Promise((resolve, reject) => {
        plus.io.resolveLocalFileSystemURL(
          vociePath,
          function(entry) {
            entry.file(function(file) {
              console.log("语音文件对象", file);
              var fileReader = new plus.io.FileReader();
              fileReader.readAsDataURL(file);
              fileReader.onloadend = function(evt) {
                let voice = evt.target.result;
                if (voice) {
                  resolve(voice);
                } else {
                  reject("err");
                }
              };
            });
          },
          function(e) {
            alert("Resolve file URL failed: " + e.message);
          }
        );
      });
    },
    //base64转file文件
    base64TOfile(base64) {
      if (base64) {
        let that = this;
        var arr = base64.split(",");
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]); // 解码base-64编码的数据
        var n = bstr.length;
        var u8arr = new Uint8Array(n); // 无符号整型数组
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        //转换成file对象
        let filename = new Date().getTime();
        let filetest = new File([u8arr], filename, { type: mime });
        return filetest;
      } else {
        return "";
      }
    },
    //--------------------2019/11/6---- 新增结束-------------------------

    // 删除某一项
    deleteStep(index) {
      this.list.splice(index, 1);
      localStorage.setItem("PatrolArray", JSON.stringify(this.list));
      this.$store.commit("setPatrolArray", this.list);
    },
    // todo 查看详情
    getDetail(item) {
      // localStorage.setItem("patrolArrayDetail", JSON.stringify(item));
      if (this.id) {
        //查看
        this.$store.commit("setPatrolArrayDetail", item);
        this.$router.push(`/PatrolDetail/${this.patrolType}/1`);
      } else {
        //新增的查看
        this.$store.commit("setPatrolArrayDetail", item);
        this.$router.push(`/PatrolDetail/${this.patrolType}/2`);
      }
    },
    // todo 新建一个巡查对象，然后返回ID，再依次添加数据
    submit() {
      // console.log("看看转化的照片的base64",this.takeImgsbase64,this.takeImgsbase64.length)
      Toast.loading({
        duration: 0,
        mask: true,
        message: "提交中"
      });
      let f = {
        userId: this.$store.state.userInfo.userId,
        fireUnitId: this.$store.state.userInfo.fireUnitID
      };
      this.$axios.post(this.$api.ADD_PATROL_TRACK, f).then(res => {
        if (res.success) {
          this.patrolId = res.result.patrolId;
          this.submitArrayAll();
          // this.submitArray()
        }
      });
    },

    //todo 依次提交数组数据  --------------------------------------2019/11/13暂停使用---------------------------------------------------------
    /* async submitArray() {
      let that = this;
      let result;
      for (let i =0; i< this.list.length ;i++){
        let param = new FormData();
        param.append("PatrolId",that.patrolId) 
        param.append("PatrolAddress", this.list[i].patrolAddress)
        param.append("ProblemStatus",this.list[i].patrolStatus)
        param.append("ProblemRemarkType",this.list[i].problemRemakeType)
        param.append("ProblemRemark",this.list[i].remakeText)
        //图片
        if(this.list[i].photoListFile.length){
          for(let x= 0;x<this.list[i].photoListFile.length;x++){
            let fileImg = this.base64TOfile(this.takeImgsbase64[i].file[x])
            console.log("fileImg",fileImg)
            param.append(`LivePicture${Number(x) + 1}`, fileImg);
          }
        }
        //语音
        if(this.list[i].remarkVioce){
          let voicefile = this.base64TOfile(this.voicebase64[i])
          console.log("有语音就上传",voicefile,this.list[i].voiceLength)
           
           param.append("VoiceLength", this.list[i].voiceLength) 
           param.append("RemarkVioce", voicefile)
        }
        //
        await  this.$axios.post(this.$api.ADD_PATROL_TRACK_DETAIL,param).then(res => {
              console.log("提交回馈",res)
              result = res.result.success
            }).catch(res=>{
              Toast.clear();
              this.$toast('网路链接超时，请稍后重试');
              console.log("上传提交失败",res)
            })

      }
      if(result){
            Toast.clear();
            that.$toast.success("提交成功");
            that.$router.push({
              name:'patrol',
              params:{
                active:1
              }
            })
            that.$store.commit('setPatrolArray',[])
            localStorage.removeItem('PatrolArray')
        }
    } */
    //提交轨迹点-----------------------------2019/11/13新增使用------------------------------------------
    submitArrayAll() {
      console.log("打印数据11111111111111", this.list);
      console.log("打印数据this.takeImgsbase64", this.takeImgsbase64);
      console.log("打印数据voicebase64", this.voicebase64);
      let emptyObject = new File(["empty"], "empty.txt", {
        type: "text/plain"
      });
      let that = this;
      let param = new FormData();
      param.append("PatrolId", that.patrolId); //巡查id

      for (let index = 0; index < this.list.length; index++) {
        param.append("DeviceSn", this.list[index].equiNo); //编码
        console.log(
          "this.list[index].patrolAddress",
          this.list[index].patrolAddress
        );
        param.append("PatrolAddress", this.list[index].patrolAddress); //地址
        param.append("SystemIdList", this.list[index].systemId); //无用字段
        param.append("ProblemStatus", this.list[index].patrolStatus); //问题状态
        param.append(
          `LivePicture1`,
          this.list[index].photoListFile.length > 0
            ? this.base64TOfile(this.takeImgsbase64[index].file[0])
            : emptyObject
        );
        param.append(
          `LivePicture2`,
          this.list[index].photoListFile.length > 1
            ? this.base64TOfile(this.takeImgsbase64[index].file[1])
            : emptyObject
        );
        param.append(
          `LivePicture3`,
          this.list[index].photoListFile.length > 2
            ? this.base64TOfile(this.takeImgsbase64[index].file[2])
            : emptyObject
        );
        param.append("ProblemRemarkType", this.list[index].problemRemakeType); //问题描述问题
        param.append("ProblemRemark", this.list[index].remakeText); //文字描述
        if (this.list[index].remarkVioce) {
          param.append(
            "RemarkVioce",
            this.base64TOfile(this.voicebase64[index])
          );
          param.append("VoiceLength", this.list[index].voiceLength); //语音长度
        } else {
          param.append("RemarkVioce", emptyObject);
          param.append("VoiceLength", 0);
        }
      }
      //
      this.$axios
        .post(this.$api.AddPatrolTrackDetailAll, param)
        .then(res => {
          console.log("提交回馈", res);
          if (res.result.success) {
            Toast.clear();
            this.$router.push({
              name: "patrol",
              params: {
                active: 1
              }
            });
            this.$store.commit("setPatrolArray", []);
            localStorage.removeItem("PatrolArray");
          }
        })
        .catch(res => {
          Toast.clear();
          this.$toast("网路链接超时，请稍后重试");
          console.log("上传提交失败", res);
        });
    }
  }
};
</script>

<style lang="scss">
.patrol-record {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  & > :nth-child(2) {
    flex: 2 0 auto;
  }
  &-panel {
    .van-panel__header {
      & > :nth-child(1) {
        flex: 2 0 auto;
      }
      & > :nth-child(2) {
        flex: 1 0 auto;
      }
      &::after {
        border-bottom-style: dashed;
      }
    }
    .van-panel__content {
      padding: 10px;
    }
  }

  /*进度条*/
  &-steps {
    &-i {
      position: absolute;
      right: 4px;
      top: 4px;
      font-size: 16px;
      color: #f56c6c;
    }
    /*取消多余的线条*/
    .van-step::after {
      border-width: 0;
    }
    .van-step__title {
      border-left: 1px solid #ebedf0;
      border-right: 1px solid #ebedf0;
    }
    .van-panel__header-value {
      color: #409eff;
    }
    &-info {
      & > :nth-child(2) {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      /*照片*/
      .van-image {
        margin: 5px 8px 0 8px;
      }
      /*语音按钮*/
      &-but {
        .van-button__text {
          display: flex;
        }
      }
    }
    /*  左侧进度样式*/
    .van-step__circle-container,
    .van-step__line {
      top: 50%;
    }
    .van-step__circle {
      width: 10px;
      height: 10px;
    }
  }

  &-sound {
    & > :nth-child(2) {
      margin-left: 4px;
      font-size: 18px;
      color: #f56c6c;
    }
    .van-button__text {
      display: flex;
    }
    &-img {
      height: 16px;
      margin: auto 5px;
    }
  }

  /*无数据*/
  &-empty {
    text-align: center;
    padding: 15px;
    & > div {
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 260px;
      left: 30%;
      color: #aeadad;
      img {
        padding-right: 10px;
      }
    }
  }

  /* jst */
  .patrol-record-panel {
    .van-cell {
      .van-cell__title {
        flex: 3;
      }
    }
    .van-panel__content {
      .patrol-record-steps-info {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
