// pages/test-drive/index.js
import { getCurrentLocation, getProvincesAndCitiesTree } from '../../utils/location.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        currentProduct: null,
        provincesAndCitiesTree: null,
        province: '',
        city: '',
        cities: null,
        currentProvinceIndex: 0,
        // currentCitiesIndex:0
    },

    getPhoneNumber(e) {
        const cloudId = e.detail.cloudID
        if(!cloudId)return 
        wx.cloud.callFunction({
          name: 'get-phone-number',
          data: {
            weRunData: wx.cloud.CloudID(cloudId),
          }
        }).then(res=>{
          this.setData({
            phone: res.result
          })
        })
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const id = options.id
        const db = wx.cloud.database()
        db.collection('product').where({ '_id': id }).get().then(res => {
            const data = res.data
            this.setData({
                currentProduct: data[0],
            })
        })

        const { city, province } = getCurrentLocation()
        const provincesAndCitiesTree = getProvincesAndCitiesTree()

        //选择器指向当前省份
        let currentProvinceIndex = 0
        provincesAndCitiesTree.forEach((item, index) => {
            if (province === item.fullname) {
                currentProvinceIndex = index
            }
        })

        //显示当前城市列表
        let cities = provincesAndCitiesTree.filter(item => {
            return item.fullname === province
        })[0].children


        this.setData({
            city: city,
            province: province,
            provincesAndCitiesTree,
            currentProvinceIndex,
            cities,
        })

    },

    bindProvinceChange: function (e) {
        const index = e.detail.value
        const currentProvincesAndCities = this.data.provincesAndCitiesTree[index]
        this.setData({
            province: currentProvincesAndCities.fullname,
            city: currentProvincesAndCities.children[0].fullname,
            cities: this.data.provincesAndCitiesTree[index].children

        })
    },
    bindCityChange: function (e) {
        const index = e.detail.value
        this.setData({
            city: this.data.cities[index].fullname
        })
    },
    //点击提交表单
    onforminput(e) {
        if (this.isError()) {
            this.handleSubmit()
        }
    },
    //向后台提交表单数据
    handleSubmit() {
        const db = wx.cloud.database()
        const { lastName, firstName, email, phone, province, city } = this.data
        const title = this.data.currentProduct._id
        //提示框
        wx.showLoading({
            title: '加载中',
        })
        db.collection('test_drive').add({
            data: {
                lastName, firstName, email, phone, province, city, title,
                status: 'TO_DO'
            }
        })
            .then(res => {
                wx.hideLoading()
                this.showSuccess()
            })

    },
    showSuccess() {
        wx.showModal({
            title: '预约成功',
            content: '感谢您提交Tesla试驾请求。我们的工作人员会及时跟您电话联系',
            showCancel: false,
            success(res) {
                wx.navigateBack({
                    delta: 0
                })
            }
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
        return count === allInput.length
    },










    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },



    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})