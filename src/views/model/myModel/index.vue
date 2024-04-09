<template>
  <div class="app-container">
    <el-card>
      <div class="operation">
        <el-input placeholder="搜索模型" v-model="modelName" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="queryModels"></el-button>
        </el-input>
      </div>
      <!-- <el-card style="overflow-y: auto; height: 600px; margin: 30px auto;"> -->
        <!-- <div style="text-align: center;">
            <span>已添加模型</span>
            <el-divider></el-divider>
        </div> -->
        <el-row style="margin-bottom: -20px;" :gutter="40">
            <el-col :span="24 / 2" v-for="item in modelList" :key="index" style="margin-bottom: 20px; padding: 10px;">
                <CardView 
                    title="XGBOOST"
                    :beginTime="item.begin_time"
                    :endTime="item.end_time"
                    :trainTime="item.trainTime"
                    :status="item.status"
                    :containerId="item.container_id"
                    :type="item.type"
                    :savePth="item.save_pth"
                    :testPth="item.test_pth"></CardView>
            </el-col>
        </el-row>
        <!-- </el-card> -->
    </el-card>
  </div>
</template>
<script>
import { createModel,queryModel} from '@/api/model'
import { modelInfoStore } from '@/utils/modelInfo'
import { setModelBegin, getModelBegin } from '@/utils/rechangeInfo'
import CardView from '@/views/components/CardView.vue'


export default {
  components:{
    CardView
  },
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
      modelList:[1,2],
      modelName: '',
      dialogVisible:false,
      modelSetDuplicate: [],
      begin: getModelBegin() == undefined ? 0 : getModelBegin(),
      total: 0,
      currentPage: getModelBegin() == undefined ? 1 : parseInt(getModelBegin() / 2 + 1),
    }
  },
  computed:{
    
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
        this.modelList.forEach(item=>{
          console.log(item.end_time)
            if(item.end_time!=null){
                const begin=new Date(item.begin_time).getTime()
                const end=new Date(item.end_time).getTime()
                const diff=end-begin
                const hours = Math.floor(diff / 3600000)
                const minutes = Math.floor((diff % 3600000) / 60000)
                const seconds = Math.floor((diff % 60000) / 1000)
                Object.assign(item,{trainTime:`${hours}:${minutes}:${seconds}`})
            }
            else{
              item.end_time='未知'
              item.trainTime='未知'
            }
            // item.status=item.status==0?'训练中':'训练完成'
        })
        console.log(modelList)
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
  min-height: 670px;
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