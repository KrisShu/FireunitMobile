<template>
  <div class="fireneteork_box">
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
            {{scope.item.deviceSn}}
          </span>
          <span>
            <i>所在建筑：</i>
            {{scope.item.fireUnitArchitectureName}}
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
        </p>
        <p class="display_p">
          <span>
            <i>联网部件数量：</i>
            {{scope.item.netDetectorNum}}
          </span>
        </p>
        <p class="display_p">
          <span  @click="gotodetails('故障部件数量',scope.item)">
            <i>故障部件数量：</i>
            {{scope.item.faultDetectorNum}}
            <van-icon  name="search" color="#1989fa" />
          </span>
          <span>
            <i>故障部件率：</i>
            {{scope.item.detectorFaultRate}}
          </span>
        </p>
        <p class="display_p">
          <span @click="gotodetails('30天火警数量',scope.item)">
            <i>30天火警数量：</i>
            {{scope.item.alarmNum30Day}}
            <van-icon  name="search" color="#1989fa" />
          </span>
          <span @click="gotodetails('高频部件数量',scope.item)">
            <i>高频部件数量：</i>
            {{scope.item.highAlarmDetectorNum}}
            <van-icon  name="search" color="#1989fa" />
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
        fireUnitId: '',
        total: 0
      }
    };
  },
  created(){
    let setUserInfo = JSON.parse(localStorage.getItem('setUserInfo')) 
    this.page.fireUnitId = setUserInfo.fireUnitID
  },
  methods: {
    gotodetails(text,item) {
      console.log("text",text,item)
      this.$router.push({
        path:"/fireneteorkDetails",
        query:{
          basenavtitle:text,
          id:item.deviceId,
          deviceSn:item.deviceSn,
          fireUnitArchitectureName:item.fireUnitArchitectureName,
        }
      });
    },
    getList(success) {
      let x = arguments[0] instanceof Object;
      let p = this.page;
      if (!x) {
        p.SkipCount = 0;
        this.tableList = [];
      }
      this.$axios
        .get(this.$api.GetFireAlarmDeviceList, {
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
  .fireneteork_box{
    padding: 12px;
    .van-cell-group{
      background: #F8F8F8;
      .van-cell{
        margin-bottom: 10px;
        border-radius: 8px;
        border: 1px solid white;
        background: rgb(232, 239, 255);
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
