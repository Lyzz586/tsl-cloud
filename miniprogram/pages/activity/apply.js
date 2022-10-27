// pages/activity/apply.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        remark: '',
        id:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({id:options.id})
        this.db = wx.cloud.database()
        this._loadActivity(options.id)
    },
    _loadActivity(activityId) {
        this.db.collection('activity').where({ _id: activityId }).get().then(res => {
            console.log(res.data[0]);
        })
    },
    onforminput(e) {
        if (this.isError()) {
            this.handleSubmit()
        }
    },
    handleSubmit() {
        const {lastName,firstName,phone,email,remark,id} = this.data
        wx.showLoading({
            title: '加载中',
          })
        this.db.collection('activity_apply').add({
            data:{
                last_name:lastName,
                first_name:firstName,
                mobile:phone,
                email:email,
                remark:remark,
                activity_id:id
            }
        }).then(res => {
            wx.hideLoading()
            console.log(res);
        })
    },
    //验证规则
    isError() {
        let allInput = this.selectAllComponents('.tesla-input')
        let count = 0
        allInput.forEach(item => {
            if (item.isReady()) {
                count++
            }
        })
        console.log(allInput.length, count);
        return count === allInput.length
        
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