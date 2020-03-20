//index.js
//获取应用实例
const app = getApp()
const util = require('../../../../utils/util.js')
Page({
  data: {
      imgSrc: util.config.source,
      friendId:0
  },

  onLoad: function () {
  },
  /**
   * 获取formId
   */
  getFormId(e) {
    setTimeout(() => {
      console.log(e.detail.formId);
      if (e.detail.formId != "the formId is a mock one") {
        util.requester.post("/frontapi/store/collect/user/formid", {
          formId: e.detail.formId
        })
      }
    }, 10000)
  },
  // 点击授权登陆
  clickLogin(userInfo) {
    console.log(userInfo)

    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success: res => {
        util.requester.post('/frontapi/store/wechat/xcx/sessionkey/get', {
          code: res.code
        }, res => {
          util.requester.post('/frontapi/store/wechat/xcx/token/get', {
            openid: res.datas.openid,
            sessionKey: res.datas.sessionKey,
            avatar: userInfo.detail.userInfo.avatarUrl,
            nickname: userInfo.detail.userInfo.nickName,
            gender: userInfo.detail.userInfo.gender,
            city: userInfo.detail.userInfo.city,
            country: userInfo.detail.userInfo.country,
            gender: userInfo.detail.userInfo.gender,
            friendId: wx.getStorageSync("uid") ? wx.getStorageSync("uid") : 0
          }, res => {
            wx.hideLoading();
            wx.setStorageSync('ng-params-one', res.datas.id);
            wx.setStorageSync('ng-params-two', res.datas.token);
            wx.setStorageSync('ng-params-three', 'xcx');
              if (wx.getStorageSync("uid") !=0){
                  wx.reLaunch({
                      url: '/page/tabBar/interest/index'
                  })
              }else{
                  let url = '/page/tabBar/home/index'
                  console.log(url)
                  wx.reLaunch({
                      url: url
                  })
              }
          })
        })
      }
    })
  },
})