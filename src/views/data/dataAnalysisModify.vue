<template>
    <div class="app-container">
        <el-card>
            <div>
                <span>数据集选择：</span>
                <el-select v-model="fileSelected" @change="getFileHeadCol" placeholder="请选择数据集">
                    <el-option 
                        v-for="item in trainList"
                        :label="item.file_name"
                        :value="item.save_pth">
                    </el-option>
                </el-select>
                <span>请选择特征：</span>
                <el-select 
                  v-model="featureSelected" placeholder="请选择特征" @change="featureDistributionShow">
                <el-option
                    v-for="item in colName"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <span>请选择类别：</span>
                <el-select
                  v-model="classSelected"
                  @change="featureDistributionShow"
                >
                <el-option v-for="item in types" :label="item" :value="item">
                </el-option>
              </el-select>

            </div>
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="charts-container">
                        <h2>类间分布图</h2>
                        <div ref="sampleDistributionScatter">

                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="charts-container">
                        <h2>样本分布图</h2>
                        <div ref="sampleOccuption" ></div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="charts-container">
                        <h2>PCA降维2D</h2>
                        <div class="pca2D"></div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="charts-container">
                        <h2>PCA降维3D</h2>
                        <div ref="pca3D">
                            
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
import useCharts from '../components/echarts/chartsUse'
import { optionList ,scatter2DOption} from '../components/echarts/data/echartsOption.d'
import {getTrainData} from '@/api/data'
import {getOneFeatureDistribution,getFileHead,getOccupytion,pca} from '@/api/chartsData'

const {chartsInit,setChartsOption} =useCharts()
export default{
    mounted(){
        this.$nextTick(()=>this.initCharts())
        //初始化数据
        this.initData()
    },
    data(){
        return{
            fileSelected:'',
            classSelected:'',
            featureSelected:'',
            trainList:[],
            chartsList:[],
            colName:[],
            types:[]
        }
    },
    watch:{
        'fileSelected':function(newVal,oldVal){
            //修改数据
            this.changeData()
        }
    },
    methods:{
        /**
        * 初始化图表
        * @param
        **/
        initCharts(){
            Object.keys(this.$refs).forEach((key,index)=>{
                const mountedElem=this.$refs[key]
                const charts=chartsInit(mountedElem,optionList[index])
                this.chartsList.push({
                   mountedElem,charts
                })
            })
            const mountedElem=document.querySelector('.pca2D')
            const charts=chartsInit(mountedElem,scatter2DOption)
            this.chartsList.splice(2,0,{mountedElem,charts})
            console.log(this.chartsList)
        },
        /**
        * 获取文件特征
        * @param
        **/
        async initData(){
            const {trainList}=await (await (getTrainData())).data
            this.trainList=trainList
            console.log(trainList)
            this.getFileHeadCol()
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
            console.log(feature_distribution)
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
            setChartsOption(this.chartsList[0].charts,option,false)
        }
    },
        /**
        * 展示数据表头
        * @param
        **/
        async getFileHeadCol(){
            if(this.fileSelected!=''){
                const {types,col}=await (await getFileHead({'save_pth':this.fileSelected})).data
                col.shift()
                this.colName=col
                this.types=types
            }
        },
        /**
        * 改变数据
        * @param
        **/
        changeData(){
            Promise.all(this.occupytionShow(),this.getPcaData())
        },
        /**
        * 绘制饼图
        * @param
        **/
        async occupytionShow(){
            if(this.fileSelected!=''){
                const payload={save_pth:this.fileSelected}
                return new Promise((resolve,reject)=>{
                getOccupytion(payload).then(res=>{
                    const {occuption}=res.data
                    // console.log(occuption)
                    const option={
                    series: [{
                    data: occuption
                    }]
                }
                setChartsOption(this.chartsList[1].charts,option,false)
            })
        }) 
      }
    },
    /**
    * 获取pca降维后的数据（3维）
    * @param
    **/
    getPcaData(){
      if(this.fileSelected!=''){
            const payload={
                save_pth:this.fileSelected
            }
            return new Promise((resolve,reject)=>{
                pca(payload).then(res=>{
                    const {pcaData2D,pcaData3D}=res.data
                    // console.log(pcaData3D)
                    const option3D={
                        dataset: {
                            source: pcaData3D
                        }  
                    }
                    console.log(pcaData2D)
                    const option2D={
                        series:{
                            data:pcaData2D
                        }
                    }
                    setChartsOption(this.chartsList[2].charts,option2D,false)
                    setChartsOption(this.chartsList[3].charts,option3D,false)
                })
            })
      }
   }
    }
}
</script>

<style lang="scss">
    .charts-container{
        box-shadow:  rgba(0, 0, 0, 0.24) 0px 3px 8px;
        height: 500px;
        text-align: center;
        margin-top: 20px;
        h2{
            padding-top: 20px;
        }
        div{
            width: 420px;
            height: 420px;
            margin:0 auto;
        }
    }
    span{
        margin-left: 10px;
    }
</style>