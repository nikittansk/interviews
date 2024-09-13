<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview, IStage } from '@/interfaces'

const db = getFirestore()
const userStore = useUserStore()
const route = useRoute()

const isLoading = ref<boolean>(true)
const interview = ref<IInterview>()

const docref = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string)

const getData = async (): Promise<void> => {
  isLoading.value = true
  const docSnap = await getDoc(docref)

  if (docSnap.exists()) {
    const data = docSnap.data() as IInterview

    if (data.stages && data.stages.length) {
      data.stages = data.stages.map((stage: IStage) => {
        if (stage.date && stage.date instanceof Timestamp) {
          return {
            ...stage,
            date: stage.date.toDate()
          }
        }
        return stage
      })
    }
    interview.value = data
  }

  isLoading.value = false
}

const saveInterview = async (): Promise<void> => {
  isLoading.value = true
  await updateDoc(docref, { ...interview.value })
  await getData()
}

const addStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages.push({ name: '', date: null, description: '' })
  }
}

const removeStage = (index: number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index, 1)
    }
  }
}

onMounted(async () => await getData())
</script>

<template lang="pug">
  app-progress(v-if="isLoading" class="flex align-items-center")
  .content-interview(class="content-interview" v-else-if="interview?.id && !isLoading")
    app-card
      template(#title) Собеседование в компанию {{ interview.company }}
      template(#content)
        .flex.flex-column.gap-2
          label(for="company") Компания
          app-input-text(
            class="input mb-3"
            id="company"
            v-model="interview.company"
          )

        .flex.flex-column.gap-2
          label(for="vacancyLink") Описание вакансии (ссылка)
          app-input-text(
            class="input mb-3"
            id="vacancyLink"
            v-model="interview.vacancyLink"
          )

        .flex.flex-column.gap-2
          label(for="hrName") Контакт (имя)
          app-input-text(
            class="input mb-3"
            id="hrName"
            v-model="interview.hrName"
          )

        .flex.flex-column.gap-2
          label(for="contactTelegram") Telegram username HR
          app-input-text(
            class="input mb-3"
            id="contactTelegram"
            v-model="interview.contactTelegram"
          )

        .flex.flex-column.gap-2
          label(for="contactWhatsApp") WhatsApp HR
          app-input-text(
            class="input mb-3"
            id="contactWhatsApp"
            v-model="interview.contactWhatsApp"
          )

        .flex.flex-column.gap-2
          label(for="contactPhone") Телефон HR
          app-input-text(
            class="input mb-3"
            id="contactPhone"
            v-model="interview.contactPhone"
          )

        .flex.flex-wrap.gap-3.p-fluid.mb-3
          .flex-auto
            app-input-number(
              inputId="salaryFrom"
              placeholder="Зарплатная вилка от"
              v-model="interview.salaryFrom"
            )

          .flex-auto
            app-input-number(
              inputId="salaryTo"
              placeholder="Зарплатная вилка до"
              v-model="interview.salaryTo"
            )

        app-button(
          label="Добавить этап"
          severity="info"
          icon="pi pi-plus"
          class="mb-3"
          @click="addStage"
        )
        template(v-if="interview.stages")
          div(
            v-for="(stage, index) in interview.stages"
            :key="index"
            class="interview-stage"
          )
            .flex.flex-column.gap-2
              label(:for="`stage-name-${index}`") Название этапа
              app-input-text(
                class="input mb-3"
                :id="`stage-name-${index}`"
                v-model="stage.name"
              )

            .flex.flex-column.gap-2
              label(:for="`stage-date-${index}`") Дата прохождения этапа
              app-date-picker(
                class="input mb-3"
                :id="`stage-date-${index}`"
                dateFormat="dd.mm.yy"
                v-model="stage.date"
              )

            .flex.flex-column.gap-2
              label(:for="`stage-description-${index}`") Комментарий
              app-textarea(
                class="input mb-3"
                :id="`stage-description-${index}`"
                rows="5"
                v-model="stage.description"
              )

            app-button(
              severity="danger"
              label="Удалить этап"
              @click="removeStage"
            )

        .flex.flex-wrap.gap-3.mb-3
          .flex.align-items-center
            app-radio(
              inputId="interviewResult1"
              name="result"
              value="Refusal"
              v-model="interview.result"
            )
            label(for="interviewResult1" class="ml-2") Отказ

          .flex.align-items-center
            app-radio(
              inputId="interviewResult2"
              name="result"
              value="Offer"
              v-model="interview.result"
            )
            label(for="interviewResult2" class="ml-2") Оффер

        app-button(
          label="Сохранить"
          icon="pi pi-save"
          @click="saveInterview"
        )
</template>

<style scoped lang="scss">
.content-interview {
  max-width: 600px;
  margin: auto;
}
.input {
  width: 100%;
}
.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>