// pages/edit-address/edit-address.js
// var animation
const app = getApp()
const util = require('../../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        realName: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        detail: '',
        isDefault: 0,
        showCityPicker: false,
        location: '',
        personInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        this.setData({
            id: this.options.id
        })
        this.getAddress()
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
    getAddress() {
        var that = this
        util.requester.get('/frontapi/store/address/detail', {
            id: this.data.id
        }, res => {
            this.setData({
                // personInfo:res.datas
                realName: res.datas.realName,
                phone: res.datas.phone,
                province: res.datas.province,
                city: res.datas.city,
                district: res.datas.district,
                detail: res.datas.detail,
                isDefault: res.datas.isDefault
            })
        })
    },
    getRealname(e) {
        this.setData({
            realName: e.detail.value
        })
    },
    getPhone(e) {
        this.setData({
            phone: e.detail.value
        })
    },
    getDetail(e) {
        this.setData({
            detail: e.detail.value
        })
    },
    setDefault() {

        this.setData({
            isDefault: this.data.isDefault == 1 ? this.data.isDefault = 0 : this.data.isDefault = 1
        })

    },
    // 点击所在地区弹出选择框
    selectDistrict: function (e) {
        this.setData({
            showCityPicker: false
        })
        this.setData({
            showCityPicker: true
        })
    },
    confirmCity(e) {
        // console.log(e);
        this.setData({
            location: e.detail[0].name + ' ' + e.detail[1].name + ' ' + e.detail[2].name,
            province: e.detail[0].name,
            city: e.detail[1].name,
            district: e.detail[2].name
        })

    },
    saveAddress() {
        var that = this
        util.requester.put('/frontapi/store/address/update', {
            id: that.data.id,
            realName: that.data.realName,
            phone: that.data.phone,
            province: that.data.province,
            city: that.data.city,
            district: that.data.district,
            detail: that.data.detail,
            isDefault: that.data.isDefault,
        }, res => {
            if (res.result) {
                wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 1000,
                })
                // wx.navigateTo({
                //   url: '/pages/my-address/my-address',
                // })
                wx.navigateBack();

            } else {
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 1000,
                })
            }
        })
    }
})