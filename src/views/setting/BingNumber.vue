<template>
  <div class="bing-number">
    <div>
      <base-nav title="绑定设施编号"></base-nav>
      <base-form
        :form="form"
        :form-list="formList"
        @codeInfo="setCode"
      ></base-form>

      <van-cell title="设施所属消防系统（单选）">
        <van-radio-group slot="label"  v-model="form.fireSystemId">
          <van-cell-group>
            <van-cell
              @click="toggle(item)"
              v-for="(item, index) in unitList"
              :key="index"
              :title="item.fireSystemName"
              clickable
            >
              <van-radio slot="right-icon" :name="item.fireSystemID"></van-radio>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </van-cell>
    </div>

    <base-button @click="submit">提交</base-button>
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/7/2 09:57
 *  1,常量从js文件引入，不要定义魔术变量
 */
export default {
  name: "BingNumber",
  components: {},
  props: {},
  data() {
    return {
      id: 0,
      fireSystemName:'',
      form: {
        equiNo: "",
          fireUnitId: this.$store.state.userInfo.fireUnitID
      },
      formList: [
        {
          label: "设施编码",
          remind: "输入或扫描设施编码",
          value: "equiNo",
          mySolt: "scan"
        },
        {
          label: "具体位置",
          remind: "请输入具体位置",
          value: "address"
        }
      ],
      unitList: [],
      radio:"1"
    };
  },
  computed: {},
  watch: {},
  created() {
    console.log("新增切修改",this.$route.query);
    this.id = +this.$route.params.id;
    let f = this.$route.query;
    if (this.id) {
      console.log("f滴定仪",f)
      this.form.equiNo = f.equiNo;
      this.form.address = f.address;
      this.form.id = f.id;
      this.form.opreation = 1; // 0-删除，1-修改
      this.fireSystemId = f.fireSystemId
      this.fireSystemName = f.fireSystemName
    }
     this.getUnit(this.fireSystemName);
      console.log("this.form.fireSystemId",this.form.fireSystemId)
     
  },
  mounted() {},
  methods: {
    setCode(val) {
      this.form.equiNo = val;
    },
    toggle(item) {
      this.$set(this.form, "fireSystemId", item.fireSystemID);
      /* this.form.fireSystemId =item.id
      console.log("this.form.fireSystemId",this.form.fireSystemId) */
    },
    //  todo 获取消防系统
    getUnit(fireSystemName) {
      console.log("fireSystemName",fireSystemName)
      let data={
        FireUnitID :this.$store.state.userInfo.fireUnitID
      }
      console.log("this.$store.state.userInfo.fireUnitID",this.$store.state.userInfo.fireUnitID)
      this.$axios.get(this.$api.GetFireUnitSystem,{params:data}).then(res => {
        if (res.success) {
          console.log("获取设施编号列表",res.result)
          this.unitList = res.result;
          for(let arr of  this.unitList ){
            if(arr.fireSystemName == fireSystemName){
              this.$set(this.form, "fireSystemId", arr.fireSystemID);
            }
          }
        }
      });
    },
    //  todo 提交
    submit() {//this.id为0为新增数据，其他数据为修改数据
      console.log("提交状态",this.id,this.form)
      let a = this.id
        ? this.$axios.put(this.$api.UPDATE_EQUIPMENTNO_INFO, this.form)
        : this.$axios.post(this.$api.ADD_EQUIPMENT_NO, this.form);
      a.then(res => {
        if (res.success) {
          if (res.result.success) {
            this.$toast.success("绑定成功！");
            this.$router.back();
          } else {
            this.$toast.fail(res.result.failCause);
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "../../style/app";
.bing-number {
  background-color: #fff;
  @include my-flex();
}
</style>
