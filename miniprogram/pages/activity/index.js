// pages/activity/index.js
import { formatTime } from '../../utils/util'
import { getCurrentLocation } from '../../utils/location'
const citySelector = requirePlugin('citySelector');
Page({
    data: {
        count: 0,
        limit: 5,
        total: 0,
        currentCity: '',
        isLoading: false,
        activityInfo: [],
        noMore: false
    },

    onLoad(options) {
        const { city } = getCurrentLocation()
        this.setData({ currentCity: city })
        this.db = wx.cloud.database()

        this._loadCurrentActivitiesCount()

    },

    _loadCurrentActivitiesCount() {
        this.db = wx.cloud.database()
        this.db.collection('activity').orderBy('created_time', 'asc').where({ city: this.data.currentCity }).count().then(res => {
            this.setData({ total: res.total })
        })
    },

    changeProvince() {
        const key = 'LHRBZ-LRCC3-DRR3B-3YPUZ-FEYIJ-HQBNA'; // 使用在腾讯位置服务申请的key
        const referer = 'tesla'; // 调用插件的app的名称
        wx.navigateTo({
            url: `plugin://citySelector/index?key=${key}&referer=${referer}`,
        })
    },


    _loadCurrentCityActivityList() {
        if (this.data.count !== 0 && this.data.count === this.data.total) {
            this.setData({
                noMore: true
            })
            return
        }
        this.setData({ 
            isLoading: true,
        })
        this.db.collection('activity').orderBy('created_time', 'asc')
            .skip(this.data.count)
            .limit(this.data.limit)
            .where({ city: this.data.currentCity }).get().then(res => {
                let activityInfo = this.data.activityInfo
                res.data.forEach(item => {
                    item['start_time'] = formatTime(item['start_time'])
                    item['end_time'] = formatTime(item['end_time'])
                    activityInfo.push(item)
                })
                const count = activityInfo.length
                this.setData({
                    activityInfo,
                    isLoading: false,
                    count
                })
                this._updateActivityStatus()
            })
    },

    _updateActivityStatus() {
        const now = formatTime(new Date())
        let activityInfo = []
        this.data.activityInfo.forEach(item => {
            item['status'] = (now <= item['end_time'] && now >= item['start_time'] ? 'registering' : 'registertionEnd');
            activityInfo.push(item)
        })

        this.setData({
            activityInfo
        })
    },
    goToDetail(e) {
        const { id } = e.currentTarget.dataset
        wx.navigateTo({
            url: `./detail?id=${id}`,
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
        const selectedCity = citySelector.getCity(); // 选择城市后返回城市信息对象，若未选择返回null
        if (selectedCity) {
            this.setData({
                currentCity: selectedCity.fullname,
                activityInfo:[],
                count:0
            })
            
        }
        this._loadCurrentActivitiesCount()
        this._loadCurrentCityActivityList()
    },

    /**
 * 页面上拉触底事件的处理函数
 */
    onReachBottom() {
        this._loadCurrentCityActivityList()
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
        citySelector.clearCity();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },



    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})