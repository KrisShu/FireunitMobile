<template>
  <div class="updateSystem">
        <base-nav title="系统升级"></base-nav>
        <div class="text_center" v-if="version == versionResult.versionNo">
            <img src="../../assets/logo.png" alt="">
            <p>版本号 {{versionResult.versionNo}}</p>
            <p>已是最新版本</p>
        </div>
       <div v-else>
            <div class="text_center">
                    <img src="../../assets/logo.png" alt="">
                    <p>版本号 {{version}}</p>
            </div>
            <div class="newversion">
                <p>更新版本：{{versionResult.versionNo}}</p>
                <p class="newtip">{{versionResult.versionRemark}}</p>
            </div>
            <div class="bnts">
                <van-button @click="checkisexistence" type="info" size="large">下载并安装</van-button>
            </div>
           
       </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
export default {
    data(){
        return{
            version:'',
            versionResult:'',
            apk_name:'',
            relativePath :'',
            loadingtoast:'',
        }
    },
     created(){
        this.version = localStorage.getItem('version');
        this.checkVersion();

    },
    methods:{
        checkVersion(){
            this.$axios.get(this.$api.GetNewestVersion,{params:{AppType:2}}).then(res=>{
                console.log("res",res)
                this.versionResult = res.result;
            })
        },
        //监测是否已存在安装包
        checkisexistence(){
            this.loadingtoast = Toast.loading({
                message: '下载中...',
                forbidClick: true,
                duration:0
            });
            if(!window.plus){
                return
            }
            let filename = '防火单位预警系统手机端.apk',
            relativePath = "_downloads/" + filename,
            that = this;
            //检查文件是否已存在
            plus.io.resolveLocalFileSystemURL(relativePath, 
                function(entry) {
                    //如果文件存在则删除该文件
                    plus.io.resolveLocalFileSystemURL(relativePath, function(entry2) {
                        entry2.remove(function(entry2) {
                            console.log("文件删除成功==" + relativePath);
                            that.download()
                        }, function(e) {
                            console.log("文件删除失败=" + relativePath);
                        });
                    });
                },
                function(e) {
                    console.log("文件不存在,联网下载=" + relativePath);
                    //如果文件不存在,则去下载
                    that.download()
                }
            )

        },
        download() {
            let that = this;
            this.apk_name = '防火单位预警系统手机端.apk';
            var dtask = plus.downloader.createDownload(this.versionResult.appPath, 
                {
                    filename:"_downloads/"+this.apk_name    //利用保存路径
                }  , function(d, status){
                // 下载完成
                if(status == 200){ 
                    console.log("Download success: " + d.filename);
                    //下载成功,d.filename是文件在保存在本地的相对路径，使用下面的API可转为平台绝对路径
                    var fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename);
                    console.log("fileSaveUrl",fileSaveUrl)
                    localStorage.clear();
                    that.loadingtoast.clear();
                    plus.runtime.install(fileSaveUrl, {}, 
                        function onSuccess(widgetInfo){
                           console.log('安装成功',widgetInfo)
                        }, function onError(error){
                            console.log('安装error',error)
                        }
                    );
                } else {
                    console.log("Download failed: " + status); 
                    plus.downloader.clear();
                }  
            });
            dtask.start(); 
        }
    }   
}
</script>

<style lang="scss">
    .updateSystem{
        img{
            width: 50px;
        }
        .text_center{
            padding-top: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            p{
                line-height: 2;
                font-size: 16px;
            }
        }
        .newversion{
            padding: 40px;
            line-height: 2;
            .newtip{
                color: rgb(167, 167, 167);
            }
        }
        .bnts{
            position: fixed;
            width: 100%;
            box-sizing: border-box;
            bottom: 20px;
            padding: 20px;
        }
    }
</style>