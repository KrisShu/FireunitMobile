<template>
  <div class="fault-index">
    <van-tabs
      color="#0385fe"
      class="fault-index-tabs"
      v-model="active"
      swipeable
    >
      <van-tab title="待处理"><index-tem :active="active"></index-tem></van-tab>
      <van-tab title="自行处理中"><index-tem :active="active"></index-tem></van-tab>
      <van-tab title="维保处理中"><index-tem :active="active" :special="special"></index-tem></van-tab>
      <van-tab title="已解决"><index-tem :active="active"></index-tem></van-tab>
    </van-tabs>
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/6/27 14:00
 *  1,常量从js文件引入，不要定义魔术变量
 */
import IndexTem from "./IndexTem";
export default {
  name: "index",
  components: {
    IndexTem
  },
  props: {},
  data() {
    return {
      active: 0,
      special:'',
      info: {}
    };
  },
  computed: {},
  watch: {},
  created() {
    // console.log("路由参数",this.$route.params)
    this.active = +this.$route.params.active
    this.special = +this.$route.params.special
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss">
.fault-index {
  &-tabs {
    .van-tabs__wrap {
      z-index: 0;
    }
  }
}
</style>
