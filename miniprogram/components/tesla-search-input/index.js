// components/tesla-serch-input/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        
    },

    /**
     * 组件的初始数据
     */
    data: {
        value:'',
        iscleared:true,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onCancel() {
            this.setData({
                value:'',
                iscleared:true
            })
            this.triggerEvent('onClear')
        },
        onInput(e) {
            let value = e.detail.value
            if(value !== '') {
                this.setData({
                    iscleared:false,
                    value
                })
            }else{
                this.setData({
                    iscleared:true
                })
            }
            this.triggerEvent('search',value)
        }
    }
})
