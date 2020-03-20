// pages/exchange-success/exchange-success.js
const util = require("../../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgSrc: util.config.source,
        id:0,
        type:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id:options.id,
            type:options.type
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
    toRecord(){
        if(this.data.id){
            wx.navigateTo({
                url: '/page/interest/pages/exchange-detail/exchange-detail?id=' + this.data.id,
            })
        }else{
            wx.navigateTo({
                url: '/page/interest/pages/record/record',
            })
        }

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