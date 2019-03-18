import Vue from 'vue'
import personPosition from '@/views/systemSetting/personPosition/personPosition'

describe('personPosition.vue', () => {
  it('personPosition', () => {
    const Constructor = Vue.extend(personPosition)
    const vm = new Constructor().$mount()
    expect(personPosition)
  })
})
