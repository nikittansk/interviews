
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFirestore, collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview } from '@/interfaces'

const userStore = useUserStore()
const db = getFirestore()

const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)

const getAllInterviews = async <T extends IInterview>(): Promise<T[]> => {
  const getData = query(collection(db, `users/${userStore.userId}/interviews`), orderBy('createdAt', 'desc'))

  const listDocs = await getDocs(getData)

  return listDocs.docs.map((doc) => doc.data() as T)
}

onMounted(async () => {
  const listInterviews: Array<IInterview> = await getAllInterviews()
  console.log(listInterviews)
  interviews.value = [...listInterviews]
})
</script>
<template lang="pug">

</template>

<style scoped lang="scss">
</style>