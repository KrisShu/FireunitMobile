<template>
  <div class="aiBox">
       <base-nav title="AI智能分析报警"></base-nav>
        <div class="aiBox_content">
            <base-list
              @onLoad="GetVisionAlarmList"
              @refresh="GetVisionAlarmList"
              :mostlist="false"
              :tableList="tableList"
            >
              <div class="slot_content " slot-scope="scope" slot="content">
                    <p class="display_p">
                        <span class="speical_span">
                            <i>【设备编号】：</i>
                            {{scope.item.creationTime}}
                        </span>
                    </p>
                    <p class="display_p">
                        <span class="speical_span">
                            <i>【警情类型】：</i>
                            {{scope.item.visionAlarmType}}
                        </span>
                    </p>
                    <p class="display_p">
                        <span class="speical_span">
                            <i>【视觉设备】：</i>
                            {{scope.item.visionDevice}}
                        </span>
                    </p>
                    <p class="display_p">
                        <span class="speical_span">
                            <i>【监控地点】：</i>
                            {{scope.item.location}}
                        </span>
                    </p>
                    <van-button @click="showImg(scope.item.visionAlarmId)" size="small" type="info">查看图片</van-button>
              </div>
            </base-list>
        </div>

  </div>
</template>

<script>
import { ImagePreview } from "vant";
import Vue from "vue";

Vue.use(ImagePreview);
export default {
    data(){
        return{
            tableList:[],
            page:{
                FireUnitId :this.$store.state.userInfo.fireUnitID,
                VisionAlarmType :0
            },
            srcList:[]
        }
    },
    methods:{
        GetVisionAlarmList(success){
            let x = arguments[0] instanceof Object;
            let p = this.page;
            if (!x) {
                p.SkipCount = 0;
                this.tableList = [];
            }
            this.$axios.get(this.$api.GetVisionAlarmList,{params:this.page}).then(res=>{
                console.log("res",res);
                for(let arr of res.result.items){
                    arr.creationTime = this.delTime(arr.creationTime)
                };
                this.tableList = this.tableList.concat(res.result.items);
                p.total = res.result.totalCount;
                x ? success(this.tableList.length, res.result.totalCount, p) : "";
            }).catch(err=>{
                console.log("err",err)
            })
        },
        //时间处理格式
        delTime(data){
            var str = data.split('T');
            var str2 = str[1].split(".")
            var timestr = str[0] +" "+ str2[0]
            return timestr;
        },
        showImg(id){
            this.srcList =[]
            this.$axios.get(this.$api.GetVisionAlarmPhotoPath,{params:{
                visionAlarmId:id
            }}).then(res=>{
                console.log("res",res)
                let img = `${this.$url}${res.result}`
                this.srcList.push(img)
                let instance = ImagePreview({
                    images: this.srcList,
                    closeOnPopstate: true
                });
                this.setBackButton(function() {
                    instance.close();
                });
            })
        }
    }
}
</script>

<style lang="scss">
.aiBox{
    .aiBox_content{
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