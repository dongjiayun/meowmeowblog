<template>
    <div id="markdown-body" class="markdown-body" v-html="previewContent" />
</template>

<script setup lang="ts">
import 'highlight.js/styles/stackoverflow-light.css'
// @ts-ignore
import MarkdownIt from 'markdown-it'
// @ts-ignore
import MarkdownItSub from 'markdown-it-sub'
// @ts-ignore
import MarkdownItSup from 'markdown-it-sup'
// @ts-ignore
import MarkdownItFootnote from 'markdown-it-footnote'
// @ts-ignore
import MarkdownItAbbr from 'markdown-it-abbr'
// @ts-ignore
import MarkdownItMark from 'markdown-it-mark'
// @ts-ignore
import { full as emoji } from 'markdown-it-emoji'
// @ts-ignore
import MarkdownItTextualUml from 'markdown-it-textual-uml'
// @ts-ignore
import MarkdownItHighlightjs from 'markdown-it-highlightjs'
// @ts-ignore
import MarkdownItAttrs from 'markdown-it-attrs'

import mermaid from 'mermaid'

import { computed, nextTick, onMounted, watch } from 'vue'
// @ts-ignore
const markdown = new MarkdownIt()

markdown.use(MarkdownItSub)
markdown.use(MarkdownItSup)
markdown.use(MarkdownItFootnote)
markdown.use(MarkdownItAbbr)
markdown.use(MarkdownItMark)
markdown.use(emoji)
markdown.use(MarkdownItTextualUml)
markdown.use(MarkdownItHighlightjs)
markdown.use(MarkdownItAttrs)

const props = defineProps<{
    content: string
}>()

const previewContent = computed(() => {
    return markdown.render(props.content)
})

watch(() => previewContent, () => {
    renderMermaid()
})

const renderMermaid = () => {
    nextTick(() => {
        mermaid.run({
            nodes: document.querySelectorAll('#markdown-body .mermaid'),
        })
    })
}

onMounted(() => {
    nextTick(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'light'
        })
        renderMermaid()
    })
})
</script>

<style scoped lang="scss">
pre.hljs {
    background-color: #f4f4f4;
    padding: 10px;
}

pre.hljs code {
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 14px;
}
</style>
