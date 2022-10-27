// pages/car-calculator/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        product: '',
        products: [],
        productLine: '',
        productLines: [],
        price: 0,
        priceList: [],
        financialPlan: '特斯拉融资租赁',
        financialPlans: ['特斯拉融资租赁', '合作机构贷款'],
        financialProduct: '标准贷款',
        financialProducts: ['标准贷款', '标准贷款（优惠利率）'],
        periods: '12个月',
        periodsOptions: ['12个月', '24个月', '36个月', '48个月', '60个月'],
        rate: 0,
        annualizedRate: '4.00',
        downPayment: 0,
        loan: 0,
        monthlyPayment: 0,
        provinces: [],
        allCities: [],
        cities: [],
        currentProvince: '',
        currentCity: '',
        financeOrgs: [],
        originProductData: [],
        currentProductImg: [],
        bankSrc: ['/images/pingan.png', '/images/pingan.png', '/images/pingan.png', '/images/pingan.png', '/images/pingan.png'],
        isCollapse: false,
        isLearnMoreShow: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.db = wx.cloud.database()

        this._loadProducts()
        this._loadProvince()
    },
    onRateInput(e) {
        this.setData({
            rate: e.detail.value
        })
        this._compute()
    },
    _compute() {
        let downPayment = this.data.price * (this.data.rate / 100)
        let loan = this.data.price - downPayment
        let monthlyPayment = (Number.parseFloat(loan) * (1 + this.data.annualizedRate / 100)) / Number(this.data.periods.slice(0, 2))

        monthlyPayment = Number.parseInt(monthlyPayment * 100) / 100
        this.setData({
            downPayment: downPayment.toLocaleString(),
            loan: loan.toLocaleString(),
            monthlyPayment: monthlyPayment.toLocaleString()
        })
    },
    _loadProvince() {
        this.db.collection('province').get().then(res => {
            const provinces = res.data
            this._loadCities().then(res2 => {
                    const allCities = res2.data
                    this._loadFinanceOrgs().then(res3 => {
                        const allFinanceOrgs = res3.data
                        this.setData({
                            provinces,
                            allCities,
                            allFinanceOrgs
                        })
                        this._changeProvince()
                    })
            })
        })
    },
    _loadCities() {
       return this.db.collection('city').get()
    },
    _loadFinanceOrgs() {
        return this.db.collection('finance_org').get()
    },
    _loadProducts() {
        this.db.collection('product').get().then(res => {
            let products = []
            const index = 0
            res.data.forEach(item => {
                products.push(item.title)
            })
            this.setData({
                originProductData: res.data,
                product: products[index],
                products
            })

            this.changeProduct(index)
        })
    },
    _changePeriods(index) {
        let periods = this.data.periodsOptions[index]

        this.setData({
            periods
        })
        this._compute()
    },
    _changeCities(cities) {
        let result = this.data.allCities.filter(item => {
            return cities.includes(item._id)
        })

        const currentCity = result[0]
        const financeOrgs = this.data.allFinanceOrgs.filter(item => {
            return currentCity['finance_orgs'].includes(item._id)
        })

        this.setData({
            cities: result,
            currentCity: result[0].name,
            financeOrgs
        })
    },
    _changeProvince(index = 0) {
        const currentProvince = this.data.provinces[index]
        this.setData({
            currentProvince:currentProvince.name
        })
        this._changeCities(currentProvince.cities)

    },

    onCityChange(e) {
        const {index,value} = e.detail
        this.setData({
            currentCity: value
        })
        const currentCity = this.data.allCities[index]
        const result = this.data.allFinanceOrgs.filter(item => {
            return currentCity['finance_orgs'].includes(item._id)
        })
        this.setData({
            financeOrgs:result
        })
    },

    onProvinceChange(e) {
        this._changeProvince(e.detail.index)
    },

    onProductSelected(e) {
        this.changeProduct(e.detail.index)
    },

    onProductLineSelected(e) {
        this.changeProductLine(e.detail.index)
    },
    onPeriodsChange(e) {
        const { index } = e.detail
        this._changePeriods(index)
    },

    changeProduct(index) {
        let currentProduct = this.data.originProductData[index]
        let productLines = []
        let priceList = []
        currentProduct.productLine.forEach(item => {
            productLines.push(item.name)
            priceList.push(item.price)
        })
        this.setData({
            productLines,
            productLine: productLines[0],
            priceList,
            price: priceList[0],
            currentProductImg: currentProduct.carPic

        })

        this._compute()

    },
    changeProductLine(index) {
        this.setData({
            productLine: this.data.productLines[index],
            price: this.data.priceList[index]
        })
    },

    readMore() {
        this.setData({ isLearnMoreShow: true })
    },
    showCard() {
        let isCollapse = this.data.isCollapse
        isCollapse = !isCollapse
        this.setData({ isCollapse })
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