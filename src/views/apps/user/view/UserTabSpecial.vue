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

const sortedHistory = computed(() =>
  [...(props.userData.departmentHistory ?? [])].reverse(),
)
</script>

<template>
  <VRow>
    <!-- 연도별 부서 이력 & 부서장 코멘트 -->
    <VCol cols="12">
      <VCard title="연도별 부서 이력">
        <VDivider />
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">연도</th>
              <th scope="col">부서</th>
              <th scope="col">부서장 코멘트</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in sortedHistory"
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
                {{ item.comment || '-' }}
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
  </VRow>
</template>
