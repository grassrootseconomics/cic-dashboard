<template>
  <v-alert shaped prominent dark :color="color" elevation="1" :icon="icon">
    <div class="title">
      {{ title }}
    </div>
    <div>{{ subTitle }}</div>
  </v-alert>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    subTitle: String,
    color: String,
  },
}
</script>
