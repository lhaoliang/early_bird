// pages/submit-assess/submit-assess.js
const app = getApp()
const util = require('../../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        header: util.requester.getHeader(),
        server: util.config.server,
        source: util.config.source,
        star: 5,
        defaultStar: 0,
        comment: '',
        orderId: 0,
        orderInfo: {},
        imgList: [],
        goodsId:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderId:options.id,
            goodsId:options.goodsId,
            orderInfo: JSON.parse(options.item)
        })
    },
    getCom(e) {
        this.setData({
            comment: e.detail.value
        })
    },
    deleteImg(e) {
        wx.showModal({
            title: '提示',
            content: '删除该图片?',
            success: res => {
                if (res.confirm) {
                    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
                    this.setData({
                        imgList: this.data.imgList
                    })
                }
            }
        })

    },
    subCom() {
        if (!this.data.comment) {
            wx.showToast({
                title: '请输入评价内容',
                duration: 1200,
                icon: 'none'
            });
            return;
        }
        if (this.data.comment.length < 400 ) {
            wx.showToast({
                title: '您的反馈报告字数不够',
                duration: 1200,
                icon: 'none'
            });
            return;
        }
        if (this.data.imgList.length<5) {
            wx.showToast({
                title: '反馈图片不够',
                duration: 1200,
                icon: 'none'
            });
            return;
        }
        util.requester.post('/frontapi/store/trial/feedback/add', {
            orderId: this.data.orderId,
            goodsId: this.data.goodsId,
            comment: this.data.comment,
            images: this.data.imgList.join(',')
        }, res => {
            if (res.result) {
                wx.showToast({
                    title: '反馈成功',
                    duration: 1200,
                })
                setTimeout(() => {
                    wx.navigateTo({
                        url: '/page/personal/pages/my-trial/my-trial',
                    })
                }, 1200)
            } else {
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 1000,
                })
            }
        })
    },
    addImg() {
        wx.chooseImage({
            success: res => {
                const tempFilePaths = res.tempFilePaths
                // if (res.tempFilePaths[0].indexOf('wxfile') != -1) {
                //     let url = res.tempFilePaths[0]
                //     res.tempFilePaths[0] = url.replace(/wxfile/, "http")
                //     console.log(res.tempFilePaths[0]);
                // }
                // console.log(res);
                // util.requester.post('/frontapi/store/image/upload',{
                //     img: res.tempFilePaths[0],
                // },res=>{
                //     console.log(res);
                //         const result = JSON.parse(res.data);
                //         this.setData({
                //             imgList: this.data.imgList.concat([result.datas])
                //         })
                // })
                tempFilePaths.forEach( item=>{
                    wx.uploadFile({
                        url: this.data.server + '/frontapi/store/image/upload',
                        filePath: item,
                        name: 'img',
                        header: this.data.header,
                        success: res => {
                            console.log(res);
                            const result = JSON.parse(res.data);
                            this.setData({
                                imgList: this.data.imgList.concat([result.datas])
                            })
                        }
                    })
                } )

            }
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
    }
})