<template>
  <div class="fireneteork_box">
    <div class="top_screen">
       <van-button  
        v-for="item in buttonarr"
        :key="item.text"
        plain
        :type="item.type"
        @click="screen(item.text)"
       >
            <van-icon v-if="screensign == item.text" name="star" />
            {{item.text}}
            {{item.num}}

        </van-button>
    </div>
    <base-list
      @onLoad="getList"
      @refresh="getList"
      :mostlist="false"
      :tableList="tableList"
      ref="baselist"
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
      buttonarr:[
          {
              type:'info',
              text:'全部'
          },
          {
              type:'primary',
              text:'在线',
              num:0
          },
          {
              type:'default',
              text:'离线',
              num:0
          },
      ],
      screensign:'全部',
      tableList: [],
      page: {
        fireUnitId: '',
        total: 0
      }
    };
  },
  created(){
    let setUserInfo = JSON.parse(localStorage.getItem('setUserInfo')) 
    this.page.fireUnitId = setUserInfo.fireUnitID;
    this.GetFireAlarmDeviceStateNum();
  },
  methods: {
    //获取状态数量
    GetFireAlarmDeviceStateNum(){
      this.$axios.get(this.$api.GetFireAlarmDeviceStateNum,{params:this.page}).then(res=>{
          this.buttonarr[1].num = res.result[0].value
          this.buttonarr[2].num = res.result[1].value
      })
    },
    //筛选状态
    screen(text){
       this.screensign = text;
       this.page.DeviceState = text;
       this.getList();
    },
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
    //获取列表
    getList(success) {
      let x = arguments[0] instanceof Object;
      let p = this.page;
      if (!x) {
        p.SkipCount = 0;
        this.tableList = [];
        this.$refs.baselist.loading = true;
        this.$refs.baselist.finished = false;
      }
      this.$axios.get(this.$api.GetFireAlarmDeviceList, 
      {
          params: p
      }).then(res => {
          this.tableList = this.tableList.concat(res.result.items);
          p.total = res.result.totalCount;
          x ? success(this.tableList.length, res.result.totalCount, p) : this.changelist(this.tableList.length, res.result.totalCount, p);
      });
    },
    changelist(size, total = 5, page = {}){
        page.SkipCount = size;
        this.$refs.baselist.loading = false;
        if (size >= total ) {
            this.$refs.baselist.finished = true;
        }
    },
  }
};
</script>

<style lang="scss">
  .fireneteork_box{
    padding: 12px;
      .top_screen{
        display: flex;
        justify-content: space-between;
        padding: 10px 0px;
        .van-button{
            height: 30px;
            padding: 6px;
            width: 100px;
            line-height: 0px;
        }
        .van-button--default{
            border: 1px solid rgb(110, 110, 110);
        }
      }
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
