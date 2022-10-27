export default {
get storage() {
    return {
      set: (key, value = '') => {
        if (key) {
          return wx.setStorageSync(key, value)
        }
      },
      get: (key) => {
        return wx.getStorageSync(key)
      }
    }
  }
}