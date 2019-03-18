import Vue from 'vue'
import editSystemNotice from '@/views/systemSetting/systemNotice/children/editSystemNotice'

describe('editSystemNotice.vue', () => {
  it('editSystemNotice', () => {
    const Constructor = Vue.extend(editSystemNotice)
    const vm = new Constructor().$mount()
    expect(editSystemNotice)
  })
})
