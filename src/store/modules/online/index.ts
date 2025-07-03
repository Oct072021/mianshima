import { defineStore } from 'pinia'

import { OnlineState } from './data.d'

import { online } from './api'

export const useOnlineStore = defineStore('onlineStore', {
  state: (): OnlineState => ({
    onlineUser: [],
  }),
  actions: {
    getOnlineUser() {
      online().then((res) => {
        this.onlineUser = res.data
      })
    },
  },
})
