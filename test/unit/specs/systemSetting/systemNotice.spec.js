import Vue from 'vue'
import systemNotice from '@/views/systemSetting/systemNotice/systemNotice'

describe('systemNotice.vue', () => {
  it('systemNotice', () => {
    const Constructor = Vue.extend(systemNotice)
    const vm = new Constructor().$mount()
    expect(systemNotice)
  })
})
