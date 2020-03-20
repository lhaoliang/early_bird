// pages/goods-comment/goods-comment.js
const util = require('../../../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        offset: 0,
        limit: 10,
        list: [],
        goodsId: 0,
        okRate: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            goodsId: options.goodsId
        })
    },
    onShow() {
        this.getComments();
    },
    getComments(reset = true, success = function () { }) {
        if (reset) {
            this.setData({
                offset: 0
            })
        };
        wx.showLoading({
            title: '加载中',
        })
        util.requester.get('/frontapi/store/goods/evaluations', {
            offset: this.data.offset,
            limit: this.data.limit,
            goodsId: this.data.goodsId
        }, res => {
            
            if (reset) {
                this.setData({
                    list: []
                })
            }
            res.datas.rows.forEach(v => {
                v.createdAt = v.createdAt.substr(0, 10);
                v.goodsSpec = JSON.parse(v.goodsSpec || '[]');

            })
            this.setData({
                list: this.data.list.concat(res.datas.rows),
                total: res.datas.total,
                okRate: res.datas.okRate,
                offset: this.data.offset + this.data.limit
            })
            wx.hideLoading();
            wx.stopPullDownRefresh();//停止当前页面下拉刷新。
            success();
        })
    },
    toCommentDetail(e) {
        // try {
        //     wx.setStorageSync(
        //         'comment',
        //         `${JSON.stringify(e.currentTarget.dataset.item)}`,
        //     )
        // } catch (e) {
        //     console.log(e);
        // }
        wx.navigateTo({
            url: `/page/newsale/pages/goods-comment-detail/goods-comment-detail?id=${e.currentTarget.dataset.item.id}` ,
        })
    },
    // goCom(e){
    //   console.log(e)
    //   wx.navigateTo({
    //     url: `/pages/submit-assess/submit-assess?goodsid=${e.currentTarget.dataset.goodsid}`,
    //   })
    // },
    onReachBottom() {
        if (this.data.total > this.data.offset) {
            this.getComments(false);
        }
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        console.log("刷新");
        wx.showLoading({
            title: "刷新中",
            mask: true,

        });
        this.getComments();
        wx.hideLoading();
        console.log("关闭");

    }
})