<template>
    <div class="app-container">
        <el-card style="margin-top:20px;height: 800px;">
          <el-dialog
            title="数据上传"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
            label-width="80px">
            <el-form ref="form" :model="form">
            <el-form-item label="文件名称">
                <el-input v-model="form.filename"></el-input>
                <el-upload class="upload-demo" ref="upload" action="" :file-list="fileList" accpet=".csv" :auto-upload="true"
                    limit="1" :http-request="handleUpload" :show-file-list="false">
                    <el-button slot="trigger" type="primary" icon="el-icon-plus" :disabled="uploading">选择文件</el-button>
                </el-upload> 
            </el-form-item>
            <el-form-item label="文件备注">
                <el-input v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
      </el-dialog>
      <div class="operation">
        <el-row>
          <el-col :span="8">
            <!-- <el-upload class="upload-demo" ref="upload" action="" :file-list="fileList" accpet=".csv" :auto-upload="true"
              limit="1" :http-request="handleUpload" :show-file-list="false">
              <el-button slot="trigger" type="primary" icon="el-icon-plus" :disabled="uploading">导入测试集</el-button> -->
              <el-button type="primary" icon="el-icon-plus" @click="dialogVisible=true">导入测试集</el-button>
            <!-- </el-upload> -->
          </el-col>
            <el-col :span="14" :offset="0" class="text-right">
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
                    <el-input placeholder="搜索数据集" v-model="filename" class="input-with-select">
                      <el-button slot="append" icon="el-icon-search" @click="queryTrainsetData"> </el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
      </div>

      <div v-if="dataSet.length == 0" class="empty">
        <img src="@/assets/images/empty.png" />
        <div>暂无文件哦,<span style="color:#409EFF">"快去创建吧"</span></div>
      </div>

      <div class="data-set-container">
    <el-row :gutter="20" style="margin-top: 10px;" v-if="dataSet.length !== 0">
      <el-col :span="24">
        <el-card class="data-set-card" style="height: 650px;">
          <div class="card-header">已添加数据集</div>
          <el-table
            width="100%"
            :data="currentPageData"
            class="data-table"
            :row-class-name="'table-row'"
          >
            <el-table-column label="文件名称" prop="file_name" align="center"></el-table-column>
            <el-table-column label="文件格式" align="center">
                <template slot-cope="scope.row">
                    {{ "csv" }}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="upload_time" align="center"></el-table-column>
            <el-table-column label="文件大小" prop="size" align="center">
              <template slot-scope="scope">
                  {{ scope.row.size }}KB
              </template>
            </el-table-column>
            <!-- <el-table-column label="备注" prop="fill_type" align="center"></el-table-column> -->
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="getTrainSet(scope.row)">下载</el-button>
                <el-button type="text" @click="dealFile(scope.row)">处理</el-button>
                <el-button type="text" @click="deleteTrainData(scope.row)">删除</el-button>
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
      </el-col>
    </el-row>
  </div>
        </el-card>
        
    </div>
</template>
<script>


//依赖引入
import { getUserUploadTestSet, getClassifiedResult, queryTestSet, deleteTestSet } from '@/api/file'
import { getToken } from '@/utils/auth'
import { setFilePath, setLastRouter, setTestBegin, getTestBegin } from '@/utils/rechangeInfo'
import saveJson from 'file-saver'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { getTrainData,uploadData,queryData,deleteFile} from '@/api/data'

export default {

    name:'dataList',
    mounted() {
      this.getTrainData()
    },
    data() {
        return {
          form: {
              filename: '',
              region: '',
              date1: '',
              date2: '',
              delivery: false,
              type: [],
              resource: '',
              desc: ''
            },
            filename:'',
            dialogVisible:false,
            dataName:'',
            dataSet: [],
            currentPage: 1,
            pageSize: 7,
            //时间选择器
            timer: {},
            pca_x: [],
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
        value2: '',

        //后端交互
        uploading: false,
        testName: '',
        testSetList: [],
        fileList: [],
        total: 0,
        currentPage: getTestBegin() == undefined ? 1 : parseInt(Math.floor(getTestBegin() / 8) + 1),
        begin: getTestBegin() == undefined ? 0 : getTestBegin(),
        dialogVisible: false,
        classifiedSet: [],
        classifiedSets: [],
        myCharts: null,
        jsonData: ''
        }
        
    },
    computed: {
        currentPageData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.dataSet.slice(start, end);
    },
  },
  
    methods: {
      //获取训练数据
      getTrainData(){
        getTrainData().then(res=>{
        this.dataSet=res.data.trainList
        console.log(this.dataSet)
        })
      },
      queryTrainsetData(){
        const query={'filename':this.filename,'date':this.value2}
        queryData(query).then(res=>{
            const {data:{trainList}}=res
            this.dataSet=trainList
        })
      },
      //删除文件
      deleteTrainData(row){
        const deleteInfo={"id":row.id,"save_pth":row.save_pth}
        deleteFile(deleteInfo).then(res=>{
          const {data:{status}}=res
          if(status==200){
            this.getTrainData()
          }
          else{
            this.$message.error('删除失败')
          }
        })
      },
      //处理跳转
      dealFile(row){
        this.$router.push({name:'dataTreat',params:{
          id:row.id,save_pth:row.save_pth
        }})
      },
      handleCurrentChange(val) {
          this.currentPage = val;
      },
      getTrainSet() {
          const a = document.createElement('a')
          a.setAttribute('href', 'https://wsystorage-1316338016.cos.ap-nanjing.myqcloud.com/train-set/train_10000.csv')
          a.setAttribute('download', '')
          a.click()
          a.remove()
      },
      deleteData(index){
        if (index >= 0 && index < this.dataSet.length) {
            this.dataSet.splice(index, 1);
        }
      },
      createFile(){
          this.$router.push({ path: '/bigData/dataCreate' })
      },

    queryTestSets() {
      this.$store.dispatch('user/testnameStore', this.testName)
      this.begin = 0
      this.currentPage = 1
      setTestBegin(0)
      const data = JSON.stringify({ vague_name: this.testName, begin: this.begin })
      queryTestSet(data).then(res => {
        const { testSetList, total } = res.data
        this.testSetList = testSetList
        this.total = total
      })
    },
    //删除文件
    fileDelete(row) {
      const { id, test_filepath } = row
      const data = JSON.stringify({ id: id, test_filepath: test_filepath })
      this.total -= 1
      this.begin = this.begin >= this.total ? (this.begin - 8 >= 0 ? this.begin - 8 : 0) : this.begin
      setTestBegin(this.begin)
      deleteTestSet(data).then(res => {
        const { code } = res.data
        if (code == 1) {
          this.$message.success('删除成功')
          this.getTestSetList()
        }
        else {
          this.$message.success('删除失败')
        }
      })
    },



    //上传验证集
    handleUpload(params) {
      this.form.filename=params.file.name
      
      // this.$notify.info({
      //   title: '提示',
      //   dangerouslyUseHTMLString: true,
      //   message: '<div style="color:#409EFF;"><i class="el-icon-loading"></i>上传中请耐心等待</div>',
      //   showClose: false,
      //   duration: 0
      // });
      // this.uploading = true
      // const file = params.file
      // const formData = new FormData()
      // formData.append('file', file)
      // uploadData(formData).then(res=>{
      //   this.$notify.closeAll()
      //   this.getTrainData()
      // })
      // uploadVerifySet(formData).then(res => {
      //   //不管是否上传成功都关闭
      //   this.$notify.closeAll()
      //   const { code } = res.data
      //   if (code == 1) {
      //     this.uploading = false
      //     this.$message.success('文件上传成功')
      //     this.$refs.upload.clearFiles()
      //   }
      //   else {
      //     this.$message.error('文件上传失败')
      //   }
      // })
    },
    //获取用上传的测试集
    getTestSetList() {
      const data = JSON.stringify({ begin: this.begin })
      getUserUploadTestSet(data).then(res => {
        const { testSetList, total } = res.data
        this.testSetList = testSetList
        this.total = total
      })
    },
    handleEdit(row) {
      setFilePath(row.test_filepath)
      setLastRouter('/data/test')
      // 跳转至页面查看
      this.$router.push({ path: '/data/csvreader' })
    },
    open() {
      this.$nextTick(() => {
        this.initialCharts()
      })
    },
    //查询分类结果
    queryClassifiedResult(row) {
      this.classifiedSet = []
      this.classifiedSets = []
      const { id } = row
      getClassifiedResult(JSON.stringify({ id: id })).then(res => {
        let { classified_result, detail_classified } = res.data.userTestSet
        this.jsonData = detail_classified
        classified_result = JSON.parse(classified_result)
        for (var i = 0; i < 6; i++) {
          this.classifiedSet.push({ name: 'label' + i, value: parseInt(classified_result[i]) })
        }
        this.classifiedSets.push({
          label0: classified_result[0], label1: classified_result[1],
          label2: classified_result[2], label3: classified_result[3],
          label4: classified_result[4], label5: classified_result[5]
        })
        this.dialogVisible = true
      })
    },
    //导出json
    exportJson() {
      let arr = new Blob([this.jsonData], { type: 'text/plain;charset=utf-8' })
      saveJson(arr, `validate.json`)
    },
    //导出excel
    exportExcel() {
      var xlsxParam = { raw: true };
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(
        document.querySelector("#outputData"),
        xlsxParam
      )
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      })
      try {
        FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          "outputData.xlsx"
        )
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout)
      }
      return wbout
    },
    pageChange(val) {
      this.begin = (val - 1) * 8
      if (this.$store.state.user.testName == '') {
        setTestBegin(this.begin)
        this.getTestSetList()
      }
      else {
        const data = JSON.stringify({ vague_name: this.testName, begin: this.begin })
        queryTestSet(data).then(res => {
          const { testSetList, total } = res.data
          this.testSetList = testSetList
          this.total = total
        })
      }

    },
        }
    }

</script>
<style scoped>
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
  width: 200px;
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
.data-set-container {
        height: 400px;
  padding: 20px;
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
}
.data-table {
  width: 100%;
}
.table-row {
  cursor: pointer;
}
.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>@/api/data