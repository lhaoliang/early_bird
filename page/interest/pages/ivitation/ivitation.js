const ctx = wx.createCanvasContext('myCanvas');
const util = require('../../../../utils/util.js')
Page({
  data: {
    img: '',
    img2: '',
    userInfo: {},
    imgSrc: util.config.source,
    height:0,
    width:0,

  },
  onLoad: function(options) {
    let myCanvasWidth = 0
    let myCanvasHeight = 0
    wx.getSystemInfo({
      success: function (res) {
        myCanvasHeight = res.windowHeight-80
        myCanvasWidth = myCanvasHeight*9/16

      },
    })
    this.setData({
      canvasWidth: myCanvasWidth,
      canvasHeight: myCanvasHeight
    })
    util.requester.get("/frontapi/store/user/info", {}, res => {
        console.log(res.datas);
        this.setData({
          userInfo: res.datas
        });
        this.getImg()
      }

    )
    //需要注意的是：我们展示图片的域名需要在后台downfile进行配置，并且画到canvas里面前需要先下载存储到data里面
    //先下载下来，比如我们的logo


    console.log(this.data.img);
  },
  getImg(){
      wx.showLoading({
          title: '生成中',
      });
      wx.downloadFile({
          url: this.data.imgSrc + 'xcx_images/invitation-friends.png',
          success: res => {
            console.log(res)
              this.setData({
                  img: res.tempFilePath
              });
              wx.downloadFile({
                  url: this.data.imgSrc + this.data.userInfo.generateCode,
                  // url: 'https://admin.anasit.com/attachs/uploads/generateCode191.png',
                  success: result => {
                      console.log(result);
                      this.setData({
                          img2: result.tempFilePath
                      });
                      this.canvasImg();
                  }
              })
          }
      })
  },
  onShareAppMessage() {
    return {
        title: this.data.userInfo.nickname + '邀请您成为早鸟会员',
        path: '/page/tabBar/home/index?uid=' + this.data.userInfo.id,
        imageUrl: this.data.imgSrc + 'xcx_images/invite_share.png'
    }
  },
  getUserInfo() {
    util.requester.get("/frontapi/store/user/info", {}, res => {
      console.log(res.datas);
      this.setData({
        userInfo: res.datas
      });
      wx.hideLoading();
      wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
    })
  },
  getScreen(){
      // 获取系统信息
      wx.getSystemInfo({
          success: res => {
              // 获取可使用窗口宽度
              let clientHeight = res.windowHeight;
              // 获取可使用窗口高度
              let clientWidth = res.windowWidth;
              // 算出比例
              let ratio = 750 / clientWidth;
              // 算出高度(单位rpx)
              let height = clientHeight * ratio;
              // 设置高度
              this.setData({
                  height: height,
                  width: clientWidth
              });
              console.log(clientWidth,clientHeight)
          }
      });
  },
  canvasImg() {
    // console.log(this.data.img);
    const ctx = wx.createCanvasContext('myCanvas');
    const grd = ctx.createLinearGradient(0, 0, 300, 0); //创建了一个线性的渐变颜色 前两个参数起点横纵坐标，后两个参数终点横纵坐标
    ctx.setFillStyle(grd); //为创建的canvans上下文添充颜色  如果没有设置 fillStyle，默认颜色为 black。
    ctx.fillRect(0, 0, 300, 400);
      ctx.drawImage(this.data.img, 0, 0, this.data.canvasWidth, this.data.canvasHeight); 


    ctx.setTextAlign('center'); //是否居中显示，参考点画布中线

    // ctx.beginPath();
    // ctx.arc(157, 40, 18, 0, 2 * Math.PI)
    // ctx.setFillStyle('rgba(0,0,0,.1)')
    // ctx.fill()

    // ctx.setFillStyle('transparent')
    // ctx.fillRect(150, 20, 18, 36)

    // ctx.setFillStyle('rgba(0,0,0,.1)')
    // ctx.fillRect(0, 20, 190, 36)

    ctx.beginPath()
      ctx.setStrokeStyle('rgba(0,0,0,.1)')
      ctx.setLineCap('round')
      ctx.setLineWidth(36)
      ctx.moveTo(0, 36)
      ctx.lineTo(180, 36)
      ctx.stroke()


    ctx.setFontSize(12) //字体大小
    ctx.setFillStyle('#fff') //字体颜色
    ctx.fillText(this.data.userInfo.nickname + '邀请您注册早鸟首发', 95, 43);


    // ctx.save();
    // ctx.beginPath();
    // ctx.arc(140, 355, 40, 0, Math.PI * 2, false);
    // ctx.clip()
    ctx.drawImage(this.data.img2, this.data.canvasWidth / 2 - 40, this.data.canvasHeight / 2 + this.data.canvasHeight/5, 80, 80);
    ctx.setFontSize(12) //字体大小
    ctx.setFillStyle('#666464') //字体颜色
    ctx.fillText('买全球新品 上早鸟首发', this.data.canvasWidth / 2, this.data.canvasHeight / 2 + this.data.canvasHeight / 2.5);

    // ctx.restore()

    ctx.draw();
      wx.hideLoading();

  },
  saveImg() {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      // width: 300,                     //画布宽高
      // height: 400,
      // destWidth: 600,                 //画布宽高*dpr 以iphone6为准
      // destHeight: 800,
      canvasId: 'myCanvas',
      success: function(res) {
        console.log(res.tempFilePath) //生成的临时图片路径
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            console.log(res);
            wx.showToast({
              title: '保存成功',
            })
          }
        })
      }
    })
  }
})