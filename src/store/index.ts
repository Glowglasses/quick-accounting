import Vue from 'vue'
import Vuex from 'vuex'
import {RecordItem, State, Tag} from '@/custom';
import {getRecordListHash} from '@/lib/getRecordListHash';
Vue.use(Vuex)
const state: State = {
  chartPayOrIncome: "支出",
  chartOrderByTime: "周",
  currentMonth: "",
  selectedTagIds: [],
  payOrIncome: "pay",
  isAdd: "no",
  isEdit: false,
  tagList: [],
  recordList: [],
  recordListHash: [],
  currentRecord: {tags:[],notes:"",amount:"",createdAt:"",type:""}
}
const store =  new Vuex.Store({
  state,
  mutations: {
    fetchTags(state): void{
      state.tagList = JSON.parse(window.localStorage.getItem("tagList") || "[]")
    },
    saveTag(state,payload: Tag): void{
      state.tagList.push(payload)
      window.localStorage.setItem("tagList",JSON.stringify(state.tagList))
      store.commit("fetchTags")
    },
    updateTag(state,payload: Tag): void{
      const index = state.tagList.findIndex(item => item.id === payload.id)
      if (index !== -1){
        state.tagList.splice(index,1,payload)
        window.localStorage.setItem("tagList",JSON.stringify(state.tagList))
      }
    },
    removeTag(state, payload: string){
      if (payload !== ""){
        window.localStorage.setItem("tagList",JSON.stringify(state.tagList.filter((item: Tag) => item.id !== payload)))
        store.commit("fetchTags")
      }
    },
    fetchRecordList(state){
      state.recordList = JSON.parse(window.localStorage.getItem("recordList") || '[]')
      store.commit("getRecordListHash")
    },
    saveRecord(state,payload: RecordItem){
      if (payload !== undefined){
        state.recordList.push(payload)
      }
      window.localStorage.setItem("recordList",JSON.stringify(state.recordList))
      store.commit("fetchRecordList")
      state.selectedTagIds = []
      store.commit("getRecordListHash")
    },
    getRecordListHash(state){
      if (state.recordList !== null){
        state.recordListHash = getRecordListHash(state.recordList)
      }
    },
    removeRecord(state,record: RecordItem){
      store.commit("fetchRecordList")
      const index = state.recordList.findIndex((item: RecordItem) =>
        item.createdAt === record.createdAt
      )
      state.recordList.splice(index,1)
      store.commit('saveRecord')
    },
    updateRecord(state,record: RecordItem){
      const currentRecord = JSON.parse(window.localStorage.getItem("currentRecord") || "")
      store.commit("fetchRecordList")
      const index = state.recordList.findIndex((item: RecordItem) =>
        item.createdAt === currentRecord.createdAt
      )
      state.recordList.splice(index,1,record)
      store.commit('saveRecord')
    },
    getCurrentRecord(state) {
      state.currentRecord = JSON.parse(window.localStorage.getItem("currentRecord") || "")
    }

  },
  actions: {
  },
  modules: {
  }
})

export default store