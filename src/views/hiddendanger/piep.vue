<template>
  <div class="piepBox">
        <base-nav title="消防管网报警"></base-nav>
        <div class="top_screen">
            <van-button  
                v-for="item in buttonarr"
                :key="item.text"
                plain
                :type="item.type"
                @click="screen(item.text)"
            >
               <div>
                    
                <p>
                    <van-icon v-if="screensign == item.text" name="star" />
                    {{item.text}}
                </p>
                <p>
                    {{item.num}}
                </p>
               </div>
                

            </van-button>
        </div>
        <div class="piepBox_content">
            <base-list
              @onLoad="GetWaterAlarmList"
              @refresh="GetWaterAlarmList"
              :mostlist="false"
              :tableList="tableList"
              ref="baseList"
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
                        <van-button  v-if="scope.item.alarmHandleStatus == 1" @click="actionSheet(scope.item.alarmDataId,true)" class="btn" type="warning">处理</van-button>
                        <van-button  v-if="scope.item.alarmHandleStatus == 2" @click="actionSheet(scope.item.alarmDataId)" class="btn" type="info">误报</van-button>
                        <van-button  v-if="scope.item.alarmHandleStatus == 3" @click="actionSheet(scope.item.alarmDataId)" class="btn" type="info">已处理</van-button>
                        <van-button  v-if="scope.item.alarmHandleStatus == 4" @click="actionSheet(scope.item.alarmDataId)" class="btn" type="info">忽略</van-button>

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
        <!--  -->
        <van-action-sheet v-model="actionSheetshow" title="警情处理">
            <div class="Nuclearpolice_content">
                    <van-radio-group v-model="actionSheetForm.checkState">
                        <van-radio :name="4">忽略</van-radio>
                        <van-radio :name="2">误报</van-radio>
                        <van-radio :name="3">已处理</van-radio>
                    </van-radio-group>
                    <describe-qusetion
                        v-model="question"
                        :voice.sync="actionSheetForm.voice"
                        :content.sync="actionSheetForm.content"
                        @voiceBase64="voiceBase64"
                    ></describe-qusetion>
                    <van-button type="info" @click="submit" size="large">提交</van-button>
            </div>
        </van-action-sheet>
        <!--  -->
        <van-action-sheet v-model="actionSheetshow2" title="警情处理">
                <div class="Nuclearpolice_content">
                    <p>处理时间：<span>{{details.handleTime}}</span> </p>
                    <p>处理状态：
                        <span v-if="details.alarmHandleStatus == 2">误报</span>
                        <span v-if="details.alarmHandleStatus == 3">已处理</span>
                        <span v-if="details.alarmHandleStatus == 4">忽略</span>
                    </p>
                    <div>
                        <p v-if="details.handleContent">情况描述：<span>{{details.handleContent}}</span> </p>
                        <div class="display_p" v-if="details.handleVoiceUrl">
                            <span>情况描述：</span>
                            <base-play-sound
                            :time="details.handleVoiceLength"
                            :isEdit="1"
                            :voice.sync="details.handleVoiceUrl"
                            ></base-play-sound>
                        </div>
                    </div>
                </div>
        </van-action-sheet>
        
  </div>
</template>

<script>
import DescribeQusetion from "../../components/DescribeQusetion"
import BasePlaySound from "../../components/BasePlaySound"
export default {
    components:{
         DescribeQusetion,
         BasePlaySound
    },
    data(){
        return{
            buttonarr:[
                    {
                        type:'info',
                        text:'全部'
                    },
                    {
                        type:'warning',
                        text:'未处理',
                        num:0
                    },
                    {
                        type:'primary',
                        text:'已处理',
                        num:0
                    }
                    
            ],
            screensign:'全部',
            page:{
                FireUnitId :this.$store.state.userInfo.fireUnitID,
                VisitSource :2,
                HandleStatusFilter:1
            },
            tableList:[],
            actionSheetshow:false,
            actionSheetForm:{
                checkState:4
            }, 
            question:{},
            actionSheetshow2:false,
            details:{}
        }
    },
    created(){
        this.GetWaterAlarmCheckStatusNum()
    },
    methods:{
            GetWaterAlarmCheckStatusNum(){
                this.$axios.get(this.$api.GetWaterAlarmCheckStatusNum,{
                    params:{fireUnitId:this.$store.state.userInfo.fireUnitID}
                }).then(res=>{
                    // console.log("消防管网数据",res)
                    this.buttonarr[1].num = res.result[0].value
                    this.buttonarr[2].num = res.result[1].value
                })
            },
            screen(text){
                // console.log(text)
                this.screensign = text
                if(text == '未处理'){
                    this.page.HandleStatusFilter = 3
                }else if(text == '已处理'){
                    this.page.HandleStatusFilter = 2
                }else{
                    this.page.HandleStatusFilter = 1
                }
                this.GetWaterAlarmList()
            },
            GetWaterAlarmList(success){
                let x = arguments[0] instanceof Object;
                let p = this.page;
                if (!x) {
                    p.SkipCount = 0;
                    this.tableList = [];
                    this.$refs.baseList.loading = true //将加载中....打开
                    this.$refs.baseList.finished = false //将完成字样  关闭
                }
                this.$axios.get(this.$api.GetWaterAlarmList, {params: p}).then(res => {
                    // console.log("消防管网列表",res)
                    if(res.result.totalCount>0){
                        for(let arr of res.result.items){
                            arr.creationTime = this.deal(arr.creationTime)
                        }
                        this.tableList = this.tableList.concat(res.result.items);
                        p.total = res.result.totalCount;
                        
                    }
                    x ? success(this.tableList.length, res.result.totalCount, p) :  this.changelist(this.tableList.length, res.result.totalCount, p);
                    
                
                });
            },
            changelist(size, total = 5, page = {}){//改变列表状态
                page.SkipCount = size;
                this.$refs.baseList.loading = false;
                if (size >= total ) {
                    this.$refs.baseList.finished = true;
                }
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
            },
            actionSheet(id,flag){
                this.alarmDataId = id
                if(flag){
                    this.actionSheetshow = true;
                }else{
                    this.actionSheetshow2 = true;
                    this.GetWaterAlarmCheckDetail(id)
                }
                
                
            },
            GetWaterAlarmCheckDetail(alarmId){
                this.$axios.get(this.$api.GetWaterAlarmCheckDetail,{
                    params:{alarmId}
                }).then(res=>{
                    // console.log("详情",res)
                    res.result.handleTime = this.deal(res.result.handleTime)
                    if(res.result.handleVoiceUrl){
                        res.result.handleVoiceUrl = `${this.$url}${res.result.handleVoiceUrl}`
                    }
                    this.details = res.result
                })
            },

            base64ToFile(base64){
                let arr, mime, bstr, n, u8arr;
                arr = base64.split(",");
                mime = arr[0].match(/:(.*?);/)[1];
                bstr = atob(arr[1]); // 解码base-64编码的数据
                n = bstr.length;
                u8arr = new Uint8Array(n); // 无符号整型数组
                while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
                }
                //转换成file对象
                let filename = new Date().getTime();
                let filetest = new File([u8arr], filename, { type: mime });
                let fileList2 = filetest;
                return fileList2;
            },
            voiceBase64(Base64voice){
                this.voicefile =  this.base64ToFile(Base64voice);
            },
            submit(){
                let param = new FormData();
                param.append("CheckState",  this.actionSheetForm.checkState);
                param.append("CheckUserId", this.$store.state.userInfo.userId);
                param.append("AlarmDataId", this.alarmDataId);
                if(this.question.content){
                    param.append("CheckContent", this.question.content);
                }else if(this.voicefile){
                    param.append("CheckVoice", this.voicefile);
                    param.append("CheckVoiceLength", this.question.duration);
                }
                this.$axios.post(this.$api.CheckWaterAlarm,param).then(res=>{
                    // console.log("请求",res)
                    if(res.success){
                        this.actionSheetForm.checkState = 4
                        this.question = {}
                        this.actionSheetshow = false;
                        this.GetWaterAlarmList();
                        this.GetWaterAlarmCheckStatusNum();
                    }
                })
            
            }
    }

}
</script>

<style lang="scss">
.piepBox{
    .top_screen{
        padding: 10px 12px 0 12px;
        display: flex;
        justify-content: space-between;
        .van-button{
           width: 30%;
        }
        .van-button__text{
            div{
                p{
                    line-height: 1.5;
                    margin: 0;
                }
            }
        }
    }
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
                    align-items: center;
                    i{
                        font-style: normal;
                    }
                }
                .fontWeight{
                    font-weight: bold;
                }

            }
            .btn{
                padding: 4px;
                height:auto;
                line-height: normal;
            }
        }
    } 
    .Nuclearpolice_content{
        padding: 20px 10px;
        .van-radio-group{
            display: flex;
            justify-content: space-between;
            .van-radio__icon{
                font-size: 1rem;
            }
            .van-radio__label{
                font-size: 0.9rem;
            }
        }
        p{
            font-weight: bold;
            font-size: 14px;
            span{
                font-weight: normal;
                font-size: 14px;
            }

        }
        .handleContent{
            overflow: hidden;
            white-space: pre-wrap;
        }
        .display_p{
            display: flex;
            align-items: center;
            &>span{
                font-weight: bold;
                font-size: 14px;
            }
        }
    }
}

</style>