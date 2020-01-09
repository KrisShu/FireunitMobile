<template>
  <div class="fault-detail">
    <base-nav v-if="active != 2 " :title="title[active]" :active="active"></base-nav>
    <base-nav v-else :title="title[active]" :active="active" :special="have"></base-nav>

    <van-cell-group>
     <!--  <van-cell
        class="flex-title"
        :title="form.userName"
        :value="$store.state.getAction[form.source]"
        :label="form.creationTime"
      ></van-cell> -->
      <van-cell  
        class="flex-title"
        :title="form.userName"
        :value="$store.state.getAction[form.source]"
      ></van-cell>
      <p class="timeBox">
        <span v-if="active == 1">
          派单时间：{{form.dispatchTime}}
        </span>
        <span v-if="active == 2">
          派单时间：{{form.dispatchTime}}
        </span>
        <span >
          发现时间：{{form.creationTime}}
        </span>
      </p>

      <!--      todo 建议抽离图片展示-->
      <van-cell title="问题描述">
        <div slot="label">
          <div style="margin: 5px" v-show="form.problemVoiceUrl">
            <!--        todo 播放声音-->
            <base-play-sound :isEdit="1" :time="form.voiceLength" :voice="form.problemVoiceUrl"></base-play-sound>
          </div>
          <div v-show="form.problemRemark" class="fault-detail-text">{{ form.problemRemark }}</div>
          <shot-photo :truePhoto="form.truePhoto" v-model="form.photoList" :disabled="1"></shot-photo>
        </div>
      </van-cell>
      <!-- 已解决 -->
      <div v-if="active === '3'">
        <van-cell title="解决时间" :value="form.solutionTime"></van-cell>
        <van-cell title="处理途径" :value="form.solutionWay === 1 ? '自行处理' : '维保叫修'"></van-cell>
        <van-cell title="备注信息" :label="form.solutionRemark"></van-cell>
      </div>
     
      <van-cell v-if="active == '1'" title="问题处理">
        <div slot="label" class="fault-detail-label">
          <van-switch-cell
            v-model="handleStatus"
            title="是否已处理"
          ></van-switch-cell>
          <van-cell title="问题处理途径">
          <span>自行处理</span>
          </van-cell>
          <van-cell title="备注">
            <van-field
              slot="label"
              v-model="form.solutionRemark"
              type="textarea"
              rows="6"
              placeholder="在这请输入您的备注信息"
            ></van-field>
          </van-cell>
        </div>
      </van-cell>

      <!-- 维保叫修 -->
       <van-cell v-if="active == '2'" title="问题处理">
        <div slot="label" class="fault-detail-label">
          <van-switch-cell
            v-model="handleStatus"
            title="是否已解决"
          ></van-switch-cell>
          <van-cell title="问题处理途径">
          <span v-if="have == 5">维保叫修(处理中)</span>
          <span v-if="have == 6">维保叫修(已处理)</span>
          </van-cell>
          <van-cell title="备注">
            <van-field
              slot="label"
              v-model="form.solutionRemark"
              type="textarea"
              rows="6"
              placeholder="在这请输入您的备注信息"
            ></van-field>
          </van-cell>
        </div>
      </van-cell>
      <!-- 待处理 -->
      <van-cell v-if="active == 0" title="问题处理">
        <div slot="label" class="fault-detail-label">
          <van-switch-cell v-model="handleStatus" title="是否已解决"></van-switch-cell>
          <van-cell title="问题处理途径">
            <div slot="label" class="fault-detail-label-radio">
              <van-radio-group v-model="form.solutionWay">
                <van-radio :name="1">自行处理</van-radio>
                <van-radio :name="2">维保叫修</van-radio>
              </van-radio-group>
            </div>
          </van-cell>
          <van-cell title="备注">
            <van-field
              slot="label"
              v-model="form.solutionRemark"
              type="textarea"
              rows="6"
              placeholder="在这请输入您的备注信息"
            ></van-field>
          </van-cell>
        </div>
      </van-cell>

    </van-cell-group>

   
    <base-button @click="submit" v-if="active == 0 && handleStatus == false">派单</base-button>
    <base-button @click="submit" v-else-if="active == 0 && handleStatus == true">提交</base-button>
    <base-button @click="submit" v-else-if="(active == 1 || active == 2)">提交</base-button>
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/7/1 17:12
 *  1,常量从js文件引入，不要定义魔术变量
 *  待处理-新增、处理中-编辑、已处理-查看
 */
import ShotPhoto from "../../components/ShotPhoto";
export default {
  name: "FaultDetail",
  components: {
    ShotPhoto
  },
  props: {},
  data() {
    return {
      handleStatus: false,
      title: ["设施故障待处理", "自行处理",'维保叫修', "设置故障已解决"],
      active: 0,
      breakDownId: 0,
      form: {
        voice: ""
      },
      have:''
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    ({
      status: this.active,
      breakDownId: this.breakDownId
    } = this.$route.params);
    if(this.$route.params.have !== '0'){
      console.log("维保叫修详情")
      this.have = this.$route.params.have
    }
    console.log("this.active详情页面的路由参数",this.active,this.$route.params)
    this.getDetail();
  },
  methods: {
    // todo 更新设施故障、表单验证(设施故障待处理提交)
    submit() {
      let f ={};
      f.breakDownId = this.breakDownId
      f.solutionWay = this.form.solutionWay
      if(this.active == 0){
        if(this.handleStatus && (this.form.solutionWay == 1|| this.form.solutionWay == 2)){
          f.handleStatus = 3
        }else if(!this.handleStatus && this.form.solutionWay == 1){
          f.handleStatus = 4
        }else if(!this.handleStatus && this.form.solutionWay == 2){
          f.handleStatus = 5
        }
      }else if(this.active == 1){
        if(this.handleStatus){
          f.handleStatus = 3
        }else {
           f.handleStatus = 4
        }
      }else if(this.active == 2){
        if(this.handleStatus){
          f.handleStatus = 3
        }else {
           f.handleStatus = 5
        }
      }
      
      
      f.solutionRemark = this.form.solutionRemark
     
      console.log("f",f)
      this.$axios.put(this.$api.UPDATE_BREAK_DOWN_INFO, f).then(res => {
        console.log("res",res)
          this.$toast.success("保存成功");
          this.$router.back();
      });
    },
    //  todo 获取设施故障详情
    getDetail() {
      console.log("BreakDownId", this.breakDownId )
      this.$axios
        .get(this.$api.GET_BREAK_DOWN_INFO, {
          params: { BreakDownId: this.breakDownId }
        })
        .then(res => {
          console.log("res.success77777777777777777777777777777777777777",res)
          if (res.success) {
            res.result.creationTime = this.deal( res.result.creationTime )
            res.result.dispatchTime = this.deal( res.result.dispatchTime )
            res.result.solutionTime = this.deal( res.result.solutionTime )
            this.form = res.result;
            /* this.form.handleStatus = this.form.handleStatus ? this.form.handleStatus : 4;
            if( this.form.handleStatus == 1){
              this.form.handleStatus =4
            } */
            this.form.solutionWay = this.form.solutionWay ? this.form.solutionWay : 1;
            //  遍历照片
            this.form.photoList = [];
            this.form.truePhoto = [];
            //便利真实照片
            for (let i of res.result.patrolPhotosPath) {
              this.form.truePhoto.push(`${this.$url}${i}`);
            }
            //遍历缩略图
             for (let i of res.result.patrolPhotosBase64) {
              this.form.photoList.push(`data:image/;base64,${i}`);
            }
            console.log("this.form.photoList",this.form.photoList)

            //  语音、文字
            if (this.form.problemVoiceUrl) {
              this.form.problemVoiceUrl = `${this.$url}${this.form.problemVoiceUrl}`;
            } 
          }
        });
    },
    //
    deal(data){
        var str = data.split('T');
        var str2 = str[1].split(".")
        var timestr = str[0] +" "+ str2[0]
        return timestr;
    },
  }
};
</script>

<style lang="scss">
.fault-detail {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  & > :nth-child(2) {
    flex: 2 0 auto;
  }
  /*问题描述文字*/
  &-text {
    margin: 0 0 5px 4px;
  }
  &-remake {
    margin-top: 8px;
  }
  &-label {
    & > div {
      /*background-color: #f0f0f0;*/
    }
    &-radio {
      padding: 8px;
      .van-radio {
        height: 28px;
      }
    }
  }
  .timeBox{
    padding: 0.625rem 1rem;
    font-size: 0.8rem;
    color: #8a8a8a;
    margin: 0px;
    span{
      display: block;
      line-height: 1.5;

    }
  }
}
</style>
