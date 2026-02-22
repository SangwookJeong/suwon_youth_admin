import { defineStore } from 'pinia'
import axios from '@axios'

export const useAttendanceStore = defineStore('AttendanceStore', {
  actions: {
    // 👉 임원 출결 조회
    fetchOfficerAttendance(date, type) {
      return axios.get('/apps/attendance/officer', { params: { date, type } })
    },

    // 👉 임원 출결 저장
    saveOfficerAttendance(date, type, attendees) {
      return axios.post('/apps/attendance/officer', { date, type, attendees })
    },

    // 👉 임원 출결 이력 조회
    fetchOfficerHistory(type) {
      return axios.get('/apps/attendance/officer/history', { params: { type } })
    },

    // 👉 청년회전체 출결 조회
    fetchAllAttendance(date, type) {
      return axios.get('/apps/attendance/all', { params: { date, type } })
    },

    // 👉 청년회전체 출결 저장
    saveAllAttendance(date, type, attendees) {
      return axios.post('/apps/attendance/all', { date, type, attendees })
    },

    // 👉 청년회전체 출결 이력 조회
    fetchAllHistory(type) {
      return axios.get('/apps/attendance/all/history', { params: { type } })
    },
  },
})
