// components/spec-modal/spec-modal.js
const util = require('../../utils/util.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        specsProp: {
            value: [],
            type: Array,
            observer() {
                this.data.specsProp.forEach(v => {
                    v.specificationTitles = JSON.parse(v.specificationTitles);
                })
                this.setData({
                    specs: this.data.specsProp
                })
            }
        },
        specGroupsProp: {
            value: [],
            type: Array,
            observer() {
                this.data.specGroupsProp.forEach(v => {
                    v.specificationNames = JSON.parse(v.specificationNames);
                    v.chooseIndex = -1;
                });
                // this.data.specGroupsProp.forEach(x => {
                //     x.specificationNames.forEach(y => {
                //         y = y.replace(/ /g, '')
                //     })
                // })
                this.setData({
                    specGroups: this.data.specGroupsProp
                })
            }
        },
        defaultImage: String,
        defaultPrice: String,
        defaultStock: String,
        numPerUser: {
            value: 1,
            type: Number
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        num: 1,
        currentSpec: {},
        specNames: '',
        imgSrc: util.config.source
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
        clickCount(e) {
            let num = this.data.num + e.currentTarget.dataset.num;
            if (num >= 1 && num <= this.data.numPerUser) {
                this.setData({
                    num: num
                })
            }
        },
        chooseSpec(e) {
            let titleIndex = e.currentTarget.dataset.titleIndex;
            let specIndex = e.currentTarget.dataset.specIndex;
            let title = this.data.specGroups[titleIndex].specificationTitle;
            let spec = this.data.specGroups[titleIndex].specificationNames[specIndex];
            this.data.specGroups[titleIndex].chooseIndex = specIndex;
            this.setData({
                specGroups: this.data.specGroups
            });
            this.data.specNames = '';
            // 寻找匹配的规格组合
            this.data.specs.forEach(spec => {
                let flag = this.data.specGroups.every(group => {
                    let specName = group.specificationNames[group.chooseIndex];
                    if (spec.specificationTitles[group.specificationTitle] == specName) {
                        return true;
                    }
                })
                if (flag) {
                    console.log(spec);
                    // 判断规格是否可用
                    if (spec.isActive) {
                        this.setData({
                            currentSpec: spec
                        })
                    } else {
                        wx.showToast({
                            title: '抱歉，该规格组合已售罄',
                            icon: 'none'
                        })
                        this.data.specGroups[titleIndex].chooseIndex = -1;
                        this.setData({
                            specGroups: this.data.specGroups
                        });
                    }
                }
            });
            // 设置选中的名字
            this.data.specGroups.forEach(group => {
                if (group.chooseIndex > -1) {
                    this.data.specNames += group.specificationNames[group.chooseIndex] + ' ';
                }
            })
            this.setData({
                specNames: this.data.specNames
            })
            // 提交事件
            this.triggerEvent('choose', {
                specId: this.data.currentSpec.id,
                specNames: this.data.specNames
            })
        }
    }
})