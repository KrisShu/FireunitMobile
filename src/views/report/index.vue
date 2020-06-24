<template>
  <div class="reportBox">
    <div class="top">
        <div class="topTitle">
            智慧消防数据综合报告
        </div>
        <div class="top_selectTimeBox diplay">
            <div class="top_selectTimeBox-left diplay">
                <van-cell-group class="diplay">
                    <van-field @focus="calendarshow = true" v-model="timeDataS" />
                    <span>至</span>
                    <van-field @focus="calendarshow = true" v-model="timeDataE" />
                </van-cell-group>
                <van-button size="mini" @click="select" type="primary">查询</van-button>
            </div>
            <div class="btns">
                    <van-button @click="preWeek" size="mini" type="info">上周</van-button>
                    <van-button @click="preMonth" size="mini" type="info">上月</van-button>
            </div>
        </div>
        <van-calendar 
        :min-date="minDate" 
        :max-date="maxDate"
        color="#07c160" 
        v-model="calendarshow" 
        type="range" 
        @confirm="onConfirm" />

    </div>

    <van-collapse class="one_collapse" v-model="activeNames">
        <van-collapse-item title="设施设备数据" name="1">
            <van-collapse class="two_collapse" v-model="activeNames">
                <van-collapse-item
                    v-for="(arr,index) in collapseIemsOne" 
                    :key="index"
                    :name="arr.name"
                    :disabled="arr.disabled"
                >
                    <template #title>
                        <div class="titlebox">
                            <span>{{arr.title}}</span>
                            <i v-if="arr.disabled" >暂无数据</i>
                        </div>
                    </template>
                    <div class="content">
                        <div> 
                            <p class="content_title"> <span> ◆</span>当前数据</p>
                            <p :class="arr.title =='其他消防设施' ?'pdb':'' " v-html="arr.data.nowData"></p>
                        </div>
                        <div v-if="arr.title != '其他消防设施'"> 
                            <p class="content_title"><span> ◆</span>事件数据（{{content_title_time}}） </p>
                            <p style="padding-bottom: 20px;" v-html="arr.data.eventData"></p>
                        </div>
                    </div>
                </van-collapse-item>
            </van-collapse>
        </van-collapse-item>
        <van-collapse-item title="人工作业数据" name="2">
            <div class="content">
                <div> 
                    <p class="content_title"> <span> ◆</span>当前数据</p>
                    <p v-html="personData.nowData"></p>
                </div>
                <div> 
                    <p class="content_title"><span> ◆</span>事件数据（{{content_title_time}}）</p>
                    <p style="padding-bottom: 20px;" v-html="personData.eventData"></p>
                </div>
            </div>
        </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
let moment = require("moment"); //引入后就可以使用了
export default {
    data(){
        return{
            timeDataS:'',
            timeDataE:'',
            calendarshow:false,
            minDate:new Date(2019,0,1),
            maxDate:new Date(2021,12,31),
            activeNames:['1'],
            collapseIemsOne:[
                {
                    name:'1_1',
                    title:'火灾自动报警联网设施',
                    disabled:false,
                    data:''
                },
                {
                    name:'1_2',
                    title:'独立式火警联网设施',
                    disabled:false,
                    data:''
                },
                {
                    name:'1_3',
                    title:'电气火灾防护设施',
                    disabled:false,
                    data:''
                },
                {
                    name:'1_4',
                    title:'消防管网远程监控设施',
                    disabled:false,
                    data:''
                },
                {
                    name:'1_5',
                    title:'AI智能分析设施',
                    disabled:false,
                    data:''
                },
                {
                    name:'1_6',
                    title:'其他消防设施',
                    disabled:false,
                    data:''
                }
            ],
            infos:{
               fireUnitId:this.$store.state.userInfo.fireUnitID,
            //    fireUnitId:2,
                beginDate:'',
                endDate:'', 
            },
            personData:'',//个人作业数据
            content_title_time:''
        }
    },
    created(){
        this.preWeek();
    },
    methods:{
        GetFireUnitReport(){
            this.$axios.get(this.$api.GetFireUnitReport,{params:this.infos}).then(res=>{
                this.content_title_time = res.result.dateRange
                let listDeviceData = res.result.listDeviceData;
                this.personData = res.result.personData;
                for(let x = 0;x<this.collapseIemsOne.length;x++){
                    if(listDeviceData[x].deviceData){
                        this.collapseIemsOne[x].data = listDeviceData[x].deviceData
                    }else{
                        this.collapseIemsOne[x].disabled = true
                    }
                }
                this.activeNames = ['1','2'];//调用钱展开所有节点
                for(let arr of this.collapseIemsOne){
                    if(!arr.disabled){
                        this.activeNames.push(arr.name)
                    }
                }
            })
        },
        //时间处理
        formatDate(date) {
            return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        },
        //
        onConfirm(date){
            const [start, end] = date;
            console.log(date)
            this.calendarshow = false;
            this.timeDataS = this.formatDate(start)
            this.timeDataE = this.formatDate(end)
        },
        select(){
            this.infos.beginDate =   this.timeDataS
            this.infos.endDate =  this.timeDataE
            this.GetFireUnitReport()
        },
        preWeek(){
            //一周的开始
            let lastweekstartDate = moment().week(moment().week() - 1).startOf('week').add(1,'days').format('YYYY/MM/DD');
            //一周的结尾
            let lastweekendDate = moment().week(moment().week() - 1).endOf('week').add(1,'days').format('YYYY/MM/DD');
            this.timeDataS = lastweekstartDate;
            this.timeDataE = lastweekendDate;
            this.infos.beginDate =  lastweekstartDate
            this.infos.endDate =  lastweekendDate
            this.GetFireUnitReport()

        },
        preMonth(){
            let lastmonthstartDate = moment().month(moment().month() - 1).startOf('month').format('YYYY/MM/DD');
            let lastmonthendDate = moment().month(moment().month() - 1).endOf('month').format('YYYY/MM/DD');
            this.timeDataS = lastmonthstartDate;
            this.timeDataE = lastmonthendDate;
            this.infos.beginDate =  lastmonthstartDate
            this.infos.endDate =  lastmonthendDate
            this.GetFireUnitReport();
        }
    }
}
</script>

<style lang="scss">
    .reportBox{
        padding-bottom: 50px;
        .top{
            .topTitle{
                border-bottom: 1px solid #eeeeee;
                text-align: center;
                line-height: 2.5;
                background: white;
                font-size: 18px;
                font-weight: bold;
            }
            .diplay{
                display: flex;
                align-items: center;
            }
            .top_selectTimeBox{
                background: white;
                padding:10px 4px;
                justify-content: space-between;
                &-left{
                    width: 66%;
                    .van-cell-group{
                        margin-right: 4px;
                        .van-cell{
                            padding: 0;
                            background: center;
                            input{
                                border: 1px solid #cccccc;
                                line-height: 3;
                                font-size: 12px;
                                padding-left: 4px;
                            }
                        }
                        span{
                            margin: 0 4px;
                        }
                    
                    }
                    .van-button{
                        height:2.375rem;
                        // margin-left: 10px;
                    }
                }  
                .btns{
                    .van-button{
                        height:2.375rem;
                        // margin-left: 10px;
                    }
                }
            }
            
        }
        .one_collapse{
            padding: 10px;
            .van-collapse-item__title{
                // background: rgb(38, 88, 47);
                // background: #0385fe;
                background:#1d477b ;
                color: rgb(255, 255, 255);
                font-size: 18px;
            }
            .van-collapse-item:nth-of-type(1){
                .van-collapse-item__content{
                    padding: 0;
                     
                    .two_collapse{
                        .van-collapse-item__title{
                            // background: rgb(111, 187, 125);
                             background: #167fc1;
                            color: rgb(255, 255, 255);
                            font-size: 16px;
                            .titlebox{
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                            }
                        }
                        .van-collapse-item__content{
                            padding: 0px 10px;
                            color: #333;
                        }
                    }
                }
            }
            .van-collapse-item__content{
                color: #333;
            }
            
        }
    }
</style>