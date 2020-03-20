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
    wx.navigateTo({
      url: `/page/personal/pages/trialorder-detail/trialorder-detail?id=${e.currentTarget.dataset.item.id}`
    })
  },
  toFeedback(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/page/personal/pages/feedback/feedback?id=${item.id}&goodsId=${item.goodsId}&item=${JSON.stringify(item)}`
    })
  },
  clickRemind(e) {
    let item = e.currentTarget.dataset.item;
    util.requester.post('/frontapi/store/trial/order/shipping/reminder', {
      orderId: item.id
    }, res => {
      if (res.result) {
        wx.showToast({
          title: '已成功提醒发货，请耐心等待哦亲',
          duration: 1200,
          icon: 'none'
        })
      }
      setTimeout(() => {
        this.onShow()
      }, 1200)
    })
  },
  toLogistics(e) {
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/page/personal/pages/logistics/logistics?id=' + id + '&type=trial',
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
    util.requester.get("/frontapi/store/trial/order/list", params, res => {
      console.log(res)
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

  },
  toHome() {
    wx.switchTab({
      url: '/page/tabBar/home/index'
    })
  },
})