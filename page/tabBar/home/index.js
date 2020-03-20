// pages/home/home.js
const app = getApp()
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    saleGoods: [],
    appointList: [],
    trialList: [],
    imgSrc: util.config.source,
    currentBanner: 0,
    plateImage: '',
    titles: [],
    timer: '',
    title: '',
    getCoupon: false,
    start: false,
    uid: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.uid != undefined) {
      this.setData({
        uid: options.uid
      })
    }
    util.requester.get("/frontapi/store/user/info", {}, res => {
      console.log(res.datas);
      this.setData({
        userInfo: res.datas
      });
    }
    )
    this.getUid()
    this.getImgList();
    this.getSaleGoods();
    this.getAppointGoods();
    this.getParams();
    this.getPlateTitle();
  },
  onShow: function(options) {
    this.getImgList();
    this.getSaleGoods();
    this.getTrialList()
    this.setTimeInterval()
    this.getCpp()
  },

  getUid() {
    if (this.data.uid) {
      wx.setStorage({
        key: "uid",
        data: this.data.uid
      })
    }
  },
  //新用户弹窗
  getCpp() {
    util.requester.get('/frontapi/store/goods/coupon/cpp', {}, res => {
      if (res.datas == 'false') {
        this.setData({
          getCoupon: false
        })
      }
      if (res.datas == 'true') {
        this.setData({
          getCoupon: true
        })
      }

    })
  },
  getTrialList() {
    util.requester.get('/frontapi/store/trial/list', {
      merId: 1
    }, res => {


      res.datas.forEach(v => {

        if ((new Date(v.startTime) - new Date()) > 0) {
          v.start = true
        } else {
          v.start = false
        }
        //对开始时间进行操作
        let time = v.startTime;
        let pos = time.indexOf("-");
        time = time.substring(pos + 1);
        let pos2 = time.lastIndexOf(":");
        time = time.substring(0, pos2);
        v.startime = time
        this.setData({
          trialList: res.datas
        })
      })
    })
  },
  toTrialDetail(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/page/trial/pages/trial-detail/trial-detail?id=${item.id}&goodsId=${item.goodsId}`,
    })
  },
  getPlateTitle() {
    util.requester.get('/frontapi/store/setting/plate/get', {}, res => {
      this.setData({
        titles: res.datas
      })
    })
  },
  getImgList() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    util.requester.get('/frontapi/store/banner/list', {}, res => {
      that.setData({
        imgs: res.datas
      })
      wx.hideLoading();
      wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
    })
  },
  getParams() {
    util.requester.get('/frontapi/store/setting/parameter/get', {}, res => {
      this.setData({
        plateImage: res.datas.plateImage
      })
    })
  },
  bannerChange(e) {
    this.setData({
      currentBanner: e.detail.current
    })
  },
  turn(e) {
      console.log(e.currentTarget.dataset.src)
      if (e.currentTarget.dataset.src == '') {
          return
      }else{
        //   let pos = e.currentTarget.dataset.src.indexOf('=')
        //   let pos3 = e.currentTarget.dataset.src.indexOf('&')
        //   let id = e.currentTarget.dataset.src.substring(pos + 1, pos3)
        //   let pos2 = e.currentTarget.dataset.src.lastIndexOf('=')
        //   let goodsId = e.currentTarget.dataset.src.substring(pos2 + 1)
          wx.navigateTo({
              url: e.currentTarget.dataset.src ,
          })
      }

  },
  // 获取新品发售
  getSaleGoods() {
    util.requester.get('/frontapi/store/activity/newsale/list', {
      merId: 1
    }, res => {
      // 计算结束倒计时
      res.datas.forEach(v => {
        let diffHours = Math.round((new Date(v.endTime) - new Date()) / 1000 / 60 / 60);
        let days = Math.floor(diffHours / 24);
        let hours = diffHours % 24;
        if (days > 0) {
          v.endTimeFormat = `${days}天${hours}小时`;
        } else {
          v.endTimeFormat = `${hours}小时`;
        }

      })

      this.setData({
        saleGoods: res.datas
      })
    })
  },
  // 获取formId
  getFormId(e) {
    setTimeout(() => {
      console.log(e.detail.formId);
      if (e.detail.formId != "the formId is a mock one") {
        util.requester.post("/frontapi/store/collect/user/formid", {
          formId: e.detail.formId
        })
      }
    }, 5000)
  },
  getAppointGoods() {
    util.requester.get('/frontapi/store/activity/appoint/list', {
      merId: 1
    }, res => {
      // 计算结束倒计时
      this.setData({
        appointList: res.datas
      })
    })
  },
  getEndTime(time) {
    if (time <= 0) {
      time = 0;
    }
    let diffTime = Math.round((new Date(time) - new Date()) / 1000);
    let days = Math.floor(diffTime / 60 / 60 / 24);
    diffTime = diffTime % (60 * 60 * 24);
    let hours = Math.floor(diffTime / 60 / 60).toString().padStart(2, '0');
    diffTime = diffTime % (60 * 60);
    let mins = (Math.floor(diffTime / 60)).toString().padStart(2, '0');
    let seconds = (diffTime % 60).toString().padStart(2, '0');
    if (days > 0) {
      return [days, hours.charAt(0), hours.charAt(1), mins.charAt(0), mins.charAt(1), seconds.charAt(0), seconds.charAt(1)]
    } else {
      return [hours.charAt(0), hours.charAt(1), mins.charAt(0), mins.charAt(1), seconds.charAt(0), seconds.charAt(1)]
    }
  },
  // 设置定时器
  setTimeInterval() {
    this.data.timer = setInterval(() => {
      this.data.appointList.forEach(v => {
        v.endTime = new Date(v.endTime)
        v.endTime--;
        v.endTimeFormat = this.getEndTime(v.endTime)
      })
      this.setData({
        'appointList': this.data.appointList
      })
    }, 990)
  },
  clickGoods(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/page/newsale/pages/goods-detail/goods-detail?id=${item.id}&goodsId=${item.goodsId}`,
    })
  },
  // 新品预售详情
  toDetail(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/page/presale/pages/presale-detail/presale-detail?id=${item.id}&goodsId=${item.goodsId}`,
    })
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    wx.showLoading({
      title: "刷新中",
      mask: true,

    });
    this.setData({
      imgs: [],
      saleGoods: [],
      appointList: [],
      trialList: [],
      currentBanner: 0,
      plateImage: '',
      titles: []
    })
    clearInterval(this.data.timer)
    this.onLoad({});
    this.onShow();
    wx.hideLoading();

  },
  showCoupon() {
    this.setData({
      getCoupon: !this.data.getCoupon
    })
  },
  onShareAppMessage() {
      console.log(11)
    return {
      title: this.data.userInfo.nickname + '邀请您成为早鸟会员',
      path: '/page/tabBar/home/index?uid=' + this.data.userInfo.id,
      imageUrl: this.data.imgSrc + 'xcx_images/invite_share.png'
    }
  },
})