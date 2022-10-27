// app.js
import { initCurrentLocation, initProvinceAndCities, getCurrentLocation } from './utils/location.js'

App({
    onLaunch() {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: 'cloud1-9gr2pnpvb813b122',
                traceUser: true,
            })
        }
       
        //获取用户地理信息&城市省份列表
        initCurrentLocation();
        initProvinceAndCities();
        getCurrentLocation();
    },
    globalData: {
        userInfo: null
    }
})
