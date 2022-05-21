<template>
  <v-skeleton-loader
    class="mx-auto"
    :max-height="h"
    type="card"
  ></v-skeleton-loader>
</template>

<script>
export default {
  props: {
    h: String,
  },
}
</script>
