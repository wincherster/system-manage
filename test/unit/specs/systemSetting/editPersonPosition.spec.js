import Vue from 'vue'
import editPersonPosition from '@/views/systemSetting/personPosition/children/editPersonPosition'

describe('editPersonPosition.vue', () => {
  it('editPersonPosition', () => {
    const Constructor = Vue.extend(editPersonPosition)
    const vm = new Constructor().$mount()
    expect(editPersonPosition)
  })
})
