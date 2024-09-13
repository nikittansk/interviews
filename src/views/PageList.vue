
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  where
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview } from '@/interfaces'
import { useConfirm } from 'primevue/useconfirm'

const userStore = useUserStore()
const db = getFirestore()
const confirm = useConfirm()

const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)
const selectedFilterResult = ref<string>('')

const submitFilter = async (): Promise<void> => {
  isLoading.value = true
  const listInterviews: Array<IInterview> = await getAllInterviews(true)
  interviews.value = [...listInterviews]
  isLoading.value = false
}

const clearFilter = async (): Promise<void> => {
  isLoading.value = true
  const listInterviews: Array<IInterview> = await getAllInterviews()
  interviews.value = [...listInterviews]
  selectedFilterResult.value = ''
  isLoading.value = false
}

const getAllInterviews = async <T extends IInterview>(isFilter?: boolean): Promise<T[]> => {
  let getData

  if (isFilter) {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc'),
      where('result', '==', selectedFilterResult.value)
    )
  } else {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc')
    )
  }

  const listDocs = await getDocs(getData)

  return listDocs.docs.map((doc) => doc.data() as T)
}

const confirmRemoveInterview = async (id: string): Promise<void> => {
  confirm.require({
    message: 'Вы хотите удалить собеседование?',
    header: 'Удаление собеседований',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      isLoading.value = true

      await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))

      const listInterviews: Array<IInterview> = await getAllInterviews()
      interviews.value = [...listInterviews]

      isLoading.value = false
    }
  })
}

onMounted(async () => {
  const listInterviews: Array<IInterview> = await getAllInterviews()
  interviews.value = [...listInterviews]

  isLoading.value = false
})
</script>
<template lang="pug">
  app-dialog

  app-progress(v-if="isLoading" class="flex align-items-center")

  app-message(v-else-if="!isLoading && !interviews.length" severity="info") Нет добавленных собеседований

  template(v-else)
    h1 Список собеседований
    .flex.align-items-center.mb-5
      .flex.align-items-center.mr-2
        app-radio(
          inputId="interviewResult1"
          name="result"
          value="Refusal"
          v-model="selectedFilterResult"
        )
        label(for="interviewResult1" class="ml-2") Отказ
      .flex.align-items-center.mr-2
        app-radio(
          inputId="interviewResult2"
          name="result"
          value="Offer"
          v-model="selectedFilterResult"
        )
        label(for="interviewResult2" class="ml-2") Оффер
      app-button(
        class="mr-2"
        @click="submitFilter"
        :disabled="!selectedFilterResult"
      ) Применить
      app-button(
        severity="danger"
        :disabled="!selectedFilterResult"
        @click="clearFilter"
      ) Сбросить
    app-datatable(:value="interviews")
      app-column(field="company" header="Компания")
      app-column(field="hrName" header="Имя HR")
      app-column(field="vacancyLink" header="Вакансия")
        template(#body="slotProps")
          a(:href="slotProps.data.vacancyLink" target="_blank") Ссылка на вакансию
      app-column(header="Контакты")
        template(#body="slotProps")
          .contacts
            a(
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/${slotProps.data.contactTelegram}`"
              target="_blank"
              class="contacts__telegram"
            )
              span(class="contacts__icon pi pi-telegram")

            a(
              v-if="slotProps.data.contactWhatsApp"
              :href="`https://wa.me/${slotProps.data.contactWhatsApp}`"
              target="_blank"
              class="contacts__whatsapp"
            )
              span(class="contacts__icon pi pi-whatsapp")

            a(
              v-if="slotProps.data.contactPhone"
              :href="`tel:${slotProps.data.contactPhone}`"
              target="_blank"
              class="contacts__phone"
            )
              span(class="contacts__icon pi pi-phone")

      app-column(header="Пройденные этапы")
        template(#body="slotProps")
          span(v-if="!slotProps.data.stages") Не заполнено
          div(v-else class="interview-stages")
            app-badge(
              v-for="(stage, i) in slotProps.data.stages"
              :key="i"
              :value="i + 1"
              rounded
            )
      app-column(header="Зарплатная вилка")
        template(#body="slotProps")
          span(v-if="!slotProps.data.salaryFrom") Не заполнено
          span(v-else) {{ slotProps.data.salaryFrom }} - {{ slotProps.data.salaryTo }}
      app-column(header="Результат")
        template(#body="slotProps")
          span(v-if="!slotProps.data.result") Не заполнено
          template(v-else)
            app-badge(
              :severity="slotProps.data.result === 'Offer' ? 'success' : 'danger'"
              :value="slotProps.data.result === 'Offer' ? 'Оффер' : 'Отказ'"
            )
      app-column
        template(#body="slotProps")
          .flex.gap-2
            router-link(:to="`/interview/${slotProps.data.id}`")
              app-button(icon="pi pi-pencil" severity="info")
            app-button(
              icon="pi pi-trash"
              severity="danger"
              @click="confirmRemoveInterview(slotProps.data.id)"
            )
</template>

<style scoped lang="scss">
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;

  &__telegram {
    color: #0088cc;
  }

  &__whatsapp {
    color: #25d366;
  }

  &__phone {
    color: #371777;
  }

  &__icon {
    font-size: 20px;
  }
}
.interview-stages {
  display: flex;
  gap: 5px;
}
</style>