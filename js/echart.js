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
let actwin = 0

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
            value: 1
        }]
    }]
}
// 使用刚指定的配置项和数据显示图表。
myChart5.setOption(option5)
var isUpdating5 = true;
function updateChart5() {
    if (!isUpdating5) {
        return;
    }
    $.get("https://remotewtl_windspeed.ishm.net", function (data) {
        var velocityValue = data.Velocity;
        myChart5.setOption({
            title: {
                text: velocityValue.toString()
            },
            series: [{
                data: [{
                    value: parseFloat(velocityValue),
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
                    value: 10 - parseFloat(velocityValue)
                }]
            }]
        });
    }).fail(function () {
        console.error('Failed to fetch data');
        isUpdating5 = false; // Stop updating on error
    });
}

setInterval(updateChart5, 50);




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
var isUpdating6 = true;
function updateChart6() {
    if (!isUpdating6) {
        return;
    }

    var fan_speed = fan_control.fan_speed
    var fan_speed_loop_up_table = [
        0,0,0,0,0.28,0.55,0.95,1.4,1.75,2.21,2.83,3.34,3.85,4.33,4.66,4.8,4.96,5.05,5.1,5.18,5.18
    ]
    fan_speed = fan_speed_loop_up_table[Math.round( fan_speed/5 )]
    myChart6.setOption({
        title: {
            text: fan_speed.toString()
        },
        series: [{
            data: [{
                value: parseFloat(fan_speed),
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
                value: 100 - parseFloat(fan_speed)
            }]
        }]
    });
}
setInterval(updateChart6, 500);
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




const MAX_POINTS = 250;
let displacementData = [];
let fftData = { x: [], y: [] };

// === Initialize charts ===
var myChart8 = echarts.init(document.getElementById('echartdisplaydata'));     // Displacement
var myChart9 = echarts.init(document.getElementById('echartdisplayfftdata'));  // FFT

// === Displacement Chart Options ===
const displacementOption = {
  title: { text: 'Live Displacement' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', name: 'Time', data: [] },
  yAxis: { type: 'value', name: 'Displacement' },
  series: [{
    name: 'Displacement',
    type: 'line',
    showSymbol: false,
    data: []
  }]
};

// === FFT Chart Options ===
const fftOption = {
  title: { text: 'FFT Magnitude Spectrum' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', name: 'Frequency (Hz)', data: [] },
  yAxis: { type: 'value', name: 'Magnitude' },
  series: [{
    name: 'Magnitude',
    type: 'bar',
    data: []
  }]
};

// === Apply Options to Each Chart ===
myChart8.setOption(displacementOption);
myChart9.setOption(fftOption);

// === Trim helper ===
function trimArray(arr, max) {
  return arr.length > max ? arr.slice(arr.length - max) : arr;
}

// === Socket.IO Listeners ===
var socket = io('https://remotewtl_displacement.ishm.net', { reconnectionAttempts: 5, reconnectionDelay: 1000, reconnectionDelayMax: 5000, timeout: 20000 });
//var socket = io('127.0.0.1:5002', { reconnectionAttempts: 5, reconnectionDelay: 1000, reconnectionDelayMax: 5000, timeout: 20000 });

socket.on('sin_wave', (dataPoint) => {
  displacementData.push(dataPoint);
  displacementData = trimArray(displacementData, MAX_POINTS);

  const xData = displacementData.map(d => d.x);
  const yData = displacementData.map(d => d.y);

  myChart8.setOption({
    xAxis: { data: xData },
    series: [{ data: yData }]
  });
});

socket.on('sin_wave_fft', (data) => {
  fftData = data;

  myChart9.setOption({
    xAxis: { data: fftData.x },
    series: [{ data: fftData.y }]
  });
});


var socket = io.connect('https://remotewtl_webcam.ishm.net', { reconnectionAttempts: 5, reconnectionDelay: 1000, reconnectionDelayMax: 5000, timeout: 20000 }); // Ensure this matches the address your Flask app is running on
//var socket = io.connect('127.0.0.1:5001', { reconnectionAttempts: 5, reconnectionDelay: 1000, reconnectionDelayMax: 5000, timeout: 20000 }); // Ensure this matches the address your Flask app is running on
socket.on('connect', function () {
    console.log('Connected to the web server.');
});

socket.on('frame', function (data) {
    document.getElementById('live-camera').src = "data:image/jpeg;base64," + data.data;
});





