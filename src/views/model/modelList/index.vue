<template>
    <div class="app-container">
        <el-card style="margin-top:20px;">

      <div class="operation">
        <el-row>
            <el-col :span="8">
                <el-button type="primary" icon="el-icon-plus" @click="createModel">创建模型</el-button>
            </el-col>
            <el-col :span="15" :offset="0" class="text-right">
                <div class="flex-container">
                    <el-date-picker
                        v-model="value2"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        style="margin-right: 200px;"
                    ></el-date-picker>
                    <el-input placeholder="搜索模型" v-model="dataName" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="queryFile"></el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
      </div>
      
      <div v-if="modelSet.length === 0" class="empty">
        <img src="@/assets/images/empty.png" />
        <div>暂无模型哦,<span style="color:#409EFF">"快去创建吧"</span></div>
      </div>

      <div v-else>
        <el-card style="overflow: auto; height: 600px; margin: 30px auto;">
        <div style="text-align: center;">
            <span>已添加模型</span>
            <el-divider></el-divider>
            
        </div>
        <el-row style="margin-bottom: -20px;">
            <el-col :span="24 / 6" v-for="(model, index) in modelSet" :key="index" style="margin-bottom: 20px; padding: 10px;">
                <el-card :body-style="{ padding: '0px' }" style="width: calc(100% - 20px); height: 230px; margin: auto;">
                    <img src="@/assets/images/model.png" class="image" style="max-height: 120px; width: 100%; object-fit: cover;">
                    <div style="padding: 14px;">
                    <span>{{ model.modelName }}</span>
                    <div class="bottom clearfix">
                        <time class="time">{{ model.createTime }}</time>
                        <el-button type="text" class="button">查看详情</el-button>
                    </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        </el-card>

      </div>
             
        </el-card>
        
    </div>
</template>
<script>

import { getToken } from '@/utils/auth'
import { getBasicInfo } from '@/api/bigData'
import { getLastRouter  } from '@/utils/rechangeInfo'

export default {

    name:'dataList',
    mounted() {
        this.myCharts = this.$echarts.init(document.getElementById('load'))
        this.getPcaData().then(res => {
            this.myCharts.setOption(this.getOption(res))
        })
    },
    created() {
        // this.initSokcet()
    },
    data() {
        return {
            dataName:'',
            onlinePeople: 0,
            modelNums: 0,
            myCharts: {},
            modelSet: [
            { 'modelName': 'data_train1', 'createTime': '2023-07-09', 'fileSize':'14.87MB','createPeople': 'nuist', 'remark': 20 },
                { 'modelName': 'data_train_1000', 'createTime': '2023-07-04', 'fileSize':'14.87MB','createPeople': 'wsy', 'remark': 18 },
                { 'modelName': 'train_1000', 'createTime': '2023-07-06','fileSize':'14.87MB', 'createPeople': 'nuist', 'remark': 15 },
                { 'modelName': 'train_2000', 'createTime': '2023-07-01','fileSize':'14.87MB', 'createPeople': 'nuist', 'remark': 12 },
                { 'modelName': 'train_x', 'createTime': '2023-07-02', 'fileSize':'14.87MB','createPeople': 'wsy', 'remark': 11 },
                { 'modelName': 'data_train1', 'createTime': '2023-07-09', 'fileSize':'14.87MB','createPeople': 'nuist', 'remark': 20 },
                { 'modelName': 'data_train_1000', 'createTime': '2023-07-04', 'fileSize':'14.87MB','createPeople': 'wsy', 'remark': 18 },
                { 'modelName': 'train_1000', 'createTime': '2023-07-06','fileSize':'14.87MB', 'createPeople': 'nuist', 'remark': 15 },
                { 'modelName': 'train_2000', 'createTime': '2023-07-01','fileSize':'14.87MB', 'createPeople': 'nuist', 'remark': 12 },
                { 'modelName': 'train_x', 'createTime': '2023-07-02', 'fileSize':'14.87MB','createPeople': 'wsy', 'remark': 11 },
                { 'modelName': 'data_train1', 'createTime': '2023-07-09', 'fileSize':'14.87MB','createPeople': 'nuist', 'remark': 20 },
                { 'modelName': 'data_train_1000', 'createTime': '2023-07-04', 'fileSize':'14.87MB','createPeople': 'wsy', 'remark': 18 },
                { 'modelName': 'train_1000', 'createTime': '2023-07-06','fileSize':'14.87MB', 'createPeople': 'nuist', 'remark': 15 },
                { 'modelName': 'train_2000', 'createTime': '2023-07-01','fileSize':'14.87MB', 'createPeople': 'nuist', 'remark': 12 },
                { 'modelName': 'train_x', 'createTime': '2023-07-02', 'fileSize':'14.87MB','createPeople': 'wsy', 'remark': 11 },
            ],
            timer: {},
            pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
         }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        value2: ''
        }
    },
    methods: {
        //初始化websocket
        initSokcet() {
            console.log(getToken())
            const conUrl = 'ws://112.74.58.26:13390/websocket/' + getToken()
            const socket = new WebSocket(conUrl)
            //建立socket连接连接成功后完成请求
            socket.onopen = () => {
                getBasicInfo().then(res => {
                    const { onlinePeople, modelNums } = res.data
                    this.modelNums = modelNums
                    this.onlinePeople = onlinePeople
                })
            }
            //先向接口发送请求
            //接收socket消息
            socket.onmessage = (res) => {
                //当socket接收到res消息中进度为100%时断开连接
                //socket.close()
                // console.log(res.data)
                // this.percentage = parseInt(res.data)
            }
        },
             
        getModelSet() {
            const a = document.createElement('a')
            a.setAttribute('href', 'https://wsystorage-1316338016.cos.ap-nanjing.myqcloud.com/train-set/train_10000.csv')
            a.setAttribute('download', '')
            a.click()
            a.remove()
        },
        deleteModel(index){
             if (index >= 0 && index < this.dataSet.length) {
            this.dataSet.splice(index, 1);
        }
        },
        createModel(){
            this.$router.push({ path: '/model/createModel' })
        },
         backToLastPage() {
            this.$router.push({ path: getLastRouter() })
        },
        }
    }

</script>
<style scoped>
 .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
.info-container {
    width: 100%;
    height: 100%;
    display: flex;
}

.el-row .el-card {
    height: 120px;
}

ul {
    list-style: none;
    padding: 0px;
}

.title {
    font-family: "微软雅黑";
    font-size: 18px;
}
.operation {
  width: 100%;
  position: relative;
  height: 42px;
  align-items: center;
}

.el-input {
  width: 260px;
  position: absolute;
  right: 0%;
  margin-bottom: 20px;

}

.empty {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-image: url('../../../assets/images/empty.png');
  background-size: cover;
  background-repeat: no-repeat; */
}

.flex-container {
    margin: 0;
        display: flex;
        justify-content: flex-end;
    }

</style>