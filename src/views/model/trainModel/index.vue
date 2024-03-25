<template>
  <div class="app-container">
    <el-card>
      <el-form :model="model"  ref="modelTrainForm" label-width="100px" class="demo-ruleForm">
        <!-- <el-form-item label="模型选择" prop="modelChoose">
          <el-select v-model="model.modelChoose" placeholder="请选择模型">
            <el-option v-for="(item, index) in modelList" :label="item.model_name" :value="index"></el-option>
          </el-select>
        </el-form-item> -->
        
        <el-form-item label="算法选择" prop="trainChoose">
          <el-select v-model="model.algorithmChoose" placeholder="请选择数据集" @change="algorithmType=algorithmList[model.algorithmChoose].type">
            <el-option v-for="(item,index) in algorithmList" :label="item.algorithm_name" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="训练集选择" prop="trainChoose" v-if="algorithmType==0">
          <el-select v-model="model.trainChoose" placeholder="请选择数据集">
            <el-option v-for="(item,index) in trainList" :label="item.file_name" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有测试集" v-if="algorithmType==0">
          <el-radio-group v-model="hasTest">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="测试集选择" prop="testChoose" v-if="hasTest && algorithmType==0">
          <el-select v-model="model.testChoose" placeholder="请选择数据集">
            <el-option v-for="item in trainList" :label="item.filename" :value="item.train_filepath"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="镜像选择" prop="mirrorChoose">
          <el-select v-model="model.mirrorChoose" placeholder="请选择镜像">
            <el-option v-for="item in mirrorList" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标对象">
          <div>Label标签</div>
        </el-form-item>
        <el-form-item label="算法类型">
          <div>多分类任务</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="train">开始训练</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<style scoped></style>
<script>
import {modelTrain,getAlgorithm} from '@/api/model'
import { getTrainData } from '@/api/data'

export default {
  mounted() {
    this.initData()
  },
  watch:{
    'algorithmType':(val)=>{
        console.log(val)
    }
  },
  data() {
    return {
      model: {
        modelChoose: '',
        trainChoose: '',
        testChoose:'',
        algorithmChoose:'',
        mirrorChoose:''
      },
      mirrorList:[
        {name:'python3.8',value:'python3.8'},
      ],
      hasTest:false,
      modelList: [],
      trainList: [],
      testList:[],
      rules: {
        modelChoose: [
          { required: true, message: '请选择模型', trigger: 'change' }
        ],
        trainChoose: [
          { required: true, message: '请选择数据集', trigger: 'change' }
        ],
        testChoose:[
          {required:true}
        ],
        algorithmChoose:[
          {required:true}
        ],
        mirrorChoose:[
          {required:true}
        ]
      },
      algorithmType:0
    }
  }
  , methods: {
    /**
    * 提交训练表单
    * @param
    **/
    train(){
      let data
      //自定义算法
      if(this.algorithmType){
        data={
          algorithmSavePth:this.algorithmList[this.model.algorithmChoose].save_pth,
          mirror:'python:3.8',
          command:'python main.py',
          type:1
        }
      }
      //系统默认算法
      else{
        const currTrainSet=this.trainList[this.model.trainChoose]
        data={
          trainSetSavePth:currTrainSet.save_pth,
          newTrainSetSavePth:`/home/code/data.csv`,
          mirror:'python:3.8',
          command:`python main.py --path=/home/code/data.csv`,
          type:0
        }
      }
      console.log(data)
      modelTrain(data).then(res=>console.log(res.data))
    },
    resetForm() {
      
    },
    getCanBeTrainedModel() {
      
    },
    /**
    * 初始化数据列表
    * @param
    **/
    async initData(){
      const resList=await Promise.all([getAlgorithm(),getTrainData()])
      this.algorithmList=resList[0].data.algorithmList
      this.trainList=resList[1].data.trainList
      
    }
  }
}
</script>
