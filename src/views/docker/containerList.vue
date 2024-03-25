<template>
    <div class="app-container">
        <el-card>
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
            <el-table-column prop="command" align="center">
                <template slot="header">
                    <span class="header"> 执行语句 </span>
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
                   <el-tag type="success" effect="dark"> {{ scope.row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column  align="center">
                <template slot="header">
                    <span class="header"> 日志文件 </span>
                </template>
                <template slot-scope="scope">
                    <span class="field">
                        {{ scope.row.log }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center">
                <template slot="header">
                    <span class="header"> 操作 </span>
                </template>
              <template slot-scope="scope">
                <el-button type="text" @click="">停止</el-button>
                <!-- <el-button type="text" @click="">处理</el-button> -->
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
import {getContainerStatus} from '@/api/docker'

export default{
    mounted(){
        this.getContainerStatusList()
    },
    data(){
        return{
            container:[],
            dataSet:[],
            currentPage: 1,
            pageSize: 1
        }
    },
    methods:{
        async getContainerStatusList(){
            const {container_status}=await(await getContainerStatus()).data
            this.container=container_status
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