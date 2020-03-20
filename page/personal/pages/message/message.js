// pages/message/message.js
const util = require("../../../../utils/util.js");
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

    },
    onShow() {
        this.setData({
            isMore: true,
            isLoading: false,
            offset: 0,
            total: 0,
            limit: 10,
            list: [],

        });
        this.getMessage();
    },
    chooseTab(e) {
        this.setData({
            tab: e.currentTarget.dataset.tab,
            offset: 0,
            total: 0,
            list: [],
            isMore: true
        });
        this.getMessage();
    },
    toHome() {
        wx.switchTab({
            url: '/page/tabBar/home/index',
        })
    },
    getMessage() {

        if (this.data.tab == 2) {
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
            util.requester.get("/frontapi/store/notice/sys", params, res => {
                this.data.isLoading = false;
                wx.hideLoading();
                this.setData({
                    list: this.data.list.concat(res.datas.rows),
                    total: res.datas.total,
                    offset: this.data.offset + this.data.limit
                })
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
        };
        if (this.data.tab == 1) {
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
            util.requester.get("/frontapi/store/dynamic/list", params, res => {
                this.data.isLoading = false;
                wx.hideLoading();
                // res.datas.rows.forEach(x => {
                //     // if (x.comment.length > 14) {
                //     //     x.comment = x.comment.slice(0, 14) + '...';
                //     // } 
                //     if (x.goods.goodsName.length > 14) {
                //         x.goods.goodsName = x.goods.goodsName.slice(0, 14) + '...';
                //     }
                // });
                this.setData({
                    list: this.data.list.concat(res.datas.rows),
                    total: res.datas.total,
                    offset: this.data.offset + this.data.limit
                });

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
                }
                wx.stopPullDownRefresh();//停止当前页面下拉刷新。


            })
        }

    },
    // toComment(e){
    //     // if(e.currentTarget.dataset.item.isScreened ==0){
    //     //     this.readMessage(e.currentTarget.dataset.item.id);
    //     // }
    //     // wx.navigateTo({
    //     //     url: '/pages/goods-comment/goods-comment' + "?id=" + e.currentTarget.dataset.item.id,
    //     // });
    // },
    // 跳转订单详情
    toOrderDetail(e) {
        if (e.currentTarget.dataset.item.noticeType == 1 || e.currentTarget.dataset.item.noticeType == 4) {
            if (e.currentTarget.dataset.item.isread == 0) {
                this.readMessage(e.currentTarget.dataset.item.id);
            }

            wx.navigateTo({
                url: '/page/personal/pages/order-detail/order-detail' + "?id=" + e.currentTarget.dataset.item.orderId + '&type=1',
            });

        } else if (e.currentTarget.dataset.item.noticeType == 2) {
            if (e.currentTarget.dataset.item.isread == 0) {
                this.readMessage(e.currentTarget.dataset.item.id);
            }
            wx.navigateTo({
                url: '/page/personal/pages/sub-detail/sub-detail' + "?id=" + e.currentTarget.dataset.item.orderId,
            });

        } else if (e.currentTarget.dataset.item.noticeType == 3) {
            if (e.currentTarget.dataset.item.isread == 0) {
                this.readMessage(e.currentTarget.dataset.item.id);
            }
            wx.navigateTo({
                url: '/page/personal/pages/trialorder-detail/trialorder-detail' + "?id=" + e.currentTarget.dataset.item.orderId,
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
    // 读消息
    readMessage(id) {

        util.requester.put("/frontapi/store/notice/read/set", {
            id: id
        }, res => {
            console.log(res);
        })
    },
    // 上拉刷新
    onReachBottom() {
        this.getMessage();
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        this.onShow();
        console.log("刷新");

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
    toDetial(e) {
        if (e.currentTarget.dataset.item.dynamicType == 1) {
            wx.navigateTo({
                url: '/page/newsale/pages/goods-comment-detail/goods-comment-detail?id=' + e.currentTarget.dataset.item.linkId
            })
        } else if (e.currentTarget.dataset.item.dynamicType == 2){
            wx.navigateTo({
                url: '/page/newsale/pages/goods-question-detail/goods-question-detail?id=' + e.currentTarget.dataset.item.linkId,
            })
        } else if (e.currentTarget.dataset.item.dynamicType == 4) {
            wx.navigateTo({
                url: '/page/newsale/pages/goods-question-detail/goods-question-detail?id=' + e.currentTarget.dataset.item.from.questionId,
            })
        }


    },

})