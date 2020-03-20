// pages/money-rule/money-rule.js
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgSrc: util.config.source,
        limit: 100,
        offset: 0,
        isMore: true,
        isLoading: false,
        prizeList: [],
        superGoods:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            offset: 0,
            limit: 100,
            isLoading: false
        })
        this.getPrizeList()
        this.getUserInfo()
        this.getSuper()
    },
    toRule(){
        wx.navigateTo({
            url: '/page/interest/pages/change-rule/change-rule',
        })
    },
    getSuper(){
        util.requester.get("/frontapi/store/equity/super/jackpot/get", {}, res => {
            this.setData({
                superGoods:res.datas
            })
        })
    },
    getPrizeList() {
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
        util.requester.get("/frontapi/store/equity/exchange/prize/list", params, res => {
            console.log(res)
            this.data.isLoading = false;
            wx.hideLoading();
            this.setData({
                prizeList: this.data.prizeList.concat(res.datas.rows),
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
    getUserInfo() {
        wx.showLoading({
            title: '加载中',
        });
        util.requester.get("/frontapi/store/user/info", {}, res => {
            this.setData({
                growValue: res.datas.growthValue
            })
            wx.hideLoading();
            wx.stopPullDownRefresh(); //停止当前页面下拉刷新
        })
    },
    toCouponDetail(e){
        wx.navigateTo({
            url: '/page/interest/pages/coupon-goods-detail/coupon-goods-detail?id=' + e.currentTarget.dataset.id +"&type=" + e.currentTarget.dataset.type,
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
        wx.navigateTo({
            url: '/page/interest/pages/record/record',
        })
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
        wx.showLoading({
            title: "刷新中",
            mask: true,
        });
        this.getUserInfo()
        wx.hideLoading();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getPrizeList()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

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
})