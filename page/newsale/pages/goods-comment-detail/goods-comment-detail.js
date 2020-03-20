// pages/goods-comment-detail/goods-comment-detail.js
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail: {},
        id:'',
        list: [],
        offset: 0,
        limit: 10,
        total: 0,
        comment: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //  console.log(options);
        this.setData({
            id: options.id
        })
        this.loadDatas();
        // console.log(this.data.detail);
        // wx.removeStorageSync('comment')
    },
    loadDatas(reset = true) {
        if (reset) {
            this.setData({
                offset: 0
            })
        };
        wx.showLoading({
            title: '加载中',
        })
        util.requester.get('/frontapi/store/goods/evaluation/detail', {
            id: this.data.id
        }, res => {
            wx.hideLoading();
            this.setData({
                detail:res.datas
            })
            util.requester.get('/frontapi/store/goods/evaluations/follows', {
                offset: this.data.offset,
                limit: this.data.limit,
                evaluationId: this.data.id
            }, res => {
                wx.hideLoading();
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
    
                wx.stopPullDownRefresh();//停止当前页面下拉刷新。
            })
        })
        
    },
    commentInput(e) {
        this.setData({
            comment: e.detail.value
        })
    },
    // 提交评价（跟评）
    addComment() {
        if (this.data.comment == '') {
            wx.showToast({
                title: '请填写评价内容',
                icon: 'none'
            })
            return
        }
        util.requester.post('/frontapi/store/goods/evaluation/follow/add', {
            comment: this.data.comment,
            parentId: this.data.detail.id,
            followId: this.data.detail.id
        }, res => {
            wx.showToast({
                title: '已评价',
                duration: 1200
            });
            this.setData({
                comment: ''
            })
            this.loadDatas();
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
        wx.hideLoading();
        console.log("关闭");

    }
})