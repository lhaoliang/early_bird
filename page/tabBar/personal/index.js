// pages/my/my.js
const util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    messageTotal: 0,
    imgSrc: util.config.source,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
    this.getMessageNum();
  },

  onShow: function () {
    this.getMessageNum();
  },
  toTrial() {
    wx.navigateTo({
      url: '/page/personal/pages/my-trial/my-trial',
    })
  },
  toAddress() {
    wx.navigateTo({
      url: '/page/personal/pages/my-address/my-address?mode=0',
    })
  },
  toAdvice() {
    wx.navigateTo({
      url: '/page/personal/pages/advice/advice',
    })
  },
  toCoupon() {
    wx.navigateTo({
      url: '/page/personal/pages/coupon/coupon',
    })
  },
  toOrders() {
    wx.navigateTo({
      url: '/page/personal/pages/my-orders/my-orders',
    })
  },
  toSub() {
    wx.navigateTo({
      url: '/page/personal/pages/my-sub/my-sub',
    })
  },
  toRefund() {
    wx.navigateTo({
      url: '/page/personal/pages/my-refund/my-refund',
    })
  },
  // 跳转订单列表
  clickOrder(e) {
    wx.navigateTo({
      url: '/page/personal/pages/my-orders/my-orders?type=' + e.currentTarget.dataset.type
    })
  },
  // 获取用户信息
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
  // 获取未读消息总数
  getMessageNum() {
    util.requester.get("/frontapi/store/notice/unread/count", {}, res => {
      console.log(res);
      this.setData({
        messageTotal: res.datas
      })

    })
  },

  /**
   * 获取手机号
   */
  getPhoneNumber: function (e) {
    console.log(e)
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      util.requester.post("/frontapi/store/phone/decrypt", {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }, res => {
        console.log(res);
        if (res.datas == '授权失败') {
          wx.clearStorageSync();
          wx.showToast({
            title: '身份过期，请重新登录',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/page/common/pages/authorization/authorization'
            })
          }, 1300)
        } else {
          // 更新用户手机号
          util.requester.put("/frontapi/store/phone/save", {
            phone: res.datas.phoneNumber,
          }, res => {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
            this.getUserInfo()
          })

        }
      })
    } else {
      wx.showToast({
        title: '您已取消授权',
        icon: 'none'
      })
      this.getUserInfo()
    }
  },
  toMessage() {
    wx.navigateTo({
      url: '/page/personal/pages/message/message'
    })
  },
  /**
   * 获取formId
   */
  getFormId(e) {
    console.log(e.detail.formId);
    if (e.detail.formId != "the formId is a mock one") {
      util.requester.post("/frontapi/store/collect/user/formid", {
        formId: e.detail.formId
      })
    }
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    console.log("刷新");
    wx.showLoading({
      title: "刷新中",
      mask: true,

    });
    this.getUserInfo();
    console.log("关闭");

  },
  onShareAppMessage() {
    return {
      title: this.data.userInfo.nickname + '邀请您成为早鸟会员',
      path: '/page/tabBar/home/index?uid=' + this.data.userInfo.id,
      imageUrl: this.data.imgSrc + 'xcx_images/invite_share.png'
    }
  },
})