// pages/my-sub/my-sub.js
const util = require("../../../../utils/util.js");
Page({

    /**
     * 页面的初始数据11
     */
    data: {
        tab: 1,
        appointTotal: 0,
        alarmTotal: 0,
        limit: 10,
        offset: 0,
        limit2: 10,
        offset2: 0,
        appointList: [],
        alarmList: [],
        goodsInfo: {},
        imgSrc: util.config.source,
        timer: '',
        timer2: '',
        isMore: true,
        isMore2: true,
        isLoading: false,
        isLoading2: false,
    },
    chooseTab(e) {
        this.setData({
            tab: e.currentTarget.dataset.tab,
        })

        if (this.data.tab == 1) {
            if (this.data.isLoading) {
                return;
            }
            this.data.isLoading = true;
            this.setData({
                isLoading: false
            })
            this.getAlarmList()
        }
        if (this.data.tab == 2) {
            if (this.data.isLoading2) {
                return;
            }
            this.data.isLoading2 = true;
            this.setData({
                isLoading2: false
            })
            this.getAppointList()
        }
    },
    toHome() {
        wx.switchTab({
            url: '/page/tabBar/home/index'
        })
    },
    toOrderDetail(e) {
        wx.navigateTo({
            url: `/page/personal/pages/order-detail/order-detail?id=${e.currentTarget.dataset.id}`,
        })
    },
    lookOrder(e) {
        wx.navigateTo({
            url: `/page/personal/pages/sub-fail/sub-fail?id=` + e.currentTarget.dataset.id,
        })
    },
    toDetail(e) {
        wx.navigateTo({
            url: `/page/personal/pages/sub-detail/sub-detail?id=${e.currentTarget.dataset.id}`,
        })
    },
    toPresaleDetail(e) {
        wx.navigateTo({
            url: `/page/presale/pages/presale-detail/presale-detail?id=${e.currentTarget.dataset.id}&goodsId=${e.currentTarget.dataset.idx}`,
        })
    },
    getAppointList() {
        if (!this.data.isMore2) {
            return;
        }
        let params = {
            limit: this.data.limit2,
            offset: this.data.offset2,
        };
        wx.showLoading({
            title: '加载中',
        })
        util.requester.get("/frontapi/store/appoint/list", params, res => {
            this.data.isLoading2 = false;
            wx.hideLoading();
            this.setData({
                appointList: this.data.appointList.concat(res.datas.rows),
                appointTotal: res.datas.total,
                offset2: this.data.offset2 + this.data.limit2
            });
            if (res.datas.rows.length == 0) {
                this.setData({
                    isMore2: false
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
    getEndTime2(time2) {
        if (time2 <= 0) {
            time2 = 0;
        }
        let diffTime = Math.round((new Date(time2) - new Date()) / 1000);
        // if (v.status != 3) {
        //     diffTime = Math.round((new Date(v.appointActivity.endTime) - new Date()) / 1000);
        // } else {
        //     diffTime = Math.round((new Date(v.tailpayExpiredTime) - new Date()) / 1000);
        // }

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
    setTimeInterval2() {
        this.data.timer2 = setInterval(() => {
            this.data.appointList.forEach(v => {
                if (v.status == 3) {
                    v.endTime = new Date(v.tailpayExpiredTime)
                    v.endTime--;
                    v.endTimeFormat = this.getEndTime2(v.tailpayExpiredTime)

                } else {
                    v.endTime = new Date(v.appointActivity.endTime)
                    v.endTime--;
                    v.endTimeFormat = this.getEndTime2(v.appointActivity.endTime)
                }

            })
            this.setData({
                appointList: this.data.appointList
            })
        }, 990)
    },
    getAlarmList() {
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
        util.requester.get("/frontapi/store/appoint/alarm/list", params, res => {
            this.data.isLoading = false;
            wx.hideLoading();
            this.setData({
                alarmList: this.data.alarmList.concat(res.datas.rows),
                alarmTotal: res.datas.total,
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
    // 设置定时器
    setTimeInterval() {
        this.data.timer = setInterval(() => {
            this.data.alarmList.forEach(v => {
                v.endTime = new Date(v.appointActivity.endTime)
                v.endTime--;
                v.endTimeFormat = this.getEndTime(v.appointActivity.endTime)
            })
            this.setData({
                alarmList: this.data.alarmList
            })
        }, 990)
    },
    cancel(e) {
        util.requester.post('/frontapi/store/appoint/alarm/set', {
            activityId: e.currentTarget.dataset.activityid
        }, res => {
            if (res.result) {
                wx.showToast({
                    title: '取消提醒成功',
                    icon: 'success',
                    duration: 1200
                })
                setTimeout(() => {
                    this.setData({
                        appointTotal: 0,
                        alarmTotal: 0,
                        limit: 10,
                        offset: 0,
                        limit2: 10,
                        offset2: 0,
                        appointList: [],
                        alarmList: [],
                        goodsInfo: {},
                        timer: '',
                        timer2: '',
                        isMore: true,
                        isMore2: true,
                        isLoading: false,
                        isLoading2: false,
                    })
                    this.getAlarmList();
                }, 1200)
            } else {
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 1000
                })
            }
        })
    },
    clickPay(e) {
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            offset: 0,
            limit: 10,
            isLoading: false
        })
        this.getAlarmList()
        this.setTimeInterval()
        this.setTimeInterval2()
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
        this.setTimeInterval2()
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
        if (this.data.tab == 1) {
            this.getAlarmList()
        }
        if (this.data.tab == 2) {
            this.getAppointList()
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    // 下拉刷新
    onPullDownRefresh: function() {
        if (this.data.tab == 1) {
            wx.showLoading({
                title: "刷新中",
                mask: true,
            });
            this.setData({
                alarmList: [],
                goodsInfo: {},
                offset: 0,
                isMore: true,
                isLoading: false,
            });
            clearInterval(this.data.timer);
            this.getAlarmList();
            this.setTimeInterval();
            wx.hideLoading();
        }
        if (this.data.tab == 2) {
            wx.showLoading({
                title: "刷新中",
                mask: true,
            });
            this.setData({
                appointList: [],
                goodsInfo: {},
                offset2: 0,
                isMore2: true,
                isLoading2: false,
            })
            clearInterval(this.data.timer2);
            this.getAppointList();
            this.setTimeInterval2();
            wx.hideLoading();
        }
    },
})