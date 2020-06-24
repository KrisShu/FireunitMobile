<template>
  <div class="firewaring_box">
      <base-nav title="火警联网报警"></base-nav>
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
      <div class="firewaring_content">
            <base-list
                @onLoad="GetFireAlarmList"
                @refresh="GetFireAlarmList"
                :mostlist="false"
                :tableList="tableList"
                ref="baseList"
            >
                <div class="slot_content " slot-scope="scope" slot="content">
                        <p :class="isread(scope.item.isRead)">
                            <span class="speical_span">
                                <i>【报警部件】：</i>
                                {{scope.item.detectorSn}}
                            </span>
                            <van-button @click="Nuclearpolice(scope.item.fireAlarmId)" v-if="scope.item.checkState == 1" type="warning">处理</van-button>
                            <van-button @click="getdetails(scope.item.fireAlarmId)"  v-if="scope.item.checkState == 2" type="info">误报</van-button>
                            <van-button @click="getdetails(scope.item.fireAlarmId)" v-if="scope.item.checkState == 3" type="info">测试</van-button>
                            <van-button @click="getdetails(scope.item.fireAlarmId)" v-if="scope.item.checkState == 4" type="info">真实火警</van-button>
                            <van-button @click="Nuclearpolice(scope.item.fireAlarmId)" v-if="scope.item.checkState == 5" type="warning">处理</van-button>
                        </p>
                        <p class="display_p">
                            <span class="speical_span">
                                <i>【部件类型】：</i>
                                {{scope.item.detectorTypeName}}
                            </span>
                        </p>
                        <p class="display_p">
                            <span class="speical_span">
                                <i>【部件位置】：</i>
                                {{scope.item.location}}
                            </span>
                        </p>
                        <p class="display_p">
                            <span class="speical_span">
                                <i>【联网设施】：</i>
                                {{scope.item.gatewaySn}}
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

            <!-- 核警 -->
            <van-action-sheet round v-model="show" title="核警">
                <div class="Nuclearpolice_content">
                    <van-radio-group v-model="NuclearpoliceForm.CheckState ">
                        <van-radio name="2">误报</van-radio>
                        <van-radio name="3">测试</van-radio>
                        <van-radio name="4">真实火警</van-radio>
                    </van-radio-group>
                    <van-checkbox-group v-if="NuclearpoliceForm.CheckState == 4" v-model="NuclearpoliceForm.NotifyList">
                        <van-checkbox name="通知工作人员" shape="square">通知工作人员</van-checkbox>
                        <van-checkbox name="通知119" shape="square">通知119</van-checkbox>
                    </van-checkbox-group>
                    <describe-qusetion
                        v-model="question"
                        :voice.sync="NuclearpoliceForm.voice"
                        :content.sync="NuclearpoliceForm.content"
                        @voiceBase64="voiceBase64"
                    ></describe-qusetion>
                    <van-button type="info" @click="submit" size="large">提交</van-button>
                </div>
            </van-action-sheet>
            <!--  -->
            <van-action-sheet round v-model="detailsshow" title="核警">
                <div class="Nuclearpolice_content">
                    <p>处理时间：<span>{{details.checkTime}}</span> </p>
                    <p>处理状态：
                        <span v-if="details.checkState == 2">误报</span>
                        <span v-if="details.checkState == 3">测试</span>
                        <span v-if="details.checkState == 4">真实火警</span>
                    </p>
                    <div>
                        <p v-if="details.content && details.content != '无' ">情况描述：<span>{{details.content}}</span> </p>
                        <div class="display_p" v-if="details.vioceUrl">
                            <span>情况描述：</span>
                            <base-play-sound
                            :time="details.voiceLength"
                            :isEdit="1"
                            :voice.sync="details.vioceUrl"
                            ></base-play-sound>
                        </div>
                    </div>
                </div>
            </van-action-sheet>
      </div>
       
     
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
            screendata:[],
            tableList:[],
            buttonarr:[
                {
                    type:'info',
                    text:'全部'
                },
                {
                    type:'warning',
                    text:'未核警',
                    num:0
                },
                {
                    type:'primary',
                    text:'已核警',
                    num:0
                }
                
            ],
            screensign:'全部',
            page:{
                FireUnitId :this.$store.state.userInfo.fireUnitID,
                VisitSource :2,
                CheckStates:1,
            },
            show:false,//是否显示核警框
            question: {},
            voicefile:"",
            NuclearpoliceForm:{
                fireAlarmId:0,
                CheckState: '2',
                NotifyList:['通知工作人员'],
            },
            details:{},
            detailsshow:false
            
        }
    },
    created(){
        this.GetFireAlarmCheckStatusNum();
    },
    methods:{
        GetFireAlarmCheckStatusNum(){
            this.$axios.get(this.$api.GetFireAlarmCheckStatusNum,{
                params:{fireUnitId:this.$store.state.userInfo.fireUnitID}
            }).then(res=>{
                // console.log("记录条数",res);
                this.buttonarr[1].num = res.result[0].value
                this.buttonarr[2].num = res.result[1].value
            })
        },
        screen(text){
            // console.log(text)
            this.screensign = text
            if(text == '未核警'){
                this.page.CheckStates = 3
            }else if(text == '已核警'){
                this.page.CheckStates = 2
            }else{
                this.page.CheckStates = 1
            }
            this.GetFireAlarmList();
        },
        //
        GetFireAlarmList(success) {
            let x = arguments[0] instanceof Object;
            let p = this.page;
            if (!x) {
                p.SkipCount = 0;
                this.tableList = [];
                this.$refs.baseList.loading = true //将加载中....打开
                this.$refs.baseList.finished = false //将完成字样  关闭
            }
            this.$axios.get(this.$api.GetFireAlarmList, {params: p}).then(res => {
                // console.log("获取核警列表",res)
                if(res.result.totalCount>0){
                    for(let arr of res.result.items){
                        arr.creationTime = this.deal(arr.creationTime)
                    }
                    this.tableList = this.tableList.concat(res.result.items);
                    p.total = res.result.totalCount;
                }
                
                x ? success(this.tableList.length, res.result.totalCount, p) : this.changelist(this.tableList.length, res.result.totalCount, p);
            });
        },
        changelist(size, total = 5, page = {}){//改变列表状态
            page.SkipCount = size;
            this.$refs.baseList.loading = false;
            if (size >= total ) {
                this.$refs.baseList.finished = true;
            }
        },
        //是否未读
        isread(flag){//true为已读
            // console.log("是否读取",flag)
            if(flag){
                return 'display_p'
            }else{
                return 'display_p fontWeight'
            }
        },
        //时间处理
        deal(data){
            var str = data.split('T');
            var str2 = str[1].split(".")
            var timestr = str[0] +" "+ str2[0]
            return timestr;
        },
        //打开核警弹窗
        Nuclearpolice(id){
            // console.log(id)
            this.show = true;
            this.NuclearpoliceForm.fireAlarmId = id
        },
        //获取
        voiceBase64(Base64voice){
             this.voicefile =  this.base64ToFile(Base64voice);
        },
        base64ToFile(base64){
            let arr, mime, bstr, n, u8arr;
            arr = base64.split(",");
            mime = arr[0].match(/:(.*?);/)[1];
            // console.log("mime", mime);
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
        //提交核警数据
        submit(){
            // console.log("this",parseInt(this.NuclearpoliceForm.CheckState))
            let param = new FormData();
            param.append("CheckUserId", parseInt(this.$store.state.userInfo.userId));
            param.append("AlarmDataId", parseInt(this.NuclearpoliceForm.fireAlarmId));
            param.append("CheckState", parseInt(this.NuclearpoliceForm.CheckState) );
            if(this.NuclearpoliceForm.CheckState == 4){
                param.append("NotifyList", this.NuclearpoliceForm.NotifyList);
            }
            if(this.question.content){
                param.append("CheckContent", this.question.content);
            }else if(this.voicefile){
                param.append("CheckVoice", this.voicefile);
                param.append("CheckVoiceLength", this.question.duration);
            }

            this.$axios.post(this.$api.CheckFireAlarm,param).then(res=>{
                // console.log("核警成功",res)
                this.show = false;
                this.NuclearpoliceForm.CheckState = '2'
                this.question = {}
                this.GetFireAlarmList()
                this.GetFireAlarmCheckStatusNum()
            }).catch(err=>{
                console.log("核警失败",err)
            })
            
           
        },
        //查看数据详情
        getdetails(fireAlarmId){
            this.detailsshow = true
            this.$axios.get(this.$api.GetFireAlarmById,{params:{fireAlarmId}}).then(res=>{
                // console.log(res);
                res.result.checkTime = this.deal(res.result.checkTime)
                if(res.result.vioceUrl){
                    res.result.vioceUrl = `${this.$url}${res.result.vioceUrl}`
                }
                this.details  = res.result
            })
        }
    }
}
</script>

<style lang="scss">
    .firewaring_box{
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
        .firewaring_content{
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
                        .van-button{
                            padding: 4px;
                            height:auto;
                            line-height: normal;
                        }

                    }
                    .fontWeight{
                        font-weight: bold;
                    }
                }
            }
            .Nuclearpolice_content{
                padding: 20px 10px;
                .display_p{
                    display: flex;
                    align-items: center;
                    &>span{
                        font-weight: bold;
                        font-size: 14px;
                    }
                }
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
                .van-checkbox-group{
                    display: flex;
                    margin: 20px 0px;
                    .van-checkbox__icon .van-icon{
                        font-size: 12px;
                    }
                    .van-checkbox__label{
                        font-size: 0.9em;
                    }
                    .van-checkbox:nth-of-type(1){
                        margin-right: 20px;
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
                .describe-qusetion{
                    margin-top: 20px;
                }
            }
        }
    }
</style>