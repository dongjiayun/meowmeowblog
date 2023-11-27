<template>
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover"
    />
    <meow-layout>
        <RouterView v-if="keepAliveRoutes.includes(route.name)" v-slot="{ Component }">
            <KeepAlive>
                <component :is="Component" />
            </KeepAlive>
        </RouterView>
        <RouterView v-else />
    </meow-layout>
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()
const keepAliveRoutes = ref < Array < any >>([])
watch(route, () => {
    if (!keepAliveRoutes.value.includes(route.name) && route.meta?.keepAlive) {
        keepAliveRoutes.value.push(route.name)
    }
})


</script>

<style lang="scss" scoped>
.meow{

}
</style>
