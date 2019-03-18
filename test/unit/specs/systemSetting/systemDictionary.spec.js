import Vue from 'vue'
import systemDictionary from '@/views/systemSetting/advancedSetting/systemDictionary/systemDictionary'

describe('systemDictionary.vue', () => {
  it('systemDictionary', () => {
    const Constructor = Vue.extend(systemDictionary)
    const vm = new Constructor().$mount()
    expect(systemDictionary)
  })
})
