var appIndex = new Vue({
  el: '#appIndex',
  data: {
    datalist: {},
    year: '',
    month: '',
    date: '',
    hour: '',
    minute: '',
    second: '',
    strDate: '',
    weather_curr: '',
    weather_icon: ''
  },
  methods: {
    timeFormate: function(timeStamp) {
      var today
      var strDate
      today = new Date()
      var n_day = today.getDay()
      switch (n_day) {
        case 0:
          {
            strDate = 'Sunday'
          }
          break
        case 1:
          {
            strDate = 'Monday'
          }
          break
        case 2:
          {
            strDate = 'Tuesday'
          }
          break
        case 3:
          {
            strDate = 'Wednesday'
          }
          break
        case 4:
          {
            strDate = 'Thursday'
          }
          break
        case 5:
          {
            strDate = 'Friday'
          }
          break
        case 6:
          {
            strDate = 'Saturday'
          }
          break
        case 7:
          {
            strDate = 'Sunday'
          }
          break
      }
      var year = new Date(timeStamp).getFullYear()
      var month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? '0' + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1
      var date =
        new Date(timeStamp).getDate() < 10
          ? '0' + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate()
      var hour =
        new Date(timeStamp).getHours() < 10
          ? '0' + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours()
      var minute =
        new Date(timeStamp).getMinutes() < 10
          ? '0' + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes()
      var second =
        new Date(timeStamp).getSeconds() < 10
          ? '0' + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds()
      this.year = year
      this.month = month
      this.date = date
      this.hour = hour
      this.minute = minute
      this.second = second
      this.strDate = strDate
    }
  },
  mounted() {
    var _this = this // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      //   _this.date = new Date() // 修改数据date
      _this.timeFormate(new Date())
    }, 1000)
    console.log(666, this.datalist)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
    }
  },
  created: function() {
   // this.getWeath()
    // this.init()
    // console.log(this.datalist)
  }
})
