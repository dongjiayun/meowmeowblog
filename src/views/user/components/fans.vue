<template>
    <user-list ref="userRef" is-fans />
</template>

<script lang="ts">
export default {
    name: 'MeowFans',
}
</script>
<script setup lang="ts">
import userList from './userList.vue'
import { ref } from 'vue'

const userRef = ref()

</script>

<style scoped lang="scss">

</style>
