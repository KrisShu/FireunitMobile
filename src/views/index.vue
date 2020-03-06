<template>
  <div class="index">
    <!--    todo 头部-->
    <van-nav-bar>
      <div slot="left">
        <img src="../assets/ssgz_img_01.png" alt="" />
        <span style="margin-left: 5px">{{ $store.state.userInfo.name }}</span>
      </div>
      <div slot="right" class="righticon">
        <div @click="goto('firewaring')" class="righticonimg firewaring">
          <img  src="../assets/1.png" alt="" />
          <img v-if="firewaringred" class="red" src="../assets/redicon.png" alt="">
        </div>
        <div @click="goto('electric')" class="righticonimg electric">
          <img class="electric_2"  src="../assets/2.png" alt="" />
          <img v-if="Electricred" class="red" src="../assets/redicon.png" alt="">
        </div>
        <div @click="goto('ai')" class="righticonimg ">
          <img class="ai"  src="../assets/ai.png" alt="" />
          <img v-if="Electricred" class="red" src="../assets/redicon.png" alt="">
        </div>
        <div @click="goto('piep')" class="righticonimg piep">
          <img  src="../assets/3.png" alt="" />
          <img v-if="Waterred" class="red" src="../assets/redicon.png" alt="">
        </div> 
      </div>
    </van-nav-bar>

    <!--    todo 内容-->
    <router-view />

    <!--      todo 底部导航栏-->
    <van-tabbar v-model="active">
      <van-tabbar-item
        v-for="(item, index) in tabBars"
        :key="index"
        replace
        :to="item.router"
      >
        <span>{{ item.label }}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? item.active : item.normal"
        />
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/6/27 12:02
 *  1,常量从js文件引入，不要定义魔术变量
 */
export default {
  name: "index",
  components: {},
  props: {},
  data() {
    return {
      active: 0,
      tabBars: [
        {
          label: "设施故障",
          active: require("../assets/ssgz_btn_blue01.png"),
          normal: require("../assets/ssgz_btn_gray01.png"),
          router: "fault"
        },
        {
          label: "值班巡查",
          active: require("../assets/ssgz_btn_blue02.png"),
          normal: require("../assets/ssgz_btn_gray02.png"),
          router: "patrol"
        },
        {
          label: "物联终端",
          active: require("../assets/ssgz_btn_blue03.png"),
          normal: require("../assets/ssgz_btn_gray03.png"),
          router: "terminal"
        },
        {
          label: "我的设置",
          active: require("../assets/ssgz_btn_blue04.png"),
          normal: require("../assets/ssgz_btn_gray04.png"),
          router: "setting"
        }
      ],
      Waterred:false,
      Electricred:false,
      firewaringred:false,

    };
  },
  computed: {
   
  },
  watch: {},
  created() {
    console.log("this.$route.meta.active",this.$route.meta.active)
    this.active = this.$route.meta.active;
    this.GetNoReadAlarmNumList();
  },
  mounted() {},
  methods: {
    GetNoReadAlarmNumList(){
      let fireUnitId = this.$store.state.userInfo.fireUnitID;
      this.$axios.get(this.$api.GetNoReadAlarmNumList,{params:{fireUnitId}}).then(res=>{
        console.log("获取三个状态",res)
        if(res.result[0].noReadAlarmNum>0){
          this.firewaringred = true
        }
        if(res.result[1].noReadAlarmNum>0){
          this.Electricred  = true
        }
        if(res.result[2].noReadAlarmNum>0){
          this.Waterred   = true
        }
      }).catch(err=>{
        console.log("获取三个状态失败",err)
      })
    },
    goto(path){
      console.log("path",path)
      this.$router.push({
        path:path
      })
    }
  }
};
</script>

<style lang="scss">
.index {
  .righticon{
    display: flex;
    align-items: center;
    padding-bottom: 0px;
    .righticonimg{
      position: relative;
      width: 40px;
      height: 30px;
      // border: 1px solid darkcyan;
      .red{
        position: absolute;
        top: -6px;
        left: 18px;
      }
      .electric_2{
        width: 32px;
        height: 26px;
      }
      .ai{
        width: 30px;
        height: 26px;
      }
    }
   
  }
  .van-nav-bar{
    line-height: 32px;
  }
  & > :first-child {
    color: #fff;
    /*background: linear-gradient(to right, #0385fe, #039dfe);*/
    background-color: #0385fe;
    position: sticky;
    top: 0;
    img{
      width: 20px;
    }
    &::after {
      border-width: 0;
    }
  }
}
</style>
