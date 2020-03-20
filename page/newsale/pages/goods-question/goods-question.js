// pages/goods-question/goods-question.js
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        offset: 0,
        limit: 10,
        total: 0,
        goodsId: 0,
        question: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            goodsId: options.goodsId
        })
        this.loadDatas();
    },
    loadDatas(reset = true) {
        if (reset) {
            this.setData({
                offset: 0
            })
        }
        util.requester.get('/frontapi/store/goods/purchase/question', {
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
            })
            this.setData({
                list: this.data.list.concat(res.datas.rows),
                total: res.datas.total,
                offset: this.data.offset + this.data.limit
            });
            wx.hideLoading();
            wx.stopPullDownRefresh();//停止当前页面下拉刷新。
        })
    },
    questionInput(e) {
        this.setData({
            question: e.detail.value
        });
    },
    addQuestion() {
        if (this.data.question==""){
            wx.showToast({
                title: '请填写提问内容',
                icon: 'none'
            })
            return
        }
        util.requester.post('/frontapi/store/goods/purchase/question/add', {
            question: this.data.question,
            goodsId: this.data.goodsId
        }, res => {
            wx.showToast({
                title: '提问成功',
                duration: 1200
            });
            this.setData({
                question:''
            })
            this.loadDatas();
        });
    },
    toQuestionDetail(e) {
        wx.navigateTo({
            url: '/page/newsale/pages/goods-question-detail/goods-question-detail?id=' + e.currentTarget.dataset.item.id,
        })
    },
    onReachBottom() {
        if (this.data.total > this.data.offset) {
            this.loadDatas(false);
        }
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        console.log("刷新");
        wx.showLoading({
            title: "刷新中",
            mask: true,

        });
        this.loadDatas();
        console.log("关闭");

    }
})