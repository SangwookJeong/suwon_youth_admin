<script setup>
const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
})

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

const currentYear = new Date().getFullYear()
</script>

<template>
  <VRow>
    <!-- 봉사 & 소속 정보 -->
    <VCol cols="12">
      <VCard title="봉사 & 소속 정보">
        <VDivider />
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              sm="6"
            >
              <div class="d-flex align-center gap-3 mb-4">
                <VAvatar
                  rounded
                  color="primary"
                  variant="tonal"
                  size="42"
                >
                  <VIcon icon="mdi-account-group-outline" />
                </VAvatar>
                <div>
                  <p class="text-xs text-medium-emphasis mb-0">
                    금년도 부서
                  </p>
                  <VChip
                    :color="resolveDeptVariant(props.userData.currentDepartment).color"
                    size="small"
                    class="mt-1"
                  >
                    {{ props.userData.currentDepartment }}
                  </VChip>
                </div>
              </div>
            </VCol>

            <VCol
              cols="12"
              sm="6"
            >
              <div class="d-flex align-center gap-3 mb-4">
                <VAvatar
                  rounded
                  color="success"
                  variant="tonal"
                  size="42"
                >
                  <VIcon icon="mdi-hand-heart-outline" />
                </VAvatar>
                <div>
                  <p class="text-xs text-medium-emphasis mb-0">
                    봉사부서
                  </p>
                  <p class="text-sm font-weight-medium mb-0">
                    {{ props.userData.serviceTeam || '-' }}
                  </p>
                </div>
              </div>
            </VCol>

            <VCol
              v-if="props.userData.collegeTeam"
              cols="12"
              sm="6"
            >
              <div class="d-flex align-center gap-3 mb-4">
                <VAvatar
                  rounded
                  color="info"
                  variant="tonal"
                  size="42"
                >
                  <VIcon icon="mdi-school-outline" />
                </VAvatar>
                <div>
                  <p class="text-xs text-medium-emphasis mb-0">
                    대학부팀
                  </p>
                  <p class="text-sm font-weight-medium mb-0">
                    {{ props.userData.collegeTeam }}
                  </p>
                </div>
              </div>
            </VCol>

            <VCol
              cols="12"
              sm="6"
            >
              <div class="d-flex align-center gap-3 mb-4">
                <VAvatar
                  rounded
                  color="warning"
                  variant="tonal"
                  size="42"
                >
                  <VIcon icon="mdi-briefcase-outline" />
                </VAvatar>
                <div>
                  <p class="text-xs text-medium-emphasis mb-0">
                    {{ props.userData.occupation }}
                  </p>
                  <p class="text-sm font-weight-medium mb-0">
                    {{ props.userData.workplaceName || '-' }}
                  </p>
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 연도별 부서 이력 -->
    <VCol cols="12">
      <VCard title="연도별 부서 이력">
        <VDivider />
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">연도</th>
              <th scope="col">부서</th>
              <th scope="col">비고</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in [...(props.userData.departmentHistory ?? [])].reverse()"
              :key="item.year"
            >
              <td class="font-weight-medium">
                {{ item.year }}
                <VChip
                  v-if="item.year === currentYear"
                  color="primary"
                  size="x-small"
                  class="ms-2"
                >
                  현재
                </VChip>
              </td>
              <td>
                <VChip
                  :color="resolveDeptVariant(item.department).color"
                  size="small"
                >
                  {{ item.department }}
                </VChip>
              </td>
              <td class="text-medium-emphasis">
                {{ item.year === currentYear ? '재적 중' : '이전 소속' }}
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>

    <!-- 인적사항(비고) -->
    <VCol
      v-if="props.userData.remarks"
      cols="12"
    >
      <VCard title="인적사항(비고)">
        <VCardText>
          <p class="text-body-1 mb-0">
            {{ props.userData.remarks }}
          </p>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
