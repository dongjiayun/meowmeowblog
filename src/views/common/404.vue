<script setup lang="ts">

</script>

<template>
    <div class="blog-404">
        <div class="fof">
            <h1>Error 404</h1>
        </div>
    </div>
</template>

<style scoped lang="scss">
.blog-404{
    display: table;
    width: 100%;
    height: 60vh;
    text-align: center;
    font-family: 'Lato', sans-serif;
    color: #888;
    margin: 0;
}

.fof{
    display: table-cell;
    vertical-align: middle;
}

.fof h1{
    font-size: 50px;
    display: inline-block;
    padding-right: 12px;
    animation: type .5s alternate infinite;
}

@keyframes type{
    from{box-shadow: inset -3px 0px 0px #888;}
    to{box-shadow: inset -3px 0px 0px transparent;}
}
</style>
