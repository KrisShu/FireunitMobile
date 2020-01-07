<template>
  <div class="firenetwork_details_box">
    <base-nav :title="basenavtitle"></base-nav>
    <div class="content">
        <div class="top_box">
            <div class="display_div">
                <p>
                    <span>设施编号：</span>
                        {{deviceSn}}
                </p>
                <p>
                    <span >所在建筑：</span>
                    {{fireUnitArchitectureName}}
                </p>
            </div>
            <div v-if="basenavtitle == '故障部件数量'">
                <span>故障部件数量：</span>
                {{page.total}}
            </div>
            <div v-if="basenavtitle == '30天火警数量'">
                <span>30天火警数量：</span>
                {{page.total}}
            </div>
            <div v-if="basenavtitle == '高频部件数量'">
                <span>高频部件数量：</span>
                {{page.total}}
            </div>
        </div>
        <base-list
            @onLoad="getList"
            @refresh="getList"
            :mostlist="false"
            :tableList="tableList"
        >
            <div v-if="basenavtitle == '故障部件数量'" class="slot_content" slot-scope="scope" slot="content">
                <p><span>故障时间：</span>{{scope.item.creationTime}}</p>
                <p><span>部件地址：</span>{{scope.item.identify}}</p>
                <p><span>部件类型：</span>{{scope.item.detectorTypeName}}</p>
                <p><span>安装位置：</span>{{scope.item.location}}</p>
                <p><span>故障描述：</span>{{scope.item.faultContent}}</p>
            </div>
            <div v-else-if="basenavtitle == '30天火警数量'" class="slot_content" slot-scope="scope" slot="content">
                <p><span>报警时间：</span>{{scope.item.alarmTime}}</p>
                <p><span>部件地址：</span>{{scope.item.identify}}</p>
                <p><span>部件类型：</span>{{scope.item.detectorTypeName}}</p>
                <p><span>安装位置：</span>{{scope.item.location}}</p>
            </div>
            <div v-else-if="basenavtitle == '高频部件数量'" class="slot_content" slot-scope="scope" slot="content">
                <p><span>部件地址：</span>{{scope.item.identify}}</p>
                <p><span>部件类型：</span>{{scope.item.detectorTypeName}}</p>
                <p><span>安装位置：</span>{{scope.item.location}}</p>
                <p><span>30天平均报警：</span>{{scope.item.alarmNum}}</p>
            </div>
        </base-list>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            basenavtitle:'',
            deviceSn:'',
            fireUnitArchitectureName:'',
            page:{
                fireAlarmDeviceId:'',
                total: 0
            },
            tableList:[]
        }
    },
    created(){
        ({  basenavtitle:this.basenavtitle,
            id:this.page.fireAlarmDeviceId,
            deviceSn:this.deviceSn,
            fireUnitArchitectureName:this.fireUnitArchitectureName}=this.$route.query)
    },
    methods:{
        getList(success) {
            let x = arguments[0] instanceof Object;
            let p = this.page;
            if (!x) {
                p.SkipCount = 0;
                this.tableList = [];
            }
            let as;
            if(this.basenavtitle == '故障部件数量'){
                as = this.$axios.get(this.$api.GetFireAlarmFaultDetectorList,{params: p})
            }else if(this.basenavtitle == '30天火警数量'){
                as = this.$axios.get(this.$api.GetFireAlarm30DayList,{params: p})
            }else if(this.basenavtitle == '高频部件数量'){
                as = this.$axios.get(this.$api.GetFireAlarmHighList,{params: p})
            }
            as.then(res => {
                console.log("详情list",res)
                if(this.basenavtitle == '故障部件数量'){
                    for(let arr of res.result.items){
                        arr.creationTime = this.deal(arr.creationTime)
                    }
                }else if(this.basenavtitle == '30天火警数量'){
                    for(let arr of res.result.items){
                        arr.alarmTime = this.deal(arr.alarmTime)
                    }
                }
               
                this.tableList = this.tableList.concat(res.result.items);
                p.total = res.result.totalCount;
                x ? success(this.tableList.length, res.result.totalCount, p) : "";
                });
        },
        deal(data){
            var str = data.split('T');
            var str2 = str[1].split(".")
            var timestr = str[0] +" "+ str2[0]
            return timestr;
        },
    }
}
</script>

<style lang="scss">
    .firenetwork_details_box{
        .content{
            padding: 12px;
            span{
                font-weight: bold;
            }
            .top_box{
                background: white;
                padding: 10px;
                font-size: 14px;
                .display_div{
                    display: flex;
                    justify-content: space-between;
                    p{
                        margin: 0px;
                        line-height: 2;
                    }
                }
            }
            .van-cell-group {
                background: #F8F8F8;
                padding-top: 10px;
                .van-cell{
                    margin-bottom: 10px;
                    border-radius: 8px;
                    // background: rgba(253, 251, 216, 0.418);
                    background: rgba(255, 246, 230, 0.76);
                    border: 1px solid white;
                }
            }
        }
    }
</style>