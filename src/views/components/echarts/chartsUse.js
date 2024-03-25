import * as echrats from 'echarts'

export default function useCharts(){

    let charts=null

    function chartsInit(element,option){
        if(element&&option){
            charts=echrats.init(element)
            charts.setOption(option)
        }
    }

    function setChartsOption(option,flag){
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