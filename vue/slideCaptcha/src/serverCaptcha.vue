<script setup>
import { ref } from 'vue'
const img1 = ref(undefined)
const img2 = ref(undefined)

fetch('/api/captcha').then(data => data.json()).then(data => {
  console.log('data', data)
  img1.value = '/api' + data.bgUrl
  img2.value = '/api' + data.blockUrl
})
</script>
<template>
  <div>
    <img :src='img1'/><br/>
    <img :src="img2" alt="">
  </div>
</template>