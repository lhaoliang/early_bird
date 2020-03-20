// components/spec-modal/spec-modal.js
const util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      value: [],
      type: Array,
      observer() {
        this.setData({
          listData: this.data.list
        })
      }
    },
    choosedCoupon: {
      value: 0,
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    num: 1,
    imgSrc: util.config.source,
    descriptions: [],
    listData: [],
    couponId: 0,
    couponType: '',
    couponFaceValue: '',
    discount: 0,
    choosedCoupon: 0
  },


  attached: function() {
    this.setData({
      descriptions: []
    })
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
      console.log(this.data.listData)
      this.triggerEvent('close', {
        descriptions: this.data.descriptions,
        couponId: this.data.couponId,
        couponType: this.data.couponType,
        couponFaceValue: this.data.couponFaceValue,
        discount: this.data.discount,
        choose: this.data.choose,
        flag: false
      })
    },
    getChoose(e) {
      console.log(e)
      console.log(e.detail.choose)
      let listData = this.data.listData;
      listData.forEach(item => {
        item.coupon.choose = false;
      })
      this.setData({
        listData: listData
      })
      console.log(this.data.listData)

      if (e.detail.choose) {
        // this.setData({
        //     descriptions:[]
        // })

        this.setData({
          descriptions: e.detail.description,
          couponId: e.currentTarget.dataset.item.id,
          couponType: e.currentTarget.dataset.item.coupon.couponType,
          couponFaceValue: e.currentTarget.dataset.item.coupon.couponFaceValue,
          discount: e.currentTarget.dataset.item.coupon.discount,
          choose: true
        })
        this.closeModal()
      } else {
        this.setData({
          descriptions: e.detail.description,
          choose: false
        })
        this.closeModal()
      }
      console.log(this.data.descriptions, e.detail.choose);
    },
    // _confirmEvent(){
    //     console.log('succss')
    //     // this.triggerEvent("confirmEvent");
    // }
  }

})