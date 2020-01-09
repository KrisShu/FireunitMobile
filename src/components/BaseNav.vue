<template>
  <van-nav-bar
    class="base-nav"
    :title="title"
    :left-arrow="showLeft"
    :right-text="rightText"
    @click-left="routerBack"
    @click-right="$emit('onClickRight')"
  >
    <slot name="rightText" slot="right"></slot>
  </van-nav-bar>
</template>

<script>
/**
 *  作者：0          时间：2019/7/2 14:41
 *  1,常量从js文件引入，不要定义魔术变量
 */
export default {
  name: "Base",
  components: {},
  props: {
    title: {
      type: String,
      default: "标题"
    },
    rightText: {
      type: String,
      default: ""
    },
    showLeft: {
      type: Boolean,
      default: true
    },
    active:'',
    special:''
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    routerBack(){
      console.log("路径跳转",this.active,this.title)
      if(this.title == '设施故障处理中' ||this.title == '自行处理'   ||this.title == '维保叫修'|| this.title == '设置故障已解决'){
        if(this.title == '维保叫修'){
          console.log("have路径跳转",this.special)
          if(this.special == 5){
            this.$router.push({
              name:'fault',
              params:{
                active:this.active,
                special:this.special
              }
            })
          }
        }else{
          this.$router.push({
            name:'fault',
            params:{
              active:this.active
            }
          })
        }
        
        
      }else if(this.title == '值班记录' || this.title == '巡查记录'){
        console.log("sssss",this.active)
        this.$router.push({
          name:'patrol',
          params:{
            active:this.active
          }
        })
      }else{
        this.$router.back()
      }
    }
  }
};
</script>

<style lang="scss">
.base-nav {
  z-index: 999 !important;
  background-color: #0385fe;
  /*background: linear-gradient(to right, #0385fe, #039dfe);*/
  position: sticky;
  top: 0;
  & > div,
  i {
    color: #fff !important;
  }
  &::after {
    border-width: 0;
  }
  /*  右侧文字*/
  .van-nav-bar__text {
    color: #fff;
  }
}
</style>
