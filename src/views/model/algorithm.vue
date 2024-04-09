<template>
    <div class="app-container">     
    <el-dialog
            title="算法信息"
            :visible.sync="dialogVisible"
            width="34%"
            :before-close="handleClose"
            label-width="80px">
            <el-form :model="model" ref="algorithmForm" :rules="rules" label-width="100px" style="max-width:500px;">
            <el-form-item label="算法文件">
                <div class="file-upload">
                    <el-input v-model="algorithm.algorithmFileName" placeholder="算法文件" :disabled="true"></el-input>

                    <el-upload class="upload-demo" ref="upload" action="" :file-list="fileList" accpet=".csv" :auto-upload="true"
                    limit="1" :http-request="handleUpload" :show-file-list="false">
                        <el-button slot="trigger" type="primary" icon="el-icon-upload" :disabled="uploading">选择文件</el-button>
                    </el-upload> 

                </div>
                </el-form-item>
            <el-form-item label="启动代码">
                <el-input v-model="algorithm.startCode" placeholder="请输入启动代码"></el-input>
            </el-form-item>
            <el-form-item prop="algorithm" label="算法名称">
              <el-input v-model="algorithm.algorithmName" placeholder="请输入算法描述(3-8个字)"></el-input>
            </el-form-item>
            <el-form-item label="算法描述" prop="modelDescription">
              <el-input type="textarea" v-model="algorithm.algorithmDescription" :rows="5" placeholder="请输入模型描述(100字以内)"></el-input>
            </el-form-item>
            
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAlgorithm">立即创建</el-button>
          </span>
        </el-dialog>

        <el-card>
            <el-button type="primary" icon="el-icon-plus" @click="dialogVisible=true">自定义算法</el-button>
            <el-row :gutter=20>
                <el-col :span="24">
                    <el-card class="data-set-card" style="height: 650px;">
                        <div class="card-header">已添加算法</div>
                        <el-table
                            width="100%"
                            :data="algorithmList"
                            class="data-table"
                            :row-class-name="'table-row'"
                        >
                    <el-table-column label="算法名称" prop="algorithm_name" align="center"></el-table-column>
                    <el-table-column label="算法描述" prop="algorithm_description" align="center"></el-table-column>
                    <el-table-column label="上传时间" prop="upload_time" align="center"></el-table-column>
                    <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="train(scope.row)">训练</el-button>
                        <el-button type="text" @click="deleteAlgorithm(scope.row)" :disabled="scope.row.type==0">删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                <el-pagination layout="prev, pager, next" :page-size="2" :total="total" :current-page.sync="currentPage"
                    @current-change="pageChange">
                </el-pagination>
                </div>
            </el-card>
                </el-col>
            </el-row>
             
        </el-card>

    </div>
</template>
<script>
import {algorithmUpload,getAlgorithm,modelTrain} from '@/api/model'
export default{
    mounted(){
        this.queryModelList()
        // setInterval(()=>{
        //     this.checkDockerStatus()
        // },1000*2)
    },
    data(){
        return{
            dialogVisible:false,
            algorithm:{
                algorithmName:'',
                algorithmDescription:'',
                algorithmFileName:'',
                startCode:''
            },
            rules:[

            ],
            file:null,
            fileList:[],
            algorithmList:[],
            ws:null
        }
    },
    watch:{

    },
    methods:{
        /**
        * 算法添加
        * @param
        **/
        addAlgorithm(){
            // this.$refs.algorithmForm.validate(valid=>{
            //     this.dialogVisible = false
            //     console.log(valid)
            //     if(valid){
                this.dialogVisible = false
                const fd=new FormData()
                fd.append('file',this.file)
                Object.keys(this.algorithm).forEach(keys=>fd.append(keys,this.algorithm[keys]))
                algorithmUpload(fd)
                this.queryModelList()
                this.$router.push({})
            //     }
            // })
        },
        /**
        * 处理文件上传
        * @param
        **/
        handleUpload(param){
            const file=param.file
            this.algorithm.algorithmFileName=file.name
            this.file=file
            this.fileList.splice(0,1)
        },
        /**
        * 查询算法列表
        * @param
        **/
       async queryModelList(){
            const {status,algorithmList}=await (await getAlgorithm()).data
            if(status==200){
                this.algorithmList=algorithmList
            }
       },

       /**
       * 训练
       * @param
       **/
      train(row){
        
        this.$router.push({
            name:'trainModel',
            params:{
                
            }
        })
      },
      /**
      * 删除算法
      * @param
      **/
      deleteAlgorithm(){
        
      },
      /**
      * 检查容器状态
      * @param
      **/
      checkDockerStatus(){

      },
      /**
      * 初始化webscoket
      * @param
      **/
      initWebScoket(){
        this.ws=new WebSocket("")
        this.ws.onmessage=(msg)=>{
            console.log(msg)
        }
        this.onopen=()=>{
            console.log('打开了连接')
        }
        this.onclose=()=>{
            console.log('关闭了连接')
        }

      }

    }
}

</script>
<style scoped>
.el-card:nth-child(1){
    position: relative;
}
.file-upload{
        display: flex;
}
.pagination {
  position: absolute;
  width: 100%;
  text-align: center;
  right: 0%;
  bottom: 1%;
}


.data-set-card {
  width: 100%;
  height: 400px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.card-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}
</style>