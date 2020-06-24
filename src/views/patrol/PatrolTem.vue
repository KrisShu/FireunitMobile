<template>
  <div class="patrol-tem">
    <!-- 值班巡查页面 -->
    <van-cell>
      <van-dropdown-menu slot="title">
        <van-dropdown-item
          title="记录状态"
          @change="getList"
          v-model="page[table[active].pageName]"
          :options="actions"
        ></van-dropdown-item>
      </van-dropdown-menu>
      <van-button size="mini" icon="plus" type="primary" @click="addList">
        新增
      </van-button>
    </van-cell>
    <!-- 当active为1时是巡查记录页面且存在未提交的巡查记录显示状态为未提交 -->
    <!-- <div
      @click="gotoAdd"
      class="nosubmitBox van-hairline--top"
      v-if="active && $store.state.patrolArray.length > 0"
    >
      <p>
        <span>{{ $store.state.userInfo.name }}</span>
        <span class="status">未提交</span>
      </p>
    </div> -->
    <!-- 值班记录和巡查记录的列表 当active为1时是巡查记录-----当active为0时是值班记录 -->
    <base-list
      :table-list="table[active].tableList"
      :table-name="table[active].tableName"
      @onLoad="getList"
      @cellClick="getDetail"
      @refresh="getList"
    >
    </base-list>
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/7/2 09:12
 *  1,常量从js文件引入，不要定义魔术变量
 */
export default {
  name: "PatrolTem",
  components: {},
  props: {
    // todo 当前激活的选项
    active: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      table: [
        // 值班记录
        {
          tableName: {
            ids: "patrolduty",
            title: "dutyUserName",
            label: "creationTime",
            value: "dutyStatus"
          },
          listName: "dutyList",
          pageName: "DutyStatus",
          tableList: []
        },
        //巡查记录
        {
          tableName: {
            ids: "patrolduty",
            title: "userName",
            label: "creationTime",
            value: "patrolStatus"
          },
          listName: "patrolList",
          pageName: "PatrolStatus",
          tableList: []
        }
      ],
      actions: [
        {
          text: "全部",
          value: 0
        },
        {
          text: "正常 ",
          value: 1,
          className: "normal"
        },
        {
          text: "故障（已解决）",
          value: 2,
          className: "handle"
        },
        {
          text: "故障（未解决）",
          value: 3,
          className: "notHandle"
        }
      ],
      page: {}
    };
  },
  computed: {},
  watch: {},
  created() {
    this.page.FireUnitId = this.$store.state.userInfo.fireUnitID;

    // console.log("dddddddddddddddddd", this.$store.state.patrolArray);
  },
  mounted() {},
  methods: {
    // todo 获取中文字段、获取class+
    // eslint-disable-next-line no-unused-vars
    getStatus(val, label = "text") {
      // let x = this.actions.find(item => {
      //   return item.value === val[this.table[this.active].tableName.value];
      // });
      // return x ? x[label] : "";

      return 1;
    },
    //  todo 获取list、值班记录、巡查记录
    getList(success) {
      let x = arguments[0] instanceof Object;
      let p = this.page;
      let list = this.table[this.active];
      if (!x) {
        p.SkipCount = 0;
        list.tableList = [];
      }
      let url = this.active ? "GET_PATROL_LIST" : "GET_DUTY_LIST";
      this.$axios
        .get(this.$api[url], {
          params: p
        })
        .then(res => {
          console.log("res", res);
          if (res.success) {
            if (res.result.items.length > 0) {
              for(let arr of res.result.items){
                arr.creationTime = this.deal(arr.creationTime)
              }
              list.tableList = list.tableList.concat(res.result.items);
            }
            x ? success(list.tableList.length, res.result.totalCount, p) : "";
          }
        });
    },
    //时间处理
    deal(data){
        var str = data.split('T');
        var str2 = str[1].split(".")
        var timestr = str[0] +" "+ str2[0]
        return timestr;
    },

    //    todo 获取详情、编辑、查看
    getDetail(val) {
      console.log("获取详情、编辑、查看",val)
      val.active = this.active;
      let u = `./${this.active ? "PatrolRecord" : "DutyRecord"}/${this.active ? val.patrolId : val.dutyId}`;
      this.$router.push({
        path: u,
        query: val
      });
    },
    // todo 新增
    addList() {
      let u = `./${this.active ? "PatrolRecord" : "DutyRecord"}/0`;
      if (this.active) {
        //新增巡查记录
        /* if (this.$store.state.patrolArray.length > 0) {
          this.$toast("存在未提交的巡查记录，请提交后再新增");
        } else {
          let data = this.$store.state.userInfo.fireUnitID;
          this.$axios
            .get(this.$api.GET_ADD_ALLOW, { params: { FireUnitId: data } })
            .then(res => {
              if (res.result.success) {
                this.$router.push(u);
              } else {
                this.$toast(res.result.failCause);
              }
            });
        } */
          //是否能新增
          let data = this.$store.state.userInfo.fireUnitID;
          this.$axios
            .get(this.$api.GET_ADD_ALLOW, { params: { fireUnitId: data } })
            .then(res => {
              if (res.result.success) {
                this.$router.push(u);
              } else {
                this.$toast(res.result.failCause);
              }
            });

      } else {
        this.$router.push(u);
      }
    },
    /*jst 未提交的新增 */
    gotoAdd() {
      let u = `./${this.active ? "PatrolRecord" : "DutyRecord"}/0`;
      this.$router.push(u);
    }
  }
};
</script>

<style lang="scss">
.patrol-tem {
  /*下拉框*/
  .van-dropdown-menu {
    height: 22px;
    &:after {
      border-width: 0;
    }
    .van-dropdown-menu__item {
      justify-content: left;
      & > span::after {
        top: 8px;
      }
    }
    .van-dropdown-item--down {
      top: 135px !important;
    }
  }
  & > :nth-child(1) {
    &::after {
      border-width: 0;
    }
  }
  /*正常*/
  .normal {
    color: #67c23a;
  }
  /*已解决正常*/
  .handle {
    color: #67c23a;
  }
  /*未解决*/
  .notHandle {
    color: #e6a23c;
  }

  /* jst */
  .nosubmitBox {
    padding: 10px 18px;
    background: rgb(255, 255, 255);
    p {
      line-height: 0;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      span.status {
        color: red;
      }
    }
  }
}
</style>
