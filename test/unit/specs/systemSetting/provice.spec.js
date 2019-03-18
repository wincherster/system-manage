import Vue from 'vue'
import provice from '@/views/systemSetting/advancedSetting/provice/provice'

describe('provice.vue', () => {
  it('provice', () => {
    const Constructor = Vue.extend(provice)
    const vm = new Constructor().$mount()
    expect(provice)
  })
})
