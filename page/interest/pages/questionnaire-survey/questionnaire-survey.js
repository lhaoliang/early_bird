// pages/questionnaire-survey/questionnaire-survey.js
const util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // list: [{
    //     id: 1,
    //     type: 1,
    //     title: '您的年龄是?',
    //     atanswer: -1,
    //     answer: ['18岁以下', '18岁以下', '25 - 30岁', '30 - 35岁', '35 - 50岁', '50岁以上'],
    // }, {
    //     id: 2,
    //     type: 2,
    //     title: '您的年龄是?',
    //     atanswer: [],
    //     answer: ['18岁以下', '18岁以下', '25 - 30岁', '30 - 35岁', '35 - 50岁', '50岁以上'],
    // }, {
    //     id: 3,
    //     type: 2,
    //     title: '您的年龄是?',
    //     atanswer: [],
    //     answer: ['18岁以下', '18岁以下', '25 - 30岁', '30 - 35岁', '35 - 50岁', '50岁以上'],
    // }],
    list: [],
    subBox: false,
    answerlist: {
      id: '',
      questionId: []
    }

  },
  // 获取题目
  getlist() {
    wx.showLoading({
      title: '加载中',
    })
    util.requester.get('/frontapi/store/equity/questionnaire/list', {}, res => {
      this.setData({
        list: res.datas
      })
      for (let i = 0; i < this.data.list.length; i++) {
        if (this.data.list[i].type == 2) {
          console.log(this.data.list[i].type)
          this.data.list[i].atanswer = []
        } else {
          this.data.list[i].atanswer = ""

        }

      }
      console.log(this.data.list);
      wx.hideLoading();

    })



  },
  // 单选选择
  clickanswer(e) {
    let questions = this.data.list;
    questions[e.currentTarget.dataset.index].atanswer = e.currentTarget.dataset.key;
    this.setData({
      list: questions
    })
    // console.log(this.data.list)
  },
  // 多选选择
  chooseMoreAnswer(e) {
    // console.log(this.data.list)
    // console.log(e.currentTarget.dataset.key)
    let questions = this.data.list;
    let state = true
    for (let i = 0; i < questions[e.currentTarget.dataset.index].atanswer.length; i++) {
      if (questions[e.currentTarget.dataset.index].atanswer[i] == e.currentTarget.dataset.key) {
        questions[e.currentTarget.dataset.index].atanswer.splice(i, 1);
        state = false;
      }
    }
    if (state) {
      questions[e.currentTarget.dataset.index].atanswer.push(e.currentTarget.dataset.key)
      // console.log(questions[e.currentTarget.dataset.index].atanswer);
    }
    this.setData({
      list: questions
    })
  },
  // 提交按钮
  sbumitbtn() {
    let answer = [];

    console.log(this.data.list);
    for (let i = 0; i < this.data.list.length; i++) {
      let answerlist = {
        questionId: '',
        optionId: []
      }
      if (this.data.list[i].type == 1) {
        answerlist.optionId.push(this.data.list[i].atanswer);
        answerlist.questionId = this.data.list[i].id;
        if (answerlist.optionId == "" || answerlist.optionId == []) {
          break
        } else {
          answer.push(answerlist);
        }

      } else if (this.data.list[i].type == 2) {
        answerlist.optionId = this.data.list[i].atanswer;
        answerlist.questionId = this.data.list[i].id;
        if (answerlist.optionId == "" || answerlist.optionId == []) {
          break
        } else {
          answer.push(answerlist);
        }
      }
    }
    // 检查是否答完题
    if (answer.length == this.data.list.length) {
      console.log(answer)
      let jsonInfo = JSON.stringify(answer);
      console.log(jsonInfo)
      wx.showLoading({
        title: '提交中...',
      })
      util.requester.post('/frontapi/store/equity/questionnaire/add', {
        jsonInfo
      }, res => {
        this.setData({
          subBox: true
        })
        wx.hideLoading();
      })
    } else if (answer.length < this.data.list.length) {
      wx.showToast({
        icon: 'none',
        title: "请完成答题哦！",
        duration: 1500
      })
    }

  },
  // 完成提交
  accomplish() {
    wx.navigateBack();

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlist();


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