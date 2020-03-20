// components/spec-modal/spec-modal.js
const util = require('../../utils/util.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        mode: {
            value: 1,
            type: Number,
            
        },
        // specGroupsProp: {
        //     value: [],
        //     type: Array,
        //     observer() {
        //         this.data.specGroupsProp.forEach(v => {
        //             v.specificationNames = JSON.parse(v.specificationNames);
        //             v.chooseIndex = -1;
        //         });
        //         // this.data.specGroupsProp.forEach(x => {
        //         //     x.specificationNames.forEach(y => {
        //         //         y = y.replace(/ /g, '')
        //         //     })
        //         // })
        //         this.setData({
        //             specGroups: this.data.specGroupsProp
        //         })
        //     }
        // },
        // defaultImage: String,
        // defaultPrice: String,
        // defaultStock: String,
        // numPerUser: {
        //     value: 1,
        //     type: Number
        // }
    },

    /**
     * 组件的初始数据
     */
    data: {
        mode:1,
        num: 1,
        // currentSpec: {},
        // specNames: '',
        imgSrc: util.config.source
    },


    attached: function () {
        console.log(this.data.mode==1?"新手大礼包":"成为会员");
        console.log(this.data.mode)
        if (this.data.mode ==1){
            util.requester.get('/frontapi/store/goods/user/coupon/add', {}, res => {
                console.log(res)
            })
        }

    },
    /**
     * 组件的方法列表
     */

    methods: {
        stop() {

        },
        /**
         * 获取formId
         */
        getFormId(e) {
            setTimeout(() => {
                console.log(e.detail.formId);
                if (e.detail.formId != "the formId is a mock one") {
                    util.requester.post("/frontapi/store/collect/user/formid", {
                        formId: e.detail.formId
                    })
                }
            }, 5000)
        },
        closeModal() {
            this.triggerEvent('close');
        },
        clickBuy() {
            this.triggerEvent('buy', {
                goodsInfo: {
                    goods_spec_id: this.data.currentSpec.id,
                    purchase_num: this.data.num
                }
            });
        },
        getSuccess() {
            if(this.data.mode==1){
                this.closeModal();
            }else{
                // wx.showToast({
                //     title: '恭喜您，成为早鸟会员！',
                //     icon: 'none',
                //     image: '',
                //     duration: 1200,
                //     mask: false,
                // });
                this.closeModal();
                    wx.switchTab({
                        url: '/page/tabBar/interest/index',
                    })
            }
            

        }

    }

})