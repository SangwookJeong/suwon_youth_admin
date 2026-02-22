import mock from '@/@fake-db/mock'

// 임원 역할 (admin, manager, leader)
export const officerRoles = ['admin', 'manager', 'leader']

// 임원 출결 기록 (오전임원모임, 전체임원모임)
// 임원 IDs: 1,2(admin), 3,8,10,15,17,28,29,33,37,38,43,46,48(manager), 19,21,24,25,26,31(leader) = 21명
let officerRecords = [
  // 1월 오전임원모임 (매주 일요일 오전)
  { id: 1, date: '2026-01-04', type: '오전임원모임', attendees: [1, 3, 8, 15, 19, 21, 25, 28, 33, 43, 48] },
  { id: 2, date: '2026-01-11', type: '오전임원모임', attendees: [1, 2, 3, 8, 17, 19, 21, 24, 26, 29, 31, 37, 46] },
  { id: 3, date: '2026-01-18', type: '오전임원모임', attendees: [1, 3, 8, 10, 15, 19, 21, 25, 28, 33, 38, 48] },
  { id: 4, date: '2026-01-25', type: '오전임원모임', attendees: [1, 2, 3, 17, 19, 21, 24, 26, 31, 37, 43, 46] },
  // 2월 오전임원모임
  { id: 5, date: '2026-02-01', type: '오전임원모임', attendees: [1, 3, 8, 15, 19, 21, 25, 28, 31, 33, 48] },
  { id: 6, date: '2026-02-08', type: '오전임원모임', attendees: [1, 2, 3, 8, 17, 19, 21, 24, 26, 29, 37, 43, 46] },
  { id: 7, date: '2026-02-15', type: '오전임원모임', attendees: [1, 3, 8, 10, 15, 17, 19, 21, 28, 33, 38] },

  // 1월 전체임원모임 (격주 일요일)
  { id: 8, date: '2026-01-11', type: '전체임원모임', attendees: [1, 2, 3, 8, 10, 15, 17, 19, 21, 24, 25, 26, 29, 31, 33, 38, 46, 48] },
  { id: 9, date: '2026-01-25', type: '전체임원모임', attendees: [1, 2, 3, 8, 17, 19, 21, 24, 26, 28, 29, 31, 37, 38, 43, 46] },
  // 2월 전체임원모임
  { id: 10, date: '2026-02-08', type: '전체임원모임', attendees: [1, 2, 3, 8, 10, 15, 17, 19, 21, 24, 25, 26, 29, 31, 33, 43, 46, 48] },
]

// 청년회 전체 출결 기록 (수요말씀, 토요교제, 주일말씀)
let allRecords = [
  // 1월 수요말씀
  { id: 1, date: '2026-01-07', type: '수요말씀', attendees: [1, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 21, 24, 25, 28, 29, 31, 33, 37, 38, 40, 43, 46, 48, 50] },
  { id: 2, date: '2026-01-14', type: '수요말씀', attendees: [1, 3, 4, 6, 8, 9, 11, 14, 16, 17, 19, 21, 22, 25, 26, 28, 30, 32, 34, 37, 39, 41, 44, 46, 48] },
  { id: 3, date: '2026-01-21', type: '수요말씀', attendees: [2, 3, 5, 7, 10, 12, 13, 15, 17, 19, 20, 21, 23, 24, 26, 27, 29, 31, 33, 35, 38, 40, 42, 45, 47, 49] },
  { id: 4, date: '2026-01-28', type: '수요말씀', attendees: [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47] },
  // 2월 수요말씀
  { id: 5, date: '2026-02-04', type: '수요말씀', attendees: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49] },
  { id: 6, date: '2026-02-11', type: '수요말씀', attendees: [2, 4, 6, 8, 10, 12, 14, 16, 18, 19, 20, 21, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50] },
  { id: 7, date: '2026-02-18', type: '수요말씀', attendees: [1, 2, 3, 5, 7, 9, 11, 14, 16, 17, 19, 21, 24, 25, 27, 29, 31, 33, 37, 38, 40, 43, 46, 48] },

  // 1월 토요교제
  { id: 8, date: '2026-01-10', type: '토요교제', attendees: [1, 2, 4, 6, 8, 10, 12, 14, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 40, 42, 44, 46, 48, 50] },
  { id: 9, date: '2026-01-17', type: '토요교제', attendees: [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 43, 45, 47, 49] },
  { id: 10, date: '2026-01-24', type: '토요교제', attendees: [1, 2, 3, 5, 8, 10, 12, 15, 17, 19, 21, 24, 26, 28, 31, 33, 35, 37, 40, 42, 44, 46, 48] },
  { id: 11, date: '2026-01-31', type: '토요교제', attendees: [2, 4, 6, 9, 11, 14, 16, 18, 19, 21, 23, 25, 27, 29, 32, 34, 36, 38, 41, 43, 45, 47, 49] },
  // 2월 토요교제
  { id: 12, date: '2026-02-07', type: '토요교제', attendees: [1, 3, 5, 7, 10, 12, 15, 17, 19, 21, 24, 26, 28, 31, 33, 35, 37, 39, 42, 44, 46, 48, 50] },
  { id: 13, date: '2026-02-14', type: '토요교제', attendees: [2, 4, 6, 8, 11, 13, 16, 19, 20, 21, 23, 25, 27, 29, 32, 34, 36, 38, 40, 43, 45, 47, 49] },
  { id: 14, date: '2026-02-21', type: '토요교제', attendees: [1, 2, 3, 5, 7, 9, 12, 15, 17, 19, 21, 24, 26, 29, 31, 33, 37, 40, 43, 46, 48] },

  // 1월 주일말씀
  { id: 15, date: '2026-01-04', type: '주일말씀', attendees: [1, 2, 3, 4, 5, 7, 8, 10, 12, 14, 15, 17, 18, 19, 21, 23, 24, 25, 27, 28, 29, 31, 33, 35, 37, 38, 40, 42, 43, 45, 46, 48, 50] },
  { id: 16, date: '2026-01-11', type: '주일말씀', attendees: [1, 2, 3, 5, 6, 8, 9, 11, 13, 15, 17, 19, 20, 21, 22, 24, 26, 28, 29, 31, 33, 34, 37, 39, 40, 43, 44, 46, 47, 48, 50] },
  { id: 17, date: '2026-01-18', type: '주일말씀', attendees: [1, 3, 4, 5, 7, 9, 10, 12, 14, 16, 17, 19, 21, 23, 25, 26, 27, 29, 31, 32, 33, 35, 37, 38, 40, 41, 43, 45, 46, 48, 49, 50] },
  { id: 18, date: '2026-01-25', type: '주일말씀', attendees: [1, 2, 3, 4, 6, 8, 10, 12, 14, 17, 18, 19, 20, 21, 24, 25, 26, 28, 29, 31, 33, 36, 37, 38, 40, 43, 46, 47, 48, 50] },
  // 2월 주일말씀
  { id: 19, date: '2026-02-01', type: '주일말씀', attendees: [1, 2, 3, 5, 7, 8, 10, 12, 15, 17, 19, 21, 23, 25, 26, 28, 31, 33, 35, 37, 38, 40, 43, 44, 46, 48, 49, 50] },
  { id: 20, date: '2026-02-08', type: '주일말씀', attendees: [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 17, 19, 21, 22, 24, 25, 26, 28, 29, 31, 33, 37, 38, 40, 42, 43, 45, 46, 48, 50] },
  { id: 21, date: '2026-02-15', type: '주일말씀', attendees: [1, 3, 5, 7, 9, 11, 14, 15, 17, 19, 21, 23, 24, 26, 28, 31, 33, 34, 37, 39, 40, 43, 46, 47, 48, 50] },
]

// 👉 임원 출결 조회
mock.onGet('/apps/attendance/officer').reply(config => {
  const { date, type } = config.params ?? {}
  const record = officerRecords.find(r => r.date === date && r.type === type)

  return [200, { attendees: record?.attendees ?? [] }]
})

// 👉 임원 출결 저장
mock.onPost('/apps/attendance/officer').reply(config => {
  const { date, type, attendees } = JSON.parse(config.data)
  const idx = officerRecords.findIndex(r => r.date === date && r.type === type)

  if (idx >= 0) {
    officerRecords[idx].attendees = attendees
  } else {
    officerRecords.push({ id: officerRecords.length + 1, date, type, attendees })
  }

  return [200, { success: true }]
})

// 👉 임원 출결 이력 조회
mock.onGet('/apps/attendance/officer/history').reply(config => {
  const { type } = config.params ?? {}
  let filtered = type ? officerRecords.filter(r => r.type === type) : officerRecords

  filtered = filtered.sort((a, b) => b.date.localeCompare(a.date))

  return [200, filtered]
})

// 👉 청년회전체 출결 조회
mock.onGet('/apps/attendance/all').reply(config => {
  const { date, type } = config.params ?? {}
  const record = allRecords.find(r => r.date === date && r.type === type)

  return [200, { attendees: record?.attendees ?? [] }]
})

// 👉 청년회전체 출결 저장
mock.onPost('/apps/attendance/all').reply(config => {
  const { date, type, attendees } = JSON.parse(config.data)
  const idx = allRecords.findIndex(r => r.date === date && r.type === type)

  if (idx >= 0) {
    allRecords[idx].attendees = attendees
  } else {
    allRecords.push({ id: allRecords.length + 1, date, type, attendees })
  }

  return [200, { success: true }]
})

// 👉 청년회전체 출결 이력 조회
mock.onGet('/apps/attendance/all/history').reply(config => {
  const { type } = config.params ?? {}
  let filtered = type ? allRecords.filter(r => r.type === type) : allRecords

  filtered = filtered.sort((a, b) => b.date.localeCompare(a.date))

  return [200, filtered]
})
