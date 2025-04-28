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

var myChart8 = echarts.init(document.getElementById('echartdisplaydata'));
var myChart9 = echarts.init(document.getElementById('echartdisplayfftdata'));

var socket = io('https://remotewtl_displacement.ishm.net', { reconnectionAttempts: 5, reconnectionDelay: 1000, reconnectionDelayMax: 5000, timeout: 20000 });
//var socket = io('127.0.0.1:5002', { reconnectionAttempts: 5, reconnectionDelay: 1000, reconnectionDelayMax: 5000, timeout: 20000 });



socket.on('connect', function () {
    console.log('Connected to the displacement server.');
});
var data_displacement = [];
var data_displacement_fft = [];

var isUpdating = true;

var option8 = {
    backgroundColor: '#f5f5f5',
    title: {
        text: 'Raw Displacement',
        left: 'center', // Aligns the title to the center
        top: '20', // Position from the top margin
        textStyle: {
            color: '#333',
            fontSize: 18,
            fontWeight: 'bold'
        },
        subtextStyle: {
            color: '#666',
            fontSize: 14
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        scale: true,
        splitLine: {
            show: true,
            lineStyle: {
                color: '#ddd',
                type: 'dashed'
            }
        },
        axisLine: {
            lineStyle: {
                color: '#333'
            }
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: false,
        scale: true,
        splitLine: {
            show: true,
            lineStyle: {
                color: '#ddd',
                type: 'dashed'
            }
        },
        axisLine: {
            lineStyle: {
                color: '#333'
            }
        },
        min: 0,
        max: 0
    },
    series: [{
        type: 'line',
        data: [],
        symbolSize: 5,
        animation: false,
        itemStyle: {
            color: '#c23531',
            borderColor: '#222',
            borderWidth: 1
        },
        emphasis: {
            itemStyle: {
                borderColor: '#c23531',
                borderWidth: 2
            }
        }
    }],
    dataZoom: [
        {
            type: 'slider', // This is the most common type of dataZoom.
            start: 0,      // Starting position of the dataZoom, 0% by default.
            end: 100       // Ending position of the dataZoom, 100% by default.
        },
        {
            type: 'inside', // This allows zooming by scrolling the mouse wheel.
            start: 0,
            end: 100
        }
    ],
    roam: false, // This is necessary for the inside option to work
};

myChart8.setOption(option8);
myChart9.setOption(option8);
myChart9.setOption({
    title: {
        text: 'Displacement FFT',
    }
});
socket.on('sin_wave', function (msg) {
    //console.log(isUpdating)
    if (isUpdating) {
        //console.log("inside if")
        if (data_displacement.length > 400) {
            data_displacement.shift();
        }

        data_displacement.push([msg.x, msg.y]);
        let yValue = data_displacement.map(pair=>pair[1]);
        //let newMin = Math.min(...yValue);
        //let newMax = Math.max(...yValue);
        //newMax =  msg.y + 50
        //newMin = msg.y - 50
        // Update the chart
        requestAnimationFrame(() =>{
            myChart8.setOption({
                xAxis: {
                    data: data_displacement.map(item => item[0]), // Update x-axis categories to match the current data
                    name: 'Time(s)'
                },
                series: [{
                    data: data_displacement
                }],
                yAxis: {
                    //min:newMin,
                    //max:newMax
                    min: -200, //-350
                    max:200,
                    name: 'Displacement(mm)' 
                }
            });
        })
    }
});
socket.on('sin_wave_fft', function (msg) {
    if (isUpdating) {
        data_displacement_fft = [];
        for (let i = 0; i < msg.x.length; i++) {
            if (msg.y[i] > 50000){
                continue
            }
            
            data_displacement_fft.push([msg.x[i], msg.y[i]]);
        }
        let yValue = data_displacement_fft.map(pair=>pair[1]);
        let newMin_fft = Math.min(...yValue);
        let newMax_fft = Math.max(...yValue);
        // let newMax_fft = Math.max(...yValue);
        // Update the chart
        requestAnimationFrame(() =>{
        myChart9.setOption({
            xAxis: {
                data: data_displacement_fft.map(item => item[0]), // Update x-axis categories to match the current data
                name: 'Frequency (Hz)'
            },
            series: [{
                data: data_displacement_fft
            }],
            yAxis: {
                min:newMin_fft,
                max:newMax_fft,
                name: 'Magnitude'
            }
        });
    })
    }
});

document.getElementById('toggleUpdate').addEventListener('click', function () {
    isUpdating = !isUpdating;
    this.textContent = isUpdating ? 'Pause' : 'Resume';
    if (isUpdating) {
        socket.connect();  // Connect to the server if updating
    } else {
        socket.disconnect();  // Disconnect from the server if not updating
    }
});

// Resize chart on container resize
window.onresize = function () {
    myChart8.resize();
    myChart9.resize();
};


var socket = io.connect('https://remotewtl_webcam.ishm.net', { reconnectionAttempts: 5, reconnectionDelay: 1000, reconnectionDelayMax: 5000, timeout: 20000 }); // Ensure this matches the address your Flask app is running on
//var socket = io.connect('127.0.0.1:5001', { reconnectionAttempts: 5, reconnectionDelay: 1000, reconnectionDelayMax: 5000, timeout: 20000 }); // Ensure this matches the address your Flask app is running on
socket.on('connect', function () {
    console.log('Connected to the web server.');
});

socket.on('frame', function (data) {
    document.getElementById('live-camera').src = "data:image/jpeg;base64," + data.data;
});





