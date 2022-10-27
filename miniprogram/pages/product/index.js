// pages/product/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        product: null,
        // productLines: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad(options) {
    //获取产品数据
    const { id } = options
    const db = wx.cloud.database()
    db.collection('product').where({'_id':id}).get().then(res => {
        const data = res.data
        this.setData({
            product: data[0],
        })
    })
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})