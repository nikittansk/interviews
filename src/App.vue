<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from '@/stores/user'
import AppHeader from '@/components/AppHeader.vue'

const userStore = useUserStore()

const isLoading = ref<boolean>(true)

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      userStore.userId = user.uid
    } else {
      userStore.userId = ''
    }
    isLoading.value = false
  })
})
</script>

<template lang="pug">
  app-progress(v-if="isLoading")
  .container(v-else)
    app-header
    .content
      router-view
</template>

<style scoped lang="scss">
.container {
  max-width: 1280px;
  margin: auto;
  padding: 20px;
}
</style>
