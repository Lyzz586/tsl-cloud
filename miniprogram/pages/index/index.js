// index.js
// 获取应用实例
const app = getApp()

Page({
    data: {
        List: [],
        products: null,
        isModelShow: false,
        magazine:null,
    },

    onLoad: function (options) {
        this.db = wx.cloud.database()
        this.db.collection('swiper').get().then(res => {
                    this.setData({
                        List: res.data
                    })
                })
        this.db.collection('product').get().then(res => {
            const products = res.data
            this.setData({
                products
            })
        })
        this.db.collection('magazine').get().then(res => {
            const magazine = res.data
            this.setData({
                magazine
            })
        })
    },


    //预约试驾
    onSwiperBookClick() {
        this.setData({
            isModelShow: true
        })
    },

    clickProduct(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/test-drive/index?id=${id}`,
        })
        this.setData({
            isModelShow:false
        })
    },
    clickMagazine(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: `/pages/magazine/index?=${id}`,
        })
    },

    gotoCarCalculator(e) {
        wx.navigateTo({
          url: '/pages/car-calculator/index',
        })
    },
    gotoVideo() {
        wx.navigateTo({
          url: '/pages/video/index',
        })
    }
})
