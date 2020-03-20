// pages/refund-detail/refund-detail.js
const util = require("../../../../utils/util.js");

Page({

	/**
	 * 页面的初始数据
	 */
    data: {
        imgSrc: util.config.source,
        id: '',
        orderDetail:{},
        info:'提醒发货',
        ordetPath:{}
    },

	/**
	 * 生命周期函数--监听页面加载
	 */
    onLoad: function (options) {
        console.log(options.id)
        this.setData({
            id:options.id
        })
        
    },

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
    onReady: function () {

    },
    clarm(e){
        if (this.data.orderDetail.isRemind){
            return
        }
        util.requester.put('/frontapi/store/equity/order/remind/update', {
            orderId: e.currentTarget.dataset.id
        }, res => {
            if(res.result){
                wx.showToast({
                    title: '已成功提醒！',
                    duration: 1200
                });
                this.setData({
                    info:'提醒发货'?'已提醒':'提醒发货'
                })
            }
            this.getRecordDetail()
        })
    },
    getPath(){
        util.requester.get('/frontapi/store/equity/order/path/get', {
            orderId: this.data.id
        }, res => {
           this.setData({
               ordetPath:res.datas
           })
        })
    },
    toLogistics(e){
        wx.navigateTo({
            url: '/page/personal/pages/logistics/logistics?id=' + this.data.id +'&type=vip'
        })
    },
    getRecordDetail(){
        wx.showLoading({
            title: '加载中',
        })
        util.requester.get('/frontapi/store/equity/exchange/record/detail', {
            id:  this.data.id
        }, res => {
            this.setData({
                orderDetail:res.datas
            })
        })
        wx.hideLoading();
        wx.stopPullDownRefresh();//停止当前页面下拉刷新。
    },
	/**
	 * 生命周期函数--监听页面显示
	 */
    onShow() {
        this.getRecordDetail()
        this.getPath()
    },
    // 上拉刷新
    onReachBottom() {
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

    // 获取订单退款详情
    // 下拉刷新
    onPullDownRefresh: function () {
        console.log("刷新");
        wx.showLoading({
            title: "刷新中",
            mask: true,
        });
        this.getRecordDetail()
        wx.hideLoading();
        console.log("关闭");

    }
})