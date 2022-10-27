// pages/map/location.js
import { qqmapsdk } from '../../utils/location'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        latitude: 0,
        longitude: 0,
        address: '',
        name: '',
        timeInfo: '',
        chargingInfo: '',
        phone: '',
        phoneService: '',
        markerCategory:'',
        // userLocation: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // let { location } = getCurrentLocation()
        // this.setData({
        //     userLocation: location
        // })

        const id = options.id;
        this.db = wx.cloud.database()
        this.db.collection('marker').where({ _id: id }).get().then(res => {
            const { latitude, longitude } = res.data[0];
            this.setData({ latitude, longitude })
            this._buildLocationInfo(res.data[0])
        })
    },

    _buildLocationInfo(locationInfo) {
        console.log(locationInfo);
        this.setData({
            name: locationInfo.name,
            timeInfo: locationInfo.time_info,
            phone: locationInfo.phone,
            phoneService: locationInfo.service,
            chargingInfo: locationInfo.charging_info
        })

        this._buildAddress(locationInfo.latitude, locationInfo.longitude);
        this._buildDistance(locationInfo.latitude, locationInfo.longitude);
        this._buildMarkerCategoryInfo(locationInfo.marker_category)
    },
    _buildAddress(latitude, longitude) {
        qqmapsdk.reverseGeocoder({
            location: {
                latitude,
                longitude
            },
            success: (res) => {
                this.setData({
                    address: res.result.formatted_addresses.recommend
                });
            }

        })
    },

    _buildDistance(latitude, longitude) {
        qqmapsdk.calculateDistance({
            from: '',
            to: [{
                latitude,
                longitude
            }],
            success: (res) => {
                this.setData({
                    distance: res.result.elements[0].distance / 1000 + 'km'
                });
            }
        })
    },

    _buildMarkerCategoryInfo(id) {
        this.db.collection('markers_category').where({ _id: id }).get().then(res => {
            this.setData({
                markerCategory: res.data[0].title
            })
        })
    },

    goMap() {
            wx.openLocation({
            latitude: this.data.latitude,
            longitude: this.data.longitude,
            name: this.data.name,
            address: this.data.address,
            success:(res) => {
                console.log(res);
            }
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