// pages/trial-detail/trial-detail.js
const util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: util.config.source,
    id: '',
    goodsId: '',
    tab: 1,
    activityDetail: {},
    goodsDetail: {},
    avatars: [],
    specId: "",
    start: false,
    startTime: '',
    isMember: true,
    code:'',
    loadMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      goodsId: options.goodsId
    })
  },
  toRule() {
    wx.navigateTo({
      url: '/page/trial/pages/trial-rule/trial-rule',
    })
  },
  showBeMember() {
    this.setData({
      isMember: true
    })
  },
    getCode() {
        let url = '/page/trial/pages/trial-detail/trial-detail?goodsId=' + this.data.goodsId + '%26' + 'id=' + this.data.id
        util.requester.get('/frontapi/store/goods/share', {
            path: url,
            type: 3,
            id: this.data.id

        }, res => {
            console.log(res)
            this.setData({
                code: res.datas
            });

        })
    },
  getUserInfo() {
    util.requester.get("/frontapi/store/user/info", {}, res => {
      if (res.datas.isVip == 0) {
        this.setData({
          isMember: false
        })
      } else {
        this.setData({
          isMember: true
        })
      }
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
    console.log(e)
    wx.navigateTo({
      url: `/page/trial/pages/pay-deposit/pay-deposit?activityId=${this.data.id}&goodsSpecId=${e.detail.goodsInfo.goods_spec_id}&goodsId=${this.data.goodsId}&purchaseNum=${e.detail.goodsInfo.purchase_num}`,
    });
    this.setData({
      showSpecModal: false
    })
  },
  getTrialDetail() {
    util.requester.get('/frontapi/store/trial/detail', {
      id: this.data.id
    }, res => {
      this.setData({
        activityDetail: res.datas.activity,
        avatars: res.datas.user,
          code: res.datas.activity.qrCode
      });
        if (!res.datas.activity.qrCode){
          this.getCode()
      }
      if ((new Date(res.datas.activity.startTime) - new Date()) > 0) {
        this.setData({
          start: true
        })
        //对开始时间进行操作
        let time = new Date(res.datas.activity.startTime)
        var m = time.getMonth()+1
        var d = time.getDate()
        var h = time.getHours().toString().padStart(2, '0')
        var min = time.getMinutes().toString().padStart(2, '0')
        var s = time.getSeconds().toString().padStart(2, '0')
        time = m + '月' + d + "日 " + h + ":" + min
        // let pos = time.indexOf("/");
        // time = time.substring(pos + 1);
        // let pos2 = time.lastIndexOf(":");
        // time = time.substring(0, pos2);
        this.setData({
          startTime: time
        })
      }

      wx.hideLoading();
      wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
    })
  },
  getGoodDetail() {
    wx.showLoading({
      title: '加载中',
    })
    util.requester.get('/frontapi/store/trial/goods/detail/get', {
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
        goodsDetail: res.datas
      })
    })
    wx.hideLoading();
  },
  // 组件提交选中规格事件
  chooseSpec(e) {
    this.setData({
      specId: e.detail.specId,
      specNames: e.detail.specNames
    })
  },
  openSpecModal() {
    this.getUserInfo()
    if (!this.data.isMember) {
      // wx.showToast({
      //     title: '您还不是会员，无法申请试用',
      //     icon: 'none',
      //     duration: 1000
      // })
      // setTimeout(() => {
      //     wx.switchTab({
      //         url: '/pages/interest/interest',
      //     })
      // }, 1000)
      this.setData({
        isMember: true
      })
      return
    }
    if (this.data.activityDetail.isTrial) {
      wx.showToast({
        title: '已申请',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (this.data.start) {
      wx.showToast({
        title: '该活动未到时间',
        icon: 'none',
        duration: 1000
      })
      return
    } else {
      this.setData({
        showSpecModal: true
      })
    }
  },
  closeSpecModal() {
    this.setData({
      showSpecModal: false
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
  closeShareModal() {
    this.setData({
      showShareModal: false
    })
  },
    onReachBottom() {
        if (!this.data.loadMore) {
            this.getGoodDetail()
            this.setData({
                loadMore: true
            })

        }
    },
  // 点击分享
  clickShare() {
    this.setData({
      showChooseShareModal: true
    })
  },
  chooseTab(e) {
    this.setData({
      tab: e.currentTarget.dataset.tab
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getTrialDetail(),
      this.getGoodDetail()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showLoading({
      title: "刷新中",
      mask: true,
    });
    this.getTrialDetail()
    this.getGoodDetail()
    wx.hideLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.activityDetail.title,
        imageUrl: this.data.imgSrc + this.data.goodsDetail.goods.sliderImage[0],
      path: `page/trial/pages/trial-detail/trial-detail?id=${this.data.activityDetail.id}&goodsId=${this.data.activityDetail.goodsId}`
    }
  }
})