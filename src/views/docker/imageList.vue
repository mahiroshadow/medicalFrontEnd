<template>
    <div class="app-container">
        <el-card>
            <el-button type="primary" @click="dialogVisible=true" icon="el-icon-plus">DockerFile构建</el-button>
            <el-dialog
                title="镜像构建"
                :visible.sync="dialogVisible"
                width="30%">
              <el-form ref="imageBuildForm" :rules="rules" :model="imageBuildData" label-width="100px"> 
                  <el-form-item label="DockerFile" prop="dockerfile">
                    <div style="display: flex;">
                      <el-input v-model="imageBuildData.fileName" :disabled="true"></el-input>
                      <el-upload class="upload-demo" ref="upload" action="" :file-list="fileList" accpet=".csv" :auto-upload="true"
                        limit="1" :http-request="handleUpload" :show-file-list="false">
                      <el-button slot="trigger" type="primary" :disabled="uploading">选择</el-button>
                    </el-upload> 
                    </div>
                    </el-form-item>
                    <el-form-item label="镜像名称" prop="imageName">
                      <el-input v-model="imageBuildData.imageName"></el-input>
                    </el-form-item>
                    <el-form-item label="镜像标签" prop="imageTag">
                      <el-input v-model="imageBuildData.imageTag"></el-input>
                    </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="buildImage">构 建</el-button>
              </span>
            </el-dialog>


            <el-table
              width="100%"
              :data="imageList"
              class="data-table"
              :row-class-name="'table-row'"
            >
            <el-table-column label="镜像名称" prop="image_name" align="center"></el-table-column>
            <el-table-column label="文件大小" prop="image_size" align="center">
              <template slot-scope="scope">
                  {{ scope.row.image_size }}
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="create_time" align="center"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            :current-page="currentPage"
            :page-sizes="[pageSize]"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="dataSet.length"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-card>
    </div>
</template>
<script>    
import {getImageList,buildDockerImage} from '@/api/docker'

export default{
    mounted(){
      this.getDockerImageList()
    },
    data(){
        return{
          imageList:[],
          dialogVisible:false,
          rules:{
            dockerfile:[
              {required:false}
            ],
            imageName:[
              {required:true,message:'请输入名称',trigger:'blur'},
              {min:3,max:8,message:'字符在3-8字内',trigger:'blur'}
            ],
            imageTag:[
              {required:true,message:'请输入标签',trigger:'blur'},
              {min:1,max:5,message:'字符在3-5字内',trigger:'blur'}
            ]
          },
          imageBuildData:{
              fileName:'',
              imageName:'',
              imageTag:''
          },
          uploadFile:{},
          dataSet:[],
          currentPage: 1,
          pageSize: 1,
        }
    },
    methods:{
      async getDockerImageList(){
        const {imageList }=await (await getImageList()).data
        //将日期进行转换
        imageList.forEach(item => {
            item.create_time=new Date(item.create_time).toLocaleDateString()
        })
        this.imageList=imageList
      },
      handleUpload(param){
        const file=param.file
        this.imageBuildData.fileName=file.name
        this.uploadFile=file
        //清空文件列表
        this.fileList.pop()
      },
      buildImage(){
        //验证表单
        this.$refs.imageBuildForm.validate(valid=>{
            if(valid){
              const fd=new FormData()
              const keys=Object.keys(this.imageBuildData)
              keys.forEach(key=>fd.append(key,this.imageBuildData[key]))
              fd.append('file',this.uploadFile)
              buildDockerImage(fd).then(res=>{
                const {data:{status}}=res
                if(status==200)
                  this.$message.success('创建成功')
                this.dialogVisible=false
              })
            }else
              console.log(1)
        })
        
  
      }

    }
}
</script>
<style scoped>
.pagination {
  margin-top: 20px;
  text-align: center;
}

</style>