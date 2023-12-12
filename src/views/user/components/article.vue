<template>
    <blog
        :cid="cid"
    />
</template>

<script lang="ts">
export default {
    name: 'MeowArticle',
}
</script>
<script setup lang="ts">
import Blog from '@/views/blog/index.vue'

const props = defineProps < {
    cid: string
}>()

</script>

<style scoped lang="scss">

</style>
