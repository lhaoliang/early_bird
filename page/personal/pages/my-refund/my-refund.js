// pages/my-refund/my-refund.js
const util = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [1],
    status: 6,
    list: [{}],
    total: 0,
    limit: 10,
    offset: 0,
    imgSrc: util.config.source,
  },
  cancel(e) {
    wx.showModal({
      title: '提示',
      content: '你确定要取消退款吗？',
      success(res) {
        if (res.confirm) {
          util.requester.put("/frontapi/store/order/refund/cancel", {
            refundRequestId: e.currentTarget.dataset.id
          }, res => {
            if (res.result) {
              wx.showToast({
                title: '你已成功取消退款',
                duration: 1000
              })
              wx.navigateTo({
                url: `/page/personal/pages/refund-detail/refund-detail?id=${e.currentTarget.dataset.id}`
              })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      offset: 0,
      list: []
    })
    this.getOrderList();
  },
  // 上拉刷新
  onReachBottom() {
    this.getOrderList();
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

  },
  toOrderDetail(e) {
    wx.navigateTo({
      url: '/page/personal/pages/order-detail/order-detail?id=' + e.currentTarget.dataset.item.orderGoods[0].orderId + '&type=2'
    })
  },
  toHome() {
    wx.switchTab({
      url: '/page/tabBar/home/index'
    })
  },
  // 获取订单列表
  getOrderList() {
    let params = {
      limit: this.data.limit,
      offset: this.data.offset
    }
    params.status = this.data.status;
    util.requester.get("/frontapi/store/order/list", params, res => {
      this.setData({
        list: this.data.list.concat(res.datas.rows),
        total: res.datas.total,
        offset: this.data.offset + this.data.limit
      })
      wx.hideLoading();
      wx.stopPullDownRefresh()
    })
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    console.log("刷新");
    wx.showLoading({
      title: "刷新中",
      mask: true,
    });
    this.getOrderList();
    console.log("关闭");
  },
  /**
   * 获取formId
   */
  // getFormId(e) {
  //   setTimeout(() => {
  //     console.log(e.detail.formId);
  //     if (e.detail.formId != "the formId is a mock one") {
  //       util.requester.post("/frontapi/store/collect/user/formid", {
  //         formId: e.detail.formId
  //       })
  //     }
  //   }, 5000)
  // },
})