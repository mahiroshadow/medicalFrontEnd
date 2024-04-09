import * as echarts from 'echarts'
import ecStat from 'echarts-stat'

echarts.registerTransform(ecStat.transform.clustering)

export default function useCharts(){
   

    function chartsInit(element,option){
        if(element&&option){
            const charts=echarts.init(element)
            charts.setOption(option)
            return charts
        }
        return null
    }

    function setChartsOption(charts,option,flag){
        if(flag&&charts)
            //清空画布
            charts.clear()
        if(option)
            charts.setOption(option)
    }


    return {
        chartsInit,
        setChartsOption            
    }
}