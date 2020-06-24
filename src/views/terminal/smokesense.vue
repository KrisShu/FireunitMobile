<template>
    <div class="smokesenseBox">
        <div class="top_screen">
            <van-button  
                v-for="item in buttonarr"
                :key="item.text"
                plain
                :type="item.type"
                @click="screen(item.text)"
            >
                <van-icon v-if="screensign == item.text" name="star" />
                {{item.text}}
                {{item.num}}

            </van-button>
        </div>
        <!-- 列表 -->
        <base-list
            @onLoad="getList"
            @refresh="getList"
            :mostlist="false"
            :tableList="tableList"
        >
            <div class="slot_content" slot-scope="scope" slot="content">
                <p class="display_p">
                    <span class="speical_span">
                        <i class="left_title">设施编号：</i>
                        {{scope.item.detectorSn}}
                    </span>
                    <span class="speical_span">
                        <i class="left_title">电量：</i>
                         <i :class="getColor(scope.item.powerNum)">{{scope.item.powerNum}}</i>
                    </span>
                </p>
                <p class="display_p">
                    <span>
                        <i class="left_title">安装位置：</i>
                        {{scope.item.location}}
                    </span>
                </p>
                <p class="display_p">
                    <span>
                        <i class="left_title">设施状态：</i>
                        <i class="gary" v-if="scope.item.state == -1">离线</i>
                        <i class="green" v-if="scope.item.state == 1">正常</i>
                        <i class="yellow" v-if="scope.item.state == 2">故障</i>
                    </span>
                </p>
            </div>
        </base-list>
    </div>
</template>

<script>
export default {
    data(){
        return{
            buttonarr:[
                {
                    type:'info',
                    text:'全部'
                },
                {
                    type:'primary',
                    text:'正常',
                    num:0
                },
                {
                    type:'warning',
                    text:'故障',
                    num:0
                },
                {
                    type:'default',
                    text:'离线',
                    num:0
                }
            ],
            screensign:'全部',
            tableList:[],
            page:{
                fireUnitId:this.$store.state.userInfo.fireUnitID, 
                state:''
            }
        }
    },
    created(){
        this.GetIndependentDetectorStatesNum()
    },
    methods:{
        //筛选
        screen(text){
            this.screensign = text;
            if(text == '全部'){
                this.page.state = ''
            }else{
                this.page.state = text
            }
            this.getList();
        },
        GetIndependentDetectorStatesNum(){
            this.$axios.get(this.$api.GetIndependentDetectorStatesNum,
            {params:{fireunitId:this.$store.state.userInfo.fireUnitID}}).then(res=>{
                console.log("状态",res);
                this.buttonarr[1].num = res.result.normalNum;
                this.buttonarr[2].num = res.result.faultNum;
                this.buttonarr[3].num = res.result.offlineNum;
            })
        },
        getList(success) {
            let x = arguments[0] instanceof Object;
            let p = this.page;
            if (!x) {
                // console.log("noooooooo")
                p.SkipCount = 0;
                this.tableList = [];
            }
            this.$axios.get(this.$api.GetIndependentDetectorList,{params: p}).then(res=>{
                console.log("获取列表",res);
                this.tableList = this.tableList.concat(res.result.items);
                p.total = res.result.totalCount;
                x ? success(this.tableList.length, res.result.totalCount, p) : "";
            })
        },
        getColor(num){
            if(num >20){
                return 'green'
            }else if(num<=20){
                return 'yellow'
            }else{
                 return 'gary'
            }
        }
    }
}
</script>

<style lang="scss">
    .smokesenseBox{
        padding: 12px;
        .top_screen{
            display: flex;
            justify-content: space-between;
            padding: 10px 0px;
            .van-button{
                height: 30px;
                padding: 6px;
                line-height: 0px;
            }
            .van-button--default{
                border: 1px solid rgb(110, 110, 110);
            }
        }
        .van-cell-group{
            background: #F8F8F8;
            .van-cell{
                margin-bottom: 10px;
                border-radius: 8px;
                border: 1px solid white;
                background: rgb(232, 239, 255);
                .slot_content{
                    .display_p{
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                    }
                    i{
                        font-style:normal;
                        font-weight: bold;
                        &.green{
                              color: #39b143
                        }
                        &.gary{
                              color: #cccccc
                        }
                        &.yellow{
                              color: #ff976a
                        }
                    }
                }
            }
        }
    }
</style>