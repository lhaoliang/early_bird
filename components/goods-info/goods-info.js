// components/goods-info/goods-info.js
const util = require('../../utils/util.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        type: {
            value: 1,
            type: Number
        },
        discount:{
            value:false,
            type:Boolean
        },
        growType:{
            value: false,
            type: Boolean 
        },
        goodsImg:{
            value:false,
            type: Boolean 
        },
        goodsInfo: {
            value: {},
            type: Object,
            observer() {
                this.data.goodsInfo.goodsSpecName = JSON.parse(this.data.goodsInfo.goodsSpecName || '[]')
                this.setData({
                    goodsInfoData: this.data.goodsInfo
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        imgSrc: util.config.source,
        goodsInfoData: {}
    },

    /**
     * 组件的方法列表
     */
    methods: {

    },
    onShow() {
        console.log(this.data.goodsInfo);
    }
})