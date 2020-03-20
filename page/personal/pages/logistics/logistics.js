// pages/order-detail/order-detail.js
const util = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    imgSrc: util.config.source,
    orderPath: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: Number(options.id),
      type: options.type ? options.type : 'news'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getOrderPath();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  // 获取物流轨迹
  getOrderPath() {
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.type == 'news') {
      util.requester.get("/frontapi/store/order/path/get", {
        orderId: this.data.id
      }, res => {
        this.setData({
          orderPath: res.datas,
        });
        wx.hideLoading();
      })
    } else if (this.data.type == 'trial') {
      util.requester.get("/frontapi/store/trial/order/path/get", {
        orderId: this.data.id
      }, res => {
        this.setData({
          orderPath: res.datas,
        });
        wx.hideLoading();
      })
    }else if (this.data.type == 'vip') {
        util.requester.get("/frontapi/store/equity/order/path/get", {
            orderId: this.data.id
        }, res => {
            this.setData({
                orderPath: res.datas,
            });
            wx.hideLoading();
        })
    }

  },



})