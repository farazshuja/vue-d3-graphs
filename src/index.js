import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { sentenceCase } from 'change-case'

Vue.filter('sentenceCase', function (value) {
  if (!value) return ''
  return sentenceCase(value)
})

/* eslint-disable no-new */
new Vue(Object.assign({
  el: '#app',
  store
}, App))
