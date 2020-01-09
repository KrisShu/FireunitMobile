<template>
  <div class="index-tem">
      <!-- 菜单状态为维保叫修 -->
      <div class="top_screen" v-if="active == 2">
        <van-button  
          v-for="item in buttonarr"
          :key="item.text"
          plain
          :type="item.type"
          @click="screen(item.text)"
        >
            <van-icon v-if="screensign == item.text" name="star" />
            {{item.text}}

        </van-button>
      </div>

    <base-list
      @cellClick="getDetail"
      @onLoad="getList"
      @refresh="getList"
      :table-name="tableName"
      :table-list="tableList"
    >
      <span slot="cellTitle" slot-scope="scope">
        {{ scope.item.userName }} ({{ scope.item.userPhone }})
      </span>
      <span slot="cellValue" slot-scope="scope">
        {{$store.state.getAction[scope.item.source]}}
      </span>
      <span v-if="pageTotal.HandleStatus == 6" slot="cellLabel" slot-scope="scope">
        {{timeType[6].label}}{{ scope.item[timeType[6].value] }}
      </span>
      <div v-else slot="cellLabel" slot-scope="scope">
       
          {{timeType[active].label}}{{ scope.item[timeType[active].value] }}
        <!-- 自行处理中 -->
        <p v-if=" (active ==1 || active ==2)">{{timeType[0].label}}{{ scope.item[timeType[0].value] }}</p>
      </div>
    </base-list>
  </div>
</template>

<script>
/**
 *  作者：0          时间：2019/7/1 16:16
 *  1,常量从js文件引入，不要定义魔术变量
 */
export default {
  name: "IndexTem",
  components: {},
  props: {
    // todo 当前激活的选项、用来判断详情的类型、新增、编辑、查看
    active: {
      type: Number,
      default: 0
    },
    special:{
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      timeType: [
        {
          label: "发现时间：",
          value: "creationTime"
        },
        {
          label: "派单时间：",
          value: "dispatchTime"
        },
        {
          label: "派单时间：",
          value: "dispatchTime"
        },
         {
          label: "解决时间：",
          value: "solutionTime"
        },
        {
          label: "解决时间：",
          value: "solutionTime"
        },
        {
          label: "解决时间：",
          value: "solutionTime"
        },
        {
          label: "处理时间：",
          value: "safeCompleteTime"
        }
      ],
      tableList: [],
      tableName: {
        ids:'fault',
        title: "userName",
        smallTitle: "userPhone",
        label: "creationTime",
        value: "source"
      },
      title: "全部来源",
      screensign:'处理完成待确认',
      buttonarr:[
            {
                type:'info',
                text:'处理完成待确认'
            },
            {
                type:'info',
                text:'已派单'
            }
            
        ],
      page: {
        FireUnitId: this.$store.state.userInfo.fireUnitID,
        HandleStatus: 0,
        total: 0
      },
      page2: {
        FireUnitId: this.$store.state.userInfo.fireUnitID,
        HandleStatus: 6,
        total: 0
      },
      pageTotal:{}
    };
  },
  computed: {},
  watch: {},
  created() {
    console.log('列表页面的thisa.active77777777777',this.active,this.special)
    if(this.special==5){
      this.screensign = '已派单'
      this.page2.HandleStatus = 5
    }else if(this.special==6){
      this.screensign = '处理完成待确认'
      this.page2.HandleStatus = 6
    }
  },
  mounted() {
    console.log("pagepage",this.page)
  },
  methods: {
    screen(state){
      this.screensign = state;
      if(state == '处理完成待确认'){
        this.page2.HandleStatus = 6
      }else if(state == '已派单'){
          this.page2.HandleStatus = 5
      }
      this.getList();
    },
    // todo 获取list
    getList(success) {
      let x = arguments[0] instanceof Object;
      let p = this.page;
      if(this.active==1 || this.active == 2){
        
        this.page.HandleStatus = this.active+3
        console.log("this.page.HandleStatus",this.page.HandleStatus)
        if(this.active == 2){
          p = this.page2
          
        }
      }else if(this.active == 3){
         this.page.HandleStatus = this.active
      }else if(this.active ==0){
         this.page.HandleStatus = 1;
      }
  
     
      if (!x) {
        p.SkipCount = 0;
        this.tableList = [];
      }

      console.log("获取列表的参数",p)
      this.pageTotal = p
       console.log("获取列表的参数this.pageTotalthis.pageTotal",this.pageTotal)
      this.$axios
        .get(this.$api.GET_BREAK_DOWNLIST, {
          params: p
        })
        .then(res => {
          console.log("获取列获取列",res)
          if(res.result.totalCount>0){
            for(let arr of res.result.items){
              arr.creationTime = this.deal(arr.creationTime)
              arr.dispatchTime = this.deal(arr.dispatchTime)
              arr.solutionTime = this.deal(arr.solutionTime)
            }
            this.tableList = this.tableList.concat(res.result.items);
          
            p.total = res.result.totalCount;
          }
         
          x ? success(this.tableList.length, res.result.totalCount, p) : "";
          console.log("this.tableList",this.tableList)
        });
    },
     //时间处理
    deal(data){
        var str = data.split('T');
        var str2 = str[1].split(".")
        var timestr = str[0] +" "+ str2[0]
        return timestr;
    },
    //    todo 选项
    onSelect(item) {
      this.show = false;
      this.title = item.name;
      this.$toast(item.name);
    },
    // todo 查看详情、编辑
    getDetail(val) {
      console.log(val,this.pageTotal.HandleStatus);
      if(this.pageTotal.HandleStatus ==5 ||this.pageTotal.HandleStatus ==6){
        console.log("this.pageTotal.HandleStatus2222",this.pageTotal.HandleStatus)
          this.$router.push(`./FaultDetail/${this.active}/${val.breakDownId}/${this.pageTotal.HandleStatus}`);
        
      }else{
        console.log("this.pageTotal.HandleStatus",this.pageTotal.HandleStatus)
       this.$router.push(`./FaultDetail/${this.active}/${val.breakDownId}/0`);
      }
      
    }
  }
};
</script>

<style lang="scss">
.index-tem {
  & > :first-child {
    /*margin-bottom: 4px;*/
    &::after {
      border-width: 0;
    }
  }
  /*下拉框*/
  .van-dropdown-menu {
    height: 22px;
    &:after {
      border-width: 0;
    }
    .van-dropdown-menu__item {
      justify-content: left;
      & > span::after {
        top: 8px;
      }
    }
    .van-dropdown-item--down {
      top: 135px !important;
    }
  }
  .top_screen{
      padding: 10px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .van-button{
          height: 30px;
          width: 50%;
          line-height: 0px;
      }
  }
  .van-cell__title, .van-cell__value{
    flex: none;
  }
  .van-cell__title{
    width: 80%;
  }
  .van-cell__label{
    p{
      line-height: 1.5;
      margin: 0px;
    }
  }
}
</style>
