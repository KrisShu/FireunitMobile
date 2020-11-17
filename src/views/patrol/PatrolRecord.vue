<template>
  <div class="patrol-record">
    <!-- 查看和添加巡查记录页面 -->
    <base-nav title="巡查记录" :active="1"></base-nav>
    <van-cell-group>
      <van-cell>
        <div slot="title">巡查方式：{{ type[patrolType] }}</div>
        <div slot="label" v-if="id">
          <div>巡查人员：{{ userInfo.userName }}</div>
        </div>
        <van-button
          v-if="patrolType && (!id || userInfo.patrolStatus == 4 || userInfo.state == 4 )"
          size="mini"
          type="primary"
          @click="$router.push(`/PatrolDetail/${patrolType}/0`)"
        >
          +新增巡查轨迹
        </van-button>
        <div v-else>{{ userInfo.creationTime }}</div>
      </van-cell>

      <!--巡查轨迹点list-->
      <div v-if="list.length">
        <van-cell title>
          <div slot="label">有效轨迹点{{ list.length }}个，发现{{hasQusetion}}个问题，现场解决{{hasDel}}个问题</div>
        </van-cell>
        <van-steps direction="vertical" :active="list.length" class="patrol-record-steps">
          <van-step v-for="(item, index) in list" :key="index">
            <van-panel  class="patrol-record-panel">
              <van-cell
                slot="header"
                :label="`巡查地点：${item.patrolAddress}`"
                :title="item.creationTime"
              >
                <div :style="{ color: $store.state.getStatusColor[item.patrolStatus]}">{{ $store.state.getStatus[item.status] }}</div>
              </van-cell>
              <div class="patrol-record-steps-info">
                <!--语音/备注-->
                <describe-qusetion  
                  :isEdit="1" :time="item.voiceLength" 
                  :voice="item.problemVoiceUrl" 
                  :content="item.problemRemark"
                ></describe-qusetion>
      
                <!--                照片-->
                <div>
                  <shot-photo
                    slot="label"
                    :disabled="1"
                    :truePhoto="item.truePhoto"
                    v-model="item.base64photoList"
                  ></shot-photo>
                </div>
              </div>
            </van-panel>
            <!--            删除-->
            <van-icon
              v-if="(userInfo.patrolStatus == 4 || userInfo.state == 4 )"
              class="patrol-record-steps-i"
              name="clear"
              @click="deleteStep(index,item.patrolDetailId)"
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
    <div class="btn_div" v-if="list.length && (userInfo.patrolStatus === 4 || userInfo.state === 4)">
        <base-button @click="submit" >提交</base-button>
        <base-button class="delete_btn" @click="deletelist" >删除</base-button>
    </div>

    
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/7/9 14:29
 *  1,常量从js文件引入，不要定义魔术变量
 */
import DescribeQusetion from "../../components/DescribeQusetion";
import ShotPhoto from "../../components/ShotPhoto";
import { Toast } from "vant";
import Vue from "vue";
Vue.use(Toast);
export default {
  name: "PatrolRecord",
  components: {
    DescribeQusetion,
    ShotPhoto
  },
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
      voicebase64: [],
      base64photoList:[],//缩率图
      truePhoto:[],//真实图片
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getType();
    // console.log("this.$route.query;",this.$route.query)
    this.userInfo = this.$route.query;
    this.id = +this.$route.params.id;
    this.id ? this.getList() : " "
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
      this.$axios
        .get(this.$api.GetPatrolInfo, {
          params: { patrolId : this.id }
        })
        .then(res => {
          if (res.success) {
            console.log("巡查轨迹详情list", res.result);
            this.getNum(res.result.patrolDetailList);
            this.userInfo = res.result
            this.userInfo.creationTime = this.dealTime(this.userInfo.creationTime)
            this.list = res.result.patrolDetailList;
            localStorage.setItem('PatrolId',res.result.patrolId)
            for(let arr of  this.list){
              arr.creationTime = this.dealTime(arr.creationTime)
              arr.base64photoList =[]
              arr.truePhoto=[]
                //语音
                if(arr.problemVoiceUrl){
                  arr.problemVoiceUrl = `${this.$url}${arr.problemVoiceUrl}`
                }
                //缩略图
                if (arr.patrolPhotosBase64.length>0) {
                  for (let i in arr.patrolPhotosBase64) {
                    arr.base64photoList.push(
                      `data:image/;base64,${arr.patrolPhotosBase64[i]}`
                    );
                  }
                }
                //真实图
                if(arr.patrolPhtosPath){
                  if (arr.patrolPhtosPath.length) {
                    for (let i in arr.patrolPhtosPath) {
                      arr.truePhoto.push(
                        `${this.$url}${arr.patrolPhtosPath[i]}`
                      );
                    }
                  }
                }
            }
          }
        });
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
              // console.log("语音文件对象", file);
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
    dealTime(data){
      var str = data.split('T');
      var str2 = str[1].split(".")
      var timestr = str[0] +" "+ str2[0]
      return timestr;
    },

    // 删除某一项
    deleteStep(index,id) {
      this.list.splice(index, 1);
      this.$axios.delete(this.$api.DeletePatrolDetail,{params:{patrolDetailId:id}}).then(res=>{
        // console.log("删除某一个轨迹点成功",res)
      }).catch(err=>{
        // console.log("删除某一个轨迹点失败",err)
      })
    },
    // todo 新建一个巡查对象，然后返回ID，再依次添加数据
    submit() {
      let param = new FormData();
      param.append("patrolId", this.userInfo.patrolId);
      // console.log("提交总记录",this.userInfo.patrolId)
      Toast.loading({
        duration: 0,
        mask: true,
        message: "提交中"
      });
      this.$axios.post(this.$api.SubmitPatrol, param).then(res => {
        // console.log("提交回馈", res);
        localStorage.removeItem('PatrolId')
        Toast.clear();
        this.$router.push({
          name:'patrol',
          params:{
            active:1
          }
        })
      });
    },
    //删除
    deletelist(){
      this.$axios.delete(this.$api.DeletePatrol,{params:{patrolId:this.userInfo.patrolId}}).then(res=>{
        // console.log("删除数成功",res)
        localStorage.removeItem('PatrolId')
        this.$router.push({
          name:'patrol',
          params:{
            active:1
          }
        })
      })
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
    &-i:nth-of-type(2) {
      position: absolute;
      right: 4px;
      top: 60px;
      font-size: 16px;
      color:rgb(10, 163, 10);
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
  .btn_div{
    display: flex;
    box-sizing: border-box;
    .base-button{
      width: 50%; 
     
    }
    .delete_btn{
      .van-button{

        border-color: #aeadad;
        background: #aeadad;
      }
        
    }
  }
}
</style>
