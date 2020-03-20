// components/share-modal/share-modal.js
const util = require('../../utils/util.js')
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        image: String,
        title: String,
        price: String,
        code:{
            value: '',
            type: String,
            observer() {
                this.setData({
                    codes: this.data.code
                })
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        shareImage: '',
        imgSrc: util.config.source,
        codes:'',
        plateImage:''

    },
   
    attached() {
      
            util.requester.get('/frontapi/store/setting/parameter/get', {}, res => {
                wx.getImageInfo({
                    src: this.data.imgSrc + res.datas.plateImage,
                    // src: this.data.imgSrc + 'uploads/images/fb70d8e554646f8ac6d3c36066ea6b23.png',
                    success: (res) => {
                        wx.setStorage({
                            key: 'img-top',
                            data: res,
                        });
                        wx.getImageInfo({
                            src: this.data.imgSrc + this.data.codes,
                            success: (res) => {
                                wx.setStorage({
                                    key: 'img-code',
                                    data: res,
                                });
                            },
                        });
                    },
                });
            })
     
   

        this.initShare();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        error(e) {
            console.log(e)
        },
        closeModal() {
            this.triggerEvent('close');
            wx.hideLoading();
        },
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
        // 初始化，生成图片
        initShare() {
            wx.showLoading({
                title: '生成中',
            });
            let res = wx.getSystemInfoSync();
            this.setData({
                windowHeight: res.windowHeight,
                windowWidth: res.windowWidth
            })
            const ctx = wx.createCanvasContext('myCanvas', this);
            const windowWidth = this.data.windowWidth;
            let currentHeight = 0;
            ctx.setFillStyle('#fff');
            ctx.fillRect(0, 0, 1000, 2000);
            console.log(this.data.image)
            wx.getImageInfo({
                src: this.data.image,
                success: res => {
                    ctx.drawImage(res.path, 0, currentHeight, windowWidth, windowWidth);
                    currentHeight += 10 + windowWidth;
                    let imgTop = wx.getStorageSync("img-top");

                    ctx.drawImage(imgTop.path, windowWidth * 0.04, currentHeight,
                        windowWidth * 0.92, 50 * windowWidth / 750);
                    currentHeight += windowWidth * 34 / 750 + 30;
                    // 设置文字大小
                    ctx.setFontSize(16);
                    // 设置文字颜色
                    ctx.fillStyle = '#222';
                    ctx.font = 'normal bold 18px sans-serif';
                    var str = this.data.title;
                    ctx.fillText(str, windowWidth * 0.035, currentHeight);

                    currentHeight += 15;
                    ctx.fillStyle = '#1cbdc5';
                    ctx.setFontSize(15);
                    ctx.fillText('￥', windowWidth * 0.035 - 1, currentHeight + windowWidth / 4);
                    ctx.setFontSize(23);
                    ctx.fillText(this.data.price, windowWidth * 0.035 + 13, currentHeight + windowWidth / 4);
                    let imgCode = wx.getStorageSync("img-code");
                    ctx.drawImage(imgCode.path, windowWidth / 2 + 30, currentHeight +20, windowWidth / 2 - 50, windowWidth / 2 - 50);
                    ctx.draw(false, () => {
                        wx.canvasToTempFilePath({
                            canvasId: 'myCanvas',
                            success: res => {
                                this.setData({
                                    shareImage: res.tempFilePath,
                                })
                                wx.hideLoading();
                            }
                        }, this)
                    });
                }
            })
        },

        // 保存图片
        clickShare() {
            wx.saveImageToPhotosAlbum({
                filePath: this.data.shareImage,
                success: res => {
                    wx.showModal({
                        content: '图片已保存到相册，赶紧晒一下吧~',
                        showCancel: false,
                        confirmText: '好的',
                    })
                },
                fail: (res) => {
                    console.log(res);
                }
            })
        }
    }
})