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
     couponId: 0,
     couponType: '',
     couponFaceValue: 0,
     discount: 0,
     deliverFee: 0,
     flag: true,
     goodsMoney1: 0,
     goodsMoney2: 0,
     chooseType: 0,
     choosedCouponId: 98,
     canUse:true
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
     this.setData({
       goodsInfo: options.goodsInfo,
       activityId: options.activityId
     })
     this.getDefaultAddress();
     this.getOrderPreview();

   },
   onShow() {

     // this.getDefaultAddress();
     this.getOrderPreview();

   },
   getDefaultAddress() {
     util.requester.get('/frontapi/store/address/default/get', {}, res => {
       this.setData({
         address: res.datas,
       })
     })
   },
   // 获取订单预览
   getOrderPreview() {
     wx.showLoading({
       title: '加载中',
     })
     util.requester.get('/frontapi/store/order/preview', {
       activityId: this.data.activityId,
       goodsInfo: this.data.goodsInfo
     }, res => {
       console.log(res)
       if (res.result) {
         this.setData({
           orderDetail: res.datas,
           deliverFee: parseInt(res.datas.order.deliverFee)
         });
         // 获取可用优惠券
         util.requester.get('/frontapi/store/goods/coupon/list', {
           goodsId: this.data.orderDetail.order.goods[0].goodsId,
           divisionId: 2,
           goodsPrice: this.data.orderDetail.order.goods[0].payPrice,
         }, res => {
           this.setData({
             couponList: res.datas.couponList,
             count: res.datas.count
           });
           if (res.datas.couponList[0].coupon.couponType == 3 && res.datas.count!=0) {
             this.setData({
               goodsMoney2: Math.round(this.data.orderDetail.order.goodsPrice * res.datas.couponList[0].coupon.discount / 100)
             })
           }
           if (this.data.count > 0) {
             this.setData({
               choosedCouponId: this.data.couponList[0].id,
               couponId: this.data.couponList[0].id
             })
           }
           wx.hideLoading();
           wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
         })
       } else {
         wx.navigateBack()
       }
       wx.hideLoading()
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
   clickPay() {
     if (this.data.address == null || this.data.address.id <= 0) {
       wx.showToast({
         title: '请添加收获地址',
         icon: 'none',
         duration: 1000
       })
       return;
     }
     wx.showLoading()
     this.setData({
         canUse:false
     })
     util.requester.post('/frontapi/store/order/create', {
       goodsInfo: this.data.orderDetail.goodsInfo,
       addressId: this.data.address.id,
       remark: this.data.remark,
       sign: this.data.orderDetail.sign,
       userCouponId: this.data.couponId,
       goodsPrice: this.data.orderDetail.order.goods[0].payPrice
     }, res => {
         wx.hideLoading()
         this.setData({
             canUse:true
         })
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
             util.requester.get("/frontapi/store/order/confirm", {
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
                 url: '/page/personal/pages/order-detail/order-detail?id=' + this.data.orderId + '&type=1',
             });
           }
         })
       }
     })
   },
   // 下拉刷新
   onPullDownRefresh: function() {
     console.log("刷新");
     wx.showLoading({
       title: "刷新中",
       mask: true,

     });
     this.getDefaultAddress();
     this.getOrderPreview();
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
   showCoupon(e) {
     if (this.data.count == 0) {
       wx.showToast({
         title: '暂无可用优惠券！',
         icon: 'none',
         duration: 1200
       });
       return;
     }
     console.log(e);

     if (e.detail.descriptions&&e.detail.choose) {
       this.setData({
         toCoupon: !this.data.toCoupon,
         couponsDescriptions: e.detail.descriptions,
         couponId: e.detail.couponId,
         couponFaceValue: e.detail.couponFaceValue,
         couponType: e.detail.couponType,
         discount: e.detail.discount,
         choosedCouponId: e.detail.couponId,
         chooseType: 1
       })
       if (this.data.couponType == 3) {
         this.setData({
           goodsMoney1: Math.round(this.data.orderDetail.order.goodsPrice * this.data.discount / 100)
         })

       }
     } else if (e.detail.descriptions && !e.detail.choose) {
       this.setData({
         toCoupon: !this.data.toCoupon,
         couponsDescriptions: '未选择优惠券',
         choosedCouponId: 0,
         couponId: e.detail.couponId,
         chooseType: 2
       })
     } else {
       this.setData({
         toCoupon: !this.data.toCoupon
       })
     }

     console.log(this.data.couponsDescriptions);
   },
   myCatchTouch: function () {
     return;
   },
 })