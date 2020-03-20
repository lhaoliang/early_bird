// pages/pay/pay.js
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activityId: '',
        goodsSpecId: '',
        purchaseNum: '',
        goodsInfo: {},
        appointInfo: '',
        sign: '',
        orderId: '',
        canUse:true,
    },
    // toSuccess(){
    //     wx.navigateTo({
    //         url: '/pages/pay-success/pay-success'
    //     })
    // },
    getAppointPreview() {  //用户支付定金预览
        util.requester.get('/frontapi/store/appoint/deposit/preview', {
            activityId: this.data.activityId,
            goodsSpecId: this.data.goodsSpecId,
            purchaseNum: this.data.purchaseNum,
        }, res => {
            this.setData({
                goodsInfo: res.datas.appoint,
                appointInfo: res.datas.appointInfo,
                sign: res.datas.sign,
            })
        })
    },
    clickPay() {  //用户支付定金
    wx.showLoading()
    this.setData({
        canUse:false
    })
        util.requester.post('/frontapi/store/appoint/deposit/pay', {
            appointInfo: this.data.appointInfo,
            sign: this.data.sign,
        }, res => {
            console.log(res)
            wx.hideLoading()
            this.setData({
                canUse:true
            })
            if (res.result) {
                this.setData({
                    orderId: res.datas.orderId
                });
                wx.requestPayment({
                    timeStamp: res.datas.signArray.timeStamp,
                    nonceStr: res.datas.signArray.nonceStr,
                    package: res.datas.signArray.package,
                    signType: res.datas.signArray.signType,
                    paySign: res.datas.signArray.paySign,
                    success: result => {
                        wx.showLoading({
                            title: '查询支付状态',
                        });
                        util.requester.get("/frontapi/store/appoint/order/confirm", {
                            ordersn: res.datas.ordersn,
                        }, () => {
                            wx.showToast({
                                title: '支付成功',
                                duration: 1200
                            })
                            setTimeout(() => {
                                wx.redirectTo({
                                    url: '/page/common/pages/pay-success/pay-success?id=' + res.datas.orderId + '&type=2'
                                })
                            }, 1200)
                        })
                    },
                    // fail: (res) => {
                    //     console.log(res);

                    //     wx.showToast({
                    //         title: '订单已保存,可在我的订单中支付此订单哦~',
                    //         icon: 'none',
                    //         duration: 1200
                    //     });

                    //     wx.navigateTo({
                    //         url: '/pages/order-detail/order-detail?id=' + this.data.orderId
                    //     });
                    // }
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            activityId: options.activityId,
            goodsSpecId: options.goodsSpecId,
            purchaseNum: options.purchaseNum,
        })
        this.getAppointPreview()
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