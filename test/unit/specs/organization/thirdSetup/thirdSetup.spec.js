import Vue from 'vue'
import thirdSetup from '@/views/organization/thirdSetup/thirdSetup'

describe('thirdSetup.vue', () => {
  it('thirdSetup', () => {
    const Constructor = Vue.extend(thirdSetup)
    const vm = new Constructor().$mount()
    expect(thirdSetup)
  })
})
