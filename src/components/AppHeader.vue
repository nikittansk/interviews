<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useUserStore } from '@/stores/user'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

interface IMenuItem {
  label: string,
  icon: string,
  path: string,
  show: ComputedRef<boolean>
}

const items = ref<IMenuItem[]>([
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: '/auth',
    show: computed((): boolean => !userStore.userId)
  },
  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: '/',
    show: computed((): boolean => userStore.userId)
  },
  {
    label: 'Список собеседований',
    icon: 'pi pi-list',
    path: '/list',
    show: computed((): boolean => userStore.userId)
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-pie',
    path: '/statistic',
    show: computed((): boolean => userStore.userId)
  }
])

const signOutMethod = async (): Promise<void> => {
  await signOut(getAuth())
  router.push('/auth')
}
</script>

<template lang="pug">
  app-menubar(:model="items" class="menu")
    template(#item="{ item , props}")
      template(v-if="item.show")
        router-link(
          :to="item.path"
          class="flex align-items-center"
          v-bind="props.action"
        )
          span(:class="item.icon" class="p-menuitem-icon")
          span(class="ml-2") {{ item.label}}

    template(#end)
      span(
        v-if="userStore.userId"
        @click="signOutMethod"
        class="flex align-items-center menu-exit"
      )
        span(class="pi pi-sign-out p-menuitem-icon")
        span(class="ml-2") Выход
</template>

<style scoped lang="scss">
.menu {
  margin: 30px 0;

  &-exit {
    cursor: pointer;
  }
}
</style>