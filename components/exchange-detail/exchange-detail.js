// components/spec-modal/spec-modal.js
const util = require('../../utils/util.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        cate:{
            value:0,
            type:Number
        },
        goodsInfo: {
            value: {},
            type: Object,
            observer() {
                this.setData({
                    goodsInfoData: this.data.goodsInfo,
                    description: this.data.goodsInfo.goods ? this.data.goodsInfo.goods.description.replace(/\<img/gi, '<img style="max-width:100%;margin-bottom:-5px;height:auto" '):'',
                    // .replace(/ (\r\n |\n |\r) / gm, '<br />').split('<br />')
                    exchangeRule: this.data.goodsInfo.exchangeRule
                })
            }
        },
        isPhone:{
            value:false,
            type:Boolean,
            observer(){
                this.setData({
                    phone:this.data.isPhone
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        num: 1,
        tab: 1,
        // currentSpec: {},
        // specNames: '',
        imgSrc: util.config.source,
        descriptions: [],
        goodsInfoData: {},
        phone:false,
        exchangeRule:[],
        description:''
    },


    attached: function () {
        this.getUserInfo()
    },
    /**
     * 组件的方法列表
     */

    methods: {
        getUserInfo() {
            util.requester.get("/frontapi/store/user/info", {}, res => {
               if(res.datas.phone){
                   this.setData({
                       phone:true
                   })
               }else{
                   this.setData({
                       phone:false
                   })
               }
            })
        },
        getPhoneNumber: function (e) {
            if (e.detail.errMsg === "getPhoneNumber:ok") {
                util.requester.post("/frontapi/store/phone/decrypt", {
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv
                }, res => {
                    console.log(res);
                    if (res.datas == '授权失败') {
                        wx.clearStorageSync();
                        wx.showToast({
                            title: '身份过期，请重新登录',
                            icon: 'none'
                        })
                        setTimeout(() => {
                            wx.navigateTo({
                                url: '/page/common/pages/authorization/authorization'
                            })
                        }, 1300)
                    } else {
                        // 更新用户手机号
                        util.requester.put("/frontapi/store/phone/save", {
                            phone: res.datas.phoneNumber,
                        }, res => {
                            wx.showToast({
                                title: res.message,
                                icon: 'none'
                            })
                            this.getUserInfo()
                        })

                    }
                })
            } else {
                wx.showToast({
                    title: '您已取消授权',
                    icon: 'none'
                })
                this.getUserInfo()
            }
        },
        change(e){
            wx.showModal({
                title: '提示',
                content: '你确定要兑换吗？',
                success: res => {
                    if (res.confirm) {
                        util.requester.post('/frontapi/store/equity/exchange/prize', {
                            id: e.currentTarget.dataset.id,
                            prizeType: e.currentTarget.dataset.type
                        }, res => {
                            wx.showToast({
                                title: '兑换成功',
                                duration: 1200
                            })
                            setTimeout(() => {
                                wx.redirectTo({
                                    url: '/page/interest/pages/exchange-success/exchange-success?type=' + e.currentTarget.dataset.type
                                })
                            }, 1200)
                        })

                    }
                }
            })
        },
        exchangeDetail(e){
            wx.navigateTo({
                url: '/page/interest/pages/confirm-exchange/confirm-exchange?goodsId=' + e.currentTarget.dataset.id
            })
        },
        /**
         * 获取formId
         */
        // getFormId(e) {
        //     setTimeout(() => {
        //         console.log(e.detail.formId);
        //         if (e.detail.formId != "the formId is a mock one") {
        //             util.requester.post("/frontapi/store/collect/user/formid", {
        //                 formId: e.detail.formId
        //             })
        //         }
        //     }, 5000)
        // },
        closeModal() {
            this.triggerEvent('close', {
                descriptions: this.data.descriptions
            });
        },
        // attached: function () {
        //     wx.setNavigationBarColor({
        //         backgroundColor: '#FFEAC9',
        //     });
        // },
        chooseTab(e) {
            this.setData({
                tab: e.currentTarget.dataset.tab
            })
        },
    },
})