// pages/goods-detail/goods-detail.js
const util = require('../../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 1,
    code: '',
    showSpecModal: false,
    showShareModal: false,
    showChooseShareModal: false,
    beMember: true,
    detail: {},
    saleMoney: 0,
    goodsDetail: {},
    goodsComment: [],
    goodsQuestion: [],
    id: 0,
    goodsId: 0,
    imgSrc: util.config.source,
    timer: 0,
    timer1: 0,
    specId: 0,
    specNames: '',
    loadMore: false,
    payList: [{
      avatar: '/imgs/avatar.png',
      nickname: '房东的🐱'
    }, {
      avatar: '/imgs/avatar.png',
      nickname: '房东的🐖'
    }, {
      avatar: '/imgs/avatar.png',
      nickname: '房东的🐶'
    }, {
      avatar: '/imgs/avatar.png',
      nickname: '房东的🐮'
    }, {
      avatar: '/imgs/avatar.png',
      nickname: '房东的🦆'
    }],
    currentPayListIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      goodsId: options.goodsId
    })
    this.setPayListSwiper();
    this.getDetail();
    this.getGoodsDetail();
  },
  onShow() {
    this.getGoodsComment();
    this.getGoodsQuestion();
  },
  onUnload() {
    clearInterval(this.data.timer);
    clearInterval(this.data.timer1);
  },
  getCode() {
    let url = '/page/newsale/pages/goods-detail/goods-detail?goodsId=' + this.data.goodsId + '%26' + 'id=' + this.data.id
    util.requester.get('/frontapi/store/goods/share', {
      path: url,
      type: 2,
      id: this.data.id

    }, res => {
      console.log(res)
      this.setData({
        code: res.datas
      });
    })
  },
  getDetail() {
    util.requester.get('/frontapi/store/activity/newsale/detail', {
      id: this.data.id
    }, res => {
      if (!res.datas.activity.qrCode) {
        this.getCode()
      }
      // 计算结束倒计时
      let v = res.datas.activity;
      let getEndTime = () => {
        let diffTime = Math.round((new Date(v.endTime) - new Date()) / 1000);
        let days = Math.floor(diffTime / 60 / 60 / 24);
        diffTime = diffTime % (60 * 60 * 24);
        let hours = Math.floor(diffTime / 60 / 60);
        diffTime = diffTime % (60 * 60);
        let mins = Math.floor(diffTime / 60);
        let seconds = diffTime % 60;

        if (days > 0) {
          v.endTimeFormat = ` ${days}天 ${hours.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
        } else {
          v.endTimeFormat = `${hours.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
        }


        this.setData({
          detail: res.datas.activity,
          code: res.datas.activity.qrCode
        })

      }
      getEndTime();
      this.data.timer = setInterval(() => {
        getEndTime();
      }, 1000)

    })

  },
  getGoodsDetail() {
    wx.showLoading({
      title: '加载中',
    })
    util.requester.get('/frontapi/store/goods/detail', {
      goodsId: this.data.goodsId,
      activityId: this.data.id
    }, res => {
      res.datas.goods.sliderImage = res.datas.goods.sliderImage.split(',');
      if (!this.data.loadMore) {
        res.datas.goods.description = ''
      } else {
        res.datas.goods.description = res.datas.goods.description.replace(/\<img/gi, '<img style="max-width:100%;margin-bottom:-7px;height:auto" ')
      }


      this.setData({
        goodsDetail: res.datas,
      });
      wx.hideLoading();
      wx.stopPullDownRefresh(); //停止当前页面下拉刷新。

    })
  },

  // 获取一条评论
  getGoodsComment() {
    util.requester.get('/frontapi/store/goods/evaluations', {
      offset: 0,
      limit: 1,
      goodsId: this.data.goodsId
    }, res => {
      res.datas.rows.forEach(v => {
        v.createdAt = v.createdAt.substr(0, 10);
      })
      this.setData({
        goodsComment: res.datas
      })
    })
  },
  // 获取两条提问
  getGoodsQuestion() {
    util.requester.get('/frontapi/store/goods/purchase/question', {
      offset: 0,
      limit: 2,
      goodsId: this.data.goodsId
    }, res => {
      this.setData({
        goodsQuestion: res.datas
      })
    })
  },
  //去问题详情页
  toQuestionDetail(e) {
    wx.navigateTo({
      url: '/page/newsale/pages/goods-question-detail/goods-question-detail?id=' + e.currentTarget.dataset.item.id,
    })
  },
  // 已支付轮播效果
  setPayListSwiper() {
    this.data.timer1 = setInterval(() => {
      this.setData({
        currentPayListIndex: (this.data.currentPayListIndex + 1) % this.data.payList.length
      })
    }, 1000)
  },
  chooseTab(e) {
    this.setData({
      tab: e.currentTarget.dataset.tab
    })
  },
  closeSpecModal() {
    this.setData({
      showSpecModal: false
    })
  },
  // 组件提交选中规格事件
  chooseSpec(e) {
    let spacNames = e.detail.specNames.replace(/ /g, '·');
    this.setData({
      specId: e.detail.specId,
      specNames: spacNames.slice(0, spacNames.length - 1)
    })
  },
  closeShareModal() {
    this.setData({
      showShareModal: false
    })
  },
  showBeMember() {
    this.setData({
      beMember: true
    })
  },
  openSpecModal() {
    this.setData({
      showSpecModal: true
    })
  },
  clickBuy(e) {
    if (!this.data.specId) {
      wx.showToast({
        title: '请先选择规格！',
        icon: 'none',
        duration: 1200
      });
      return;
    }
    util.requester.get('/frontapi/store/order/preview', {
      activityId: this.data.id,
      goodsInfo: JSON.stringify([e.detail.goodsInfo])
    }, res => {
      if (res.result) {
        wx.navigateTo({
          url: `/page/newsale/pages/confirm-order/confirm-order?activityId=${this.data.id}&goodsInfo=${JSON.stringify([e.detail.goodsInfo])}`,
        });
      } else {
        wx.showToast({
          title: res.message,
          duration: 1200,
          icon: "none"
        })
      }

    })

    this.setData({
      showSpecModal: false
    })
  },
  toComment() {
    wx.navigateTo({
      url: '/page/newsale/pages/goods-comment/goods-comment?goodsId=' + this.data.goodsId,
    })
  },
  toCommentDetail(e) {
    // console.log(e.currentTarget.dataset.item);
    // try {
    //     wx.setStorageSync(
    //         'comment',
    //         `${JSON.stringify(e.currentTarget.dataset.item)}`,
    //     )
    // } catch (e) {
    //     console.log(e);
    // }
    wx.navigateTo({
      url: '/page/newsale/pages/goods-comment-detail/goods-comment-detail?id=' + e.currentTarget.dataset.item.id
    })
  },
  stop() {

  },
  toQuestion() {
    wx.navigateTo({
      url: '/page/newsale/pages/goods-question/goods-question?goodsId=' + this.data.goodsId,
    })
  },
  // 点击分享
  clickShare() {
    this.setData({
      showChooseShareModal: true
    })
  },
  closeChooseShare() {
    this.setData({
      showChooseShareModal: false
    })
  },
  createShareImage() {
    this.setData({
      showShareModal: true,
      showChooseShareModal: false
    })
  },
  onShareAppMessage() {
    return {
      title: this.data.detail.title,
        imageUrl: this.data.imgSrc + this.data.goodsDetail.goods.sliderImage[0],
      path: `/page/newsale/pages/goods-detail/goods-detail?id=${this.data.detail.id}&goodsId=${this.data.detail.goodsId}`
    }
  },
  onReachBottom() {
    if (!this.data.loadMore) {
      this.getGoodsDetail()
      this.setData({
        loadMore: true
      })

    }
  },
  /**
   * 获取formId
   */
  getFormId(e) {
    console.log(e.detail.formId);
    if (e.detail.formId != "the formId is a mock one") {
      util.requester.post("/frontapi/store/collect/user/formid", {
        formId: e.detail.formId
      })
    }
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    console.log("刷新");
    wx.showLoading({
      title: "刷新中",
      mask: true,

    });
    this.setPayListSwiper();
    this.getDetail();
    this.getGoodsDetail();
    console.log("关闭");
    wx.hideLoading();
  },
  myCatchTouch: function() {
    return;
  },
})