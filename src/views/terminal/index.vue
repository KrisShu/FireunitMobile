<template>
  <div class="terminal-index">
    <van-tabs
      color="#0385fe"
      class="fault-index-tabs"
      v-model="active"
      swipeable
    >
      <van-tab title="火警联网">
        <firenetworking></firenetworking>
      </van-tab>
      <van-tab title="电气火灾">
        <electricfault></electricfault>
      </van-tab>
      <van-tab title="独立烟感">
        <smokesense></smokesense>
      </van-tab>
      <van-tab title="消防管网">
        <piepnetwork></piepnetwork>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/6/27 14:03
 *  1,常量从js文件引入，不要定义魔术变量
 */
import firenetworking from "./firenetworking";
import electricfault from "./electricfault";
import piepnetwork from "./piepnetwork";
import smokesense from './smokesense'
export default {
  name: "index",
  components: {
    firenetworking,
    electricfault,
    piepnetwork,
    smokesense
  },
  props: {},
  data() {
    return {
      active: 0
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss"></style>
