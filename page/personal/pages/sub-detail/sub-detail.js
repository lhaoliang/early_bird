// pages/sub-detail/sub-detail.js
const util = require("../../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        orderDetail: {},
        address: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id
        })
        this.getDetail();
        this.getAddress()
    },
    getDetail() {
        wx.showLoading({
            title: '加载中',
        })
        util.requester.get("/frontapi/store/appoint/detail", {
            id: this.data.id
        }, res => {
            console.log(res)
            this.setData({
                orderDetail: res.datas
            });
            wx.hideLoading();
            wx.stopPullDownRefresh();//停止当前页面下拉刷新。

        })
    },
    setWarn() {
        util.requester.post('/frontapi/store/order/shipping/reminder', {
            orderId: this.data.id
        }, res => {
            wx.showToast({
                title: '已提醒发货，请耐心等待哦亲',
                duration: 1200,
                icon: 'none'
            })
        })
    },
    toHome() {
        wx.navigateTo({
            url: '/page/tabBar/home/index',
        })
    },
    getAddress() {
        util.requester.get("/frontapi/store/address/default/get", {
        }, res => {
            this.setData({
                address: res.datas
            })
        })
    },
    toPay(e){

        util.requester.get("/frontapi/store/appoint/tail/preview", {
            appointId: e.currentTarget.dataset.id
        }, res => {
            if (res.result) {
                wx.navigateTo({
                    url: `/page/personal/pages/pay-end/pay-end?sign=${res.datas.sign}&goodsInfo=${res.datas.goodsInfo}&remark=${res.datas.order.remark}&orderInfo=${JSON.stringify(res.datas.order)}`,
                });
            }
        })
    },
    toOrderDetail(e){
        wx.navigateTo({
            url: '/page/personal/pages/order-detail/order-detail?id=' + e.currentTarget.dataset.id,
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

    },
    // 下拉刷新
    onPullDownRefresh: function () {
        console.log("刷新");
        wx.showLoading({
            title: "刷新中",
            mask: true,

        });
        this.getDetail();
        this.getAddress()
        wx.hideLoading();
        console.log("关闭");

    }
})