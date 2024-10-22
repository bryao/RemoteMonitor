// Shedding Frequency Chart
var vortexFrequencyChart = echarts.init(document.getElementById('vortexFrequencyChart'));

var vortexFrequencyOption = {
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
                label: { show: false },
                labelLine: { show: false }
            }
        },
        hoverAnimation: false,
        data: [{
            value: 0,
            name: '01',
            itemStyle: {
                normal: {
                    color: {
                        colorStops: [{
                            offset: 0,
                            color: '#00cefc'
                        }, {
                            offset: 1,
                            color: '#367bec'
                        }]
                    },
                    label: { show: false },
                    labelLine: { show: false }
                }
            }
        }, {
            name: '02',
            value: 10
        }]
    }]
};
vortexFrequencyChart.setOption(vortexFrequencyOption);

// Measured Wind Speed Chart
var measuredWindSpeedChart = echarts.init(document.getElementById('measuredWindSpeedChart'));
let measuredWindSpeed = 0;

var measuredWindSpeedOption = {
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
                label: { show: false },
                labelLine: { show: false }
            }
        },
        hoverAnimation: false,
        data: [{
            value: 0,
            name: '01',
            itemStyle: {
                normal: {
                    color: {
                        colorStops: [{
                            offset: 0,
                            color: '#00cefc'
                        }, {
                            offset: 1,
                            color: '#367bec'
                        }]
                    },
                    label: { show: false },
                    labelLine: { show: false }
                }
            }
        }, {
            name: '02',
            value: 1
        }]
    }]
};
measuredWindSpeedChart.setOption(measuredWindSpeedOption);

var isUpdatingMeasuredWindSpeed = true;
function updateMeasuredWindSpeedChart() {
    if (!isUpdatingMeasuredWindSpeed) {
        return;
    }
    $.get("http://127.0.0.1:5003", function (data) {
        var velocityValue = data.Velocity;
        measuredWindSpeedChart.setOption({
            title: { text: velocityValue.toString() },
            series: [{
                data: [{
                    value: parseFloat(velocityValue),
                    name: '01',
                    itemStyle: {
                        normal: {
                            color: {
                                colorStops: [{
                                    offset: 0,
                                    color: '#00cefc'
                                }, {
                                    offset: 1,
                                    color: '#367bec'
                                }]
                            },
                            label: { show: false },
                            labelLine: { show: false }
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
        isUpdatingMeasuredWindSpeed = false;
    });
}
setInterval(updateMeasuredWindSpeedChart, 50);

// Estimated Wind Speed Chart
var estimatedWindSpeedChart = echarts.init(document.getElementById('estimatedWindSpeedChart'));

var estimatedWindSpeedOption = {
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
                label: { show: false },
                labelLine: { show: false }
            }
        },
        hoverAnimation: false,
        data: [{
            value: 0,
            name: '01',
            itemStyle: {
                normal: {
                    color: {
                        colorStops: [{
                            offset: 0,
                            color: '#00cefc'
                        }, {
                            offset: 1,
                            color: '#367bec'
                        }]
                    },
                    label: { show: false },
                    labelLine: { show: false }
                }
            }
        }, {
            name: '02',
            value: 10
        }]
    }]
};
estimatedWindSpeedChart.setOption(estimatedWindSpeedOption);

var isUpdatingEstimatedWindSpeed = true;
function updateEstimatedWindSpeedChart() {
    if (!isUpdatingEstimatedWindSpeed) {
        return;
    }

    var fanSpeed = fan_control.fan_speed;
    var fanSpeedLookupTable = [
        0, 0, 0, 0, 0.28, 0.55, 0.95, 1.4, 1.75, 2.21, 2.83, 3.34, 3.85, 4.33, 4.66, 4.8, 4.96, 5.05, 5.1, 5.18, 5.18
    ];
    fanSpeed = fanSpeedLookupTable[Math.round(fanSpeed / 5)];
    estimatedWindSpeedChart.setOption({
        title: { text: fanSpeed.toString() },
        series: [{
            data: [{
                value: parseFloat(fanSpeed),
                name: '01',
                itemStyle: {
                    normal: {
                        color: {
                            colorStops: [{
                                offset: 0,
                                color: '#00cefc'
                            }, {
                                offset: 1,
                                color: '#367bec'
                            }]
                        },
                        label: { show: false },
                        labelLine: { show: false }
                    }
                }
            }, {
                name: '02',
                value: 100 - parseFloat(fanSpeed)
            }]
        }]
    });
}
setInterval(updateEstimatedWindSpeedChart, 500);

// Fan Speed Chart
var fanSpeedChart = echarts.init(document.getElementById('fanSpeedChart'));
let currentFanSpeed = 0;
function updateFanSpeedChart() {
    currentFanSpeed = fan_control.fan_speed;
    var fanSpeedOption = {
        title: {
            text: currentFanSpeed.toString(),
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
                    label: { show: false },
                    labelLine: { show: false }
                }
            },
            hoverAnimation: false,
            data: [{
                value: currentFanSpeed,
                name: '01',
                itemStyle: {
                    normal: {
                        color: {
                            colorStops: [{
                                offset: 0,
                                color: '#00cefc'
                            }, {
                                offset: 1,
                                color: '#367bec'
                            }]
                        },
                        label: { show: false },
                        labelLine: { show: false }
                    }
                }
            }, {
                name: '02',
                value: 100 - currentFanSpeed
            }]
        }]
    };
    fanSpeedChart.setOption(fanSpeedOption);
}
setInterval(updateFanSpeedChart, 500);

// Data Displacement Chart
var rawDisplacementChart = echarts.init(document.getElementById('dataChart'));
var fftDisplacementChart = echarts.init(document.getElementById('fftDataChart'));
var displacementSocket = io('http://127.0.0.1:5002', { reconnectionAttempts: 5, reconnectionDelay: 1000, reconnectionDelayMax: 5000, timeout: 20000 });
var dataDisplacement = [];
var dataDisplacementFFT = [];

var isUpdatingDataDisplacement = true;

var displacementChartOption = {
    backgroundColor: '#f5f5f5',
    title: {
        text: 'Raw Displacement',
        left: 'center',
        top: '20',
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
            label: { backgroundColor: '#6a7985' }
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
        scale: false,
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
        scaleLimit: {
            min: -150,
            max: 150
        }
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
            type: 'slider',
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            start: 0,
            end: 100
        }
    ],
    roam: false
};

rawDisplacementChart.setOption(displacementChartOption);
fftDisplacementChart.setOption(displacementChartOption);
fftDisplacementChart.setOption({
    title: {
        text: 'Displacement FFT',
    }
});

displacementSocket.on('displacement_data', function (msg) {
    if (isUpdatingDataDisplacement) {
        if (dataDisplacement.length > 400) {
            dataDisplacement.shift();
        }
        dataDisplacement.push([msg.x, msg.y]);
        rawDisplacementChart.setOption({
            xAxis: {
                data: dataDisplacement.map(item => item[0])
            },
            series: [{
                data: dataDisplacement
            }]
        });
    }
});

displacementSocket.on('displacement_fft_data', function (msg) {
    if (isUpdatingDataDisplacement) {
        dataDisplacementFFT = msg.y.map(item => [item[0], item[1]]);
        fftDisplacementChart.setOption({
            series: [{
                data: dataDisplacementFFT.slice()
            }]
        });
    }
});

// Toggle update button
var toggleUpdateButton = document.getElementById('toggleUpdateButton');
toggleUpdateButton.addEventListener('click', function () {
    isUpdatingDataDisplacement = !isUpdatingDataDisplacement;
    this.textContent = isUpdatingDataDisplacement ? 'Pause' : 'Resume';
    if (isUpdatingDataDisplacement) {
        displacementSocket.connect();
    } else {
        displacementSocket.disconnect();
    }
});

// Resize charts on window resize
window.onresize = function () {
    rawDisplacementChart.resize();
    fftDisplacementChart.resize();
};

// Live Camera Feed
var liveCameraSocket = io.connect('http://localhost:5001', {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000
});

liveCameraSocket.on('connect', function () {
    console.log('Connected to the server.');
});

liveCameraSocket.on('video_frame', function (data) {
    document.getElementById('liveCamera').src = "data:image/jpeg;base64," + data.data;
});