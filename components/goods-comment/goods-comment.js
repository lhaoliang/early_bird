// components/goods-comment/goods-comment.js
const util = require('../../utils/util.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        data: {
            value: {},
            type: Object
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        imgSrc: util.config.source
    },
    /**
     * 组件的方法列表
     */
    methods: {
        clickImg(e){
            let arr = []
            this.data.data.storeEvaluationPics.forEach( item=>{
                arr.push(this.data.imgSrc + item.picUrl)
            })
            let src = this.data.imgSrc + e.currentTarget.dataset.src
                wx.previewImage({
                    urls: arr,
                    current:src
            })
        }
    }
})