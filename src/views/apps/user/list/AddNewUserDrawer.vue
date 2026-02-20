<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { requiredValidator } from '@validators'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
])

const isFormValid = ref(false)
const refForm = ref()

// 👉 사진 업로드
const avatarPreview = ref('')
const refFileInput = ref()

const onAvatarClick = () => {
  refFileInput.value?.click()
}

const onFileChange = e => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    avatarPreview.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

const fullName = ref('')
const contact = ref('')
const birthDate = ref('')
const currentDepartment = ref()
const parish = ref()
const bs = ref()
const salvationDate = ref('')
const transferInDate = ref('')
const serviceTeam = ref()
const collegeTeam = ref()
const occupation = ref()
const workplaceName = ref('')
const address = ref('')
const remarks = ref('')

const departments = ['믿음부', '소망부', '사랑부', '은혜부']
const parishes = ['1교구', '2교구', '3교구', '4교구']
const bsOptions = [
  { title: '형제 (B)', value: 'B' },
  { title: '자매 (S)', value: 'S' },
]
const serviceTeams = ['찬양팀', '봉사팀', '예배팀', '전도팀', '행정팀']
const collegeTeams = ['A팀', 'B팀', 'C팀', 'D팀']
const occupations = ['학생', '직장인']

// 👉 드로어 닫기
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
    avatarPreview.value = ''
  })
}

// 👉 폼 제출
const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      const currentYear = new Date().getFullYear()
      const birthYear = birthDate.value ? new Date(birthDate.value).getFullYear() : currentYear
      const koreanAge = currentYear - birthYear + 1

      emit('userData', {
        id: 0,
        avatar: avatarPreview.value,
        fullName: fullName.value,
        contact: contact.value,
        birthDate: birthDate.value,
        age: koreanAge,
        currentDepartment: currentDepartment.value,
        departmentHistory: [{ year: currentYear, department: currentDepartment.value }],
        parish: parish.value,
        bs: bs.value ?? '',
        salvationDate: salvationDate.value,
        transferInDate: transferInDate.value,
        serviceTeam: serviceTeam.value ?? '',
        collegeTeam: collegeTeam.value ?? '',
        occupation: occupation.value,
        workplaceName: workplaceName.value,
        address: address.value,
        remarks: remarks.value,
        email: '',
        username: '',
        role: 'officer',
        status: 'active',
      })
      emit('update:isDrawerOpen', false)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        avatarPreview.value = ''
      })
    }
  })
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="420"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 제목 -->
    <div class="d-flex align-center bg-var-theme-background px-5 py-2">
      <h6 class="text-h6">
        성도 추가
      </h6>

      <VSpacer />

      <VBtn
        size="small"
        color="secondary"
        variant="text"
        icon="mdi-close"
        @click="closeNavigationDrawer"
      />
    </div>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- 사진 업로드 -->
              <VCol
                cols="12"
                class="d-flex justify-center"
              >
                <div
                  class="d-flex flex-column align-center gap-3"
                  style="cursor: pointer;"
                  @click="onAvatarClick"
                >
                  <VAvatar
                    :size="100"
                    rounded="sm"
                    color="primary"
                    variant="tonal"
                  >
                    <VImg
                      v-if="avatarPreview"
                      :src="avatarPreview"
                      cover
                    />
                    <VIcon
                      v-else
                      size="48"
                      icon="mdi-camera-plus-outline"
                    />
                  </VAvatar>
                  <span class="text-sm text-medium-emphasis">사진 등록 (클릭)</span>
                </div>
                <input
                  ref="refFileInput"
                  type="file"
                  accept="image/*"
                  style="display: none;"
                  @change="onFileChange"
                >
              </VCol>

              <!-- 이름 -->
              <VCol cols="12">
                <VTextField
                  v-model="fullName"
                  :rules="[requiredValidator]"
                  label="이름"
                />
              </VCol>

              <!-- 연락처 -->
              <VCol cols="12">
                <VTextField
                  v-model="contact"
                  :rules="[requiredValidator]"
                  label="연락처"
                  placeholder="010-0000-0000"
                />
              </VCol>

              <!-- 생년월일 -->
              <VCol cols="12">
                <VTextField
                  v-model="birthDate"
                  :rules="[requiredValidator]"
                  label="생년월일"
                  placeholder="YYYY-MM-DD"
                />
              </VCol>

              <!-- 구원일 -->
              <VCol cols="12">
                <VTextField
                  v-model="salvationDate"
                  label="구원일"
                  placeholder="YYYY-MM-DD"
                />
              </VCol>

              <!-- 수원교회 전입일 -->
              <VCol cols="12">
                <VTextField
                  v-model="transferInDate"
                  :rules="[requiredValidator]"
                  label="수원교회 전입일"
                  placeholder="YYYY-MM-DD"
                />
              </VCol>

              <!-- 부서 -->
              <VCol cols="12">
                <VSelect
                  v-model="currentDepartment"
                  label="부서"
                  :rules="[requiredValidator]"
                  :items="departments"
                />
              </VCol>

              <!-- 교구 -->
              <VCol cols="12">
                <VSelect
                  v-model="parish"
                  label="교구"
                  :rules="[requiredValidator]"
                  :items="parishes"
                />
              </VCol>

              <!-- 직장인/학생 -->
              <VCol cols="12">
                <VSelect
                  v-model="occupation"
                  label="직장인/학생"
                  :rules="[requiredValidator]"
                  :items="occupations"
                />
              </VCol>

              <!-- 직장/학교명 -->
              <VCol cols="12">
                <VTextField
                  v-model="workplaceName"
                  label="직장/학교명"
                />
              </VCol>

              <!-- 봉사부서 -->
              <VCol cols="12">
                <VSelect
                  v-model="serviceTeam"
                  label="봉사부서"
                  :items="serviceTeams"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>

              <!-- 대학부팀 -->
              <VCol cols="12">
                <VSelect
                  v-model="collegeTeam"
                  label="대학부팀"
                  :items="collegeTeams"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>

              <!-- B/S -->
              <VCol cols="12">
                <VSelect
                  v-model="bs"
                  label="B/S (형제/자매)"
                  :items="bsOptions"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>

              <!-- 주소 -->
              <VCol cols="12">
                <VTextField
                  v-model="address"
                  label="주소"
                />
              </VCol>

              <!-- 인적사항(비고) -->
              <VCol cols="12">
                <VTextarea
                  v-model="remarks"
                  label="인적사항(비고)"
                  rows="3"
                />
              </VCol>

              <!-- 저장 / 취소 -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  저장
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  취소
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
