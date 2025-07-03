import { defineStore } from 'pinia'
import { TagsViewState, TagsView } from './data.d'

export const useTabsStore = defineStore('tabsStore', {
  state: (): TagsViewState => ({
    visitedViews: [],
    cachedViews: [],
  }),
  actions: {
    addView(view: TagsView) {
      if (this.visitedViews.some((value) => value.path === view.path)) {
        return
      }
      this.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta?.title || 'unknown',
        })
      )
    },
    addCachedView(view: TagsView) {
      if (this.cachedViews.includes(view.name as string)) {
        return
      }

      if (view.meta?.cache) {
        this.cachedViews.push(view.name as string)
      }
    },
    delView(view: TagsView) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1)
          break
        }
      }

      this.delCachedView(view).then()
    },
    delCachedView(view: TagsView) {
      return new Promise((resolve) => {
        const index = this.cachedViews.indexOf(view.name as string)
        if (index > -1) {
          this.cachedViews.splice(index, 1)
        }
        resolve([...this.cachedViews])
      })
    },
    delOthersViews(view: TagsView) {
      this.visitedViews = this.visitedViews.filter((v) => {
        return v.meta?.affix || v.path === view.path
      })

      const index = this.cachedViews.indexOf(view.name as string)
      if (index > -1) {
        this.cachedViews = this.cachedViews.slice(index, index + 1)
      } else {
        this.cachedViews = []
      }
    },
    delAllViews() {
      this.visitedViews = this.visitedViews.filter((tab) => tab.meta?.affix)
      this.cachedViews = []
    },
  },
})
