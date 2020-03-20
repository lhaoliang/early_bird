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
    isMore: true,
    isLoading: false,
    limit: 10,
    offset: 0,
    isMember: true,
    goodsList: [],
    flag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      this.getUserInfo()
      this.setData({
          isMore: true,
          isLoading: false,
          offset: 0,
          goodsList: []
      })

      this.getMemberGoods()
  },

  onShow: function() {
      this.getUserInfo()


  },
  // 获取用户信息
  getUserInfo() {
    util.requester.get("/frontapi/store/user/info", {}, res => {

      if (res.datas.isVip == 0) {
        this.setData({
          isMember: false
        })
      } else {
        this.setData({
          isMember: true
        })
      }
      this.setData({
        userInfo: res.datas
      });
      wx.hideLoading();
      wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
    })
  },
  showBeMember() {
    this.setData({
      isMember: true
    })
  },
  toInvitation() {
    wx.navigateTo({
      url: '/page/interest/pages/ivitation/ivitation',
    })
  },
  toHome() {
    wx.switchTab({
      url: '/page/tabBar/home/index',
    })
  },
  getPhoneNumber: function(e) {
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
            this.onLoad()
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
  onReachBottom(){
      this.getMemberGoods()
  },
  getMemberGoods() {
    if (!this.data.isMore) {
      return;
    }
    let params = {
      limit: this.data.limit,
      offset: this.data.offset
    };
    wx.showLoading({
      title: '加载中',
    });
    util.requester.get("/frontapi/store/equity/member/area/list", params, res => {
      console.log(res)
      this.data.isLoading = false;
      wx.hideLoading();
      this.setData({
        goodsList: this.data.goodsList.concat(res.datas.rows),
        offset: this.data.offset + this.data.limit
      });
      if (res.datas.rows.length == 0) {
        this.setData({
          isMore: false
        })
        wx.showToast({
          title: '没有更多了~',
          icon: "none",
          duration: 1200
        })
      };
      wx.stopPullDownRefresh(); //停止当前页面下拉刷新
    })
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    console.log("刷新");
   
    wx.showLoading({
      title: "刷新中",
      mask: true,

    });
      this.onLoad()
      wx.hideLoading()
    console.log("关闭");

  },
  toChangeGifts() {
    wx.navigateTo({
      url: "/page/interest/pages/change-gifts/change-gifts"
    })
  },
  toquestion() {
    wx.navigateTo({
      url: "/page/interest/pages/questionnaire-survey/questionnaire-survey"
    })
  },
  onShareAppMessage() {
    return {
      title: this.data.userInfo.nickname + '邀请您成为早鸟会员',
      path: '/page/tabBar/home/index?uid=' + this.data.userInfo.id,
      imageUrl: this.data.imgSrc + 'xcx_images/invite_share.png'
    }
  },
})