// components/coupon/coupon.js
const util = require('../../utils/util.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        goodsInfo: {
            value: {},
            type: Object,
            observer() {
                this.setData({
                    goodsInfoData: this.data.goodsInfo
                })
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        imgSrc: util.config.source,
        goodsInfoData:{},


    },

    /**
     * 组件的方法列表
     */
    attached: function () {
        
        // 在组件实例进入页面节点树时执行
    },
    methods: {
        toDetail(e){
            wx.navigateTo({
                // url: `/pages/confirm-order/confirm-order?activityId=${this.data.id}&goodsInfo=${JSON.stringify([e.detail.goodsInfo])}`,
                url: '/page/interest/pages/goodsvip-detail/goodsvip-detail?memberId=' + e.currentTarget.dataset.id + "&goodsId=" + e.currentTarget.dataset.goodsid,
            })
        }
    },
    


})