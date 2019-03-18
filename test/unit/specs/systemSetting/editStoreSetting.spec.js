import Vue from 'vue'
import editStoreSetting from '@/views/systemSetting/advancedSetting/storeSetting/children/editStoreSetting'

describe('editStoreSetting.vue', () => {
  it('editStoreSetting', () => {
    const Constructor = Vue.extend(editStoreSetting)
    const vm = new Constructor().$mount()
    expect(editStoreSetting)
  })
})
