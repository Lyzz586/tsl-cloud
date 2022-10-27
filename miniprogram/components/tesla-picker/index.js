// components/tesla-picker/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // externalClasses: ['picker'],
        title:{
            type:String,
            value:''
        },
        labelKey:{
            type:String,
            value:''
        },
        options:{
            type:Array,
            value:[],
            observer(value) {
               this.buildOptionList()
            }
        },
        defaultValue:{
            type:String||Number,
            value:'',
            observer(newValue,oldValue) {
                this.initValue(newValue);
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        value:'',
        index:0,
        optionList:[]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        buildOptionList() {
            const labelKey = this.properties.labelKey
            let optionList = []
            labelKey?
                this.properties.options.forEach(item => {
                    optionList.push(item[labelKey])
                }) : optionList = this.properties.options

                const index = optionList.indexOf(this.properties.value)

                this.setData({
                    optionList,
                    index
                })

        },
        change(e) {
            let index = e.detail.value
            let value = this.properties.optionList[index]
            this.setData({value})
            this.triggerEvent('change',{value,index})
        },
        initValue(value) {
            let index = this.properties.optionList.indexOf(value)
            this.setData({value,index})
        }
    }
})
