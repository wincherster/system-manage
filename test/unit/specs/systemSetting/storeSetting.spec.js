import Vue from 'vue'
import storeSetting from '@/views/systemSetting/advancedSetting/storeSetting/storeSetting'

describe('storeSetting.vue', () => {
  it('storeSetting', () => {
    const Constructor = Vue.extend(storeSetting)
    const vm = new Constructor().$mount()
    expect(storeSetting)
  })
})
