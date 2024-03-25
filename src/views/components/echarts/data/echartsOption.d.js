//类别特征分布图
const scatterOption={
  xAxis: {},
  yAxis: {},
  series: [
    {symbolSize: 20,
      data: [],
      type: 'scatter'
    }
  ]
}
//类别占比饼图
const pieOption =  {
  legend: {
      top: 'bottom'
  },
  toolbox: {
      show: true,
      feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true }
      }
  },
  series: []
}
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

export{
    scatterOption,
    scatter3DOption,
    pieOption,
}