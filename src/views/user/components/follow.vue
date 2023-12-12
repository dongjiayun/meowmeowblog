<template>
    <user-list ref="userRef" is-follow />
</template>

<script lang="ts">
export default {
    name: 'MeowFollow',
}
</script>
<script setup lang="ts">
import { ref } from 'vue'
import userList from './userList.vue'

const userRef = ref()

</script>

<style scoped lang="scss">

</style>
