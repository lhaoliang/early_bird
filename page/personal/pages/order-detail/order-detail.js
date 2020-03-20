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
    showRefundModal: false,
    chooseRefundReason: null,
    btnMsg: '提醒发货',
    timeId: null,
    flag: false,
    refundId: '',
    type: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: Number(options.id),
      type: options.type
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
    util.requester.get("/frontapi/store/order/detail", {
      orderId: this.data.id
    }, res => {
      this.setData({
        orderDetail: res.datas,
        refundId: res.datas.refundId
      });
      wx.hideLoading();
      wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
      if (res.datas.status == 1) {
        this.setBackTime();
      }
    })
  },
  // 获取物流轨迹
  getOrderPath() {
    wx.showLoading({
      title: '加载中',
    })
    util.requester.get("/frontapi/store/order/path/get", {
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
  toDetail(e) {
      if(this.data.orderDetail.activityId){
          wx.navigateTo({
              // url: `/pages/submit-assess/submit-assess?id=${this.data.orderDetail.id}&goodsInfo=${JSON.stringify(this.data.orderDetail.goods[0])}`,
              url: `/page/newsale/pages/goods-detail/goods-detail?id=${e.currentTarget.dataset.id}&goodsId=${e.currentTarget.dataset.idx}`
          })
      }else{
          wx.navigateTo({
              // url: `/pages/submit-assess/submit-assess?id=${this.data.orderDetail.id}&goodsInfo=${JSON.stringify(this.data.orderDetail.goods[0])}`,
              url: `/page/interest/pages/goodsvip-detail/goodsvip-detail?memberId=${e.currentTarget.dataset.id}&goodsId=${e.currentTarget.dataset.idx}`
          })
      }

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
  clickRefund() {
    // wx.navigateTo({
    //     url: '/pages/apply-refund/apply-refund?id=' + this.data.orderDetail.id,
    // })
    if (this.data.orderDetail.status == 2) {
      // 弹窗退款
      this.setData({
        showRefundModal: true
      })
      util.requester.get('/frontapi/store/order/refund/reason/select', {}, res => {
        this.setData({
          refundReasons: res.datas
        })
      })
    } else {
      // 跳转页面退款
      wx.navigateTo({
        url: '/page/personal/pages/apply-refund/apply-refund?id=' + this.data.orderDetail.id,
      })
    }
  },
  closeRefund() {
    this.setData({
      showRefundModal: false
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
        url: '/page/personal/pages/refund-detail/refund-detail?id=' + res.datas,
      })
    })
  },
  deleteOrder(e) {

    wx.showModal({
      title: '提示',
      content: '你确定要删除此订单吗？',
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
      if (this.data.orderDetail.activityId){
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
      }


      if (this.data.orderDetail.memberId) {
          util.requester.post('/frontapi/store/equity/payment/rePay', {
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
                      util.requester.get("/frontapi/store/equity/payment/confirm", {
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
      }




  },
  clickRemind() {
    util.requester.post('/frontapi/store/order/shipping/reminder', {
      orderId: this.data.orderDetail.id
    }, res => {
      wx.showToast({
        title: '已提醒发货，请耐心等待哦亲',
        duration: 1200,
        icon: 'none'
      })
      this.setData({
        btnMsg: '已提醒',
        flag: true
      })
      this.getOrderDetail()
    })
  },
  toRefundDetail(e) {
    wx.navigateTo({
      url: '/page/personal/pages/refund-detail/refund-detail?id=' + e.currentTarget.dataset.id,
    })
  },
  cancel(e) {
    wx.showModal({
      title: '提示',
      content: '你确定要取消退款吗？',
      success: res => {
        if (res.confirm) {
          util.requester.put("/frontapi/store/order/refund/cancel", {
            refundRequestId: e.currentTarget.dataset.id
          }, res => {
            if (res.result) {
              wx.showToast({
                title: '你已成功取消退款',
                duration: 1200
              });
              wx.navigateTo({
                url: '/page/personal/pages/refund-detail/refund-detail?id=' + e.currentTarget.dataset.id,
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
   * 获取formId
   */
  // getFormId(e) {
  //   console.log(e.detail.formId);
  //   if (e.detail.formId != "the formId is a mock one") {
  //     util.requester.post("/frontapi/store/collect/user/formid", {
  //       formId: e.detail.formId
  //     })
  //   }
  // },
  clickToLogistics(e) {
    console.log(e);
    wx.navigateTo({
      url: '/page/personal/pages/logistics/logistics?id=' + this.data.id
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

  },
  // 再次购买
  clickBuy: function() {
    wx.navigateTo({
      url: '/page/newsale/pages/goods-detail/goods-detail?id=' + this.data.orderDetail.activityId + '&goodsId=' + this.data.orderDetail.goods[0].goodsId,
    })
  }
})