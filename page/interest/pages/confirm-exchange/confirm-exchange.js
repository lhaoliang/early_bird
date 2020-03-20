// pages/confirm-order/confirm-order.js
const util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    remark: '',
    orderDetail: {},
    goodsInfo: '',
    imgSrc: util.config.source,
    orderId: '',
    toCoupon: false,
    couponsDescriptions: [],
    type: '',
    couponList: [],
    count: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
        goodsId:options.goodsId
    })
    this.getDefaultAddress();
      this.getDetail()
  },
  onShow() {

  },
  getDetail(){
      util.requester.get('/frontapi/store/equity/exchange/prize/detail', {
          id:this.data.goodsId
      }, res => {
          this.setData({
              orderDetail: res.datas,
          })
      })
  },
    change(){
        util.requester.post('/frontapi/store/equity/exchange/prize', {
            id:this.data.goodsId,
            prizeType: this.data.orderDetail.prizeType,
            addressId: this.data.address.id
        }, res => {
            if(res.result){
                wx.showToast({
                    title: '兑换成功',
                    duration: 1200
                })
                setTimeout(() => {
                    wx.redirectTo({
                        url: '/page/interest/pages/exchange-success/exchange-success?id=' + res.datas
                    })
                }, 1200)
            }
        })
    },
  getDefaultAddress() {
    util.requester.get('/frontapi/store/address/default/get', {}, res => {
      this.setData({
        address: res.datas,
      })
    })
  },
  toAddress() {
    wx.navigateTo({
      url: '/page/personal/pages/my-address/my-address?mode=1',
    })
  },
  remarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },
    toDetail(){
        wx.navigateTo({
            url: '/page/interest/pages/exchange-detail/exchange-detail',
        })
    },
  clickPay() {
    if (this.data.address == null || this.data.address.id <= 0) {
      wx.showToast({
        title: '请添加收获地址',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    util.requester.post('/frontapi/store/equity/payment/deposit', {
      memberInfo: this.data.orderDetail.memberInfo,
      addressId: this.data.address.id,
      userCouponId: this.data.couponId,
      goodsPrice: this.data.orderDetail.order.goodsPrice,
      // remark: this.data.remark,
      sign: this.data.orderDetail.sign
    }, res => {
      if (res.result) {
        this.setData({
          orderId: res.datas.orderId
        });
        wx.requestPayment({
          timeStamp: res.datas.signArray.timeStamp,
          nonceStr: res.datas.signArray.nonceStr,
          package: res.datas.signArray.package,
          signType: res.datas.signArray.signType,
          paySign: res.datas.signArray.paySign,
          complete: result => {
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
                // wx.redirectTo({
                //     url: "/pages/order-detail/order-detail?id=" + res.datas.orderId
                // })
                wx.redirectTo({
                  url: '/page/common/pages/pay-success/pay-success?id=' + res.datas.orderId + '&type=1',
                })
              }, 1200)
            })
          },
          fail: (res) => {
            console.log(res);

            wx.showToast({
              title: '订单已保存,可在我的订单中支付此订单哦~',
              icon: 'none',
              duration: 1200
            });

            wx.navigateTo({
              url: '/page/personal/pages/order-detail/order-detail?id=' + this.data.orderId
            });
          }

        })
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    wx.showLoading({
      title: "刷新中",
      mask: true,

    });
    this.getDefaultAddress();
    this.getOrderPreview();

  },
  /**
   * 获取formId
   */
  getFormId(e) {
    setTimeout(() => {
      if (e.detail.formId != "the formId is a mock one") {
        util.requester.post("/frontapi/store/collect/user/formid", {
          formId: e.detail.formId
        })
      }
    }, 5000)
  },
})