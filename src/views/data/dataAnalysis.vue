<template>
  <div class="app-container">
        <el-card class="custom-card">
        <div class="data-selector">
        <el-select v-model="fileSelected" @change="getFileHeadCol" placeholder="请选择数据集">
            <el-option 
              v-for="item in trainList"
              :label="item.file_name"
              :value="item.save_pth">
            </el-option>
        </el-select>
      </div>
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="类空间变量分布">
            <span>请选择特征：</span><el-select 
                  v-model="featureSelected" placeholder="请选择特征" @change="featureDistributionShow"
                 >
              <el-option
                  v-for="item in colName"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
            <span>请选择类别：</span><el-select
                  v-model="classSelected"
                  @change="featureDistributionShow"
                >
                <el-option v-for="item in types" :label="item" :value="item">
                </el-option>
              </el-select>
          </el-tab-pane>
          <el-tab-pane label="样本类别比例">
          </el-tab-pane>
          <el-tab-pane label="PCA可视化">
            <span>请选择类别：</span>
            <el-select v-model="typeSelected" placeholder="请选择">
                <el-option 
                    v-for="item in [{name:'二维',value:'0'},{name:'三维',value:'1'}]"
                    :label="item.name"
                    :value="item.value"
                    >
                </el-option>
            </el-select>
          </el-tab-pane>
        </el-tabs>
        <div ref="charts" class="charts"></div>
      </el-card>
  </div>
</template>

<script>
import useCharts from '@/views/components/echarts/chartsUse'
import {scatterOption,scatter3DOption,pieOption} from '@/views/components/echarts/data/echartsOption.d'
import {getTrainData} from '@/api/data'
import {getOneFeatureDistribution,getFileHead,getOccupytion,pca} from '@/api/chartsData' 


const {chartsInit,setChartsOption }=useCharts()

export default {
  mounted(){
    this.$nextTick(()=>{
        chartsInit(this.$refs.charts,scatterOption)
    })
    this.initData()
  },

  data() {
    return {
      activeTab: '0' ,// 默认显示数据详情
      index: 0,
      dialogVisible: false,
      features:[],
      fileSelected:'',
      classSelected:'',
      options:[
        scatterOption,
        pieOption,
        scatter3DOption
      ],
      trainList:[],
      colName:[],
      featureSelected:'',
      typeSelected:'',
      types:[]
    }
  },
  watch:{
    'activeTab':(val)=>{
    }
  },
  methods: {
    /**
    * 切换选项卡
    * @param
    **/
    handleTabClick(tab) {
      const index=parseInt(tab.index)
      setChartsOption(this.options[index],true)
      switch(index){
        case 0:

          break
        case 1:
          this.occupytionShow()
          break
        case 2:
          this.getPcaData()
          break
      }
    },

    /**
    * 初始化数据
    * @param
    **/
   async initData(){
      const {trainList}=await (await (getTrainData())).data
      this.trainList=trainList
      this.getFileHeadCol()
   },
   /**
   * 展示数据表头
   * @param
   **/
   async getFileHeadCol(){
      if(this.fileSelected!=''){
          const {status,types,col}=await (await getFileHead({'save_pth':this.fileSelected})).data
          col.shift()
          this.colName=col
          this.types=types
      }
    },
    /**
    * 获取某一个特征的分布
    * @param
    **/
    async featureDistributionShow(){
        if(this.featureSelected!=''&&this.fileSelected!=''&&this.classSelected!==''){
            const payload={ save_pth:this.fileSelected,
                            feature_selected:this.featureSelected,
                            type_selected:this.classSelected 
                          }
            const {feature_distribution} =await (await getOneFeatureDistribution(payload)).data
            const keys=Object.keys(feature_distribution)
            const option={series:[]}
            keys.forEach(key => {
                option.series.push({
                    symbolSize: 4,
                    data:feature_distribution[key].data ,
                    type: 'scatter'
                })
            })
            console.log(option)
            setChartsOption(option,false)
        }
    },
    /**
    * 绘制饼图
    * @param
    **/
    async occupytionShow(){
      if(this.fileSelected!=''){
        const payload={save_pth:this.fileSelected}
        const {occuption}=await (await getOccupytion(payload)).data
        console.log(occuption)
        const option={
          series: [{
            type: 'pie',
            radius: [50, 250],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
            borderRadius: 8
            },
          data: occuption
      }
      ]
        }
        setChartsOption(option,false)
      }
    },
    /**
    * 获取pca降维后的数据
    * @param
    **/
   async getPcaData(){
      if(this.fileSelected!=''){
        const payload={
          save_pth:this.fileSelected
        }
      const {pcaData,status}=await (await pca(payload)).data
      console.log(pcaData)
      console.log(status)
      if(status!=200){
        this.$router.push({name:'dataTreat'})
        return
      }
      const option={
          dataset: {
            source: pcaData
          }  
      }
        setChartsOption(option,false)
      }
   }
  }
}
</script>


<style lang="scss" scoped>

.custom-card {
  overflow-y: auto;  
  max-height: 800px; 
  position: relative;
  .data-selector{
      display: flex;
      justify-content: flex-end;
  }
}

ul {
    list-style: none;
    padding: 0px;
}

.title{
  display: flex;
  justify-content: space-between;
  align-content: center;
  width: 100%;
  text-align: center;
  
  margin: 10px;
}

.file-operation{
  display: flex;
  justify-content: flex-end;
  height: 40px;
}
.dataName{
  height: 100px;
  font-size: 30px;
  font-weight: 500;
  color: black;
}

.charts{
  margin: 0 auto;
  width: 80%;
  height: 500px;
}
</style>