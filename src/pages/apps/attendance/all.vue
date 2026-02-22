<script setup>
import { useAttendanceStore } from '@/views/apps/attendance/useAttendanceStore'
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import { avatarText } from '@core/utils/formatters'

const attendanceStore = useAttendanceStore()
const userListStore = useUserListStore()

// 👉 예배/모임 유형
const meetingTypes = ['수요말씀', '토요교제', '주일말씀']
const selectedType = ref('주일말씀')

// 👉 날짜 선택 (오늘 기본)
const today = new Date().toISOString().slice(0, 10)
const selectedDate = ref(today)

// 👉 전체 성도 목록 & 출석
const members = ref([])
const attendees = ref([])
const isSaving = ref(false)
const saveMessage = ref('')
const searchQuery = ref('')

// 👉 출결 이력
const history = ref([])

// 👉 성도 목록 로드
const loadMembers = async () => {
  const response = await userListStore.fetchUsers({ perPage: 200, currentPage: 1 })

  members.value = response.data.users
}

// 👉 해당 날짜+유형 출결 데이터 로드
const loadAttendance = async () => {
  const response = await attendanceStore.fetchAllAttendance(selectedDate.value, selectedType.value)

  attendees.value = [...response.data.attendees]
}

// 👉 출결 이력 로드
const loadHistory = async () => {
  const response = await attendanceStore.fetchAllHistory(selectedType.value)

  history.value = response.data
}

// 👉 날짜 또는 유형 변경 시 재로드
watch([selectedDate, selectedType], async () => {
  await loadAttendance()
  await loadHistory()
})

// 👉 초기 로드
onMounted(async () => {
  await loadMembers()
  await loadAttendance()
  await loadHistory()
})

// 👉 출석 토글
const toggleAttendance = id => {
  const idx = attendees.value.indexOf(id)

  if (idx >= 0)
    attendees.value.splice(idx, 1)
  else
    attendees.value.push(id)
}

const isPresent = id => attendees.value.includes(id)

// 👉 전체 선택/해제
const selectAll = () => {
  attendees.value = filteredMembers.value.map(m => m.id)
}

const clearAll = () => {
  attendees.value = []
}

// 👉 저장
const saveAttendance = async () => {
  isSaving.value = true
  saveMessage.value = ''
  try {
    await attendanceStore.saveAllAttendance(selectedDate.value, selectedType.value, [...attendees.value])
    await loadHistory()
    saveMessage.value = '저장되었습니다.'
  } catch (e) {
    saveMessage.value = '저장에 실패했습니다.'
  } finally {
    isSaving.value = false
    setTimeout(() => { saveMessage.value = '' }, 3000)
  }
}

// 👉 검색 필터
const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value

  const q = searchQuery.value.toLowerCase()

  return members.value.filter(m =>
    m.fullName.toLowerCase().includes(q) || m.contact.includes(q),
  )
})

// 👉 전체 통계
const stats = computed(() => {
  const total = members.value.length
  const present = attendees.value.length
  const absent = total - present
  const rate = total > 0 ? Math.round((present / total) * 100) : 0

  return { total, present, absent, rate }
})

// 👉 부서별 통계
const deptStats = computed(() => {
  const depts = ['믿음부', '소망부', '사랑부', '은혜부']

  return depts.map(dept => {
    const deptMembers = members.value.filter(m => m.currentDepartment === dept)
    const deptPresent = deptMembers.filter(m => attendees.value.includes(m.id))
    const rate = deptMembers.length > 0 ? Math.round((deptPresent.length / deptMembers.length) * 100) : 0

    return {
      dept,
      total: deptMembers.length,
      present: deptPresent.length,
      rate,
    }
  }).filter(d => d.total > 0)
})

// 👉 이번달 통계
const monthlyStats = computed(() => {
  const now = new Date(selectedDate.value)
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthRecords = history.value.filter(r => r.date.startsWith(ym))

  if (!monthRecords.length) return null

  const total = members.value.length
  const avgRate = total > 0
    ? Math.round(monthRecords.reduce((sum, r) => sum + r.attendees.length, 0) / monthRecords.length / total * 100)
    : 0

  return {
    count: monthRecords.length,
    avgRate,
    records: monthRecords,
  }
})

// 👉 부서별 색상
const resolveDeptColor = dept => {
  if (dept === '믿음부') return 'primary'
  if (dept === '소망부') return 'info'
  if (dept === '사랑부') return 'success'
  if (dept === '은혜부') return 'warning'

  return 'secondary'
}
</script>

<template>
  <section>
    <!-- 👉 헤더: 날짜 + 예배 유형 -->
    <VCard class="mb-6">
      <VCardText>
        <VRow align="center">
          <VCol
            cols="12"
            sm="4"
          >
            <VTextField
              v-model="selectedDate"
              label="날짜 선택"
              type="date"
              prepend-inner-icon="mdi-calendar"
              density="compact"
            />
          </VCol>

          <VCol
            cols="12"
            sm="8"
          >
            <div class="d-flex gap-2 flex-wrap">
              <VBtn
                v-for="type in meetingTypes"
                :key="type"
                :variant="selectedType === type ? 'elevated' : 'tonal'"
                :color="selectedType === type ? 'primary' : 'default'"
                @click="selectedType = type"
              >
                {{ type }}
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- 👉 통계 카드 -->
    <VRow class="mb-6">
      <VCol
        cols="6"
        sm="3"
      >
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar
              color="primary"
              variant="tonal"
              rounded
              size="42"
            >
              <VIcon icon="mdi-account-group" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">
                전체 성도
              </div>
              <div class="text-h6 font-weight-bold">
                {{ stats.total }}명
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="6"
        sm="3"
      >
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar
              color="success"
              variant="tonal"
              rounded
              size="42"
            >
              <VIcon icon="mdi-check-circle" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">
                출석
              </div>
              <div class="text-h6 font-weight-bold">
                {{ stats.present }}명
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="6"
        sm="3"
      >
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar
              color="error"
              variant="tonal"
              rounded
              size="42"
            >
              <VIcon icon="mdi-close-circle" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">
                결석
              </div>
              <div class="text-h6 font-weight-bold">
                {{ stats.absent }}명
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="6"
        sm="3"
      >
        <VCard>
          <VCardText class="d-flex align-center gap-3">
            <VAvatar
              color="warning"
              variant="tonal"
              rounded
              size="42"
            >
              <VIcon icon="mdi-percent" />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">
                출석률
              </div>
              <div class="text-h6 font-weight-bold">
                {{ stats.rate }}%
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 👉 부서별 출석 현황 -->
    <VCard class="mb-6">
      <VCardItem>
        <VCardTitle>부서별 출석 현황</VCardTitle>
      </VCardItem>
      <VCardText>
        <VRow>
          <VCol
            v-for="dept in deptStats"
            :key="dept.dept"
            cols="6"
            sm="3"
          >
            <div class="mb-1 d-flex justify-space-between">
              <span class="text-sm font-weight-medium">{{ dept.dept }}</span>
              <span class="text-sm text-medium-emphasis">{{ dept.present }}/{{ dept.total }}명 ({{ dept.rate }}%)</span>
            </div>
            <VProgressLinear
              :model-value="dept.rate"
              :color="resolveDeptColor(dept.dept)"
              height="8"
              rounded
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- 👉 출결 체크 테이블 -->
    <VCard class="mb-6">
      <VCardText class="d-flex align-center justify-space-between flex-wrap gap-3">
        <div>
          <span class="text-h6">출결 체크</span>
          <span class="text-caption text-medium-emphasis ms-2">{{ selectedDate }} / {{ selectedType }}</span>
        </div>

        <div class="d-flex align-center gap-2 flex-wrap">
          <VTextField
            v-model="searchQuery"
            placeholder="이름, 연락처 검색"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            style="min-width: 180px;"
            hide-details
          />
          <VBtn
            variant="tonal"
            size="small"
            color="success"
            @click="selectAll"
          >
            전체출석
          </VBtn>
          <VBtn
            variant="tonal"
            size="small"
            color="secondary"
            @click="clearAll"
          >
            전체해제
          </VBtn>
          <VBtn
            color="primary"
            :loading="isSaving"
            prepend-icon="mdi-content-save"
            @click="saveAttendance"
          >
            저장
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th scope="col">출석</th>
            <th scope="col">이름</th>
            <th scope="col">부서</th>
            <th scope="col">연락처</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="member in filteredMembers"
            :key="member.id"
            :class="{ 'bg-light-success': isPresent(member.id) }"
            style="cursor: pointer;"
            @click="toggleAttendance(member.id)"
          >
            <td>
              <VCheckbox
                :model-value="isPresent(member.id)"
                color="success"
                @click.stop="toggleAttendance(member.id)"
              />
            </td>
            <td>
              <div class="d-flex align-center gap-2">
                <VAvatar
                  variant="tonal"
                  :color="resolveDeptColor(member.currentDepartment)"
                  size="32"
                >
                  <VImg
                    v-if="member.avatar"
                    :src="member.avatar"
                  />
                  <span
                    v-else
                    class="text-xs"
                  >{{ avatarText(member.fullName) }}</span>
                </VAvatar>
                <div>
                  <div class="font-weight-medium text-sm">
                    {{ member.fullName }}
                  </div>
                  <div class="text-xs text-medium-emphasis">
                    {{ member.bs === 'B' ? '형제' : '자매' }} · {{ member.currentDepartment }}
                  </div>
                </div>
              </div>
            </td>
            <td>
              <VChip
                :color="resolveDeptColor(member.currentDepartment)"
                size="small"
              >
                {{ member.currentDepartment }}
              </VChip>
            </td>
            <td class="text-medium-emphasis">
              {{ member.contact }}
            </td>
          </tr>
        </tbody>
        <tfoot v-show="!filteredMembers.length">
          <tr>
            <td
              colspan="4"
              class="text-center py-4"
            >
              검색 결과가 없습니다
            </td>
          </tr>
        </tfoot>
      </VTable>

      <!-- 저장 메시지 -->
      <VCardText v-if="saveMessage">
        <VAlert
          :type="saveMessage.includes('실패') ? 'error' : 'success'"
          variant="tonal"
          density="compact"
        >
          {{ saveMessage }}
        </VAlert>
      </VCardText>
    </VCard>

    <!-- 👉 이번달 통계 -->
    <VCard v-if="monthlyStats">
      <VCardItem>
        <VCardTitle>이번달 출결 통계 ({{ selectedType }})</VCardTitle>
        <template #append>
          <VChip
            color="primary"
            variant="tonal"
          >
            평균 출석률 {{ monthlyStats.avgRate }}%
          </VChip>
        </template>
      </VCardItem>

      <VCardText>
        <VTable density="compact">
          <thead>
            <tr>
              <th>날짜</th>
              <th>출석</th>
              <th>전체</th>
              <th>출석률</th>
              <th>현황</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in monthlyStats.records"
              :key="record.date"
            >
              <td>{{ record.date }}</td>
              <td>{{ record.attendees.length }}명</td>
              <td>{{ stats.total }}명</td>
              <td>{{ stats.total > 0 ? Math.round(record.attendees.length / stats.total * 100) : 0 }}%</td>
              <td>
                <VProgressLinear
                  :model-value="stats.total > 0 ? Math.round(record.attendees.length / stats.total * 100) : 0"
                  color="primary"
                  height="6"
                  rounded
                  style="min-width: 80px;"
                />
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss" scoped>
.bg-light-success {
  background-color: rgba(var(--v-theme-success), 0.06) !important;
}
</style>
