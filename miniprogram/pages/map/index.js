// pages/map/index.js
// import $ from './../../utils/Tool'
import { getCurrentLocation, qqmapsdk } from '../../utils/location'
Page({
    data: {
        latitude: 0,
        longitude: 0,
        markersCategory: [],
        allMarkers: [],
        markers: [],
        isInputting: false,
        locationResult: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        this.db = wx.cloud.database()
        this.db.collection('markers_category').get().then((res) => {
            const markersCategory = res.data
            this._buildMarkersCategory(markersCategory)
        })

        // let { location } = getCurrentLocation()
        // this.setData({
        //     latitude: location.lat,
        //     longitude: location.lng,
        // })
        // console.log($.storage.get('userCurrentLocation').location.lat)
        // $.storage.get('userCurrentLocation').location.lng || $.storage.get('userCurrentLocation').location.lat

        wx.getLocation({
            type: 'gcj02',
        }).then(res => {
            const { latitude, longitude } = res;
            this.setData({ latitude, longitude })
        }, (res) => {
            wx.openSetting({
                withSubscriptions: true,
                success: function (data) {
                    console.log(data);
                }
            })
        }
        )
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.mapCtx = wx.createMapContext('myMap')
        // this.mapCtx.moveToLocation()
    },

    _buildMarkersCategory(originMarkersCategory) {
        let markersCategory = originMarkersCategory.map(({ _id, ...o }, index) => ({
            id: _id,
            ...o,
            isActive: index === 0 ? true : false
        }))
        this.setData({ markersCategory })

        this.db.collection('marker').get().then((res) => {
            const marker = res.data
            this._buildMarker(marker)
        })
    },

    _buildMarker(originMarker) {
        let markers = originMarker.map(({ marker_category, ...o }, index) => ({
            markerCategoryId: marker_category,
            ...o,
            id: index,
            height: 45,
            width: 45,
            iconPath: this.getMarkerIcon(marker_category),
        }))
        this.setData({ allMarkers: markers })
        this.showMarkers()
    },

    getMarkerIcon(markerCategoryId) {
        let id = markerCategoryId
        let icon = this.data.markersCategory.filter(item => {
            return id === item.id
        })
        return icon[0]['icon'];
    },


    showMarkers() {
        this.buildMarkersCategoryId()
        let allMarkers = this.data.allMarkers

        let markers = allMarkers.filter(item => {
            return this.buildMarkersCategoryId().includes(item.markerCategoryId)
        })
        this.setData({
             markers
         })
    },

    //组织选中项的id
    buildMarkersCategoryId() {
        let markersCategoryId = []
        this.data.markersCategory.forEach((item) => {

            item.isActive == false || markersCategoryId.push(item.id)

        })
        return markersCategoryId
    },


    //点击标记分类
    clickMarkersCategory(e) {
        const id = e.currentTarget.dataset.id
        const markersCategory = this.data.markersCategory
        markersCategory.forEach((item, index) => {
            if (item.id === id) {
                markersCategory[index].isActive = !markersCategory[index].isActive

            }
        })
        // markersCategory
        this.setData({ markersCategory })
        this.showMarkers()
    },

    onMarkerTop(e) {
        const { markerId } = e.detail
        wx.navigateTo({
            url: `/pages/map/location?id=${this.data.allMarkers[markerId]['_id']}`,
        })
    },

    onSearch(e) {
        let isInputting = true
        if (e.detail == '') {
            isInputting = false
        } else {
            isInputting = true
            qqmapsdk.getSuggestion({
                keyword: e.detail,
                success: (res => {//搜索成功后的回调
                    this._buildLocationResult(res.data)
                }),
                fail: function (error) {
                    console.error(error);
                },
            });

        }
        this.setData({
            isInputting
        })

    },
    _buildLocationResult(data) {
        var locationResult = [];
        for (var i = 0; i < data.length; i++) {
            locationResult.push({ // 获取返回结果，放到sug数组中
                name: data[i].title,
                addr: data[i].address,
                latitude: data[i].location.lat,
                longitude: data[i].location.lng
            });
        }
        this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
            locationResult
        });
    },
    gotoLocation(e) {
        const { latitude, longitude } = e.currentTarget.dataset.location
        const markers = this.data.markers
        markers.push({
            id: 999999,
            latitude,
            longitude,
            iconPath: "../../images/Pin.png",
            width: 35,
            height: 35,
            markerCategoryId:"999999"
        })
        this.setData({ markers})
        this.mapCtx.moveToLocation({
            latitude,
            longitude,
        })
        this.setData({
            isInputting: false,
        })

    },
    clickClear() {
        this.setData({
            isInputting: false,
            locationResult:[]
        })
    },

    clearMarker() {
        let markers = this.data.markers.filter(({id})=> {
            return id !== 999999
        })
        this.setData({markers})
    },

    toCurrentLocation() {
        this.mapCtx.moveToLocation()
        this.clearMarker()
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