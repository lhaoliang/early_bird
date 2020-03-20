// components/city-picker/city-picker.js
const address = require('../../utils/citys.js');
const util = require('../../utils/util.js')
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isShow: {
            value: false,
            type: Boolean,
            observer(e){
                if (e) {
                    this.present();
                } else {

                }
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        animationAddressMenu: {},
        addressMenuIsShow: false,
        value: [0, 0, 0],
        reapProvince: [],
        reapCity: [],
        reapCounty: [],
        imgSrc: util.config.source,
        address:{}
    },
    attached() {
        this.getCityJson();
        
        var animation = wx.createAnimation({
            duration: 500,
            transformOrigin: "50% 50%",
            timingFunction: 'ease',
        })
        this.animation = animation;
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getCityJson() {
            var id = address.reapProvince[0].id
            this.setData({
                reapProvince: address.reapProvince,
                reapCity: address.reapCity[id],
                reapCounty: address.reapCounty[address.reapCity[id][0].id],
            })
            // util.requester.get("/frontapi/store/address/city/json", {}, res => {
            //     this.setData({
            //         address: res.datas,
            //     })
            //     var id = this.data.address.reapProvince[0].id
            //     this.setData({
            //         reapProvince: this.data.address.reapProvince,
            //         reapCity: this.data.address.reapCity[id],
            //         reapCounty: this.data.address.reapCounty[this.data.address.reapCity[id][0].id],
            //     })
            // })
        },
        // 点击所在地区弹出选择框
        present() {
            // 如果已经显示，不在执行显示动画
            if (this.data.addressMenuIsShow) {
                return;
            }
            // 执行显示动画
            this.startaddressnimation(true)
        },
        // 执行动画
        startaddressnimation(isShow) {
            if (isShow) {
                // vh是用来表示尺寸的单位，高度全屏是100vh
                this.animation.translateY(0 + 'vh').step()
            } else {
                this.animation.translateY(100 + 'vh').step()
            }
            this.setData({
                animationAddressMenu: this.animation.export(),
                addressMenuIsShow: isShow,
            })
        },
        // 点击地区选择取消按钮
        cityCancel: function(e) {
            this.startaddressnimation(false)
        },
        // 点击地区选择确定按钮
        citySure: function(e) {
            var reapCity = this.data.reapCity
            var value = this.data.value
            this.startaddressnimation(false)
            this.triggerEvent('confirm', [
                this.data.reapProvince[value[0]],
                this.data.reapCity[value[1]],
                this.data.reapCounty[value[2]]
            ])
        },
        // 处理省市县联动逻辑
        cityChange: function(e) {
            console.log(e)
            var value = e.detail.value
            var reapProvince = this.data.reapProvince
            var reapCity = this.data.reapCity
            var reapCounty = this.data.reapCounty
            var provinceNum = value[0]
            var cityNum = value[1]
            var countyNum = value[2]
            // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
            if (this.data.value[0] != provinceNum) {
                var id = reapProvince[provinceNum].id
                this.setData({
                    value: [provinceNum, 0, 0],
                    reapCity: address.reapCity[id],
                    reapCounty: address.reapCounty[address.reapCity[id][0].id],
                })
            } else if (this.data.value[1] != cityNum) {
                // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
                var id = reapCity[cityNum].id
                this.setData({
                    value: [provinceNum, cityNum, 0],
                    reapCounty: address.reapCounty[reapCity[cityNum].id],
                })
            } else {
                // 滑动选择了区
                this.setData({
                    value: [provinceNum, cityNum, countyNum]
                })
            }
        },
        stop() {

        },
    },

})
