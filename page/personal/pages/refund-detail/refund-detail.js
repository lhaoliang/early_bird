// pages/refund-detail/refund-detail.js
const util = require("../../../../utils/util.js");

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		status: 6,
		list: [{}],
		orderDetail: {},
        id:'',
        imgSrc: util.config.source,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			id: Number(options.id)
		})
		this.getOrderDetail();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		this.setData({
			id: this.data.id
		})
		this.getOrderDetail();
	},
	// 上拉刷新
	onReachBottom() {
		this.getOrderList();
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
	getOrderDetail() {
		wx.showLoading({
            title: '加载中',
        })
		util.requester.get("/frontapi/store/order/refund/detail", {
			refundRequestId: this.data.id
		}, res => {
			this.setData({
				orderDetail: res.datas
			})
			wx.hideLoading();
			wx.stopPullDownRefresh();//停止当前页面下拉刷新。
		})
	},
	cancel(e) {
		wx.showModal({
			title: '提示',
			content: '你确定要取消退款吗？',
			success:res=> {
				if (res.confirm) {
					util.requester.put("/frontapi/store/order/refund/cancel", {
						refundRequestId: e.currentTarget.dataset.id
					}, res => {
						console.log(res)
						if (res.result) {
							wx.showToast({
								title: '你已成功取消退款',
								duration: 1200
							});
                            this.onShow()
						} else {
							wx.showToast({
								title: res.message,
								icon: 'none',
								duration: 1000,
							})
						}
					})
				}
			}
		})
	},
    toDetail(e){
		console.log(e.currentTarget.dataset);
        wx.navigateTo({
            url: `/page/personal/pages/order-detail/order-detail?id=` + e.currentTarget.dataset.id
        })
    },
	// 下拉刷新
	onPullDownRefresh: function () {
		console.log("刷新");
		wx.showLoading({
			title: "刷新中",
			mask: true,

		});
		this.getOrderDetail();
		wx.hideLoading();
		console.log("关闭");

	}
})