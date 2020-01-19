<template>
  <div class="firewaring_box">
      <base-nav title="火警联网报警"></base-nav>
      <div class="firewaring_content">
            <base-list
                @onLoad="GetFireAlarmList"
                @refresh="GetFireAlarmList"
                :mostlist="false"
                :tableList="tableList"
            >
                <div class="slot_content " slot-scope="scope" slot="content">
                        <p :class="isread(scope.item.isRead)">
                            <span class="speical_span">
                                <i>【报警部件】：</i>
                                {{scope.item.detectorSn}}
                            </span>
                           <!--  <span class="yellow" v-if="scope.item.checkState == 1">
                               核警
                            </span> -->
                            <van-button @click="Nuclearpolice(scope.item.fireAlarmId)" v-if="scope.item.checkState == 1" type="warning">核警</van-button>
                            <van-button @click="getdetails(scope.item.fireAlarmId)"  v-if="scope.item.checkState == 2" type="info">误报</van-button>
                            <van-button @click="getdetails(scope.item.fireAlarmId)" v-if="scope.item.checkState == 3" type="info">测试</van-button>
                            <van-button @click="getdetails(scope.item.fireAlarmId)" v-if="scope.item.checkState == 4" type="info">真实火警</van-button>
                            <van-button v-if="scope.item.checkState == 5" disabled  type="default">已过期</van-button>
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
      </div>
       
     
  </div>
</template>

<script>
import DescribeQusetion from "../../components/DescribeQusetion"
export default {
    components:{
        DescribeQusetion
    },
    data(){
        return{
            screendata:[],
            tableList:[],
            page:{
                FireUnitId :this.$store.state.userInfo.fireUnitID,
                VisitSource :2,
                CheckStates:'未核警,误报,测试,真实火警,已过期',
            },
            show:false,//是否显示核警框
            question: {},
            voicefile:"",
            NuclearpoliceForm:{
                fireAlarmId:0,
                CheckState: '2',
                NotifyList:['通知工作人员'],
                message:''
            }
            
        }
    },
    methods:{
        //
        GetFireAlarmList(success) {
            let x = arguments[0] instanceof Object;
            let p = this.page;
            if (!x) {
                p.SkipCount = 0;
                this.tableList = [];
            }
            this.$axios.get(this.$api.GetFireAlarmList, {params: p}).then(res => {
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
        //是否未读
        isread(flag){//true为已读
            console.log("是否读取",flag)
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
            console.log(id)
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
            console.log("mime", mime);
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
            console.log("this",this.question,this.NuclearpoliceForm)
            let param = new FormData();
            param.append("CheckUserId", this.$store.state.userInfo.userId);
            param.append("FireAlarmId", this.NuclearpoliceForm.fireAlarmId);
            param.append("CheckState", +this.NuclearpoliceForm.CheckState);
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
                console.log("核警成功",res)
                this.show = false;
                this.GetFireAlarmList()
            }).catch(err=>{
                console.log("核警失败",err)
            })
           
        },
        //查看数据详情
        getdetails(id){
            console.log("idid",id)
            this.$router.push({
                path:'/firewaringdetail',
                query:{
                    id
                }
            })
        }
    }
}
</script>

<style lang="scss">
    .firewaring_box{
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
                .describe-qusetion{
                    margin-top: 20px;
                }
            }
        }
    }
</style>