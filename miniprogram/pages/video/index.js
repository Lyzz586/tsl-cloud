// pages/video/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoSrc:'',
        title: '',
        currentCarModel: 'Model 3/Y',
        allCarModel: [],
        videoCategory: [],
        allVideoList: [],
        videosTree: [],
        showCarModelSelection: false,
        actions: [],
        isFirstProdct:true,
        videoDefalut:''
    },
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多 slot 支持
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.db = wx.cloud.database()

        this.db.collection('teaching_videos_product').get().then(res => {
            const allCarModel = res.data
            this.db.collection('teaching_videos_category').get().then(res => {
                const videoCategory = res.data
                this.db.collection('teaching_videos').get().then(res => {
                    const allVideoList = res.data
                    this.setData({
                        allCarModel,
                        currentCarModel: allCarModel[0].name,
                        videoCategory,
                        allVideoList
                    })
                    this._buildVideosTree()
                    this._initActions()
                })
            })
        })

    },

    _buildVideosTree(i = 0) {
        let videosTree = []
        if(this.data.allCarModel[i].category){
            this.data.videoCategory.forEach((item, index) => {
                videosTree.push(item)
                if (item.video)
                    item.video.forEach((id, index2) => {
                        this.data.allVideoList.find((el) => {
                            if (el._id === id) {
                                videosTree[index].video[index2] = el
                            }
                        })
                    })
            })
        if(!this.data.videoDefalut){
           let videoDefalut = videosTree[0].video[0]
           this.setData({
            videoDefalut,
            videoSrc: videoDefalut.video,
            title: videoDefalut.title,
           })
        }

        }else{
            let video =  this.data.allVideoList.filter(item => {
               return item._id === this.data.allCarModel[i].video[0]
            })
            videosTree.push({video})
        }

        this.setData({
            videosTree,
        })
    },
    changeCarModel(index) {
        //隐藏分类条
        let isFirstProdct = false
        index === 0 ? isFirstProdct=true : isFirstProdct=false 
        this.setData({
            currentCarModel: this.data.allCarModel[index].name,
            isFirstProdct
        })
    },
    _initActions() {
        let actions = []
        this.data.allCarModel.forEach(item => {
            actions.push({
                name: item.name
            })
        })
        this.setData({ actions })
    },
    onCurrentVideo(e) {
        const {video,title} =  e.currentTarget.dataset.video
        this.setData({
            videoSrc:video,
            title
        })
    },
    onCarModelTap() {
        this.setData({ showCarModelSelection: true })
    },
    onClose() {
        this.setData({ showCarModelSelection: false })
    },
    onSelect(e) {
        let index = this.data.allCarModel.findIndex(item => {
            return item.name == e.detail.name
        })
        this.changeCarModel(index)
        this._buildVideosTree(index)

    },

})