import 'babel-polyfill'
import Vue from 'vue'
import fullscreen from '@/components/fullscreen'

describe('fullscreen.vue', () => {
  it('fullscreen', () => {
    const Constructor = Vue.extend(fullscreen)
    const vm = new Constructor().$mount()
    expect(fullscreen)

  })
})
