import Vue from 'vue'
import editCuisineMaint from '@/views/systemSetting/cuisineMaint/children/editCuisineMaint'

describe('editCuisineMaint.vue', () => {
  it('editCuisineMaint', () => {
    const Constructor = Vue.extend(editCuisineMaint)
    const vm = new Constructor().$mount()
    expect(editCuisineMaint)
  })
})
