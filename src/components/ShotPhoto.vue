<template>
  <div>
    <div class="shot-photo">
      <div class="shot-photo-img" v-if="!disabled && photoList.length < 3">
        <img @click="openPhoto" src="../assets/zbxc_btn_paizhao.png" />
      </div>

      <div v-for="(item, index) in photoList" :key="index">
        <van-image
          width="100px"
          height="90px"
          @click="previewPic(index)"
          :src="item"
          fit="cover"
        ></van-image>
        <van-icon
          v-if="!disabled"
          name="clear"
          @click="deleteimg(index)"
        ></van-icon>
      </div>
    </div>
    <!--    todo 图片上传方式-->
    <!-- 暂停使用 -->
    <!-- <base-photo ref="BasePhoto" :base64list.sync="base64list" v-model="photoList" ></base-photo> -->
    <base-photo ref="BasePhoto"  v-model="photoList" ></base-photo>
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/7/16 10:24
 *  1,常量从js文件引入，不要定义魔术变量
 */
import { ImagePreview } from "vant";
import Vue from "vue";

Vue.use(ImagePreview);
export default {
  name: "ShotPhoto",
  components: {},
  model: {
    prop: "photoList",
    event: "change"
  },
  props: {
    photoList: Array,
    // 是否是只读
    disabled: {
      type: Number,
      default: 0
    },
    truePhoto:Array,
    base64list:Array
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {
   console.log("disabled",this.disabled)
  },
  mounted() {},
  methods: {
    // todo 打开图片选取
    openPhoto() {
      let that = this;
      this.setBackButton(function() {
        that.$refs.BasePhoto.show = false;
      });
      this.$refs.BasePhoto.show = true;

      console.log("this.photoList,",this.photoList)
    },
    //    todo 图片预览
    previewPic(index) {
      console.log("this.disabled",this.disabled)
      if(this.disabled && this.disabled !==2){
        console.log("展示后端返回的真实图片")
         let instance = ImagePreview({
          images: this.truePhoto,
          startPosition: index,
          closeOnPopstate: true
        });
        this.setBackButton(function() {
          instance.close();
        });
      }else{
        console.log('直接展示的图片')
        let instance = ImagePreview({
          images: this.photoList,
          startPosition: index,
          closeOnPopstate: true
        });
        this.setBackButton(function() {
          instance.close();
        });
      }
    
     
    },
    deleteimg(index){
      this.photoList.splice(index,1)
      // this.base64list.splice(index,1)
    }
  }
};
</script>

<style lang="scss">
.shot-photo {
  display: grid;
  grid-template-columns: repeat(3, 33%);
  &-img {
    height: 100px;
    img {
      width: 100px;
      height: 60px;
      margin: auto;
    }
  }

  & > div {
    display: flex;
    justify-content: center;
    /*删除*/
    & > :nth-child(2) {
      left: -10px;
      top: -8px;
      font-size: 18px;
      position: relative;
      color: #909399;
    }
  }
}
</style>
