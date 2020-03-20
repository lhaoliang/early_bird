// pages/goods-question-detail/goods-question-detail.js
const util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    list: [],
    offset: 0,
    limit: 10,
    total: 0,
    answer: '',
    questionId: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.options);
    this.setData({
      id: options.id
    })



  },
  onShow() {
    this.loadDatas();
  },
  answerInput(e) {
    this.setData({
      answer: e.detail.value
    })
  },
  loadDatas(reset = true) {
    if (reset) {
      this.setData({
        offset: 0
      })
    }
    util.requester.get('/frontapi/store/goods/purchase/question/detail', {
      id: this.data.id
    }, res => {
      wx.hideLoading();
      this.setData({
        detail: res.datas
      })
      util.requester.get('/frontapi/store/goods/purchase/answer', {
        offset: this.data.offset,
        limit: this.data.limit,
        questionId: this.data.id
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
        })
      })

    })

  },
  addAnswer() {
    if (this.data.answer == "") {
      wx.showToast({
        title: '请填写回复内容',
        icon: 'none'
      })
      return
    }
    util.requester.post('/frontapi/store/goods/purchase/answer/add', {
      questionId: String(this.data.detail.id),
      answer: this.data.answer
    }, res => {
      wx.showToast({
        title: '回复成功',
        duration: 1200
      });
      this.setData({
        answer: ''
      })
      this.loadDatas();
    })
  },
  // 点赞回答
  clickDianzan(e) {
    let index = e.currentTarget.dataset.index
    util.requester.post('/frontapi/store/goods/purchase/answer/like', {
      answerId: this.data.list[index].id
    }, res => {
      this.loadDatas();
    })
  },
  onReachBottom() {
    if (this.data.total > this.data.offset) {
      this.loadDatas(false);
    }
  }
})