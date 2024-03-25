<template>
  <div class="app-container">
    <!-- 创建模型 -->
    <!-- 
    <el-dialog
            title="模型信息"
            :visible.sync="dialogVisible"
            width="34%"
            :before-close="handleClose"
            label-width="80px">
            <el-form :model="model" ref="model" :rules="rules" label-width="100px" style="max-width:500px;">
            <el-form-item label="模型信息"></el-form-item>
            <el-form-item label="模型类别">
              <span>表格数据预测</span>
            </el-form-item>
            <el-form-item prop="modelName" label="模型名称">
              <el-input v-model="model.modelName" placeholder="请输入模型描述(3-8个字)"></el-input>
            </el-form-item>
            <el-form-item label="模型描述" prop="modelDescription">
              <el-input type="textarea" v-model="model.modelDescription" :rows="5" placeholder="请输入模型描述(100字以内)"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addModel">立即创建</el-button>
          </span>
        </el-dialog>
    -->

    <el-card>
      <div class="operation">
        <!-- <el-button type="primary" icon="el-icon-plus" @click="dialogVisible=true">创建模型</el-button> -->
        <el-input placeholder="搜索模型" v-model="modelName" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="queryModels"></el-button>
        </el-input>
      </div>
   



      <!-- <div v-if="modelSet.length == 0" class="empty">
        <img src="../../../assets/images/empty.png" />
        <div>暂无模型哦,<span style="color:#409EFF">"快去创建吧"</span></div>
      </div> -->

      <el-card style="overflow-y: auto; height: 600px; margin: 30px auto;">
        <div style="text-align: center;">
            <span>已添加模型</span>
            <el-divider></el-divider>
        </div>
        <el-row style="margin-bottom: -20px;" :gutter="40">
            <el-col :span="24 / 6" v-for="(model, index) in modelList" :key="index" style="margin-bottom: 20px; padding: 10px;">
                <el-card :body-style="{ padding: '0px' }" style="width: calc(100% - 20px); height: 320px; margin: auto;">
                    <img src="@/assets/images/model.png" class="image">
                    <div style="padding: 14px;">
                    <div class="label" >模型名称:{{ model.model_name}}</div>
                    <div class="label time">创建时间:{{ model.create_time}}</div>
                    <div class="bottom clearfix">
                        <el-button type="text" class="button" @click="showModelDetail(model.model_id)">查看详情</el-button>
                    </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        </el-card>




      <!-- <div style="margin-top:20px;width: 100%;" v-for="(item, index) in modelSet">
        <el-table :data="item" width="100%">
          <template slot="empty">
            模型创建成功，若无数据集请先在<span style="color:#409EFF">“数据总览”</span>创建 ，上传训练数据训练模型后，可以在此查看
          </template>
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <div style="align-items: center;height:40px;">
                <div style="display: inline-block;height:inherit;line-height: 40px;color: black;">
                  【表格数据预测】 {{ modelSetDuplicate[index].model_name }}
                </div>
                <div style="display: inline-block;float: right;">
                  <el-button type="text" icon="el-icon-monitor" @click="trainModelLinkTo">训练</el-button>
                  <el-button type="text" icon="el-icon-delete" @click="deleteModel(index)">删除模型</el-button>
                </div>
              </div>
            </template>
             <el-table-column label="版本" prop="version" align="center"></el-table-column> 
            <el-table-column label="训练状态" prop="model_status" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.model_status == 1" style="color:#409EFF">
                  <i class="el-icon-loading"></i>
                  <span>训练中</span>
                </div>
                <div v-else style="color:#67C23A">
                  <span>训练完成</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="模型描述" prop="model_description" align="center"></el-table-column>
            <el-table-column label="模型训练时间" prop="" align="center">
              <template slot-scope="scope">
                <span>{{ (parseFloat(scope.row.model_train_time) / 1000).toFixed(2) + 's' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="模型效果" align="center">
              <template slot-scope="scope">
                <div style="margin: 0 auto;">
                  <p>
                    准确率：{{ parseFloat(scope.row.model_effect.accuracy * 100).toFixed(2) + '%' }}
                  </p>
                  <p>
                    精准率：{{ parseFloat(scope.row.model_effect.f1 * 100).toFixed(2) + '%' }}
                  </p>
                  <p>
                    召回率：{{ parseFloat(scope.row.model_effect.recall * 100).toFixed(2) + '%' }}
                  </p>
                  <p>
                    <el-button type="text" @click="watchresult(index)"
                      :disabled="scope.row.model_status == 1">完整评估结果</el-button>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="downloadModel(scope.row.model_store_remotepth)">下载模型</el-button>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div> -->
      <div class="pagination">
        <el-pagination layout="prev, pager, next" :page-size="2" :total="total" :current-page.sync="currentPage"
          @current-change="pageChange">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import { createModel,queryModel} from '@/api/model'
import { modelInfoStore } from '@/utils/modelInfo'
import { setModelBegin, getModelBegin } from '@/utils/rechangeInfo'

export default {
  mounted() {
    this.getModelList()
    this.$nextTick(()=>{
      console.log(this.$refs)
    })
    
  },
  data() {
    return {
      model: {
        modelName: '',
        modelDescription: ''
      },
      rules: {
        modelName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在3-8个字符内', trigger: 'blur' }
        ],
        modelDescription: [
          { required: true, message: '请填写业务描述', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在100字以内', trigger: 'blur' }
        ]
      },
      modelList:[],
      modelName: '',
      dialogVisible:false,
      modelSetDuplicate: [],
      begin: getModelBegin() == undefined ? 0 : getModelBegin(),
      total: 0,
      currentPage: getModelBegin() == undefined ? 1 : parseInt(getModelBegin() / 2 + 1),
    }
  },
  watch: {
    'currentPage'(new_v, old_v) {
      // console.log(new_v)
    }
  },
  methods: {
    /**
    * 添加新模型
    * @param null
    **/
    addModel(){
      this.$refs.model.validate(async valid=>{
          if(valid){
            const {data:{status}}=await (await createModel(this.model)).data
            if(status==200){
                this.$message.success('创建成功')
            }        
          }
          else
            this.$message.error('请填写表单')
          
      })
    },
    /**
    * 查询模型列表
    * @param
    **/
    async getModelList(){
      const {status,modelList}=await (await queryModel()).data
      if(status==200){
        this.modelList=modelList
      }
    },
    /**
    * 
    * @param
    **/
    showModelDetail(modelId){
      console.log(modelId)
      this.$router.push({
        name:'modelEvl',
        params:{
          modelId:modelId
        }
      })
    },


    queryModels() {
      //刷新后数据返回第一界面
      this.$store.dispatch('user/modelnameStore', this.modelName)
      this.begin = 0
      this.currentPage = 1
      setModelBegin(0)
      //清空之前的内容
      this.modelSet = []
      this.modelSetDuplicate = []
      const data = JSON.stringify({ begin: this.begin, vague_name: this.modelName })
      queryModel(data).then(res => {
        const { code, modelList, total } = res.data
        this.modelSetDuplicate = modelList
        this.total = total
        modelList.forEach(element => {
          if (element.model_status == 0)
            this.modelSet.push([])
          else {
            //2:代表训练完成
            if (element.model_status == 2)
              element.model_effect = JSON.parse(element.model_effect)
            this.modelSet.push([element])
          }
        })
      })
    },
    //跳转至训练模型界面
    trainModelLinkTo() {
      this.$router.push({ path: '/model/trainModel' })
    },
    //跳转至创建模型界面
    createModel() {
      this.$router.push({ path: '/model/createModel' })
    },
    //下载模型
    downloadModel(path) {
      const link = document.createElement('a')
      link.setAttribute('href', path)
      link.setAttribute('download', '')
      link.click()
      link.remove()
    },
    //查看模型结果
    watchresult(index) {
      modelInfoStore(this.modelSetDuplicate[index])
      this.$router.push({ path: '/model/evaluate' })
    },
    //获取用户模型列表
    getMyModel() {
      //清空之前的内容
      this.modelSet = []
      this.modelSetDuplicate = []
      const data = JSON.stringify({ begin: this.begin })
      getModelList(data).then(res => {
        const { code, modelList, total } = res.data
        this.modelSetDuplicate = modelList
        this.total = total
        modelList.forEach(element => {
          if (element.model_status == 0)
            this.modelSet.push([])
          else {
            //2:代表训练完成
            if (element.model_status == 2)
              element.model_effect = JSON.parse(element.model_effect)
            this.modelSet.push([element])
          }
        })
      })
    },
    //删除模型
    deleteModel(index) {
      const data = JSON.stringify({ id: this.modelSetDuplicate[index].id })

      this.total -= 1

      this.begin = this.begin >= this.total ? (this.begin - 2 >= 0 ? this.begin - 2 : 0) : this.begin
      setModelBegin(this.begin)
      deleteModel(data).then(res => {
        const { code } = res.data
        if (code == 1) {
          this.$message.success('模型删除成功')
          //删除成功后重新获取该页数据
          this.getMyModel()
        }
        else
          this.$message.error('模型删除失败')
      })
    },
    //调整页码
    pageChange(val) {
      this.begin = (val - 1) * 2
      if (this.$store.state.user.modelname == '') {
        //重新获取页面内容
        this.getMyModel()
        setModelBegin(this.begin)
      }
      else {
        this.modelSet = []
        this.modelSetDuplicate = []
        const data = JSON.stringify({ begin: this.begin, vague_name: this.modelName })
        queryModel(data).then(res => {
          const { code, modelList, total } = res.data
          this.modelSetDuplicate = modelList
          this.total = total
          modelList.forEach(element => {
            if (element.model_status == 0)
              this.modelSet.push([])
            else {
              //2:代表训练完成
              if (element.model_status == 2)
                element.model_effect = JSON.parse(element.model_effect)
              this.modelSet.push([element])
            }
          })
        })
      }
    }

  }
}
</script>
<style scoped>
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

.el-card {
  height: 670px;
  position: relative;
  /* overflow-y: scroll; */
}

.operation {
  width: 100%;
  position: relative;
  height: 42px;
  align-items: center;
}

.input-with-select {
  width: 260px;
  position: absolute;
  right: 0%;
  margin-bottom: 20px;

}

p {
  text-align: center;
  margin: 2px;
}

.pagination {
  position: absolute;
  width: 100%;
  text-align: center;
  right: 0%;
  bottom: 1%;
}

.image{
  display: block;
  margin:0 auto;
  height: 200px;
  width: 80%;
  object-fit: cover;
}

.label{
  margin-top:10px;
  font-size: 15px;
}
</style>