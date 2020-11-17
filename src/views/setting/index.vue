<template>
  <div>
    <van-cell-group>
      <van-cell
        @click="toNext(item.router, index)"
        v-for="(item, index) in setList"
        :key="index"
        :title="item.label"
        :value="item.content"
        is-link
      >
        <img
          slot="icon"
          :width=item.width
          height="20px"
          style="margin-right: 10px"
          :src="item.icon"
          alt=""
        />
        <template v-if="dotshow && item.label == '系统更新'" #default>
          <img class="dot_iocn" src="../../assets/dot.png" alt="">
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/6/27 14:02
 *  1,常量从js文件引入，不要定义魔术变量
 */
export default {
  name: "index",
  components: {},
  props: {},
  data() {
    return {
      setList: [
        {
          icon: require("../../assets/site_img_01.png"),
          label: "引导设置",
          router: "/AddWorker",
          width:'18px'
        },
        //2019/1/11暂停使用
        // {
        //   icon: require("../../assets/site_img_02.png"),
        //   label: "绑定设置编码",
        //   router: "/CodeList"
        // },
        {
          icon: require("../../assets/site_img_03.png"),
          label: "修改密码",
          router: "/ChangePassword",
          width:'18px'
        },
        {
          icon: require("../../assets/site_img_04.png"),
          label: "技术支持",
          content: "天树聚城市智慧消防",
          router: "/TechnicalSupport",
          width:'18px'
        },
        {
          icon: require("../../assets/update.png"),
          label: "系统更新",
          router: "/updateSystem",
          width:'22px'
        },
        {
          icon: require("../../assets/site_img_05.png"),
          label: "注销登录",
          router: "",
          width:'18px'
        }
      ],
      dotshow:false
     
    };
  },
  computed: {},
  watch: {},
  created() {
    this.checkVersion();
  },
  mounted() {},
  methods: {

    //  todo 跳转到相应的页面、或者注销
    toNext(rou, index) {
      rou ? this.$router.push(rou) : this.logOut();
    },
    //  todo 注销
    logOut() {
      let that = this;
      this.$dialog
        .confirm({
          title: "注销登录",
          message: "您是否要注销登录？"
        })
        .then(() => {
          this.$axios.post(this.$api.USER_LOGOUT).then(res => {
            if (res.success) {
              // localStorage.removeItem("isLogin");
              // localStorage.removeItem("setUserInfo");
              localStorage.clear();
              this.$router.push("login");
            }
          });
        }).catch(() => {});
      this.setBackButton(function() {
        that.$dialog.close();
      });
    },
    checkVersion(){
        this.$axios.get(this.$api.GetNewestVersion,{params:{AppType:2}}).then(res=>{
            console.log("res",res)
            let version =  localStorage.getItem('version');
            if(version !== res.result.versionNo){
              this.dotshow = true
            }
        })
    },
  }
};
</script>

<style lang="scss">

.ok{
  height: 200px;
  width: 400px;
  border: 2px solid darkblue;
  img{
    width: 100px;
    height: 100px;
    border: 1px solid red;
  }
  
}
.dot_iocn{
  width: 14px;
}
</style>
