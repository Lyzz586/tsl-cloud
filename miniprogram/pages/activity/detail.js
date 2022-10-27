// pages/activity/detail.js
import { formatTime } from '../../utils/util'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        activity: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const { id } = options
        let activity = []
        this.db = wx.cloud.database()
        this.db.collection('activity').where({ _id: id }).get().then(res => {
            let activity = res.data[0]
            activity.start_time = formatTime(activity.start_time)
            activity.end_time = formatTime(activity.end_time)
            activity.description = activity.description? this.formatImg(activity.description) : activity.description
            this.setData({
                activity
            })
            this._updateActivityStatus()
        })
    },

    _updateActivityStatus() {
        const now = formatTime(new Date())
        let activity = this.data.activity
        activity['status'] = (now <= activity['end_time'] && now >= activity['start_time'] ? 'registering' : 'registertionEnd');

        this.setData({
            activity
        })
    },
    formatImg(html) {
        let newContent = html.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
        return newContent;

    },
    apply(e) {
        const { id } = e.currentTarget.dataset
        wx.navigateTo({
          url: `/pages/activity/apply?id=${id}`,
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