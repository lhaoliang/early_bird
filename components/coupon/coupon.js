// components/coupon/coupon.js
const util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // couponType 1 会员专区 type 2 首发专区  type 3 全场通用
    // venueDivision 1会员专区 2首发专区 3全场通用

    detail: {
      value: {},
      type: Object
    },
    info: {
      value: {},
      type: Object
    },
    item: {
      value: {},
      type: Object
    },
    // 已使用和过期 2 ，3 
    status: {
      value: 1,
      type: Number
    },
    // 选择优惠券传modal 3
    modal: {
      value: 0,
      type: Number
    },
    choosedCoupon: {
      value: 0,
      type: Number
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    detail: {},
    imgSrc: util.config.source,
    showUseDescpt: false,
    title: '',
    status: 1,
    modal: 0,
    choosedCoupon: 0,
    // choosed: this.data.info.detail.choose,
    description: '',
  },

  /**
   * 组件的方法列表
   */
  attached: function() {
    this.getTitleAndType();
    console.log(this.data.detail);
    // 在组件实例进入页面节点树时执行
  },
  methods: {

    seeUserDescpt() {
      this.setData({
        showUseDescpt: !this.data.showUseDescpt
      })
    },
    // couponType 1 会员专区 type 2 首发专区  type 3 全场通用
    // venueDivision 1 会员专区 2 首发专区 3 全场通用
    getTitleAndType() {
      if (this.data.detail.venueDivision == 1) {
        this.setData({
          title: '会员专区',
        });
        if (this.data.modal == 3) {
          this.setData({
            modal: 2,
          });
        }
      } else if (this.data.detail.venueDivision == 2) {
        this.setData({
          title: '首发专区',
        });
        if (this.data.modal == 3) {
          this.setData({
            modal: 1,
          });
        }
      } else if (this.data.detail.venueDivision == 3) {
        this.setData({
          title: '全场通用',
        });
        if (this.data.modal == 3) {
          this.setData({
            modal: 1,
          });
        }
      };
      if (this.data.detail.couponType == 1) {
        this.setData({
          description: '无门槛劵'
        });
      } else if (this.data.detail.couponType == 2) {
        this.setData({
          description: '满减券'
        });
      } else if (this.data.detail.couponType == 3) {
        this.setData({
          description: '折扣券'
        });
      }
    },
    chooesCoupon(e) {
      let info = this.data.info;
      console.log(info)
      info.coupon.choose = !info.coupon.choose;
      this.triggerEvent('choose', {
        description: this.data.description,
        choose: info.coupon.choose,
      });
      this.setData({
        info: info,
      })

    },
    cancleChoose(e) {
      this.triggerEvent('choose', {
        description: '未选择优惠券',
        choose: false,
      });

    },
  },
  pageLifetimes: {

  }


})