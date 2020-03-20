// pages/message/message.js
const util = require('../../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: 1,
        list: [],
        imgSrc: util.config.source,
        isMore: true,
        isLoading: false,
        total: 0,
        limit: 10,
        offset: 0,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            isMore: true,
            isLoading: false,
            offset: 0,
            total: 0,
            limit: 10,
            list: [],

        });
        this.getCoupon();
    },
    onShow() {

    },
    chooseTab(e) {
        this.setData({
            tab: e.currentTarget.dataset.tab,
            offset: 0,
            total: 0,
            list: [],
            isMore: true
        });
        this.getCoupon();
    },
    toHome() {
        wx.switchTab({
            url: '/page/tabBar/home/index',
        })
    },
    getCoupon() {

        if (!this.data.isMore) {
            return;
        }
        wx.showLoading({
            title: '加载中',
        })
        let params = {
            limit: this.data.limit,
            offset: this.data.offset,
            couponStatus: ''
        }
        if (this.data.tab == 3) {
            params.couponStatus = 2;
        } else if (this.data.tab == 2) {
            params.couponStatus = 1;
        } else if (this.data.tab == 1) {
            params.couponStatus = 0;
        }
        util.requester.get("/frontapi/store/coupon/list", params, res => {
            this.data.isLoading = false;
            wx.hideLoading();
            if(this.data.offset == 0){
                this.setData({
                    list: res.datas.rows,
                    total: res.datas.total,
                    offset: this.data.offset
                })
            }else{
                this.setData({
                    list: this.data.list.concat(res.datas.rows),
                    total: res.datas.total,
                    offset: this.data.offset + this.data.limit
                })
            }

            // console.log(this.data.list);
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
            wx.stopPullDownRefresh();//停止当前页面下拉刷新。

        })



    },

    // 跳转订单详情
    toOrderDetail(e) {
        if (e.currentTarget.dataset.item.noticeType == 1) {
            if (e.currentTarget.dataset.item.isread == 0) {
                this.readMessage(e.currentTarget.dataset.item.id);
            }

            wx.navigateTo({
                url: '/page/personal/pages/order-detail/order-detail' + "?id=" + e.currentTarget.dataset.item.orderId,
            });

        } else if (e.currentTarget.dataset.item.noticeType == 2) {
            if (e.currentTarget.dataset.item.isread == 0) {
                this.readMessage(e.currentTarget.dataset.item.id);
            }
            wx.navigateTo({
                url: '/page/personal/pages/sub-detail/sub-detail' + "?id=" + e.currentTarget.dataset.item.orderId,
            });

        } else if (e.currentTarget.dataset.item.noticeType == 5) {
            if (e.currentTarget.dataset.item.isread == 0) {
                this.readMessage(e.currentTarget.dataset.item.id);
            }
            wx.navigateTo({
                url: '/page/personal/pages/refund-detail/refund-detail' + "?id=" + e.currentTarget.dataset.item.orderId,
            });
        }


    },
    
    // 上拉刷新
    onReachBottom() {
        this.getCoupon();
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        console.log("刷新");
        this.setData({
            isMore: true,
            isLoading: false,
            offset: 0,
            total: 0,
            limit: 10,
            list: [],

        });
        this.getCoupon();
        console.log("关闭");

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
        }, 5000)
    },
    toChangeGifts() {
        wx.navigateTo({
            url: "/page/interest/pages/change-gifts/change-gifts"
        })
    }
})