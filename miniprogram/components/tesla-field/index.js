// components/tesla-field/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        value: {
            type: String,
            value: ''
        },
        placeholder: {
            type: String,
            value: ''
        },
        required: {
            type: Boolean,
            value: false
        },
        rules: {
            type: Array,
            value: [],
        },
        type: {
            type: String,
            value: ''
        },

    },

    /**
     * 组件的初始数据
     */
    data: {
        errorMessage: '',
        error: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onBlur(e) {
            this.checkError()
            this.triggerEvent('blur', e.detail)
            // 表单验证，是否为必填字段，是否为空。
        },

        checkError() {
            this.handleRequire()
            this.handleRules()
        },
        handleRequire() {
            let error = false
            let errorMessage = ''
            if (this.properties.required) {
                const {
                    value
                } = this.properties
                if (value === '') {
                    error = true;
                    errorMessage = '必填字段'
                }
            }
            this.setData({
                error,
                errorMessage
            })
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
                this.setData({
                    error: true,
                    errorMessage: '请正确输入电子邮件地址'
                })
            }
        },
        handlePhoneRules() {
            let reg = /^1[3456789]\d{9}$/;
            if (!reg.test(this.properties.value)) {
                this.setData({
                    error: true,
                    errorMessage: '请输入正确的手机号码'
                })
            }
        },
        isReady() {
            this.checkError()
            return !this.data.error
        },

    }
})