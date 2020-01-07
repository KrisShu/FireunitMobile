<template>
  <div class="electric_box">
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
    <base-list
      @onLoad="getList"
      @refresh="getList"
      :mostlist="false"
      :tableList="tableList"
    >
      <div class="slot_content" slot-scope="scope" slot="content">
        <p class="display_p">
          <span class="speical_span">
            <i>设施编号：</i>
            {{scope.item.deviceSn}}
          </span>
        </p>
        <p class="display_p">
           <span>
            <i>设施状态：</i>
            <i class="gary" v-if="scope.item.state == -1">离线</i>
            <i class="green" v-if="scope.item.state == 1">在线</i>
            <i class="green" v-if="scope.item.state == 2">良好</i>
            <i class="red" v-if="scope.item.state == -2">超限</i>
            <i class="yellow" v-if="scope.item.state == -3">隐患</i>
          </span>
        </p>
        <p class="display_p">
          <span>
            <i>安装位置：</i>
            {{scope.item.location}}
          </span>
        </p>
        <div class="display_p">
            <div> 
                <i>当前值：</i>
            </div>
            <div>
                <ul v-if="scope.item.existTemperature">   
                    <li v-if="scope.item.phaseType == 1">
                        <span>
                            L：{{scope.item.l}}
                        </span>
                    
                        <span>
                            N：{{scope.item.n}} 
                        </span>
                    </li>
                    <li v-if="scope.item.phaseType == 2">
                        <span>
                            L1：{{scope.item.l1}}
                        </span>
                        <span>
                            L2：{{scope.item.l2}}
                        
                        </span>
                        <span>
                            L3：{{scope.item.l3}}
                        </span>
                        
                        <span>
                            N：{{scope.item.n}}
                        </span>
                    </li>
                </ul>
                <ul v-if="scope.item.existAmpere">
                    <li>
                        <span>
                        剩余电流：{{scope.item.a}}
                        </span>
                    </li>
                </ul>
            </div>
           
        </div>
      </div>
    </base-list>
  </div>
</template>

<script>
export default {
  data(){
    return {
        buttonarr:[
            {
                type:'info',
                text:'全部'
            },
            {
                type:'primary',
                text:'良好',
                 num:0
            },
            {
                type:'warning',
                text:'隐患',
                 num:0
            },
            {
                type:'danger',
                text:'超限',
                 num:0
            },
            {
                type:'default',
                text:'离线',
                 num:0
            }
        ],
        screensign:'全部',
        tableList: [],
        page: {
            fireUnitId:'',
            state:''
            // total: 0
        }
    };
  },
  created(){
    let setUserInfo = JSON.parse(localStorage.getItem('setUserInfo')) 
    this.page.fireUnitId = setUserInfo.fireUnitID
    this.GetFireElectricDeviceState()
  },
  methods: {
    //获取状态数量
    GetFireElectricDeviceState(){
        let FireUnitId = this.page.fireUnitId
        this.$axios.get(this.$api.GetFireElectricDeviceState,{params:{FireUnitId}}).then(res=>{
            console.log("获取电气设施火灾的状态数量",res.result)
            this.buttonarr[1].num = res.result.goodNum
            this.buttonarr[2].num = res.result.badNum
            this.buttonarr[3].num = res.result.warnNum
            this.buttonarr[4].num = res.result.offlineNum
            // this.ElectricDeviceState = res.data.result
        })
    },
    screen(text){
        this.screensign = text;
        if(text == '全部'){
            this.page.state = ''
        }else{
            this.page.state = text
        }
        this.getList();

    },
    getDetail() {},
    getList(success) {
      let x = arguments[0] instanceof Object;
      let p = this.page;
      if (!x) {
        p.SkipCount = 0;
        this.tableList = [];
      }
      this.$axios
        .get(this.$api.GetFireElectricDeviceList, {
          params: p
        })
        .then(res => {
          this.tableList = this.tableList.concat(res.result.items);
          p.total = res.result.totalCount;
          x ? success(this.tableList.length, res.result.totalCount, p) : "";
        });
    }
  }
};
</script>

<style lang="scss">
  .electric_box{
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
                ul{
                    li{
                            span{
                                display: block;
                            }
                    }
                }
                span{
                    display: inline-block;
                }
                 i{
                    font-style:normal;
                    font-weight: bold;
                    &.gary{
                        color: #cccccc;
                    }
                    &.green{
                        color: #07c160;
                    }
                    &.yellow{
                        color: #ff976a;
                    }
                    &.red{
                        color: #ee0a24;
                    }
                }
            }
        }
      }
      
    }
    
  }
  
</style>
