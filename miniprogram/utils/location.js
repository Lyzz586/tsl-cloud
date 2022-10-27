const QQMapWX = require('../libs/qqmap-wx-jssdk.min.js');
export const qqmapsdk = new QQMapWX({
    key: 'LHRBZ-LRCC3-DRR3B-3YPUZ-FEYIJ-HQBNA'
});

export const initCurrentLocation = () => {
    qqmapsdk.reverseGeocoder({
        success(res) {
            wx.setStorageSync('userCurrentLocation', res.result['ad_info'])
        },
        fail(res) {
            console.log(res);
        }
    })
}

export const getCurrentLocation = () => {
    // 实例化API核心类
    if (!wx.getStorageSync('userCurrentLocation')){
        initCurrentLocation()
    }
    return wx.getStorageSync('userCurrentLocation')

}



export const initProvinceAndCities = () => {
    qqmapsdk.getCityList({
        success: function (res) {//成功后的回调
            wx.setStorageSync('provinces', res.result[0])
            wx.setStorageSync('cities', res.result[1])
        },
        fail:(res) => {
            console.log(res);
        }
    })
    
}


export const getProvincesAndCitiesTree = () => {
    let allCities =  wx.getStorageSync('cities')
    //以省份的方式进行分组
    let allCitiesGroupByProvinces = []
    //初始值
    let index = 0;
    let prevItem;
    allCities.forEach(item => {
        if(allCitiesGroupByProvinces.length === 0) {
            //第一个值
            allCitiesGroupByProvinces.push([item])
        } else {
            if(item.id.slice(0, 2) === prevItem.id.slice(0, 2)) {
                allCitiesGroupByProvinces[index].push(item);
            } else {
                allCitiesGroupByProvinces.push([item])
                index++;
            }
        }
        prevItem = item;
    });
    let provinces = wx.getStorageSync('provinces')
    let tree = [];
    provinces.forEach((item, index)=> {
        item['children'] = allCitiesGroupByProvinces[index]
        tree.push(item)
    })
    return tree;
}