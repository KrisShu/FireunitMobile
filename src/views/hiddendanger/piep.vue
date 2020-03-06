<template>
  <div class="piepBox">
        <base-nav title="消防管网报警"></base-nav>
        <div class="piepBox_content">
            <base-list
              @onLoad="GetWaterAlarmList"
              @refresh="GetWaterAlarmList"
              :mostlist="false"
              :tableList="tableList"
            >
              <div class="slot_content " slot-scope="scope" slot="content">
                  <p :class="isread(scope.item.isRead)">
                        <span class="speical_span">
                            <i>【设备编号】：</i>
                            {{scope.item.deviceAddress}}
                        </span>
                  </p>
                  <p class="display_p">
                      <span class="speical_span">
                          <i>【设备位置】：</i>
                          {{scope.item.location}}
                      </span>
                  </p>
                  <p class="display_p">
                      <span class="speical_span">
                          <i>【设备类型】：</i>
                          <i v-if="scope.item.monitorType == 1">液位</i>
                          <i v-if="scope.item.monitorType == 2">水压</i>
                         
                      </span>
                  </p>
                  <p class="display_p">
                      <span class="speical_span">
                          <i>【报警数值】：</i>
                          {{scope.item.value}}
                      </span>
                  </p>
                  <p class="display_p">
                      <span class="speical_span">
                          <i>【报警时间】：</i>
                          {{scope.item.creationTime}}
                      </span>
                  </p>
              </div>
            </base-list>
        </div>
        
  </div>
</template>

<script>
export default {
  data(){
    return{
      page:{
        FireUnitId :this.$store.state.userInfo.fireUnitID,
        VisitSource :2
      },
      tableList:[]
    }
  },
  created(){

  },
  methods:{
    GetWaterAlarmList(success){
        let x = arguments[0] instanceof Object;
        let p = this.page;
        if (!x) {
            p.SkipCount = 0;
            this.tableList = [];
        }
        this.$axios.get(this.$api.GetWaterAlarmList, {params: p}).then(res => {
            console.log("获取核警列表",res)
            if(res.result.totalCount>0){
                for(let arr of res.result.items){
                    arr.creationTime = this.deal(arr.creationTime)
                }
                this.tableList = this.tableList.concat(res.result.items);
                p.total = res.result.totalCount;
                
            }
            x ? success(this.tableList.length, res.result.totalCount, p) : "";
            
           
        });
           
      
    },
    //时间处理
      deal(data){
            var str = data.split('T');
            var str2 = str[1].split(".")
            var timestr = str[0] +" "+ str2[0]
            return timestr;
      },
    //
    isread(flag){
         if(flag){
            return 'display_p'
        }else{
            return 'display_p fontWeight'
        }
    }
  }

}
</script>

<style lang="scss">
.piepBox{
    .piepBox_content{
     padding: 12px;
     .van-cell-group{
          background: #F8F8F8; 
          .van-cell{
              margin-bottom: 10px;
              border-radius: 8px;
              border: 1px solid white;
              background: rgb(232, 239, 255);
              .display_p{
                  display: flex;
                  justify-content: space-between;
                  i{
                      font-style: normal;
                  }
              }
              .fontWeight{
                  font-weight: bold;
              }

          }
        }
  } 
}

</style>