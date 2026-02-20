<script setup>
import { avatarText } from '@core/utils/formatters'

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
})

const isUserInfoEditDialogVisible = ref(false)

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
</script>

<template>
  <VRow>
    <!-- 성도 정보 카드 -->
    <VCol cols="12">
      <VCard v-if="props.userData">

        <!-- 아바타 + 이름 + 부서 -->
        <VCardText class="text-center pt-15">
          <VAvatar
            rounded="sm"
            :size="120"
            :color="resolveDeptVariant(props.userData.currentDepartment).color"
            variant="tonal"
          >
            <VImg
              v-if="props.userData.avatar"
              :src="props.userData.avatar"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(props.userData.fullName) }}
            </span>
          </VAvatar>

          <h6 class="text-h6 mt-4">
            {{ props.userData.fullName }}
          </h6>

          <VChip
            label
            :color="resolveDeptVariant(props.userData.currentDepartment).color"
            size="small"
            class="mt-4"
          >
            {{ props.userData.currentDepartment }}
          </VChip>
        </VCardText>

        <!-- 나이 / B·S 요약 -->
        <VCardText class="d-flex justify-center flex-wrap gap-6 mt-1">
          <div class="d-flex align-center gap-3">
            <VAvatar
              :size="44"
              rounded
              color="primary"
              variant="tonal"
            >
              <VIcon
                size="22"
                icon="mdi-cake-variant-outline"
              />
            </VAvatar>
            <div>
              <h6 class="text-h6">
                {{ props.userData.age }}세
              </h6>
              <span class="text-sm text-medium-emphasis">나이</span>
            </div>
          </div>

          <div class="d-flex align-center gap-3">
            <VAvatar
              :size="44"
              rounded
              color="primary"
              variant="tonal"
            >
              <VIcon
                size="22"
                icon="mdi-water-outline"
              />
            </VAvatar>
            <div>
              <h6 class="text-h6">
                {{ props.userData.bs === 'B' ? '형제 (B)' : props.userData.bs === 'S' ? '자매 (S)' : '-' }}
              </h6>
              <span class="text-sm text-medium-emphasis">B/S</span>
            </div>
          </div>
        </VCardText>

        <!-- 상세 정보 -->
        <VCardText>
          <h6 class="text-h6">
            성도 정보
          </h6>
          <VDivider class="mt-4 mb-2" />

          <VList class="card-list">
            <!-- 연락처 -->
            <VListItem>
              <VListItemTitle>
                <span class="text-sm font-weight-medium">연락처: </span>
                <span class="text-body-2">{{ props.userData.contact }}</span>
              </VListItemTitle>
            </VListItem>

            <!-- 생년월일 -->
            <VListItem>
              <VListItemTitle>
                <span class="text-sm font-weight-medium">생년월일: </span>
                <span class="text-body-2">{{ props.userData.birthDate }}</span>
              </VListItemTitle>
            </VListItem>

            <!-- 교구 -->
            <VListItem>
              <VListItemTitle>
                <span class="text-sm font-weight-medium">교구: </span>
                <span class="text-body-2">{{ props.userData.parish }}</span>
              </VListItemTitle>
            </VListItem>

            <!-- 직장인/학생 + 직장·학교명 -->
            <VListItem>
              <VListItemTitle>
                <span class="text-sm font-weight-medium">{{ props.userData.occupation }}: </span>
                <span class="text-body-2">{{ props.userData.workplaceName || '-' }}</span>
              </VListItemTitle>
            </VListItem>

            <!-- 봉사부서 -->
            <VListItem>
              <VListItemTitle>
                <span class="text-sm font-weight-medium">봉사부서: </span>
                <span class="text-body-2">{{ props.userData.serviceTeam || '-' }}</span>
              </VListItemTitle>
            </VListItem>

            <!-- 대학부팀 -->
            <VListItem v-if="props.userData.collegeTeam">
              <VListItemTitle>
                <span class="text-sm font-weight-medium">대학부팀: </span>
                <span class="text-body-2">{{ props.userData.collegeTeam }}</span>
              </VListItemTitle>
            </VListItem>

            <!-- 구원일 -->
            <VListItem>
              <VListItemTitle>
                <span class="text-sm font-weight-medium">구원일: </span>
                <span class="text-body-2">{{ props.userData.salvationDate || '-' }}</span>
              </VListItemTitle>
            </VListItem>

            <!-- 수원교회 전입일 -->
            <VListItem>
              <VListItemTitle>
                <span class="text-sm font-weight-medium">수원교회 전입일: </span>
                <span class="text-body-2">{{ props.userData.transferInDate }}</span>
              </VListItemTitle>
            </VListItem>

            <!-- 주소 -->
            <VListItem>
              <VListItemTitle>
                <span class="text-sm font-weight-medium">주소: </span>
                <span class="text-body-2">{{ props.userData.address || '-' }}</span>
              </VListItemTitle>
            </VListItem>

          </VList>
        </VCardText>

        <!-- 수정 / 정지 버튼 -->
        <VCardText class="d-flex justify-center gap-3">
          <VBtn
            variant="elevated"
            @click="isUserInfoEditDialogVisible = true"
          >
            수정
          </VBtn>
          <VBtn
            variant="tonal"
            color="error"
          >
            정지
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}
</style>
