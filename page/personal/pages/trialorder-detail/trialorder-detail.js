// pages/order-detail/order-detail.js
const util = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    orderDetail: {},
    orderPath: {},
    time: '',
    imgSrc: util.config.source,
    showRefundModal: false,
    chooseRefundReason: null,
    btnMsg: '提醒发货',
    timeId: null,
    flag: false,
    feedbackTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: Number(options.id)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getOrderDetail();
    this.getOrderPath();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.data.timeId);
  },

  // 获取订单详情
  getOrderDetail() {
    wx.showLoading({
      title: '加载中',
    })
    util.requester.get("/frontapi/store/trial/order/detail", {
      orderId: this.data.id
    }, res => {
      this.setData({
        orderDetail: res.datas,
        feedbackTime: res.datas.feedbackEndTime
      });
      this.setTimeInterval()
      wx.hideLoading();
      wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
      if (res.datas.status == 1) {
        this.setBackTime();
      }
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
  // // // 设置定时器
  setTimeInterval() {
    let optTime = this.data.feedbackTime
    optTime = new Date(optTime)
    this.data.timer = setInterval(() => {
      let finallyTime = this.getEndTime(optTime)
      this.setData({
        feedbackTime: finallyTime
      })

    }, 990)
  },
  toLogistics() {
    wx.navigateTo({
      url: '/page/personal/pages/logistics/logistics?id=' + this.data.orderDetail.id + '&type=trial',
    })
  },
  toReport(e) {
    if (!e.currentTarget.dataset.feed) {
      wx.showToast({
        title: '暂无检测报告',
        icon: 'none',
      });
      return;
    }
    wx.navigateTo({
      url: '/page/personal/pages/report/report?id=' + e.currentTarget.dataset.id,
    })
  },
  // 设置倒计时
  setBackTime() {
    let getTime = () => {
      let now = (new Date()).getTime();
      let endTime = (new Date(this.data.orderDetail.expiredTime)).getTime();
      let time = Math.round((endTime - now) / 1000);
      let hour = Math.floor(time / 60 / 60);
      time = time % (60 * 60);
      let min = Math.floor(time / 60);
      let second = time % 60;
      this.setData({
        time: `${hour}:${min}:${second}`
      })
      if (hour < 0) {
        this.getOrderDetail()
        this.setData({
          time: 0
        })
        clearInterval(this.data.timeId)

      }
    }

    this.data.timeId = setInterval(() => {
      getTime();
    }, 1000)


  },
  closeRefund() {
    this.setData({
      showRefundModal: false
    })
  },
  toFeedback(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/page/personal/pages/feedback/feedback?id=${item.id}&goodsId=${item.goodsId}&item=${JSON.stringify(item)}`
    })
  },
  // 获取物流轨迹
  getOrderPath() {
    wx.showLoading({
      title: '加载中',
    })
    util.requester.get("/frontapi/store/trial/order/path/get", {
      orderId: this.data.id
    }, res => {
      this.setData({
        orderPath: res.datas,
      });
      wx.hideLoading();
      wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
      if (res.datas.status == 1) {
        this.setBackTime();
      }
    })
  },
  // 保存选择的申请原因
  setChoose(e) {
    this.setData({
      chooseRefundReason: e.currentTarget.dataset.item
    });
  },
  confirmRefund() {
    if (!this.data.chooseRefundReason) {
      wx.showToast({
        title: '请选择退款原因',
        icon: 'none',
        duration: 1200
      });
      return;
    }
    util.requester.post('/frontapi/store/order/refund/request', {
      orderId: this.data.orderDetail.id,
      refundReasonId: this.data.chooseRefundReason.id,
      remark: '未发货申请退款'
    }, res => {
      wx.showToast({
        title: '已申请退款',
        duration: 1200
      });
      this.getOrderDetail();
      this.setData({
        showRefundModal: false
      })
      wx.navigateTo({
        url: `/page/personal/pages/my-refund/my-refund`,
      })
    })
  },
  deleteOrder(e) {

    wx.showModal({
      title: '提示',
      content: '你确定要设为默认地址吗？',
      success: res => {
        if (res.confirm) {
          util.requester.delete('/frontapi/store/order/delete', {
            orderId: e.currentTarget.dataset.id
          }, res => {
            if (res.result) {
              wx.showToast({
                title: '删除成功',
              })
              wx.navigateTo({
                url: '/page/personal/pages/my-orders/my-orders'
              })
            }
          })
        }
      }
    })

  },
  clickComment() {
    wx.navigateTo({
      url: `/page/personal/pages/submit-assess/submit-assess?id=${this.data.orderDetail.id}&goodsInfo=${JSON.stringify(this.data.orderDetail.goods[0])}`,
    })
  },
  // 支付
  clickPay(e) {
    util.requester.post('/frontapi/store/order/repay', {
      orderId: this.data.orderDetail.id
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
            setTimeout(() => {
              wx.redirectTo({
                url: '/page/common/pages/pay-success/pay-success?id=' + res.datas.orderId + '&type=1',
              })
            }, 1200)
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
  },
  clickRemind() {
    util.requester.post('/frontapi/store/trial/order/shipping/reminder', {
      orderId: this.data.orderDetail.id
    }, res => {
      wx.showToast({
        title: '已提醒发货，请耐心等待哦亲',
        duration: 1200,
        icon: 'none'
      })
      setTimeout(() => {
        this.onShow()
      }, 1200)
    })
  },
  toRefundDetail(e) {
    wx.navigateTo({
      url: '/page/personal/pages/refund-detail/refund-detail?id=' + e.currentTarget.dataset.id,
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
    console.log(e);
    wx.navigateTo({
      url: '/page/personal/pages/logistics/logistics'
    })
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    console.log("刷新");
    wx.showLoading({
      title: "刷新中",
      mask: true,

    });
    this.getOrderDetail();
    console.log("关闭");
    wx.hideLoading();

  }
})