// components/tesla-input/index.js
Component({
    /**
     * 组件的属性列表
     */
    options:{
        multipleSlots:true
    },
    externalClasses: ['i-class','label-class'],
    properties: {
        required: {
            type: Boolean,
            value: false
        },
        label: {
            type: String,
            value: ''
        },
        value: {
            type: String | Number,
            value: ''
        },
        rules: {
            type: Array,
            value: [],
        },
        disabled: {
            type: Boolean,
            value: false
        },
        tips:{
            type:String,
            value:''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        isError: false,
        errorMessage: '',
    },

    /**
     * 组件的方法列表
     */
    methods: {
        oninput(e) {
                this.checkError()
                this.triggerEvent('input',e.detail)
            // 表单验证，是否为必填字段，是否为空。
        },

        checkError() {
            this.handleRequire()
            this.handleRules()
        },
        handleRequire() {
            let isError = false
            let errorMessage = ''
            if (this.properties.required) {
                const { value } = this.properties
                if (value === '') {
                    isError = true;
                    errorMessage = '请输入' + this.properties.label
                }
            }
            this.setData({ isError, errorMessage })
        },
        handleRules() {
            this.properties.rules.forEach(rule => {
                this.handleRule(rule)
            });
        },
        handleRule(rule) {
            switch (rule.type) {
                case 'email':
                    this.handleEmailRules()
                    break;
                case 'phone':
                    this.handlePhoneRules()
                    break;
            }
        },
        handleEmailRules() {
            let format = /^[A-Za-z0-9+]+[A-Za-z0-9\.\_\-+]*@([A-Za-z0-9\-]+\.)+[A-Za-z0-9]+$/;
            if (!this.properties.value.match(format)) {
                this.setData({ isError: true, errorMessage: '请正确输入电子邮件地址' })
            }
        },
        handlePhoneRules() {
            let reg = /^1[3456789]\d{9}$/;
            if (!reg.test(this.properties.value)) {
                this.setData({
                    isError: true,
                    errorMessage: '请输入正确的手机号码'
                })
            }
        },
        isReady() {
            this.checkError()
            return !this.data.isError
        },
    }
})
