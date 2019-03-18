import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/views/home/index.vue'
Vue.use(VueRouter)
const systemNews = () => import('@/views/news/systemNews/systemNews.vue')
const systemNewsDetail = () => import('@/views/news/systemNews/systemNewsDetail.vue')
const brandManage = () => import('@/views/organization/brandManage/brandManage.vue')
const legalManage = () => import('@/views/organization/legalManage/legalManage.vue')
const editLegalManage = () => import('@/views/organization/legalManage/children/editLegalManage.vue')
const organizaManage = () => import('@/views/organization/organizaManage/organizaManage.vue')
const editStore = () => import('@/views/organization/organizaManage/children/store/editStore.vue')
const storeDetails = () => import('@/views/organization/organizaManage/children/store/storeDetails.vue')
const priceManage = () => import('@/views/organization/priceManage/priceManage.vue')
const thirdSetup = () => import('@/views/organization/thirdSetup/thirdSetup.vue')
const personManage = () => import('@/views/permission/personManage/personManage.vue')
const personDetails = () => import('@/views/permission/personManage/children/personDetails.vue')
const editPersonManage = () => import('@/views/permission/personManage/children/editPersonManage.vue')
const roleManage = () => import('@/views/permission/roleManage/roleManage.vue')
const assignPermissions = () => import('@/views/permission/roleManage/children/assignPermissions.vue')
const cuisineMaint = () => import('@/views/systemSetting/cuisineMaint/cuisineMaint.vue')
const personPosition = () => import('@/views/systemSetting/personPosition/personPosition.vue')
const systemNotice = () => import('@/views/systemSetting/systemNotice/systemNotice.vue')
const systemNoticeDetail = () => import('@/views/systemSetting/systemNotice/children/systemNoticeDetail.vue')
const editSystemNotice = () => import('@/views/systemSetting/systemNotice/children/editSystemNotice.vue')
const codeRoleSetting = () => import('@/views/systemSetting/advancedSetting/codeRoleSetting/codeRoleSetting.vue')
const provice = () => import('@/views/systemSetting/advancedSetting/provice/provice.vue')
const storeSetting = () => import('@/views/systemSetting/advancedSetting/storeSetting/storeSetting.vue')
const systemDictionary = () => import('@/views/systemSetting/advancedSetting/systemDictionary/systemDictionary.vue')
const timeTask = () => import('@/views/systemSetting/advancedSetting/timeTask/timeTask.vue')
export default new VueRouter({
  mode: 'history',
  routes: [
    {path: '/', redirect: {name: 'index'}},
    {name: 'index', path: '/index', component: Index},
    {name: 'systemNews', path: '/systemNews', component: systemNews},
    {name: 'systemNewsDetail', path: '/systemNewsDetail', component: systemNewsDetail},
    {name: 'brandManage', path: '/brandManage', component: brandManage},
    {name: 'legalManage', path: '/legalManage', component: legalManage},
    {name: 'editLegalManage', path: '/editLegalManage', component: editLegalManage},
    {name: 'organizaManage', path: '/organizaManage', component: organizaManage},
    {name: 'editStore', path: '/editStore', component: editStore},
    {name: 'storeDetails', path: '/storeDetails', component: storeDetails},
    {name: 'priceManage', path: '/priceManage', component: priceManage},
    {name: 'thirdSetup', path: '/thirdSetup', component: thirdSetup},
    {name: 'personManage', path: '/personManage', component: personManage},
    {name: 'personDetails', path: '/personDetails', component: personDetails},
    {name: 'editPersonManage', path: '/editPersonManage', component: editPersonManage},
    {name: 'roleManage', path: '/roleManage', component: roleManage},
    {name: 'assignPermissions', path: '/assignPermissions', component: assignPermissions},
    {name: 'cuisineMaint', path: '/cuisineMaint', component: cuisineMaint},
    {name: 'personPosition', path: '/personPosition', component: personPosition},
    {name: 'systemNotice', path: '/systemNotice', component: systemNotice},
    {name: 'systemNoticeDetail', path: '/systemNoticeDetail', component: systemNoticeDetail},
    {name: 'editSystemNotice', path: '/editSystemNotice', component: editSystemNotice},
    {name: 'codeRoleSetting', path: '/codeRoleSetting', component: codeRoleSetting},
    {name: 'provice', path: '/provice', component: provice},
    {name: 'storeSetting', path: '/storeSetting', component: storeSetting},
    {name: 'systemDictionary', path: '/systemDictionary', component: systemDictionary},
    {name: 'timeTask', path: '/timeTask', component: timeTask}
  ]
})
