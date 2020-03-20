// pages/my-orders/my-orders.js
const util = require("../../../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: -1,
        list: [],
        isMore: true,
        isLoading: false,
        imgSrc: util.config.source,
        total: 0,
        limit: 10,
        offset: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            tab: options.type || this.data.tab,
        })
    },
    onShow() {
        this.setData({
            isMore: true,
            isLoading: false,
            offset: 0,
            list: []
        })
        this.getOrderList();
    },
    deleteOrder(e) {
        wx.showModal({
            title: '提示',
            content: '你确定要删除此订单吗？',
            success: res => {
                if (res.confirm) {
                    util.requester.delete('/frontapi/store/order/delete', {
                        orderId: e.currentTarget.dataset.id
                    }, res => {
                        if (res.result) {
                            wx.showToast({
                                title: '删除成功',
                            })
                            this.onShow()
                        }
                    })
                }
            }
        })

    },
    // 上拉刷新
    onReachBottom() {
        this.getOrderList();
    },
    chooseTab(e) {
        if (this.data.isLoading) {
            return;
        }
        this.data.isLoading = true;
        this.setData({
            list: [],
            tab: e.currentTarget.dataset.tab,
            offset: 0,
            isMore: true
        })
        this.getOrderList();
    },
    toOrderDetail(e) {
        if (e.currentTarget.dataset.item.refundStatus == 2 || e.currentTarget.dataset.item.refundStatus == 3) {
            wx.navigateTo({
                url: '/page/personal/pages/order-detail/order-detail?id=' + e.currentTarget.dataset.item.id + '&type=2'
            })
        } else {
            wx.navigateTo({
                url: '/page/personal/pages/order-detail/order-detail?id=' + e.currentTarget.dataset.item.id + '&type=1'
            })
        }

    },
    toHome() {
        wx.switchTab({
            url: '/page/tabBar/home/index',
        })
    },
    // 获取订单列表
    getOrderList() {
        if (!this.data.isMore) {
            return;
        }
        wx.showLoading({
            title: '加载中',
        })
        let params = {
            limit: this.data.limit,
            offset: this.data.offset
        }
        if (this.data.tab >= -1) {
            params.status = this.data.tab;
        }
        util.requester.get("/frontapi/store/order/list", params, res => {
            this.data.isLoading = false;
            wx.hideLoading();
            this.setData({
                list: this.data.list.concat(res.datas.rows),
                total: res.datas.total,
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
            wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
        })
    },
    // 评价
    clickComment(e) {
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: `/page/personal/pages/submit-assess/submit-assess?id=${item.id}&goodsInfo=${JSON.stringify(item.orderGoods[0])}`,
        })
    },
    // 支付
    clickPay(e) {
        let item = e.currentTarget.dataset.item;
        if (item.activityId) {
            util.requester.post('/frontapi/store/order/repay', {
                orderId: item.id
            }, res => {
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

                        util.requester.get("/frontapi/store/order/confirm", {
                            ordersn: res.datas.ordersn,
                        }, () => {
                            wx.showToast({
                                title: '支付成功',
                                duration: 1200
                            })
                            wx.hideLoading();
                            setTimeout(() => {
                                this.onShow();
                            }, 800)
                        })

                    },
                    fail: e => {
                        console.log(e);
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none',
                            duration: 1200
                        })
                    }
                })
            })
        }
        if (item.memberId) {
            util.requester.post('/frontapi/store/equity/payment/rePay', {
                orderId: item.id
            }, res => {
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

                        util.requester.get("/frontapi/store/equity/payment/confirm", {
                            ordersn: res.datas.ordersn,
                        }, () => {
                            wx.showToast({
                                title: '支付成功',
                                duration: 1200
                            })
                            wx.hideLoading();
                            setTimeout(() => {
                                this.onShow();
                            }, 800)
                        })

                    },
                    fail: e => {
                        console.log(e);
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none',
                            duration: 1200
                        })
                    }
                })
            })
        }
    },
    clickRemind(e) {
        let item = e.currentTarget.dataset.item;
        util.requester.post('/frontapi/store/order/shipping/reminder', {
            orderId: item.id
        }, res => {
            if (res.result) {
                wx.showToast({
                    title: '已成功提醒发货，请耐心等待哦亲',
                    duration: 1200,
                    icon: 'none'
                })
            }
            this.onShow();
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
    clickToLogistics(e) {
        let item = e.currentTarget.dataset.item;

        wx.navigateTo({
            url: '/page/personal/pages/logistics/logistics?id=' + item.id
        })
    },
    // 下拉刷新
    onPullDownRefresh: function() {
        console.log("刷新");
        wx.showLoading({
            title: "刷新中",
            mask: true,

        });
        this.onShow();
        wx.hideLoading();
        console.log("关闭");

    }
})