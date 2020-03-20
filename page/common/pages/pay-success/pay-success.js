// pages/pay-success/pay-success.js
const util = require('../../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:'',
        type: 1,
        imgSrc: util.config.source,
    },
    toHome() {
        wx.switchTab({
            url: '/page/tabBar/home/index',
        })
    },
    toDetail(){
      if (this.data.type ==1) {
        wx.navigateTo({
          url: '/page/personal/pages/order-detail/order-detail?id=' + this.data.id + "&type=1",
        })
      } 
      if(this.data.type == 2) {
        wx.navigateTo({
          url: '/page/trial/pages/sub-detail/sub-detail?id=' + this.data.id,
        })
      }
        if (this.data.type == 3) {
            wx.navigateTo({
                url: '/page/trial/pages/trialorder-detail/trialorder-detail?id=' + this.data.id,
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id,
            type: options.type
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})