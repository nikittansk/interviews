import './assets/main.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { initializeApp } from 'firebase/app'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'

import ProgressSpinner from 'primevue/progressspinner'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import Message from 'primevue/message'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'
import Radio from 'primevue/radiobutton'
import Badge from 'primevue/badge'

import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: "AIzaSyCiYPxIyxbxlhDep3eMKtPQzJw8wKd38eg",
  authDomain: "interviews-ff858.firebaseapp.com",
  projectId: "interviews-ff858",
  storageBucket: "interviews-ff858.appspot.com",
  messagingSenderId: "758529533698",
  appId: "1:758529533698:web:ff6d67ac41dcfb5927c41b"
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(ToastService)
app.use(ConfirmationService)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  }
})
app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)
app.component('app-progress', ProgressSpinner)
app.component('app-card', Card)
app.component('app-datatable', DataTable)
app.component('app-column', Column)
app.component('app-dialog', ConfirmDialog)
app.component('app-message', Message)
app.component('app-input-number', InputNumber)
app.component('app-textarea', Textarea)
app.component('app-date-picker', DatePicker)
app.component('app-radio', Radio)
app.component('app-badge', Badge)

app.mount('#app')
