<template>
  <div class="base-play-sound">
    <!--    播放button-->
    <van-button type="primary" size="small" @click="playVoice">
      <img
        v-if="!isplay"
        class="base-play-sound-img"
        alt=""
        src="../assets/zbxc_img_04.png"
      />
      <div v-else class="box">
        <div class="wifi-symbol">
          <div class="wifi-circle first"></div>
          <div class="wifi-circle second"></div>
          <div class="wifi-circle third"></div>
        </div>
      </div>
      <span v-if="!isEdit">{{ duration }}"</span>
      <span v-else>{{ time }}"</span>
    </van-button>

    <!--    删除按钮-->
    <van-icon v-if="!isEdit" name="clear" @click="deleteVoice"></van-icon>
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/7/8 17:45
 *  1,常量从js文件引入，不要定义魔术变量
 */
export default {
  name: "BasePlaySound",
  components: {},
  model: {
    prop: "question",
    event: "change"
  },
  props: {
    question: Object, //用来向父组件传值、主要用来传递语音时间
    isEdit: Number, // 播放的状态
    voice: String, // 声
    time: Number,
    EditShow: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      player: Object,
      duration: "10.00",
      isplay: false
    };
  },
  computed: {},
  watch: {
    voice(val) {
      if (val) {
        this.createVoice();
      }
    }
  },
  created() {
    if (this.voice) {
      this.createVoice();
    }
  },
  mounted() {},
  methods: {
    createVoice() {
      console.log("isEdit状态", this.isEdit);
      this.player = plus.audio.createPlayer(this.voice); // 创建播放对象
      if (!this.isEdit) {
        setTimeout(() => {
          this.duration = this.player.getDuration(); // 获取音频的总长度 单位秒s
          if (this.duration < 1) {
            this.duration = 1;
          } else {
            this.duration = Math.round(this.duration);
          }
          this.question.duration = this.duration;
          console.log(
            "this.durationthis.duration---createVoice",
            this.duration
          );
        });
      }

      // todo 创建对象存在延迟、容易获取不到时长、单位为秒（s），返回值可能是小数，若长度未知则返回-1。 如果还未获取到音频流信息则返回NaN，此时需要延迟获取。
    },
    /**
     * @fileOverview 播放语音、显示语音秒数、和实时进度
     */
    playVoice() {
      let that = this;
      this.player = plus.audio.createPlayer(this.voice);
      console.log("语音地址：" + this.voice);
      let p = this.player;
      this.isplay = true;
      p.play(
        function() {
          that.$toast("播放完毕");
          that.isplay = false;
        },
        function(e) {
          that.$toast(e.message);
        }
      );
    },
    /**
     * @fileOverview 删除当前声音对象
     */
    deleteVoice() {
      console.log("关闭语音");
      this.player.stop();
      this.voice = "";
      this.$emit("update:voice", this.voice);
    }
  }
};
</script>

<style lang="scss">
.base-play-sound {
  .van-button--small {
    min-width: 86px;
    height: 32px;
  }
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

  .box {
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    position: relative;
  }
  .wifi-symbol {
    width: 30px;
    height: 30px;
    box-sizing: border-box;
    overflow: hidden;
    transform: rotate(135deg);
  }
  .wifi-circle {
    border: 2px solid #000000;
    border-radius: 50%;
    position: absolute;
  }

  .first {
    width: 2px;
    height: 2px;
    background: #cccccc;
    top: 27px;
    left: 27px;
  }

  .second {
    width: 12px;
    height: 12px;
    top: 21px;
    left: 21px;
    animation: fadeInOut 1s infinite 0.2s;
  }

  .third {
    width: 26px;
    height: 26px;
    top: 14px;
    left: 14px;
    animation: fadeInOut 1s infinite 0.4s;
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0; /*初始状态 透明度为0*/
    }
    100% {
      opacity: 1; /*结尾状态 透明度为1*/
    }
  }
}
</style>
