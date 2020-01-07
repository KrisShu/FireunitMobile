<template>
  <div>
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect"></van-action-sheet>
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/7/8 11:30
 *  1,常量从js文件引入，不要定义魔术变量
 */
export default {
  name: "BasePhoto",
  components: {},
  model: {
    prop: "base64list",
    event: "change"
  },
  props: {
    // list: Array,
    base64list: Array
  },
  data() {
    return {
      show: false,
      actions: [{ name: "拍照" }, { name: "相册中选取" }],
      dataURL: ""
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //  todo 类型选择、0-拍照、2-图库中选择
    onSelect(item, index) {
      this.show = false;
      console.log(item, index);
      index ? this.getPhoto() : this.Photograph();
    },
    //    todo 拍照
    Photograph() {
      let that = this;
      let cmr = plus.camera.getCamera();
      let res = cmr.supportedImageResolutions[10];
      let fmt = cmr.supportedImageFormats[0];
      console.log("Resolution: " + res + ", Format: " + fmt);
      console.log( "cmr.supportedImageResolutions : ",cmr.supportedImageResolutions);
      cmr.captureImage(
        function(path) {
          // todo 获取拍照后的真实地址
          plus.io.resolveLocalFileSystemURL(
            path,
            function(entry) {
              //2019/12/26-------------------要加水印版
              // that.list.push(entry.fullPath)
              var imgSrc = entry.toLocalURL();
              that.getBase64(imgSrc);

              //2019/11/16-------------------不加水印版
              /* that.list.push(entry.fullPath); //正常图片路径
              var imgSrc = entry.toLocalURL();
              that.base64list.push(imgSrc);
              that.$emit("update:base64list", that.base64list) ; */
            },
            function(e) {
              console.log(e.message);
            }
          );
        },
        function(error) {
          console.log("Capture image failed: " + error.message);
        },
        { resolution: res, format: fmt }
      );
    },

    //    todo 相册中选取
    getPhoto() {
      let that = this;
      plus.gallery.pick(
        function(path) {
          
          that.getBase64(path);

          //2019/11/6--------------- 2020/1/2暂停使用
         /*  that.list.push(path); //正常图片路径
          that.base64list.push(path);
          that.$emit("update:base64list", that.base64list); */
        },
        function(e) {
          console.log("取消选择图片");
        },
        { filter: "image" }
      );
    },

    //  todo 将照片转码成base64加上时间水印再转换为文件
    getBase64(url) {
        let that = this;
        let canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        MAX_WH = 800,
        fontSize,
        image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = function() {
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
          let time = that.getCurrnetTime("timeSign");
          console.log("打印时间水印", time);
          ctx.textAlign = "end";
          ctx.textBaseline = "middle";
          ctx.fillText(time, canvas.width - 20, canvas.height - 60);
          let dataURL = canvas.toDataURL("image/png/jpg");
          that.base64list.push(dataURL);
          // that.$emit("update:base64list", that.base64list);
          that.$emit('change',that.base64list)
        };
      image.src = url;
    },
    //获取当前时间
    getCurrnetTime(flga) {
      // ----------2019/11/6暂停使用--------------
      //----------2019/12/26开启使用--------------
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
    }
  }
};
</script>

<style lang="scss"></style>
