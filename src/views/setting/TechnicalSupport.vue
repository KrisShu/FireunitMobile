<template>
  <div class="tec-sup">
    <base-nav title="技术支持"></base-nav>
    <img width="100%" src="../../assets/site_img_09.png" />
    <van-cell-group>
      <van-cell title="技术支持电话：15881199975" icon="location-o">
        <img
          class="tec-sup-img"
          slot="icon"
          src="../../assets/site_img_07.png"
        />
        <a href="tel:15881199975">
          <img width="24px" src="../../assets/site_btn_boda.png" />
        </a>
      </van-cell>
      <van-cell
        title="我要提建议"
        icon="location-o"
        is-link
        @click="$router.push('/AddAdvice')"
      >
        <img
          class="tec-sup-img"
          slot="icon"
          src="../../assets/site_img_08.png"
        />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/7/2 10:01
 *  1,常量从js文件引入，不要定义魔术变量
 */
export default {
  name: "TechnicalSupport",
  components: {},
  props: {},
  data() {
    return {
      form: {}
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss">
.tec-sup {
  .van-cell__value{
    height: 24px;
  }
  .van-cell {
    display: flex;
    align-items: center;
  }
  .van-cell__title {
    flex: 2 0 auto;
    display: flex;
    align-items: center;
  }
  &-img {
    width: 22px;
    height: 24px;
    padding-right: 5px;
  }
}
</style>
