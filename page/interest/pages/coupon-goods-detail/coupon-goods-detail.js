// pages/coupon-goods-detail/coupon-goods-detail.js
const util = require('../../../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    
    data: {
        value:2,
        id:'',
        info:{},
        phone:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            id:options.id,
            value: Number(options.type) 
        })

        if(this.data.value == 2){
            wx.setNavigationBarColor({
                frontColor: '#000000',
                backgroundColor: '#FFEAC9',
            });
        }
        if (this.data.value == 3) {
            wx.setNavigationBarColor({
                frontColor: '#000000',
                backgroundColor: '#EEF1FA',
            });
        }
        if (this.data.value == 1) {
            wx.setNavigationBarColor({
                frontColor: '#000000',
                backgroundColor: '#FFE9DB',
            });
        }
    },
    // getUserInfo() {
    //     util.requester.get("/frontapi/store/user/info", {}, res => {
    //         if (res.datas.phone) {
    //             this.setData({
    //                 phone: true
    //             })
    //         } else {
    //             this.setData({
    //                 phone: false
    //             })
    //         }
    //     })
    // },
    getDetail(){
        util.requester.get("/frontapi/store/equity/exchange/prize/detail",{
            id:this.data.id
        }, res => {
            this.setData({
                info:res.datas
            })
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getDetail()
        // this.getUserInfo()
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
    // getFormId(e) {
    //     setTimeout(() => {
    //         console.log(e.detail.formId);
    //         if (e.detail.formId != "the formId is a mock one") {
    //             util.requester.post("/frontapi/store/collect/user/formid", {
    //                 formId: e.detail.formId
    //             })
    //         }
    //     }, 5000)
    // },
})