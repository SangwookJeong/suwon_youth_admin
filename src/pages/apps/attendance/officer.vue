<script setup>
import { useAttendanceStore } from '@/views/apps/attendance/useAttendanceStore'
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import { avatarText } from '@core/utils/formatters'

const attendanceStore = useAttendanceStore()
const userListStore = useUserListStore()

// 👉 임원 역할
const officerRoles = ['admin', 'manager', 'leader']

// 👉 모임 유형
const meetingTypes = ['오전임원모임', '전체임원모임']
const selectedType = ref('오전임원모임')

// 👉 날짜 선택 (오늘 기본)
const today = new Date().toISOString().slice(0, 10)
const selectedDate = ref(today)

// 👉 임원 목록 & 출석 체크
const officers = ref([])
const attendees = ref([])
const isSaving = ref(false)
const saveMessage = ref('')

// 👉 출결 이력 (통계용)
const history = ref([])

// 👉 임원 목록 로드
const loadOfficers = async () => {
  const response = await userListStore.fetchUsers({ perPage: 200, currentPage: 1 })

  officers.value = response.data.users.filter(u => officerRoles.includes(u.role))
}

// 👉 해당 날짜+유형 출결 데이터 로드
const loadAttendance = async () => {
  const response = await attendanceStore.fetchOfficerAttendance(selectedDate.value, selectedType.value)

  attendees.value = [...response.data.attendees]
}

// 👉 출결 이력 로드
const loadHistory = async () => {
  const response = await attendanceStore.fetchOfficerHistory(selectedType.value)

  history.value = response.data
}

// 👉 날짜 또는 유형 변경 시 데이터 재로드
watch([selectedDate, selectedType], async () => {
  await loadAttendance()
  await loadHistory()
})

// 👉 초기 로드
onMounted(async () => {
  await loadOfficers()
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
  attendees.value = officers.value.map(o => o.id)
}

const clearAll = () => {
  attendees.value = []
}

// 👉 저장
const saveAttendance = async () => {
  isSaving.value = true
  saveMessage.value = ''
  try {
    await attendanceStore.saveOfficerAttendance(selectedDate.value, selectedType.value, [...attendees.value])
    await loadHistory()
    saveMessage.value = '저장되었습니다.'
  } catch (e) {
    saveMessage.value = '저장에 실패했습니다.'
  } finally {
    isSaving.value = false
    setTimeout(() => { saveMessage.value = '' }, 3000)
  }
}

// 👉 통계 계산
const stats = computed(() => {
  const total = officers.value.length
  const present = attendees.value.length
  const absent = total - present
  const rate = total > 0 ? Math.round((present / total) * 100) : 0

  return { total, present, absent, rate }
})

// 👉 이번달 통계
const monthlyStats = computed(() => {
  const now = new Date(selectedDate.value)
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthRecords = history.value.filter(r => r.date.startsWith(ym))

  if (!monthRecords.length) return null

  const total = officers.value.length
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
const resolveDeptVariant = dept => {
  if (dept === '믿음부') return 'primary'
  if (dept === '소망부') return 'info'
  if (dept === '사랑부') return 'success'
  if (dept === '은혜부') return 'warning'

  return 'secondary'
}

// 👉 역할 한글
const roleLabel = role => {
  if (role === 'admin') return '관리자'
  if (role === 'leader') return '부장'
  if (role === 'manager') return '부감'

  return role
}
</script>

<template>
  <section>
    <!-- 👉 헤더: 날짜 + 모임유형 -->
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
                전체 임원
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

    <!-- 👉 출결 체크 테이블 -->
    <VCard class="mb-6">
      <VCardText class="d-flex align-center justify-space-between flex-wrap gap-3">
        <div>
          <span class="text-h6">임원 출결 체크</span>
          <span class="text-caption text-medium-emphasis ms-2">{{ selectedDate }} / {{ selectedType }}</span>
        </div>

        <div class="d-flex gap-2 align-center">
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
            <th scope="col">역할</th>
            <th scope="col">연락처</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="officer in officers"
            :key="officer.id"
            :class="{ 'bg-light-success': isPresent(officer.id) }"
            style="cursor: pointer;"
            @click="toggleAttendance(officer.id)"
          >
            <td>
              <VCheckbox
                :model-value="isPresent(officer.id)"
                color="success"
                @click.stop="toggleAttendance(officer.id)"
              />
            </td>
            <td>
              <div class="d-flex align-center gap-2">
                <VAvatar
                  variant="tonal"
                  :color="resolveDeptVariant(officer.currentDepartment)"
                  size="32"
                >
                  <VImg
                    v-if="officer.avatar"
                    :src="officer.avatar"
                  />
                  <span
                    v-else
                    class="text-xs"
                  >{{ avatarText(officer.fullName) }}</span>
                </VAvatar>
                <div>
                  <div class="font-weight-medium text-sm">
                    {{ officer.fullName }}
                  </div>
                  <div class="text-xs text-medium-emphasis">
                    {{ officer.bs === 'B' ? '형제' : '자매' }}
                  </div>
                </div>
              </div>
            </td>
            <td>
              <VChip
                :color="resolveDeptVariant(officer.currentDepartment)"
                size="small"
              >
                {{ officer.currentDepartment }}
              </VChip>
            </td>
            <td>
              <VChip
                size="small"
                variant="outlined"
              >
                {{ roleLabel(officer.role) }}
              </VChip>
            </td>
            <td class="text-medium-emphasis">
              {{ officer.contact }}
            </td>
          </tr>
        </tbody>
        <tfoot v-show="!officers.length">
          <tr>
            <td
              colspan="5"
              class="text-center py-4"
            >
              임원 데이터를 불러오는 중...
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
