// pages/my-address/my-address.js
const app = getApp()
const util = require('../../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgSrc: util.config.source,
        addressList: [], //地址列表
        mode: 0 // 0 地址管理，1 选择地址
    },
    //获取用户地址列表
    getAddressList() {
        wx.showLoading({
            title: '加载中',
        })
        util.requester.get('/frontapi/store/address/list', {}, res => {
            this.setData({
                addressList: res.datas
            });
            wx.hideLoading();
            wx.stopPullDownRefresh();//停止当前页面下拉刷新。

        })
    },
    //设置默认地址
    setDefault(e) {
      
        var id = e.currentTarget.dataset.idx;
        var isDefault = e.currentTarget.dataset.isdefault
        if (isDefault == 1) {
            wx.showToast({
                title: '这是默认地址！',
            })
            return
        } else {
            wx.showModal({
                title: '提示',
                content: '你确定要设为默认地址吗？',
                success: res=> {
                    if (res.confirm) {
                        util.requester.post('/frontapi/store/address/set/default', {
                            id: id
                        }, res => {
                            if (res.result) {
                                wx.showToast({
                                    title: '设置成功',
                                    icon: 'success',
                                    duration: 1000,
                                })
                                this.getAddressList()
                                
                                if (this.data.mode == 1){
                                    let pages = getCurrentPages();
                                    // console.log(e.currentTarget);
                                    pages[pages.length - 2].setData({
                                        address: e.currentTarget.dataset.item
                                    })
                                    wx.navigateBack();
                                }
                            } else {
                                wx.showToast({
                                    title: res.message,
                                    icon: 'none',
                                    duration: 1000,
                                })
                            }
                        })

                    }
                }
            })

        }

    },
    //删除地址
    delAddress(e) {
        
        var id = e.currentTarget.dataset.id;
        wx.showModal({
            title: '提示',
            content: '你确定要删除此收获地址吗？',
            success: res=> {
                if (res.confirm) {
                    util.requester.delete('/frontapi/store/address/delete', {
                        id: id
                    }, res => {
                        if (res.result) {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 1000,
                            })
                            this.getAddressList()
                        } else {
                            wx.showToast({
                                title: res.message,
                                icon: 'none',
                                duration: 1000,
                            })
                        }
                    })
                }
            }
        })
    },
    //编辑地址
    editAddress(e) {
        var id = e.currentTarget.dataset.idx;
        wx.navigateTo({
            url: '/page/personal/pages/edit-address/edit-address?id=' + id,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
   
       
        this.setData({
            mode: options.mode
        })
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getAddressList();
        
    },
    addAddress() {
        wx.navigateTo({
            url: '/page/personal/pages/add-address/add-address',
        })
    },
    selectAddress(e) {
        if (this.data.mode == 1) {
            let pages = getCurrentPages();
            // console.log(e.currentTarget);
            pages[pages.length - 2].setData({
                address: e.currentTarget.dataset.item
            })
            wx.navigateBack();
        }
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
        this.getAddressList();
        wx.hideLoading();
        console.log("关闭");

    }
})