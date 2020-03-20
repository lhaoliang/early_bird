// pages/pay-end/pay-end.js
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        addressId: '',
        sign: '',
        goodsInfo: {},
        imgSrc: util.config.source,
        remark: '',
        orderInfo: {},
        goods: {},
        orderId: '',
        timer: '',
        endTime:''
    },
    getDefaultAddress() {
        wx.showLoading({
            title: '加载中',
        })
        util.requester.get('/frontapi/store/address/default/get', {}, res => {
            wx.hideLoading();
            this.setData({
                address: res.datas
            })
        })
    },
    toAddress() {
        wx.navigateTo({
            url: '/page/personal/pages/my-address/my-address?mode=1',
        })
    },
    clickPay() { //用户支付尾款
        if (this.data.address == null || this.data.address.id <= 0) {
            wx.showToast({
                title: '请添加地址',
                duration: 1200,
                type: 'error'
            })
            return;
        }
        util.requester.post('/frontapi/store/appoint/tail/pay', {
            goodsInfo: this.data.goodsInfo,
            sign: this.data.sign,
            addressId: this.data.address.id,
            remark: this.data.remark
        }, res => {
            console.log(res)
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
                        util.requester.get("/frontapi/store/tail/order/confirm", {
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
                    fail: (res) => {
                        wx.showToast({
                            title: '您已取消支付',
                            icon: 'none',
                            duration: 1200
                          });
                    }
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            sign: options.sign,
            goodsInfo: options.goodsInfo,
            orderInfo: JSON.parse(options.orderInfo),
            remark: options.remark,
            goods: JSON.parse(options.orderInfo).goods,
        })
        console.log(this.data.orderInfo);
        this.getDefaultAddress()
        this.setTimeInterval()
    },
    getEndTime(time) {
        if (time <= 0) {
            time = 0;
        }
        let diffTime = Math.round((new Date(time) - new Date()) / 1000);
        let days = Math.floor(diffTime / 60 / 60 / 24);
        diffTime = diffTime % (60 * 60 * 24);
        let hours = Math.floor(diffTime / 60 / 60);
        diffTime = diffTime % (60 * 60);
        let mins = Math.floor(diffTime / 60);
        let seconds = diffTime % 60;
        if (days > 0) {
            return `${days}天${hours.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${hours.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
        }
    },
    // // // 设置定时器
    setTimeInterval() {
        let optTime = this.data.orderInfo.expiredTime
        optTime = new Date(optTime)

        console.log(optTime)
        this.data.timer = setInterval(() => {
            let finallyTime = this.getEndTime(optTime)
            this.setData({
                endTime:finallyTime
            })
            
        }, 990)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

        this.setTimeInterval()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})