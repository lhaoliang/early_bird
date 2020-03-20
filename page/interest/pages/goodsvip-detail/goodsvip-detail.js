// pages/goods-detail/goods-detail.js
const util = require('../../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 1,
    showSpecModal: false,
    showShareModal: false,
    showChooseShareModal: false,
    detail: {},
    goodsDetail: {},
    memberId: 0,
    goodsId: 0,
    imgSrc: util.config.source,
    imgServe: util.config.server,
    specId: 0,
    specNames: '',
    isMember: true,
    goods: {},
    flag: true,
    source: '',
    code:'',
    loadMore: false,
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            memberId: options.memberId,
            goodsId: options.goodsId
        })
        this.getGoodsDetail();
    },
    onShow() {
    },
    onUnload() {
    },
    getCode() {
        let url = '/page/interest/pages/goodsvip-detail/goodsvip-detail?goodsId=' + this.data.goodsId + '%26' + 'memberId=' + this.data.memberId
        util.requester.get('/frontapi/store/goods/share', {
            path: url,
            type: 4,
            id: this.data.memberId

    }, res => {
      console.log(res)
      this.setData({
        code: res.datas
      });

        })
    },
    getGoodsDetail() {
        wx.showLoading({
            title: '加载中',
        })
        util.requester.get('/frontapi/store/equity/member/area/detail', {
            memberId: this.data.memberId,
            goodsId:this.data.goodsId
        }, res => {
            res.datas.goods.sliderImage = res.datas.goods.sliderImage.split(',');
            if (!res.datas.qrCode) {
                this.getCode()
            }
            if (!this.data.loadMore) {
                res.datas.goods.description = ''
            } else {
                res.datas.goods.description = res.datas.goods.description.replace(/\<img/gi, '<img style="max-width:100%;margin-bottom:-7px;height:auto" ')
            }
            this.setData({
                detail: res.datas,
                goodsDetail:res.datas.goods,
                code: res.datas.qrCode
            });

            wx.hideLoading();
            wx.stopPullDownRefresh();//停止当前页面下拉刷新。

    })
  },
  showBeMember() {
    this.setData({
      flag: false
    })
  },
  getUserInfo() {
    util.requester.get("/frontapi/store/user/info", {}, res => {
      if (res.datas.isVip == 0) {
        this.setData({
          isMember: false
        })
      }
      if (res.datas.isVip == 1) {
        this.setData({
          isMember: true
        })
      }
    })
  },
  onReachBottom() {
    if (!this.data.loadMore) {
      this.getGoodsDetail()
      this.setData({
        loadMore: true
      })

    }
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
  openSpecModal() {
    this.getUserInfo()
    if (!this.data.isMember) {

      wx.showToast({
        title: '您还不是会员！',
        icon: 'none',
        duration: 1200
      });
      return
    }
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
    // wx.navigateTo({
    //     url: `/page/interest/pages/confirm-viporder/confirm-viporder?memberId=${this.data.memberId}&goodsSpecId=${e.detail.goodsInfo.goods_spec_id}&goodsId=${this.data.goodsId}&purchaseNum=${e.detail.goodsInfo.purchase_num}`,
    // });
    util.requester.get('/frontapi/store/equity/payment/preview', {
      memberId: this.data.memberId,
      goodsSpecId: e.detail.goodsInfo.goods_spec_id,
      purchaseNum: e.detail.goodsInfo.purchase_num
      // goodsInfo: JSON.stringify([e.detail.goodsInfo])
    }, res => {
      if (res.result) {
        wx.navigateTo({
          url: `/page/interest/pages/confirm-viporder/confirm-viporder?memberId=${this.data.memberId}&goodsSpecId=${e.detail.goodsInfo.goods_spec_id}&goodsId=${this.data.goodsId}&purchaseNum=${e.detail.goodsInfo.purchase_num}`,
        });
      } else {
        wx.showToast({
          title: res.message,
          duration: 3000,
          icon: "none"
        })
      }

    })

    this.setData({
      showSpecModal: false
    })
  },
  stop() {

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
  onPullDownRefresh: function () {
    console.log("刷新");
    wx.showLoading({
      title: "刷新中",
      mask: true,

    });
    this.getGoodsDetail();
    console.log("关闭");
    wx.hideLoading();
  },
  onShareAppMessage() {
    return {
      title: this.data.detail.title,
        imageUrl: this.data.imgSrc + this.data.goodsDetail.sliderImage[0],
      path: `/page/interest/pages/goodsvip-detail/goodsvip-detail?memberId=${this.data.detail.id}&goodsId=${this.data.detail.goodsId}`
    }
  },
})