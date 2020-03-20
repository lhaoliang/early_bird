// pages/report/report.js
const util = require("../../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:'',
        comment:'',
        time:'',
        status:'',
        imgSrc: util.config.source,
        imgList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id:options.id
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
    },

    getDetail(){
        util.requester.get('/frontapi/store/trial/order/feedback', {
            orderId:this.data.id
        }, res => {
            this.setData({
                comment:res.datas.comment,
                time: res.datas.createdAt,
                status:res.datas.status,
                imgList: res.datas.images.split(',')
            })
            console.log(this.data.imgList)
        })
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

    }
})