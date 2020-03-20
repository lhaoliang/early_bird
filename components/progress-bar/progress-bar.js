// components/coupon/coupon.js
const util = require('../../utils/util.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        max: {
            value: 99,
            type: Number
        },
        min: {
            value: 10,
            type: Number
        },
        now: {
            value: 60,
            type: Number,
            observer() {
                this.setData({
                    barValue: this.data.now
                })
            }
        }
        // showUseDescpt: {
        //     value: false,
        //     type: Boolean
        // },
        // goodsInfo: {
        //     value: {},
        //     type: Object,
        //     observer() {
        //         this.data.goodsInfo.goodsSpecName = JSON.parse(this.data.goodsInfo.goodsSpecName || '[]')
        //         this.setData({
        //             goodsInfoData: this.data.goodsInfo
        //         })
        //     }
        // }
    },

    /**
     * 组件的初始数据
     */
    data: {
        imgSrc: util.config.source,
        max: 99,
        min: 10,
        now: 50,
        barValue: 0,

    },

    /**
     * 组件的方法列表
     */
    lifetimes: {
        attached: function () {
            

            this.checkInput()
            this.getBarValue();
            // 在组件实例进入页面节点树时执行
        }
    },
    methods: {
        getBarValue() {
            if (this.data.min <= this.data.now && this.data.now <= this.data.max) {
                let x = this.data.max / 100;
                let barValue = this.data.now / x
                this.setData({
                    barValue: barValue
                });
            } else if (this.data.min > this.data.now) {
                let x = this.data.max / 100;
                let barValue = this.data.min / x
                this.setData({
                    barValue: barValue
                });
            }
            else if (this.data.now > this.data.max) {
                let x = this.data.max / 100;
                let barValue = this.data.max / x
                this.setData({
                    barValue: barValue
                });
            }
        },
        checkInput() {
            if (this.data.min > this.data.max) {
                this.setData({
                    min: this.data.max
                })
            };
            if (this.data.now > this.data.max) {
                this.setData({
                    now: this.data.max
                })
            };
            if (this.data.now < this.data.min) {
                this.setData({
                    now: this.data.min
                })
            };
            
        }

    },


})