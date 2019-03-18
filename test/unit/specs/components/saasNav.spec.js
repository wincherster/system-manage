import 'babel-polyfill'
import Vue from 'vue'
import saasNav from '@/components/saasNav'

describe('saasNav.vue', () => {
  it('saasNav', () => {
    const Constructor = Vue.extend(saasNav)
    const vm = new Constructor().$mount()
    expect(saasNav)

  })
})
