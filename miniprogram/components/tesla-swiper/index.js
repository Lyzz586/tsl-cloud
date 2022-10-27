// components/tesla-swiper/index.js
Component({
    properties: {
        list: {
            type: Array,
            default: []
        }
    },
    data: {
        current: 0
    },

    methods: {
        // 事件处理函数
        onChange(e) {
            const {
                current
            } = e.detail
            this.setData({
                current
            })
        },
        //跳转到产品页面
        gotoProduct(e) {
            if (e.currentTarget.dateset === null) {
                return
            }
            const {
                productId
            } = e.currentTarget.dataset
            wx.navigateTo({
                url: `/pages/product/index?id=${productId}`,
            })
        },
        onBookBtnClick() {
            this.triggerEvent('on-book-btn-click')
        }
    }
})