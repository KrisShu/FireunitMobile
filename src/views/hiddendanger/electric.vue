<template>
  <div class="electricBox">
        <base-nav title="电气火灾报警"></base-nav>
        <div class="electricBox_content">
            <base-list
                    @onLoad="GetElectricAlarmList"
                    @refresh="GetElectricAlarmList"
                    :mostlist="false"
                    :tableList="tableList"
            >
                <div class="slot_content " slot-scope="scope" slot="content">
                    <p :class="isread(scope.item.isRead)">
                        <span class="speical_span">
                            <i>【设备编号】：</i>
                            {{scope.item.fireElectricDeviceSn}}
                        </span>
                    </p>
                    <p class="display_p">
                        <span class="speical_span">
                            <i>【具体位置】：</i>
                            {{scope.item.fireUnitArchitectureName}}  {{scope.item.fireUnitArchitectureFloorName}} {{scope.item.location}}
                        </span>
                    </p>
                    <p class="display_p">
                        <span class="speical_span">
                            <i>【报警数值】：</i>
                            {{scope.item.sign}}： {{scope.item.analog}}
                            <i :class="getcolor(scope.item.state)" v-if="scope.item.state == 2">（良好）</i>
                            <i :class="getcolor(scope.item.state)" v-if="scope.item.state == -3">（隐患）</i>
                            <i :class="getcolor(scope.item.state)" v-if="scope.item.state == -2">（超限）</i>
                            <i :class="getcolor(scope.item.state)" v-if="scope.item.state == -1">（离线）</i>
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
            tableList:[],
            page:{
                FireUnitId :this.$store.state.userInfo.fireUnitID,
                VisitSource :2,
                State:0
            }
        }
    },
    methods:{
        GetElectricAlarmList(success) {
            let x = arguments[0] instanceof Object;
            let p = this.page;
            if (!x) {
                p.SkipCount = 0;
                this.tableList = [];
            }
            this.$axios.get(this.$api.GetElectricAlarmList, {params: p}).then(res => {
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
        //是否已读
        isread(flag){
            if(flag){
                return 'display_p'
            }else{
                return 'display_p fontWeight'
            }
        },
        //
        getcolor(state){
            if(state == 2){
                return 'green'
            }else if(state == -3){
                return 'yellow'
            }else if(state == -2){
                return 'orange'
            }else if(state == -1){
                return 'gray'
            }
        }
    }
}
</script>

<style lang="scss">
    .electricBox{
        .electricBox_content{
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
                            &.green{
                                color: rgb(46, 158, 46);
                            }
                            &.yellow{
                                color: rgb(231, 228, 79);
                            }
                            &.orange{
                                color: rgb(235, 108, 49);
                            }
                            &.gray{
                                color: rgb(179, 179, 179);
                            }
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