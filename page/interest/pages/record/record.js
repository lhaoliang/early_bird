// pages/record/record.js
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        limit: 10,
        offset: 0,
        isMore: true,
        isLoading: false,
        recordList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            offset: 0,
            limit: 10,
            isLoading: false
        })
        this.getRecordList()
    },
    getRecordList() {
        if (!this.data.isMore) {
            return;
        }
        let params = {
            limit: this.data.limit,
            offset: this.data.offset
        };
        wx.showLoading({
            title: '加载中',
        });
        util.requester.get("/frontapi/store/equity/exchange/record/list", params, res => {
            console.log(res)
            this.data.isLoading = false;
            wx.hideLoading();
            this.setData({
                recordList: this.data.recordList.concat(res.datas.rows),
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
            wx.stopPullDownRefresh(); //停止当前页面下拉刷新
        })
    },
    toDetail(e){
        if(e.currentTarget.dataset.type !=4){
            return
        }
        wx.navigateTo({
            url: '/page/interest/pages/exchange-detail/exchange-detail?id=' + e.currentTarget.dataset.id ,
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
        wx.showLoading({
            title: "刷新中",
            mask: true,
        });
        this.setData({
            recordList:[],
            offset: 0,
            isMore: true,
            isLoading: false,
        });
        this.getRecordList();
        wx.hideLoading();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getRecordList()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})