<template>
  <div class="firewaringdetailBox">
      <base-nav title="火警联网报警详情"></base-nav>
       <van-cell-group>
            <van-cell title="核警时间" :value="FireAlarm.checkTime"></van-cell>
            <van-cell title="发现时间" :value="FireAlarm.creationTime"></van-cell>
            <van-cell title="部件类型" :value="FireAlarm.detectorTypeName"></van-cell>
            <van-cell title="位置" :value="FireAlarm.location"></van-cell>
            <van-cell title="核警情况" :value="FireAlarm.checktext"></van-cell>
            <van-cell v-if="FireAlarm.checkState == 4" title="核警通知" >
                <span v-if="FireAlarm.notify119">通知119、</span>
                <span v-if="FireAlarm.notifyWorker">通知工作人员</span>
            </van-cell>
            <van-cell title="核警人员" :value="FireAlarm.fireCheckUser"></van-cell>
            <describe-qusetion
                :isEdit="12"
                :time="FireAlarm.voiceLength"
                :voice="FireAlarm.vioceUrl"
                :content.sync="FireAlarm.content"
            ></describe-qusetion>

       </van-cell-group>
  </div>
</template>

<script>
import DescribeQusetion from "../../components/DescribeQusetion.vue";
export default {
    components:{
        DescribeQusetion
    },
    data(){
        return{
            FireAlarm:{}
        }
    },
    created(){
        this.GetFireAlarmById(this.$route.query.id)
    },
    methods:{
        //获取详情
        GetFireAlarmById(fireAlarmId){
            this.$axios.get(this.$api.GetFireAlarmById,{params:{fireAlarmId}}).then(res=>{
                console.log("打印获取数据详情",res)
                res.result.creationTime = this.deal(res.result.creationTime)
                res.result.checkTime = this.deal(res.result.checkTime)
                if(res.result.checkState == 2){
                    res.result.checktext = '误报'
                }else if(res.result.checkState == 3){
                    res.result.checktext = '测试'
                }else if(res.result.checkState == 4){
                    res.result.checktext = '真实火警'
                }
                if(res.result.vioceUrl){
                    res.result.vioceUrl = `${this.$url}${res.result.vioceUrl}`
                }
                this.FireAlarm = res.result
            }).catch(err=>{
                console.log("打印获取数据详情s失败",err)
            })
        },
        //时间处理
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

</style>