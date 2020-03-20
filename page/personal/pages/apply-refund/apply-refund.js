// pages/apply-refund/apply-refund.js
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showDialog: false,
        detail: {},
        remark: '',
        choose: {},
        flag:true,
        refundId:''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderId: options.id
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getDetail();
    },
    show() {
        this.setData({
            showDialog: true,
            flag:false
        })
    },
  se() {
        this.setData({
            showDialog: false,
            flag: true
        })
    },

    // 获取订单详情
    getDetail() {
        util.requester.get('/frontapi/store/order/refund/preview', {
            orderId: this.data.orderId
        }, res => {
            this.setData({
                detail: res.datas,
                refundId:res.datas.order.refundId
            });
        })
    },
    // 将remark双向绑定
    setRemark(e) {
        this.setData({
            remark: e.detail.value
        });
    },
    // 提交申请
    subReturn() {
        if (!this.data.remark || !this.data.orderId || !this.data.choose.id) {
            wx.showToast({
                title: '请完善填写信息',
                duration: 1200,
                icon: 'none'
            });
            return;
        }
        util.requester.post('/frontapi/store/order/refund/request', {
            orderId: this.data.orderId,
            refundReasonId: this.data.choose.id,
            remark: this.data.remark
        }, res => {
            if(res.result){
                wx.showToast({
                    title: '已提交申请',
                    duration: 1200
                });
                setTimeout(() => {
                    wx.navigateTo({
                        url: '/page/personal/pages/refund-detail/refund-detail?id=' +  res.datas
                    })
                }, 1200);
            }
        })
    },
    // 保存选择的申请原因
    setChoose(e) {
        this.setData({
            choose: e.currentTarget.dataset.item
        });
        this.se();
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
        }, 1000)
    }
})