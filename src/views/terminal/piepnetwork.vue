<template>
  <div class="piepnetwork_box">
    <base-list
      @onLoad="getList"
      @refresh="getList"
      :mostlist="false"
      :tableList="tableList"
    >
      <div class="slot_content" slot-scope="scope" slot="content">
        <p class="display_p">
          <span>
            <i>设施编号：</i>
            {{scope.item.gateway_Sn}}
          </span>
          <span v-if="scope.item.monitorType == 1">
            <i>监控类型：</i>
            水压
          </span>
          <span v-if="scope.item.monitorType == 2">
            <i>监控类型：</i>
            液位
          </span>
        </p>
        <p class="display_p">
          <span>
            <i>安装位置：</i>
            {{scope.item.location}}
          </span>
        </p>
        <p class="display_p">
          <span>
            <i>设施状态：</i>
            <i class="gary" v-if="scope.item.state == -1">离线</i>
            <i class="green" v-if="scope.item.state == 1">在线</i>
            <i class="green" v-if="scope.item.state == 2">良好</i>
            <i class="red"  v-if="scope.item.state == -2">超限</i>
            <i class="yellow" v-if="scope.item.state == -3">隐患</i>
          </span>
          <span>
            <i>当前监测值：</i>
            {{scope.item.currentValue}}
          </span>
        </p>
      </div>
    </base-list>
  </div>
</template>

<script>
export default {
  data(){
    return {
      tableList: [],
      page: {
        fireUnitId:'',
        // total: 0
      }
    };
  },
  created(){
    let setUserInfo = JSON.parse(localStorage.getItem('setUserInfo')) 
    this.page.fireUnitId = setUserInfo.fireUnitID
  },
  methods: {
    getDetail() {},
    getList(success) {
      let x = arguments[0] instanceof Object;
      let p = this.page;
      if (!x) {
        p.SkipCount = 0;
        this.tableList = [];
      }
      this.$axios
        .get(this.$api.GetFireWaterDeviceList, {
          params: p
        })
        .then(res => {
          this.tableList = this.tableList.concat(res.result.items);
          p.total = res.result.totalCount;
          x ? success(this.tableList.length, res.result.totalCount, p) : "";
        });
    }
  }
};
</script>

<style lang="scss">
  .piepnetwork_box{
    padding: 12px;
    .van-cell-group{
      background: #F8F8F8;
      .van-cell{
        margin-bottom: 10px;
        border-radius: 8px;
        background: rgb(232, 239, 255);
        border: 1px solid white;
        .slot_content{
         .display_p{
           display: flex;
           justify-content: space-between;
            span{
                display: inline-block;
            }
            i{
                font-style:normal;
                font-weight: bold;
                &.gary{
                    color: #cccccc;
                }
                &.green{
                    color: #07c160;
                }
                &.yellow{
                    color: #ff976a;
                }
                &.red{
                    color: #ee0a24;
                }
            }
         }
        }
      }
      
    }
    
  }
  
</style>
