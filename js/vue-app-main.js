var appIndex = new Vue({
  el: '#appContainer',
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
    var _this = this 
    this.timer = setInterval(() => {
      _this.timeFormate(new Date())
    }, 1000)
    console.log(666, this.datalist)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) 
    }
  },
  created: function() {
   // this.getWeath()
    // this.init()
    // console.log(this.datalist)
  }
})
function changeImage(model) {
  var imagePath = 'img/';
  switch(model) {
      case 'Square':
          imagePath += 'Square.png'; // Path to your square image
          break;
      case 'Round Corner':
          imagePath += 'RoundCorner.png'; // Path to your round corner image
          break;
      case 'Corner Cut':
          imagePath += 'CornerCut.png'; // Path to your corner cut image
          break;
  }
  document.getElementById('currentModelImage').src = imagePath;
  document.getElementById('selectedModelName').textContent = model;
}