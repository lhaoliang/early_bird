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
        id: '',
        goodsId: '',
        imgSrc: util.config.source,
        detail: {},
        goodsDetail: {},
        info: '',
        isAppoint: false,
        specId: "",
        timer:"",
        endTime:'',
        loadMore:false,
        code:''
    },
    chooseTab(e) {
        this.setData({
            tab: e.currentTarget.dataset.tab
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
            url: `/page/presale/pages/pay/pay?activityId=${this.data.id}&goodsSpecId=${e.detail.goodsInfo.goods_spec_id}&purchaseNum=${e.detail.goodsInfo.purchase_num}`,
        });
        this.setData({
            showSpecModal: false
        })
    },
    setAlarm() {
        util.requester.post('/frontapi/store/appoint/alarm/set', {
            activityId: this.data.id
        }, res => {
            if (res.result) {
                wx.showToast({
                    title: '设置成功',
                    icon: 'success',
                    duration: 1000
                })
                this.setData({
                    info: (this.data.info == "提醒我") ? "已提醒" : "提醒我"
                })
            } else {
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 1000
                })
            }
        })
    },
    getCode() {
        let url = '/page/presale/pages/presale-detail/presale-detail?goodsId=' + this.data.goodsId + '%26' + 'id=' + this.data.id
        util.requester.get('/frontapi/store/goods/share', {
            path: url,
            type: 1,
            id: this.data.id

        }, res => {
            console.log(res)
            this.setData({
                code: res.datas
            });

        })
    },
    toRule() {
        wx.navigateTo({
            url: '/page/presale/pages/money-rule/money-rule',
        })
    },
    toDisuss() {
        wx.navigateTo({
            url: '/pages/discuss/discuss',
        })
    },
    openSpecModal() {
        if (this.data.isAppoint) {
            wx.showToast({
                title: '已预约',
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
    getDetail() {
        wx.showLoading({
            title: '加载中',
        })
        util.requester.get('/frontapi/store/activity/appoint/detail', {
            id: this.data.id
        }, res => {
            if (!res.datas.qrCode) {
                this.getCode()
            }
            if (res.datas.isAlarm) {
                this.setData({
                    info: '已提醒'
                })
            } else {
                this.setData({
                    info: '提醒我'
                })
            }
            this.setData({
                detail: res.datas,
                isAppoint: res.datas.isAppoint,
                code: res.datas.qrCode
            });

            this.setTimeInterval()
            wx.hideLoading();
            wx.stopPullDownRefresh();//停止当前页面下拉刷新。
        })
        
    },
    getEndTime(time) {
        if (time <= 0) {
            time = 0;
        }
        let diffTime = Math.round((new Date(time) - new Date()) / 1000);
        let days = Math.floor(diffTime / 60 / 60 / 24);
        diffTime = diffTime % (60 * 60 * 24);
        let hours = Math.floor(diffTime / 60 / 60);
        diffTime = diffTime % (60 * 60);
        let mins = Math.floor(diffTime / 60);
        let seconds = diffTime % 60;
        if (days > 0) {
            return `${days}天 ${hours.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${hours.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
        }
    },
    // 设置定时器
    setTimeInterval() {
        let optTime = this.data.detail.endTime
        optTime = new Date(optTime)
        this.data.timer = setInterval(() => {
            let finallyTime = this.getEndTime(optTime)
            this.setData({
                endTime: finallyTime
            })

        }, 990)
    },
    getGoodDetail() {
        wx.showLoading({
            title: '加载中',
        })
        util.requester.get('/frontapi/store/appoint/goods/detail', {
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
    getFormId(e) {  //获取formId
        console.log(e.detail.formId);
        if (e.detail.formId != "the formId is a mock one") {
            util.requester.post("/frontapi/store/collect/user/formid", {
                formId: e.detail.formId
            })
        }
    },
    onShareAppMessage() {
      return {
        title: this.data.detail.title,
          imageUrl: this.data.imgSrc + this.data.goodsDetail.goods.sliderImage[0],
        path: `page/presale/pages/presale-detail/presale-detail?id=${this.data.detail.id}&goodsId=${this.data.detail.goodsId}`
      }
    },
    // 组件提交选中规格事件
    chooseSpec(e) {
        let spacNames = e.detail.specNames.replace(/ /g, '·');
        this.setData({
            specId: e.detail.specId,
            specNames: spacNames.slice(0, spacNames.length - 1)
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
    // 点击分享
    clickShare() {
        this.setData({
            showChooseShareModal: true
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id,
            goodsId: options.goodsId
        })
        this.getDetail()
        this.getGoodDetail()
    },
    onReachBottom() {
        if (!this.data.loadMore) {
            this.getGoodDetail()
            this.setData({
                loadMore: true
            })

        }
    },
    onShow() {
        this.getDetail()
        // this.getCode()
    },
    onUnload() {
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        console.log("刷新");
        wx.showLoading({
            title: "刷新中",
            mask: true,
        });
        this.getDetail()
        this.getGoodDetail()
        wx.hideLoading();
        console.log("关闭");

    }

})


