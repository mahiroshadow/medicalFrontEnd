<template>
    <div class="app-container">
        <el-card>
            <el-dialog
                title="日志"
                :visible.sync="dialogVisible"
                width="60%">
                <codemirror v-model="logs" :options="options"></codemirror>
                <span slot="footer" class="dialog-footer">
                    <!-- <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
                </span>
            </el-dialog>
            <el-table
            width="100%"
            :data="container"
            class="data-table"
            :row-class-name="'table-row'"
            >
            <el-table-column align="center">
                <template slot="header">
                    <span class="header"> 容器名称 </span>
                </template>
                <template slot-scope="scope">
                    <span class="field">
                        {{ scope.row.container_name }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column  align="center">
                <template slot="header">
                    <span class="header"> 镜像名称 </span>
                </template>
                <template slot-scope="scope">
                    <span class="field">
                        {{ scope.row.image_id }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center">
                <template slot="header">
                    <span class="header"> 执行语句 </span>
                </template>
                <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.command" placement="top-start">
                    <span  style="text-overflow:ellipsis;white-space:nowrap;">
                        {{ scope.row.command }}
                    </span>
                </el-tooltip>
                </template>
                
            </el-table-column>
            <el-table-column  prop="create_time" align="center">
                <template slot="header">
                    <span class="header"> 创建时间 </span>
                </template>
            </el-table-column>
            <el-table-column   align="center">
                <template slot="header">
                    <span class="header"> 运行状态 </span>
                </template>
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark" v-if="scope.row.status!='exited'"> {{ scope.row.status }}</el-tag>
                    <el-tag type="danger" effect="dark" v-else> {{ scope.row.status }}</el-tag> 
                </template>
            </el-table-column>
            <el-table-column  align="center">
                <template slot="header">
                    <span class="header" > 日志文件 </span>
                </template>
                <template slot-scope="scope">
                    <span class="field" @click="watchLogs(scope.row.container_id)" style="cursor: pointer;">
                        {{ scope.row.log }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center">
                <template slot="header">
                    <span class="header"> 操作 </span>
                </template>
              <template slot-scope="scope">
                <el-button type="text" @click="deleteContainerById(scope.row.container_id)">删除</el-button>
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
import {getContainerStatus,deleteContainer,getContainerLogsById} from '@/api/docker'
import { codemirror } from "vue-codemirror";
export default{
    components:{
        codemirror
    },
    mounted(){
        this.getContainerStatusList()
    },
    data(){
        return{
            logs:'',
            container:[],
            dataSet:[],
            currentPage: 1,
            pageSize: 1,
            dialogVisible:false,
            options: {
                line: true,
                theme: "3024-day", // 主题
                tabSize: 4, // 制表符的宽度
                indentUnit: 2, // 一个块应该缩进多少个空格（无论这在编辑语言中意味着什么）。默认值为 2。
                firstLineNumber: 1, // 从哪个数字开始计算行数。默认值为 1。
                readOnly: true, // 只读
                autorefresh: true,
                smartIndent: true, // 上下文缩进
                lineNumbers: true, // 是否显示行号
                styleActiveLine: true, // 高亮选中行
                viewportMargin: Infinity, //处理高度自适应时搭配使用
                showCursorWhenSelecting: true, // 当选择处于活动状态时是否应绘制游标
                mode: "javascript",
      },
        }
    },
    methods:{
        /**
        * 获取容器状态
        * @param
        **/
        async getContainerStatusList(){
            const {container_status}=await(await getContainerStatus()).data
            this.container=container_status
            console.log(container_status)
        },
        /**
        * 删除容器
        * @param
        **/
        deleteContainerById(container_id){
            const payload={
                container_id:container_id
            }
            deleteContainer(payload).then(res=>{
                console.log(res.data)
                const {data:{status}}=res
                if(status==200)
                    this.getContainerStatusList()
            })
        },
        /**
        * 查看容器日志
        * @param
        **/
        watchLogs(container_id){
            this.logs=""
            const payload={
                container_id:container_id
            }
            this.dialogVisible=true
            getContainerLogsById(payload).then(res=>{
                const {data:{status,logs}}=res
                this.logs=logs
            })

        }
    }
}
</script>
<style scoped>
.field{
    color: rgb(118,160,212);
}
.header{
    color: rgb(33,141,208)
}
.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>