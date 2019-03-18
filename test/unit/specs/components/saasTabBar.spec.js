import 'babel-polyfill'
import Vue from 'vue'
import saasTabBar from '@/components/saasTabBar'

describe('saasTabBar.vue', () => {
  it('saasTabBar', () => {
    const Constructor = Vue.extend(saasTabBar)
    const vm = new Constructor().$mount()
    expect(saasTabBar)

  })
})
