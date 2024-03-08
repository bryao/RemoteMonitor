//shedding
var myChart4 = echarts.init(document.getElementById('echartshedding'))

option4 = {
    title: {
        text: 'N/A',
        x: 'center',
        y: 'center',
        textStyle: {
            fontWeight: 'normal',
            color: '#ffffff',
            fontSize: '30'
        }
    },
    color: ['rgba(176, 212, 251, 1)'],


    series: [{
        name: 'Line 1',
        type: 'pie',
        clockWise: true,
        radius: ['100%', '85%'],
        itemStyle: {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            }
        },
        hoverAnimation: false,
        data: [{
            value: 0,
            name: '01',
            itemStyle: {
                normal: {
                    color: { // 完成的圆环的颜色
                        colorStops: [{
                            offset: 0,
                            color: '#00cefc' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#367bec' // 100% 处的颜色
                        }]
                    },
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }
            }
        }, {
            name: '02',
            value: 10
        }]
    }]
}
myChart4.setOption(option4)


//estimated wind speed
var myChart5 = echarts.init(document.getElementById('echartactwin'))

option5 = {
    title: {
        text: 'N/A',
        x: 'center',
        y: 'center',
        textStyle: {
            fontWeight: 'normal',
            color: '#ffffff',
            fontSize: '30'
        }
    },
    color: ['rgba(176, 212, 251, 1)'],


    series: [{
        name: 'Line 1',
        type: 'pie',
        clockWise: true,
        radius: ['100%', '85%'],
        itemStyle: {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            }
        },
        hoverAnimation: false,
        data: [{
            value: 0,
            name: '01',
            itemStyle: {
                normal: {
                    color: { // 完成的圆环的颜色
                        colorStops: [{
                            offset: 0,
                            color: '#00cefc' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#367bec' // 100% 处的颜色
                        }]
                    },
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }
            }
        }, {
            name: '02',
            value: 10
        }]
    }]
}


// 使用刚指定的配置项和数据显示图表。
myChart5.setOption(option5)


//estimated wind speed
var myChart6 = echarts.init(document.getElementById('echartestwin'))

option6 = {
    title: {
        text: 'N/A',
        x: 'center',
        y: 'center',
        textStyle: {
            fontWeight: 'normal',
            color: '#ffffff',
            fontSize: '30'
        }
    },
    color: ['rgba(176, 212, 251, 1)'],


    series: [{
        name: 'Line 1',
        type: 'pie',
        clockWise: true,
        radius: ['100%', '85%'],
        itemStyle: {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            }
        },
        hoverAnimation: false,
        data: [{
            value: 0,
            name: '01',
            itemStyle: {
                normal: {
                    color: { // 完成的圆环的颜色
                        colorStops: [{
                            offset: 0,
                            color: '#00cefc' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#367bec' // 100% 处的颜色
                        }]
                    },
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }
            }
        }, {
            name: '02',
            value: 10
        }]
    }]
}


// 使用刚指定的配置项和数据显示图表。
myChart6.setOption(option6)

//fan speed
var myChart7 = echarts.init(document.getElementById('echartAqpf'))
let fan_speed = 0
function updateChart7() {
    fan_speed = fan_control.fan_speed
    option7 = {
        title: {
            text: fan_speed.toString(),
            x: 'center',
            y: 'center',
            textStyle: {
                fontWeight: 'normal',
                color: '#ffffff',
                fontSize: '30'
            }
        },
        color: ['rgba(176, 212, 251, 1)'],


        series: [{
            name: 'Line 1',
            type: 'pie',
            clockWise: true,
            radius: ['100%', '85%'],
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }
            },
            hoverAnimation: false,
            data: [{
                value: fan_speed,
                name: '01',
                itemStyle: {
                    normal: {
                        color: { // 完成的圆环的颜色
                            colorStops: [{
                                offset: 0,
                                color: '#00cefc' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#367bec' // 100% 处的颜色
                            }]
                        },
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }, {
                name: '02',
                value: 100 - fan_speed 
            }]
        }]
    }


    // 使用刚指定的配置项和数据显示图表。
    myChart7.setOption(option7)
}
setInterval(updateChart7, 500);



var myChart8 = echarts.init(document.getElementById('echartdisplaydata'));
var option8;

$.get(
  "http://127.0.0.1:5001",
  function (_rawData) {
    run(_rawData);
  }
);
function run(_rawData) {
  // var countries = ['Australia', 'Canada', 'China', 'Cuba', 'Finland', 'France', 'Germany', 'Iceland', 'India', 'Japan', 'North Korea', 'South Korea', 'New Zealand', 'Norway', 'Poland', 'Russia', 'Turkey', 'United Kingdom', 'United States'];
  const datas = [
    'Data1',
    'Data2',
  ];
  const seriesList = [];
  const datasetWithFilters = [];

  echarts.util.each(datas, function (data) {
    
    var datasetId = 'dataset_' + data;
    
    datasetWithFilters.push({
      id: datasetId,
      fromDatasetId: 'dataset_raw',
      transform: {
        type: 'filter',
        config: {
          and: [
            { dimension: 'Year', gte: 1950 },
            { dimension: 'Country', '=': data }
          ]
        }
      }
    });



    seriesList.push({
      type: 'line',
      datasetId: datasetId,
      showSymbol: false,
      name: data,
      endLabel: {
        show: true,
        formatter: function (params) {
          return params.value[3] + ': ' + params.value[0];
        }
      },
      labelLayout: {
        moveOverlap: 'shiftY'
      },
      emphasis: {
        focus: 'series'
      },
      encode: {
        x: 'time',
        y: 'data',
        label: ['time', 'data'],
        itemName: 'time',
        tooltip: ['data']
      }
    });
  });
  option8 = {
    animationDuration: 10000,
    backgroundColor: '#FFFFFF',
    dataset: [
      {
        id: 'dataset_raw',
        source: _rawData
      },
      ...datasetWithFilters
    ],
    title: {
      text: 'Income of Germany and France since 1950'
    },
    tooltip: {
      order: 'valueDesc',
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      nameLocation: 'end',
      name: "Time",
    },
    yAxis: {
      name: 'Data'
    },
    grid: {
      right: 140
    },
    series: seriesList
  };
  myChart8.setOption(option8);
}

option8 && myChart8.setOption(option);