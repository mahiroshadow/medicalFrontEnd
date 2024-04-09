//类别特征分布图
const scatterOption={
  xAxis: {},
  yAxis: {},
  series: [
    {symbolSize: 4,
      data: [],
      type: 'scatter'
    }
  ]
}


const scatter2DOption = {
  xAxis: {},
  yAxis: {},
  series: [
    {
      symbolSize: 4,
      data: [

      ],
      type: 'scatter'
    }
  ]
}



//类别占比饼图
const pieOption  = {
  title: {
    text: '样本占比',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '占比图',
      type: 'pie',
      radius: '50%',
      data: [
        
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};



//PCA降维3D散点图
const scatter3DOption = {
  grid3D: {},
  xAxis3D: {
    type: 'category'
  },
  yAxis3D: {},
  zAxis3D: {},
  dataset: {
    dimensions: ["x","y","z"],
    source: []
  },
  series: [
    {
      type: 'scatter3D',
      symbolSize:2.5,
      encode: {
        x: 'x',
        y: 'y',
        z: 'z',
        tooltip: [0, 1, 2, 3, 4]
      }
    }
  ]
}


const optionList=[scatterOption,pieOption,scatter3DOption]


const otherOption={
          color: '#528EFF',
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'shadow'
              }
          },
          legend: {},
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
          },
      }

export{
    scatterOption,
    scatter3DOption,
    scatter2DOption,
    pieOption,
    optionList,
    otherOption
}