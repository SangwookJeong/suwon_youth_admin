<script setup>
import AddNewUserDrawer from '@/views/apps/user/list/AddNewUserDrawer.vue'
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import { avatarText } from '@core/utils/formatters'

const userListStore = useUserListStore()
const searchQuery = ref('')
const selectedDepartment = ref()
const selectedParish = ref()
const selectedOccupation = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalUsers = ref(0)
const users = ref([])

// 👉 성도 목록 조회
const fetchUsers = () => {
  userListStore.fetchUsers({
    q: searchQuery.value,
    currentDepartment: selectedDepartment.value,
    parish: selectedParish.value,
    occupation: selectedOccupation.value,
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    users.value = response.data.users
    totalPage.value = response.data.totalPage
    totalUsers.value = response.data.totalUsers
  }).catch(error => {
    console.error(error)
  })
}

watchEffect(fetchUsers)

watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 필터 옵션
const departments = [
  { title: '믿음부', value: '믿음부' },
  { title: '소망부', value: '소망부' },
  { title: '사랑부', value: '사랑부' },
  { title: '은혜부', value: '은혜부' },
]

const parishes = [
  { title: '1교구', value: '1교구' },
  { title: '2교구', value: '2교구' },
  { title: '3교구', value: '3교구' },
  { title: '4교구', value: '4교구' },
]

const occupations = [
  { title: '학생', value: '학생' },
  { title: '직장인', value: '직장인' },
]

// 👉 부서별 색상
const resolveDeptVariant = dept => {
  if (dept === '믿음부')
    return { color: 'primary' }
  if (dept === '소망부')
    return { color: 'info' }
  if (dept === '사랑부')
    return { color: 'success' }
  if (dept === '은혜부')
    return { color: 'warning' }

  return { color: 'secondary' }
}

const isAddNewUserDrawerVisible = ref(false)

// 👉 페이지네이션 텍스트
const paginationData = computed(() => {
  const firstIndex = users.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = users.value.length + (currentPage.value - 1) * rowPerPage.value

  return `${firstIndex}-${lastIndex} / 전체 ${totalUsers.value}명`
})

// 👉 체크박스
const selectedRows = ref([])
const selectAllUser = ref(false)

const selectUnselectAll = () => {
  selectAllUser.value = !selectAllUser.value
  if (selectAllUser.value) {
    users.value.forEach(user => {
      if (!selectedRows.value.includes(`check${user.id}`))
        selectedRows.value.push(`check${user.id}`)
    })
  }
  else {
    selectedRows.value = []
  }
}

watch(selectedRows, () => {
  if (!selectedRows.value.length)
    selectAllUser.value = false
}, { deep: true })

const addRemoveIndividualCheckbox = checkID => {
  if (selectedRows.value.includes(checkID)) {
    const index = selectedRows.value.indexOf(checkID)

    selectedRows.value.splice(index, 1)
  }
  else {
    selectedRows.value.push(checkID)
    selectAllUser.value = true
  }
}

const addNewUser = userData => {
  userListStore.addUser(userData)
  fetchUsers()
}
</script>

<template>
  <section>
    <!-- 👉 필터 -->
    <VCard
      title="필터"
      class="mb-6"
    >
      <VCardText>
        <VRow>
          <!-- 부서 선택 -->
          <VCol
            cols="12"
            sm="4"
          >
            <VSelect
              v-model="selectedDepartment"
              label="부서 선택"
              :items="departments"
              clearable
              clear-icon="mdi-close"
            />
          </VCol>

          <!-- 교구 선택 -->
          <VCol
            cols="12"
            sm="4"
          >
            <VSelect
              v-model="selectedParish"
              label="교구 선택"
              :items="parishes"
              clearable
              clear-icon="mdi-close"
            />
          </VCol>

          <!-- 직장인/학생 -->
          <VCol
            cols="12"
            sm="4"
          >
            <VSelect
              v-model="selectedOccupation"
              label="직장인/학생"
              :items="occupations"
              clearable
              clear-icon="mdi-close"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VCard>
      <VCardText class="d-flex flex-wrap gap-4">
        <!-- 내보내기 -->
        <VBtn
          variant="tonal"
          color="secondary"
          prepend-icon="mdi-tray-arrow-up"
        >
          내보내기
        </VBtn>

        <VSpacer />

        <div class="app-user-search-filter d-flex align-center">
          <!-- 검색 -->
          <VTextField
            v-model="searchQuery"
            placeholder="성도 검색 (이름, 연락처)"
            density="compact"
            class="me-3"
          />

          <!-- 성도 추가 -->
          <VBtn @click="isAddNewUserDrawerVisible = true">
            성도 추가
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <!-- 👉 성도 테이블 -->
      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th scope="col">
              <div style="width: 1.875rem;">
                <VCheckbox
                  :model-value="selectAllUser"
                  :indeterminate="(users.length !== selectedRows.length) && !!selectedRows.length"
                  @click="selectUnselectAll"
                />
              </div>
            </th>
            <th scope="col">성도</th>
            <th scope="col">부서</th>
            <th scope="col">연락처</th>
            <th scope="col">생년월일 / 나이</th>
            <th scope="col">구원일</th>
            <th scope="col">대학부팀</th>
            <th scope="col">액션</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
          >
            <!-- 체크박스 -->
            <td>
              <div style="width: 1.875rem;">
                <VCheckbox
                  :id="`check${user.id}`"
                  :model-value="selectedRows.includes(`check${user.id}`)"
                  @click="addRemoveIndividualCheckbox(`check${user.id}`)"
                />
              </div>
            </td>

            <!-- 성도 -->
            <td>
              <div class="d-flex align-center">
                <VAvatar
                  variant="tonal"
                  :color="resolveDeptVariant(user.currentDepartment).color"
                  class="me-3"
                  size="34"
                >
                  <VImg
                    v-if="user.avatar"
                    :src="user.avatar"
                  />
                  <span v-else>{{ avatarText(user.fullName) }}</span>
                </VAvatar>

                <div class="d-flex flex-column">
                  <h6 class="text-sm font-weight-medium">
                    <RouterLink
                      :to="{ name: 'apps-user-view-id', params: { id: user.id } }"
                      class="font-weight-medium user-list-name"
                    >
                      {{ user.fullName }}
                    </RouterLink>
                  </h6>
                  <span class="text-xs text-medium-emphasis">{{ user.bs === 'B' ? '형제' : '자매' }}</span>
                </div>
              </div>
            </td>

            <!-- 부서 -->
            <td>
              <VChip
                :color="resolveDeptVariant(user.currentDepartment).color"
                size="small"
              >
                {{ user.currentDepartment }}
              </VChip>
            </td>

            <!-- 연락처 -->
            <td class="text-medium-emphasis">
              {{ user.contact }}
            </td>

            <!-- 생년월일 / 나이 -->
            <td class="text-medium-emphasis">
              <div>{{ user.birthDate }}</div>
              <div class="text-xs">{{ user.age }}세</div>
            </td>

            <!-- 구원일 -->
            <td class="text-medium-emphasis">
              {{ user.salvationDate || '-' }}
            </td>

            <!-- 대학부팀 -->
            <td class="text-medium-emphasis">
              {{ user.collegeTeam || '-' }}
            </td>

            <!-- 액션 -->
            <td
              class="text-center"
              style="width: 5rem;"
            >
              <VBtn
                size="x-small"
                color="default"
                variant="plain"
                icon
              >
                <VIcon
                  size="24"
                  icon="mdi-dots-vertical"
                />

                <VMenu activator="parent">
                  <VList>
                    <VListItem :to="{ name: 'apps-user-view-id', params: { id: user.id } }">
                      <template #prepend>
                        <VIcon
                          icon="mdi-eye-outline"
                          :size="20"
                          class="me-3"
                        />
                      </template>
                      <VListItemTitle>상세보기</VListItemTitle>
                    </VListItem>

                    <VListItem href="javascript:void(0)">
                      <template #prepend>
                        <VIcon
                          icon="mdi-pencil-outline"
                          :size="20"
                          class="me-3"
                        />
                      </template>
                      <VListItemTitle>수정</VListItemTitle>
                    </VListItem>

                    <VListItem href="javascript:void(0)">
                      <template #prepend>
                        <VIcon
                          icon="mdi-delete-outline"
                          :size="20"
                          class="me-3"
                        />
                      </template>
                      <VListItemTitle>삭제</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
              </VBtn>
            </td>
          </tr>
        </tbody>

        <tfoot v-show="!users.length">
          <tr>
            <td
              colspan="8"
              class="text-center"
            >
              검색 결과가 없습니다
            </td>
          </tr>
        </tfoot>
      </VTable>

      <VDivider />

      <!-- 👉 페이지네이션 -->
      <VCardText class="d-flex align-center flex-wrap justify-end gap-4 pa-2">
        <div
          class="d-flex align-center me-3"
          style="width: 171px;"
        >
          <span class="text-no-wrap me-3">페이지당 행수:</span>

          <VSelect
            v-model="rowPerPage"
            density="compact"
            variant="plain"
            class="user-pagination-select"
            :items="[10, 20, 30, 50]"
          />
        </div>

        <div class="d-flex align-center">
          <h6 class="text-sm font-weight-regular">
            {{ paginationData }}
          </h6>

          <VPagination
            v-model="currentPage"
            size="small"
            :total-visible="1"
            :length="totalPage"
            @next="selectedRows = []"
            @prev="selectedRows = []"
          />
        </div>
      </VCardText>
    </VCard>

    <!-- 👉 성도 추가 드로어 -->
    <AddNewUserDrawer
      v-model:isDrawerOpen="isAddNewUserDrawerVisible"
      @user-data="addNewUser"
    />
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 26rem;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>

<style lang="scss" scoped>
.user-pagination-select {
  .v-field__input,
  .v-field__append-inner {
    padding-block-start: 0.3rem;
  }
}
</style>
