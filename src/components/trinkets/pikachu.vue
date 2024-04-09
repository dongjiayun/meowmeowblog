<template>
    <div class="pikachu">
        <div class="canvas">
            <div ref="canvas" class="prof-oak" />
            <div class="table">
                <div
                    v-for="(item,index) in balls"
                    :key="index"
                    class="ball"
                    :class="{ open: currentBall === item,[item]: true }"
                    @click="handleOpen(item)"
                />
                <div class="table-legs" />
            </div>
            <div :class="currentPokemon" />
        </div>

        <div class="container">
            <p class="chat">Find a pokemon inside of <br />one of this pokeballs.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const canvas = ref()
const balls = ref(['pokeball', 'ultraball', 'premierball', 'masterball'])
const currentBall = ref('')
const currentPokemon = ref('')

const pokemons = [
    `charmander`,
    `squirtle`,
    `bulbasaur`,
    `pikachu`
]

const handleOpen = item => {
    if (currentBall.value === item) {
        currentBall.value = ''
        currentPokemon.value = ''
    } else {
        currentBall.value = item
        currentPokemon.value = pokemons[Math.floor(Math.random() * pokemons.length)]
    }
}

</script>

<style scoped lang="scss">
.pikachu{
    display: flex;
    justify-content: center;

    position: relative;
    padding: 15px 0;

    height: 500px;
    background: linear-gradient(
            0,
            #af8b60 0,
            #af8b60 5px,
            #c69c6d 5px
    );
    border-radius: 20px;
    $pixelSize: 5px;
    @mixin base {
        &:before {
            content: "";
            display: block;
            width: $pixelSize;
            height: $pixelSize;
        }
    }

    .container {
        padding: 0 15px;
        top: 10px;
        max-width: 100%;
    }

    .chat {
        position: relative;
        padding: 20px;
        font-family: "Courier Prime", monospace;
        color: #3f56b6;
        font-size: 17px;
        border: 3px solid #a2cfe3;
        background: #fff;
        border-radius: 25px;
        box-shadow: 0px 0px 0 3px #5a7ba1;

        font-smooth: never;
        -webkit-font-smoothing: none;

        @media (max-width: 380px) {
            br {
                display: none;
            }
        }
    }

    .canvas {
        position: absolute;
        top: 120px;
        padding: 15px;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        align-items: center;

        .table {
            position: relative;
            display: inline-flex;
            justify-content: center;
            padding: 0 20px 80px;
            flex-wrap: wrap;
            box-sizing: border-box;
            background: #694e32;
            border: 5px solid;

            &:before {
                position: absolute;
                content: '';
                width: 100%;
                height: 5px;
                bottom: 10px;
                left: 0;
                background: #000;
            }

            .table-legs {
                position: absolute;
                left: 0;
                right: 0;
                bottom: -15px;

                &:before,
                &:after {
                    position: absolute;
                    top: -10px;
                    content: "";
                    display: block;
                    width: $pixelSize;
                    height: $pixelSize;
                    box-shadow: 5px 0 #000,10px 0 darken(#694e32,5%),15px 0 darken(#694e32,5%),20px 0 darken(#694e32,5%),25px 0 #000,5px 5px #000,10px 5px darken(#694e32,5%),15px 5px darken(#694e32,5%),20px 5px darken(#694e32,5%),25px 5px #000,5px 10px #000,10px 10px #694e32,15px 10px #694e32,20px 10px #694e32,25px 10px #000,10px 15px #000,15px 15px #000,20px 15px #000;
                }

                &:before {
                    left: 25px;
                }

                &:after {
                    right: 30px;
                }
            }

            .ball {
                @include base;

                width: 60px;
                height: 60px;
                margin: -15px 5px;
                cursor: pointer;
                transition: transform .2s;
                user-select: none;

                &:hover { transform: translateY(-12px) }
            }

            .pokeball {
                &:before { box-shadow: 20px 0 #000,25px 0 #000,30px 0 #000,35px 0 #000,10px 5px #000,15px 5px #000,20px 5px #f80302,25px 5px #f80302,30px 5px #a40000,35px 5px #a40000,40px 5px #000,45px 5px #000,5px 10px #000,10px 10px #f80302,15px 10px #f80302,20px 10px lighten(#f80302,40%),25px 10px #f80302,30px 10px #f80302,35px 10px #a40000,40px 10px #a40000,45px 10px #a40000,50px 10px #000,5px 15px #000,10px 15px #f80302,15px 15px lighten(#f80302,40%),20px 15px #fff,25px 15px lighten(#f80302,40%),30px 15px #f80302,35px 15px #f80302,40px 15px #a40000,45px 15px #a40000,50px 15px #000,0 20px #000,5px 20px #f80302,10px 20px #f80302,15px 20px #f80302,20px 20px lighten(#f80302,40%),25px 20px #f80302,30px 20px #f80302,35px 20px #f80302,40px 20px #f80302,45px 20px #a40000,50px 20px #a40000,55px 20px #000,0 25px #000,5px 25px #f80302,10px 25px #f80302,15px 25px #f80302,20px 25px #f80302,25px 25px #000,30px 25px #000,35px 25px #f80302,40px 25px #a40000,45px 25px #a40000,50px 25px #a40000,55px 25px #000,0 30px #000,5px 30px #000,10px 30px #f80302,15px 30px #f80302,20px 30px #000,25px 30px #fff,30px 30px #c8c7c5,35px 30px #000,40px 30px #a40000,45px 30px #a40000,50px 30px #000,55px 30px #000,0 35px #000,5px 35px #fff,10px 35px #000,15px 35px #000,20px 35px #000,25px 35px #c8c7c5,30px 35px #c8c7c5,35px 35px #000,40px 35px #000,45px 35px #000,50px 35px #c8c7c5,55px 35px #000,5px 40px #000,10px 40px #fff,15px 40px #fff,20px 40px #fff,25px 40px #000,30px 40px #000,35px 40px #c8c7c5,40px 40px #c8c7c5,45px 40px #c8c7c5,50px 40px #000,5px 45px #000,10px 45px #c8c7c5,15px 45px #fff,20px 45px #fff,25px 45px #fff,30px 45px #c8c7c5,35px 45px #c8c7c5,40px 45px #c8c7c5,45px 45px #c8c7c5,50px 45px #000,10px 50px #000,15px 50px #000,20px 50px #c8c7c5,25px 50px #c8c7c5,30px 50px #c8c7c5,35px 50px #c8c7c5,40px 50px #000,45px 50px #000,20px 55px #000,25px 55px #000,30px 55px #000,35px 55px #000,55px 55px transparent }

                &.open:before {
                    background: #a40000;
                    box-shadow: 20px -20px #f80302,25px -20px #000,30px -20px #000,35px -20px #a40000,10px -15px #f80302,15px -15px #a40000,20px -15px #000,25px -15px #fff,30px -15px #b5b5b5,35px -15px #000,40px -15px #a40000,45px -15px #a40000,5px -10px #f80302,10px -10px #000,15px -10px #000,20px -10px #a3a3a3,25px -10px #000,30px -10px #000,35px -10px #7a7a7a,40px -10px #000,45px -10px #000,50px -10px #a40000,5px -5px #000,10px -5px #a3a3a3,15px -5px #a3a3a3,20px -5px #a3a3a3,25px -5px #a3a3a3,30px -5px #7a7a7a,35px -5px #7a7a7a,40px -5px #7a7a7a,45px -5px #7a7a7a,50px -5px #000,5px 0 #a3a3a3,10px 0 #a3a3a3,15px 0 #a3a3a3,20px 0 #a3a3a3,25px 0 #a3a3a3,30px 0 #a3a3a3,35px 0 #7a7a7a,40px 0 #7a7a7a,45px 0 #7a7a7a,50px 0 #7a7a7a,55px 0 #a40000,0 5px #000,10px 5px #a3a3a3,15px 5px #a3a3a3,20px 5px #a3a3a3,25px 5px #a3a3a3,30px 5px #a3a3a3,35px 5px #7a7a7a,40px 5px #7a7a7a,45px 5px #7a7a7a,50px 5px #7a7a7a,55px 5px #000,0 10px #000,5px 10px #a3a3a3,10px 10px #a3a3a3,15px 10px #a3a3a3,20px 10px #a3a3a3,25px 10px #a3a3a3,30px 10px #7a7a7a,35px 10px #7a7a7a,40px 10px #7a7a7a,45px 10px #7a7a7a,50px 10px #7a7a7a,55px 10px #000,5px 15px #000,10px 15px #a3a3a3,15px 15px #a3a3a3,20px 15px #7a7a7a,25px 15px #7a7a7a,30px 15px #7a7a7a,35px 15px #7a7a7a,40px 15px #7a7a7a,45px 15px #7a7a7a,50px 15px #000,10px 20px #000,15px 20px #000,20px 20px #7a7a7a,25px 20px #7a7a7a,30px 20px #7a7a7a,35px 20px #7a7a7a,40px 20px #000,45px 20px #000,5px 25px #000,10px 25px #fff,15px 25px #000,20px 25px #000,25px 25px #000,30px 25px #000,35px 25px #000,40px 25px #000,45px 25px #c8c7c5,50px 25px #000,0 30px #000,5px 30px #fff,10px 30px #000,15px 30px #000,20px 30px #000,25px 30px #000,30px 30px #000,35px 30px #000,40px 30px #000,45px 30px #000,50px 30px #c8c7c5,55px 30px #000,0 35px #000,5px 35px #c8c7c5,10px 35px #000,15px 35px #000,20px 35px #000,25px 35px #000,30px 35px #000,35px 35px #000,40px 35px #000,45px 35px #000,50px 35px #c8c7c5,55px 35px #000,5px 40px #000,10px 40px #fff,15px 40px #000,20px 40px #000,25px 40px #000,30px 40px #000,35px 40px #000,40px 40px #000,45px 40px #c8c7c5,50px 40px #000,5px 45px #000,10px 45px #c8c7c5,15px 45px #fff,20px 45px #fff,25px 45px #c8c7c5,30px 45px #c8c7c5,35px 45px #c8c7c5,40px 45px #c8c7c5,45px 45px #c8c7c5,50px 45px #000,10px 50px #000,15px 50px #000,20px 50px #c8c7c5,25px 50px #c8c7c5,30px 50px #c8c7c5,35px 50px #c8c7c5,40px 50px #000,45px 50px #000,20px 55px #000,25px 55px #000,30px 55px #000,35px 55px #000,55px 55px transparent;
                }
            }

            .ultraball {
                &:before {
                    box-shadow: 20px 0 #000,25px 0 #000,30px 0 #000,35px 0 #000,10px 5px #000,15px 5px #000,20px 5px #fdff01,25px 5px #fdff01,30px 5px darken(#fdff01,5%),35px 5px darken(#fdff01,5%),40px 5px #000,45px 5px #000,5px 10px #000,10px 10px #fdff01,15px 10px #fdff01,20px 10px #fff,25px 10px #fdff01,30px 10px #fdff01,35px 10px darken(#fdff01,5%),40px 10px darken(#fdff01,5%),45px 10px darken(#fdff01,5%),50px 10px #000,5px 15px #000,10px 15px #fdff01,15px 15px #fff,20px 15px lighten(#161616,20%),25px 15px lighten(#161616,20%),30px 15px #161616,35px 15px #161616,40px 15px darken(#fdff01,5%),45px 15px darken(#fdff01,5%),50px 15px #000,0 20px #000,5px 20px #161616,10px 20px #fdff01,15px 20px #fdff01,20px 20px lighten(#161616,20%),25px 20px #161616,30px 20px #161616,35px 20px #161616,40px 20px #fdff01,45px 20px darken(#fdff01,5%),50px 20px #161616,55px 20px #000,0 25px #000,5px 25px #161616,10px 25px #fdff01,15px 25px #fdff01,20px 25px #161616,25px 25px #000,30px 25px #000,35px 25px #161616,40px 25px darken(#fdff01,5%),45px 25px darken(#fdff01,5%),50px 25px #161616,55px 25px #000,0 30px #000,5px 30px #000,10px 30px #161616,15px 30px #161616,20px 30px #000,25px 30px #fff,30px 30px #c8c7c5,35px 30px #000,40px 30px #161616,45px 30px #161616,50px 30px #000,55px 30px #000,0 35px #000,5px 35px #fff,10px 35px #000,15px 35px #000,20px 35px #000,25px 35px #c8c7c5,30px 35px #c8c7c5,35px 35px #000,40px 35px #000,45px 35px #000,50px 35px #c8c7c5,55px 35px #000,5px 40px #000,10px 40px #fff,15px 40px #fff,20px 40px #fff,25px 40px #000,30px 40px #000,35px 40px #c8c7c5,40px 40px #c8c7c5,45px 40px #c8c7c5,50px 40px #000,5px 45px #000,10px 45px #c8c7c5,15px 45px #fff,20px 45px #fff,25px 45px #fff,30px 45px #c8c7c5,35px 45px #c8c7c5,40px 45px #c8c7c5,45px 45px #c8c7c5,50px 45px #000,10px 50px #000,15px 50px #000,20px 50px #c8c7c5,25px 50px #c8c7c5,30px 50px #c8c7c5,35px 50px #c8c7c5,40px 50px #000,45px 50px #000,20px 55px #000,25px 55px #000,30px 55px #000,35px 55px #000,55px 55px transparent;
                }

                &.open:before {
                    background: #161616;
                    box-shadow: 20px -20px lighten(#161616,20%),25px -20px #000,30px -20px #000,35px -20px #161616,10px -15px lighten(#161616,20%),15px -15px #161616,20px -15px #000,25px -15px #fff,30px -15px #b5b5b5,35px -15px #000,40px -15px #161616,45px -15px #161616,5px -10px lighten(#161616,20%),10px -10px #000,15px -10px #000,20px -10px #a3a3a3,25px -10px #000,30px -10px #000,35px -10px #7a7a7a,40px -10px #000,45px -10px #000,50px -10px #161616,5px -5px #000,10px -5px #a3a3a3,15px -5px #a3a3a3,20px -5px #a3a3a3,25px -5px #a3a3a3,30px -5px #7a7a7a,35px -5px #7a7a7a,40px -5px #7a7a7a,45px -5px #7a7a7a,50px -5px #000,5px 0 #a3a3a3,10px 0 #a3a3a3,15px 0 #a3a3a3,20px 0 #a3a3a3,25px 0 #a3a3a3,30px 0 #a3a3a3,35px 0 #7a7a7a,40px 0 #7a7a7a,45px 0 #7a7a7a,50px 0 #7a7a7a,55px 0 #161616,0 5px #000,10px 5px #a3a3a3,15px 5px #a3a3a3,20px 5px #a3a3a3,25px 5px #a3a3a3,30px 5px #a3a3a3,35px 5px #7a7a7a,40px 5px #7a7a7a,45px 5px #7a7a7a,50px 5px #7a7a7a,55px 5px #000,0 10px #000,5px 10px #a3a3a3,10px 10px #a3a3a3,15px 10px #a3a3a3,20px 10px #a3a3a3,25px 10px #a3a3a3,30px 10px #7a7a7a,35px 10px #7a7a7a,40px 10px #7a7a7a,45px 10px #7a7a7a,50px 10px #7a7a7a,55px 10px #000,5px 15px #000,10px 15px #a3a3a3,15px 15px #a3a3a3,20px 15px #7a7a7a,25px 15px #7a7a7a,30px 15px #7a7a7a,35px 15px #7a7a7a,40px 15px #7a7a7a,45px 15px #7a7a7a,50px 15px #000,10px 20px #000,15px 20px #000,20px 20px #7a7a7a,25px 20px #7a7a7a,30px 20px #7a7a7a,35px 20px #7a7a7a,40px 20px #000,45px 20px #000,5px 25px #000,10px 25px #fff,15px 25px #000,20px 25px #000,25px 25px #000,30px 25px #000,35px 25px #000,40px 25px #000,45px 25px #c8c7c5,50px 25px #000,0 30px #000,5px 30px #fff,10px 30px #000,15px 30px #000,20px 30px #000,25px 30px #000,30px 30px #000,35px 30px #000,40px 30px #000,45px 30px #000,50px 30px #c8c7c5,55px 30px #000,0 35px #000,5px 35px #c8c7c5,10px 35px #000,15px 35px #000,20px 35px #000,25px 35px #000,30px 35px #000,35px 35px #000,40px 35px #000,45px 35px #000,50px 35px #c8c7c5,55px 35px #000,5px 40px #000,10px 40px #fff,15px 40px #000,20px 40px #000,25px 40px #000,30px 40px #000,35px 40px #000,40px 40px #000,45px 40px #c8c7c5,50px 40px #000,5px 45px #000,10px 45px #c8c7c5,15px 45px #fff,20px 45px #fff,25px 45px #c8c7c5,30px 45px #c8c7c5,35px 45px #c8c7c5,40px 45px #c8c7c5,45px 45px #c8c7c5,50px 45px #000,10px 50px #000,15px 50px #000,20px 50px #c8c7c5,25px 50px #c8c7c5,30px 50px #c8c7c5,35px 50px #c8c7c5,40px 50px #000,45px 50px #000,20px 55px #000,25px 55px #000,30px 55px #000,35px 55px #000,55px 55px transparent;
                }
            }

            .premierball {
                &:before { box-shadow: 20px 0 #000,25px 0 #000,30px 0 #000,35px 0 #000,10px 5px #000,15px 5px #000,20px 5px #fff,25px 5px #fff,30px 5px #c8c7c5,35px 5px #c8c7c5,40px 5px #000,45px 5px #000,5px 10px #000,10px 10px #fff,15px 10px #fff,20px 10px #fff,25px 10px #fff,30px 10px #fff,35px 10px #c8c7c5,40px 10px 0 0 #c8c7c5,45px 10px 0 0 #c8c7c5,50px 10px 0 0 #000,5px 15px 0 0 #000,10px 15px 0 0 #fff,15px 15px 0 0 #fff,20px 15px 0 0 #fff,25px 15px 0 0 #fff,30px 15px 0 0 #fff,35px 15px 0 0 #fff,40px 15px 0 0 #c8c7c5,45px 15px 0 0 #c8c7c5,50px 15px 0 0 #000,0 20px 0 0 #000,5px 20px 0 0 #fff,10px 20px 0 0 #fff,15px 20px 0 0 #fff,20px 20px 0 0 #fff,25px 20px 0 0 #fff,30px 20px 0 0 #fff,35px 20px 0 0 #fff,40px 20px 0 0 #fff,45px 20px 0 0 #c8c7c5,50px 20px 0 0 #c8c7c5,55px 20px 0 0 #000,0 25px 0 0 #000,5px 25px 0 0 #fff,10px 25px 0 0 #fff,15px 25px 0 0 #fff,20px 25px 0 0 #fff,25px 25px 0 0 #f80302,30px 25px 0 0 #f80302,35px 25px 0 0 #fff,40px 25px 0 0 #c8c7c5,45px 25px 0 0 #c8c7c5,50px 25px 0 0 #c8c7c5,55px 25px 0 0 #000,0 30px 0 0 #000,5px 30px 0 0 #f80302,10px 30px 0 0 #fff,15px 30px 0 0 #fff,20px 30px 0 0 #f80302,25px 30px 0 0 #fff,30px 30px 0 0 #c8c7c5,35px 30px 0 0 #f80302,40px 30px 0 0 #c8c7c5,45px 30px 0 0 #c8c7c5,50px 30px 0 0 #f80302,55px 30px 0 0 #000,0 35px 0 0 #000,5px 35px 0 0 #fff,10px 35px 0 0 #f80302,15px 35px 0 0 #f80302,20px 35px 0 0 #f80302,25px 35px 0 0 #c8c7c5,30px 35px 0 0 #c8c7c5,35px 35px 0 0 #f80302,40px 35px 0 0 #f80302,45px 35px 0 0 #f80302,50px 35px 0 0 #c8c7c5,55px 35px 0 0 #000,5px 40px 0 0 #000,10px 40px 0 0 #fff,15px 40px 0 0 #fff,20px 40px 0 0 #fff,25px 40px 0 0 #f80302,30px 40px 0 0 #f80302,35px 40px 0 0 #c8c7c5,40px 40px 0 0 #c8c7c5,45px 40px 0 0 #c8c7c5,50px 40px 0 0 #000,5px 45px 0 0 #000,10px 45px 0 0 #c8c7c5,15px 45px 0 0 #fff,20px 45px 0 0 #fff,25px 45px 0 0 #fff,30px 45px 0 0 #c8c7c5,35px 45px 0 0 #c8c7c5,40px 45px 0 0 #c8c7c5,45px 45px 0 0 #c8c7c5,50px 45px 0 0 #000,10px 50px 0 0 #000,15px 50px 0 0 #000,20px 50px 0 0 #c8c7c5,25px 50px 0 0 #c8c7c5,30px 50px 0 0 #c8c7c5,35px 50px 0 0 #c8c7c5,40px 50px 0 0 #000,45px 50px 0 0 #000,20px 55px 0 0 #000,25px 55px 0 0 #000,30px 55px 0 0 #000,35px 55px 0 0 #000,55px 55px 0 0 transparent }

                &.open:before {
                    background: #f80302;
                    box-shadow: 20px -20px #fff,25px -20px #f80302,30px -20px #f80302,35px -20px #c8c7c5,10px -15px #fff,15px -15px #c8c7c5,20px -15px #f80302,25px -15px #fff,30px -15px #b5b5b5,35px -15px #f80302,40px -15px #c8c7c5,45px -15px #c8c7c5,5px -10px #fff,10px -10px #f80302,15px -10px #f80302,20px -10px #a3a3a3,25px -10px #f80302,30px -10px #f80302,35px -10px #7a7a7a,40px -10px #f80302,45px -10px #f80302,50px -10px #c8c7c5,5px -5px #f80302,10px -5px #a3a3a3,15px -5px #a3a3a3,20px -5px #a3a3a3,25px -5px #a3a3a3,30px -5px #7a7a7a,35px -5px #7a7a7a,40px -5px #7a7a7a,45px -5px #7a7a7a,50px -5px #f80302,5px 0 #a3a3a3,10px 0 #a3a3a3,15px 0 #a3a3a3,20px 0 #a3a3a3,25px 0 #a3a3a3,30px 0 #a3a3a3,35px 0 #7a7a7a,40px 0 #7a7a7a,45px 0 #7a7a7a,50px 0 #7a7a7a,55px 0 #c8c7c5,0 5px #f80302,10px 5px #a3a3a3,15px 5px #a3a3a3,20px 5px #a3a3a3,25px 5px #a3a3a3,30px 5px #a3a3a3,35px 5px #7a7a7a,40px 5px #7a7a7a,45px 5px #7a7a7a,50px 5px #7a7a7a,55px 5px darken(#f80302,10%),0 10px #f80302,5px 10px #a3a3a3,10px 10px #a3a3a3,15px 10px #a3a3a3,20px 10px #a3a3a3,25px 10px #a3a3a3,30px 10px #7a7a7a,35px 10px #7a7a7a,40px 10px #7a7a7a,45px 10px #7a7a7a,50px 10px #7a7a7a,55px 10px darken(#f80302,10%),5px 15px #f80302,10px 15px #a3a3a3,15px 15px #a3a3a3,20px 15px #7a7a7a,25px 15px #7a7a7a,30px 15px #7a7a7a,35px 15px #7a7a7a,40px 15px #7a7a7a,45px 15px #7a7a7a,50px 15px darken(#f80302,10%),10px 20px darken(#f80302,10%),15px 20px darken(#f80302,10%),20px 20px #7a7a7a,25px 20px #7a7a7a,30px 20px #7a7a7a,35px 20px #7a7a7a,40px 20px darken(#f80302,10%),45px 20px darken(#f80302,10%),5px 25px #000,10px 25px #fff,15px 25px #000,20px 25px #000,25px 25px #000,30px 25px #000,35px 25px #000,40px 25px #000,45px 25px #c8c7c5,50px 25px #000,0 30px #000,5px 30px #fff,10px 30px #000,15px 30px #000,20px 30px #000,25px 30px #000,30px 30px #000,35px 30px #000,40px 30px #000,45px 30px #000,50px 30px #c8c7c5,55px 30px #000,0 35px #000,5px 35px #c8c7c5,10px 35px #000,15px 35px #000,20px 35px #000,25px 35px #000,30px 35px #000,35px 35px #000,40px 35px #000,45px 35px #000,50px 35px #c8c7c5,55px 35px #000,5px 40px #000,10px 40px #fff,15px 40px #000,20px 40px #000,25px 40px #000,30px 40px #000,35px 40px #000,40px 40px #000,45px 40px #c8c7c5,50px 40px #000,5px 45px #000,10px 45px #c8c7c5,15px 45px #fff,20px 45px #fff,25px 45px #c8c7c5,30px 45px #c8c7c5,35px 45px #c8c7c5,40px 45px #c8c7c5,45px 45px #c8c7c5,50px 45px #000,10px 50px #000,15px 50px #000,20px 50px #c8c7c5,25px 50px #c8c7c5,30px 50px #c8c7c5,35px 50px #c8c7c5,40px 50px #000,45px 50px #000,20px 55px #000,25px 55px #000,30px 55px #000,35px 55px #000,55px 55px transparent;
                }
            }

            .masterball {
                &:before { box-shadow: 20px 0 #000,25px 0 #000,30px 0 #000,35px 0 #000,10px 5px #000,15px 5px #000,20px 5px #663ab6,25px 5px #663ab6,30px 5px #3d236d,35px 5px #3d236d,40px 5px #000,45px 5px #000,5px 10px #000,10px 10px #e91d62,15px 10px #e91d62,20px 10px #663ab6,25px 10px #663ab6,30px 10px #663ab6,35px 10px #3d236d,40px 10px #e91d62,45px 10px #e91d62,50px 10px #000,5px 15px #000,10px 15px #e91d62,15px 15px #663ab6,20px 15px #fff,25px 15px #663ab6,30px 15px #663ab6,35px 15px #fff,40px 15px #3d236d,45px 15px #e91d62,50px 15px #000,0 20px #000,5px 20px #663ab6,10px 20px #663ab6,15px 20px #fff,20px 20px #663ab6,25px 20px #fff,30px 20px #fff,35px 20px #663ab6,40px 20px #fff,45px 20px #3d236d,50px 20px #3d236d,55px 20px #000,0 25px #000,5px 25px #663ab6,10px 25px #663ab6,15px 25px #fff,20px 25px #663ab6,25px 25px #000,30px 25px #000,35px 25px #663ab6,40px 25px #c8c7c5,45px 25px #3d236d,50px 25px #3d236d,55px 25px #000,0 30px #000,5px 30px #000,10px 30px #663ab6,15px 30px #663ab6,20px 30px #000,25px 30px #fff,30px 30px #c8c7c5,35px 30px #000,40px 30px #3d236d,45px 30px #3d236d,50px 30px #000,55px 30px #000,0 35px #000,5px 35px #fff,10px 35px #000,15px 35px #000,20px 35px #000,25px 35px #c8c7c5,30px 35px #c8c7c5,35px 35px #000,40px 35px #000,45px 35px #000,50px 35px #c8c7c5,55px 35px #000,5px 40px #000,10px 40px #fff,15px 40px #fff,20px 40px #fff,25px 40px #000,30px 40px #000,35px 40px #c8c7c5,40px 40px #c8c7c5,45px 40px #c8c7c5,50px 40px #000,5px 45px #000,10px 45px #c8c7c5,15px 45px #fff,20px 45px #fff,25px 45px #fff,30px 45px #c8c7c5,35px 45px #c8c7c5,40px 45px #c8c7c5,45px 45px #c8c7c5,50px 45px #000,10px 50px #000,15px 50px #000,20px 50px #c8c7c5,25px 50px #c8c7c5,30px 50px #c8c7c5,35px 50px #c8c7c5,40px 50px #000,45px 50px #000,20px 55px #000,25px 55px #000,30px 55px #000,35px 55px #000,55px 55px transparent }

                &.open:before {
                    background: #3d236d;
                    box-shadow: 20px -20px #663ab6,25px -20px #000,30px -20px #000,35px -20px #3d236d,10px -15px #663ab6,15px -15px #3d236d,20px -15px #000,25px -15px #fff,30px -15px #b5b5b5,35px -15px #000,40px -15px #3d236d,45px -15px #3d236d,5px -10px #663ab6,10px -10px #000,15px -10px #000,20px -10px #a3a3a3,25px -10px #000,30px -10px #000,35px -10px #7a7a7a,40px -10px #000,45px -10px #000,50px -10px #3d236d,5px -5px #000,10px -5px #a3a3a3,15px -5px #a3a3a3,20px -5px #a3a3a3,25px -5px #a3a3a3,30px -5px #7a7a7a,35px -5px #7a7a7a,40px -5px #7a7a7a,45px -5px #7a7a7a,50px -5px #000,5px 0 #a3a3a3,10px 0 #a3a3a3,15px 0 #a3a3a3,20px 0 #a3a3a3,25px 0 #a3a3a3,30px 0 #a3a3a3,35px 0 #7a7a7a,40px 0 #7a7a7a,45px 0 #7a7a7a,50px 0 #7a7a7a,55px 0 #3d236d,0 5px #000,10px 5px #a3a3a3,15px 5px #a3a3a3,20px 5px #a3a3a3,25px 5px #a3a3a3,30px 5px #a3a3a3,35px 5px #7a7a7a,40px 5px #7a7a7a,45px 5px #7a7a7a,50px 5px #7a7a7a,55px 5px #000,0 10px #000,5px 10px #a3a3a3,10px 10px #a3a3a3,15px 10px #a3a3a3,20px 10px #a3a3a3,25px 10px #a3a3a3,30px 10px #7a7a7a,35px 10px #7a7a7a,40px 10px #7a7a7a,45px 10px #7a7a7a,50px 10px #7a7a7a,55px 10px #000,5px 15px #000,10px 15px #a3a3a3,15px 15px #a3a3a3,20px 15px #7a7a7a,25px 15px #7a7a7a,30px 15px #7a7a7a,35px 15px #7a7a7a,40px 15px #7a7a7a,45px 15px #7a7a7a,50px 15px #000,10px 20px #000,15px 20px #000,20px 20px #7a7a7a,25px 20px #7a7a7a,30px 20px #7a7a7a,35px 20px #7a7a7a,40px 20px #000,45px 20px #000,5px 25px #000,10px 25px #fff,15px 25px #000,20px 25px #000,25px 25px #000,30px 25px #000,35px 25px #000,40px 25px #000,45px 25px #c8c7c5,50px 25px #000,0 30px #000,5px 30px #fff,10px 30px #000,15px 30px #000,20px 30px #000,25px 30px #000,30px 30px #000,35px 30px #000,40px 30px #000,45px 30px #000,50px 30px #c8c7c5,55px 30px #000,0 35px #000,5px 35px #c8c7c5,10px 35px #000,15px 35px #000,20px 35px #000,25px 35px #000,30px 35px #000,35px 35px #000,40px 35px #000,45px 35px #000,50px 35px #c8c7c5,55px 35px #000,5px 40px #000,10px 40px #fff,15px 40px #000,20px 40px #000,25px 40px #000,30px 40px #000,35px 40px #000,40px 40px #000,45px 40px #c8c7c5,50px 40px #000,5px 45px #000,10px 45px #c8c7c5,15px 45px #fff,20px 45px #fff,25px 45px #c8c7c5,30px 45px #c8c7c5,35px 45px #c8c7c5,40px 45px #c8c7c5,45px 45px #c8c7c5,50px 45px #000,10px 50px #000,15px 50px #000,20px 50px #c8c7c5,25px 50px #c8c7c5,30px 50px #c8c7c5,35px 50px #c8c7c5,40px 50px #000,45px 50px #000,20px 55px #000,25px 55px #000,30px 55px #000,35px 55px #000,55px 55px transparent;
                }
            }
        }

        .prof-oak {
            @include base;

            width: 80px;
            height: 100px;
            margin-bottom: 20px;

            &:before { box-shadow: 15px 0 #000,20px 0 #000,25px 0 #000,30px 0 #000,10px 5px #000,15px 5px #afafa6,20px 5px #afafa6,25px 5px #afafa6,30px 5px #6f6f66,35px 5px #000,40px 5px #000,45px 5px #000,50px 5px #000,5px 10px #000,10px 10px #000,15px 10px #8f8f7c,20px 10px #afafa6,25px 10px #afafa6,30px 10px #afafa6,35px 10px #afafa6,40px 10px #afafa6,45px 10px #afafa6,50px 10px #8f8f7c,55px 10px #000,60px 10px #000,5px 15px #000,10px 15px #8f8f7c,15px 15px #afafa6,20px 15px #afafa6,25px 15px #afafa6,30px 15px #afafa6,35px 15px #afafa6,40px 15px #afafa6,45px 15px #afafa6,50px 15px #afafa6,55px 15px #afafa6,60px 15px #000,65px 15px #000,10px 20px #000,15px 20px #8f8f7c,20px 20px #8f8f7c,25px 20px #afafa6,30px 20px #afafa6,35px 20px #afafa6,40px 20px #afafa6,45px 20px #afafa6,50px 20px #afafa6,55px 20px #8f8f7c,60px 20px #8f8f7c,65px 20px #000,10px 25px #000,15px 25px #8f8f7c,20px 25px #f7bf72,25px 25px #fcd695,30px 25px #fcd695,35px 25px #afafa6,40px 25px #8f8f7c,45px 25px #fcd695,50px 25px #fcd695,55px 25px #d3b543,60px 25px #8f8f7c,65px 25px #000,5px 30px #000,10px 30px #f8bf72,15px 30px #4e4347,20px 30px #fcd695,25px 30px #fcd695,30px 30px #fcd695,35px 30px #8f8f7c,40px 30px #fcd695,45px 30px #fcd695,50px 30px #fcd695,55px 30px #fcd695,60px 30px #4e4347,65px 30px #f8bf72,70px 30px #000,5px 35px #000,10px 35px #e69651,15px 35px #4e4347,20px 35px #6f6f66,25px 35px #fcd695,30px 35px #fcd695,35px 35px #fcd695,40px 35px #fcd695,45px 35px #fcd695,50px 35px #fcd695,55px 35px #6f6f66,60px 35px #4e4347,65px 35px #e69651,70px 35px #000,10px 40px #000,15px 40px #e69651,20px 40px #6f6f66,25px 40px #6f6f66,30px 40px #fcd695,35px 40px #f7bf72,40px 40px #f7bf72,45px 40px #fcd695,50px 40px #6f6f66,55px 40px #6f6f66,60px 40px #e69651,65px 40px #000,15px 45px #000,20px 45px #f7bf72,25px 45px #f7bf72,30px 45px #883b31,35px 45px #e59654,40px 45px #e59654,45px 45px #883b31,50px 45px #f7bf72,55px 45px #f7bf72,60px 45px #000,15px 50px #000,20px 50px #e59654,25px 50px #f7bf72,30px 50px #000,35px 50px #e59654,40px 50px #e59654,45px 50px #000,50px 50px #f7bf72,55px 50px #e59654,60px 50px #000,10px 55px #000,15px 55px #fff,20px 55px #000,25px 55px #e59654,30px 55px #e59654,35px 55px #e59654,40px 55px #e59654,45px 55px #e59654,50px 55px #e59654,55px 55px #000,60px 55px #fff,65px 55px #000,5px 60px #000,10px 60px #cabfb9,15px 60px #fff,20px 60px #fff,25px 60px #883b31,30px 60px #000,35px 60px #000,40px 60px #000,45px 60px #000,50px 60px #883b31,55px 60px #fff,60px 60px #fff,65px 60px #cabfb9,70px 60px #000,5px 65px #000,10px 65px #e59654,15px 65px #fff,20px 65px #4e4347,25px 65px #cabfb9,30px 65px #92897a,35px 65px #ef642d,40px 65px #ef642d,45px 65px #92897a,50px 65px #cabfb9,55px 65px #4e4347,60px 65px #fff,65px 65px #e59654,70px 65px #000,5px 70px #000,10px 70px #e59654,15px 70px #e59654,20px 70px #92897a,25px 70px #fff,30px 70px #fff,35px 70px #ef642d,40px 70px #ef642d,45px 70px #fff,50px 70px #fff,55px 70px #92897a,60px 70px #e59654,65px 70px #e59654,70px 70px #000,10px 75px #000,15px 75px #883b31,20px 75px #92897a,25px 75px #cabfb9,30px 75px #fff,35px 75px #a13217,40px 75px #a13217,45px 75px #fff,50px 75px #cabfb9,55px 75px #92897a,60px 75px #883b31,65px 75px #000,15px 80px #000,20px 80px #cabfb9,25px 80px #cabfb9,30px 80px #cabfb9,35px 80px #000,40px 80px #000,45px 80px #cabfb9,50px 80px #cabfb9,55px 80px #cabfb9,60px 80px #000,15px 85px #000,20px 85px #883b31,25px 85px #cabfb9,30px 85px #cabfb9,35px 85px #000,40px 85px #000,45px 85px #cabfb9,50px 85px #cabfb9,55px 85px #883b31,60px 85px #000,15px 90px #000,20px 90px #80782d,25px 90px #80782d,30px 90px #000,45px 90px #000,50px 90px #80782d,55px 90px #80782d,60px 90px #000,20px 95px #000,25px 95px #000,50px 95px #000,55px 95px #000 }
        }

        .squirtle {
            @include base;

            width: 110px;
            height: 85px;

            &:before { box-shadow: 20px 0 #000,25px 0 #000,30px 0 #000,35px 0 #000,85px 0 #000,90px 0 #000,95px 0 #000,15px 5px #000,20px 5px #87c0ea,25px 5px #87c0ea,30px 5px #87c0ea,35px 5px #0f96ff,40px 5px #000,45px 5px #000,80px 5px #000,85px 5px #87c0ea,90px 5px #87c0ea,95px 5px #87c0ea,100px 5px #000,10px 10px #000,15px 10px #87c0ea,20px 10px #87c0ea,25px 10px #87c0ea,30px 10px #87c0ea,35px 10px #87c0ea,40px 10px #87c0ea,45px 10px #0f96ff,50px 10px #000,55px 10px #000,75px 10px #000,80px 10px #87c0ea,85px 10px #87c0ea,90px 10px #87c0ea,95px 10px #0f96ff,100px 10px #0f96ff,105px 10px #000,10px 15px #000,15px 15px #87c0ea,20px 15px #87c0ea,25px 15px #87c0ea,30px 15px #87c0ea,35px 15px #87c0ea,40px 15px #87c0ea,45px 15px #87c0ea,50px 15px #000,55px 15px #630,60px 15px #000,65px 15px #000,75px 15px #000,80px 15px #87c0ea,85px 15px #87c0ea,90px 15px #0f96ff,95px 15px #000,100px 15px #0f96ff,105px 15px #000,5px 20px #000,10px 20px #630,15px 20px #87c0ea,20px 20px #87c0ea,25px 20px #87c0ea,30px 20px #87c0ea,35px 20px #87c0ea,40px 20px #87c0ea,45px 20px #87c0ea,50px 20px #0f96ff,55px 20px #630,60px 20px #630,65px 20px #630,70px 20px #000,75px 20px #87c0ea,80px 20px #87c0ea,85px 20px #0f96ff,90px 20px #000,95px 20px #0f96ff,100px 20px #0f96ff,105px 20px #000,5px 25px #000,10px 25px #87c0ea,15px 25px #87c0ea,20px 25px #87c0ea,25px 25px #87c0ea,30px 25px #fff,35px 25px #000,40px 25px #87c0ea,45px 25px #87c0ea,50px 25px #0f96ff,55px 25px #fff,60px 25px #630,65px 25px #630,70px 25px #630,75px 25px #000,80px 25px #0f96ff,85px 25px #0f96ff,90px 25px #000,95px 25px #0f96ff,100px 25px #000,5px 30px #000,10px 30px #0f96ff,15px 30px #87c0ea,20px 30px #87c0ea,25px 30px #87c0ea,30px 30px #000,35px 30px #630,40px 30px #87c0ea,45px 30px #0f96ff,50px 30px #0f96ff,55px 30px #fff,60px 30px #630,65px 30px #630,70px 30px #630,75px 30px #000,80px 30px #0f96ff,85px 30px #000,90px 30px #000,95px 30px #000,10px 35px #000,15px 35px #0f96ff,20px 35px #0f96ff,25px 35px #0f96ff,30px 35px #000,35px 35px #630,40px 35px #0f96ff,45px 35px #0f96ff,50px 35px #0f96ff,55px 35px #000,60px 35px #fff,65px 35px #630,70px 35px #630,75px 35px #630,80px 35px #000,85px 35px #000,15px 40px #000,20px 40px #000,25px 40px #0f96ff,30px 40px #0f96ff,35px 40px #0f96ff,40px 40px #0f96ff,45px 40px #000,50px 40px #000,55px 40px #87c0ea,60px 40px #87c0ea,65px 40px #fff,70px 40px #630,75px 40px #630,80px 40px #000,15px 45px #000,20px 45px #0f96ff,25px 45px #000,30px 45px #000,35px 45px #000,40px 45px #000,45px 45px #87c0ea,50px 45px #87c0ea,55px 45px #87c0ea,60px 45px #0f96ff,65px 45px #fff,70px 45px #630,75px 45px #630,80px 45px #000,20px 50px #000,25px 50px #000,30px 50px #eef30c,35px 50px #eef30c,40px 50px #000,45px 50px #87c0ea,50px 50px #87c0ea,55px 50px #0f96ff,60px 50px #000,65px 50px #fff,70px 50px #630,75px 50px #630,80px 50px #000,30px 55px #000,35px 55px #eef30c,40px 55px #eef30c,45px 55px #000,50px 55px #000,55px 55px #000,60px 55px #000,65px 55px #fff,70px 55px #630,75px 55px #630,80px 55px #000,25px 60px #000,30px 60px #0f96ff,35px 60px #000,40px 60px #eef30c,45px 60px #eef30c,50px 60px #eef30c,55px 60px #eef30c,60px 60px #eef30c,65px 60px #000,70px 60px #fff,75px 60px #000,30px 65px #000,35px 65px #000,40px 65px #000,45px 65px #000,50px 65px #eef30c,55px 65px #eef30c,60px 65px #87c0ea,65px 65px #000,70px 65px #fff,75px 65px #000,45px 70px #000,50px 70px #000,55px 70px #000,60px 70px #87c0ea,65px 70px #000,70px 70px #000,50px 75px #000,55px 75px #0f96ff,60px 75px #0f96ff,65px 75px #0f96ff,70px 75px #000,55px 80px #000,60px 80px #000,65px 80px #000 }
        }

        .charmander {
            @include base;

            width: 115px;
            height: 90px;

            &:before { box-shadow: 25px 0 #000,30px 0 #000,35px 0 #000,40px 0 #000,90px 0 #000,20px 5px #000,25px 5px #ff7d27,30px 5px #ff7d27,35px 5px #ff7d27,40px 5px #fd6309,45px 5px #000,85px 5px #000,90px 5px #fe0100,95px 5px #000,15px 10px #000,20px 10px #ff7d27,25px 10px #ff7d27,30px 10px #ff7d27,35px 10px #ff7d27,40px 10px #ff7d27,45px 10px #fd6309,50px 10px #000,85px 10px #000,90px 10px #fe0100,95px 10px #fe0100,100px 10px #000,15px 15px #000,20px 15px #ff7d27,25px 15px #ff7d27,30px 15px #ff7d27,35px 15px #ff7d27,40px 15px #ff7d27,45px 15px #ff7d27,50px 15px #000,85px 15px #000,90px 15px #fe0100,95px 15px #fe0100,100px 15px #000,10px 20px #000,15px 20px #ff7d27,20px 20px #ff7d27,25px 20px #ff7d27,30px 20px #ff7d27,35px 20px #ff7d27,40px 20px #ff7d27,45px 20px #ff7d27,50px 20px #fd6309,55px 20px #000,80px 20px #000,85px 20px #fe0100,90px 20px #fe0100,95px 20px #fe0100,100px 20px #fe0100,105px 20px #000,5px 25px #000,10px 25px #ff7d27,15px 25px #ff7d27,20px 25px #ff7d27,25px 25px #ff7d27,30px 25px #fff,35px 25px #000,40px 25px #ff7d27,45px 25px #ff7d27,50px 25px #fd6309,55px 25px #000,80px 25px #000,85px 25px #fe0100,90px 25px #fe0100,95px 25px #fee600,100px 25px #fe0100,105px 25px #000,5px 30px #000,10px 30px #ff7d27,15px 30px #ff7d27,20px 30px #ff7d27,25px 30px #ff7d27,30px 30px darken(#0f96ff,30%),35px 30px #000,40px 30px #ff7d27,45px 30px #fd6309,50px 30px #fd6309,55px 30px #fd6309,60px 30px #000,80px 30px #000,85px 30px #fe0100,90px 30px #fee600,95px 30px #fee600,100px 30px #fe0100,105px 30px #000,5px 35px #000,10px 35px #ff7d27,15px 35px #ff7d27,20px 35px #ff7d27,25px 35px #ff7d27,30px 35px #000,35px 35px #000,40px 35px #ff7d27,45px 35px #fd6309,50px 35px #fd6309,55px 35px #fd6309,60px 35px #000,85px 35px #000,90px 35px #fee600,95px 35px #000,100px 35px #000,10px 40px #000,15px 40px #ff7d27,20px 40px #ff7d27,25px 40px #ff7d27,30px 40px #ff7d27,35px 40px #ff7d27,40px 40px #fd6309,45px 40px #fd6309,50px 40px #fd6309,55px 40px #fd6309,60px 40px #fd6309,65px 40px #000,85px 40px #000,90px 40px #ff7d27,95px 40px #000,15px 45px #000,20px 45px #000,25px 45px #fd6309,30px 45px #ff7d27,35px 45px #ff7d27,40px 45px #fd6309,45px 45px #fd6309,50px 45px #fd6309,55px 45px #fd6309,60px 45px #fd6309,65px 45px #fd6309,70px 45px #000,80px 45px #000,85px 45px #ff7d27,90px 45px #ff7d27,95px 45px #000,25px 50px #000,30px 50px #000,35px 50px #000,40px 50px #fd6309,45px 50px #fd6309,50px 50px #000,55px 50px #fd6309,60px 50px #fd6309,65px 50px #fd6309,70px 50px #000,75px 50px #000,80px 50px #fd6309,85px 50px #ff7d27,90px 50px #000,30px 55px #000,35px 55px #fee600,40px 55px #fee600,45px 55px #000,50px 55px #fd6309,55px 55px #fd6309,60px 55px #fd6309,65px 55px #fd6309,70px 55px #fd6309,75px 55px #000,80px 55px #fd6309,85px 55px #ff7d27,90px 55px #000,30px 60px #000,35px 60px #fee600,40px 60px #fee600,45px 60px #fee600,50px 60px #000,55px 60px #000,60px 60px #fd6309,65px 60px #fd6309,70px 60px #fd6309,75px 60px #000,80px 60px #fd6309,85px 60px #000,25px 65px #000,30px 65px #fff,35px 65px #000,40px 65px #fee600,45px 65px #fee600,50px 65px #fee600,55px 65px #fd6309,60px 65px #fd6309,65px 65px #fd6309,70px 65px #fd6309,75px 65px #000,80px 65px #000,30px 70px #000,35px 70px #000,40px 70px #000,45px 70px #fee600,50px 70px #fee600,55px 70px #fd6309,60px 70px #fd6309,65px 70px #fd6309,70px 70px #000,75px 70px #000,45px 75px #000,50px 75px #000,55px 75px darken(#fd6309,15%),60px 75px #fd6309,65px 75px darken(#fd6309,15%),70px 75px #000,50px 80px #000,55px 80px #fff,60px 80px darken(#fd6309,5%),65px 80px #fff,70px 80px #000,55px 85px #000,60px 85px #000,65px 85px #000 }
        }

        .bulbasaur {
            @include base;

            width: 110px;
            height: 85px;

            &:before { box-shadow: 65px 0 #000,70px 0 #000,75px 0 #000,60px 5px #000,65px 5px #118b05,70px 5px #118b05,75px 5px #118b05,80px 5px #000,50px 10px #000,55px 10px #000,60px 10px #000,65px 10px #118b05,70px 10px #0a5503,75px 10px #118b05,80px 10px #000,40px 15px #000,45px 15px #000,50px 15px #118b05,55px 15px #0a5503,60px 15px #118b05,65px 15px #0a5503,70px 15px #118b05,75px 15px #0a5503,80px 15px #118b05,85px 15px #000,90px 15px #000,20px 20px #000,35px 20px #000,40px 20px #118b05,45px 20px #118b05,50px 20px #0a5503,55px 20px #118b05,60px 20px #118b05,65px 20px #0a5503,70px 20px #118b05,75px 20px #0a5503,80px 20px #118b05,85px 20px #118b05,90px 20px #118b05,95px 20px #000,15px 25px #000,20px 25px #3edef4,25px 25px #000,30px 25px #000,35px 25px #000,40px 25px #118b05,45px 25px #0a5503,50px 25px #118b05,55px 25px #118b05,60px 25px #118b05,65px 25px #0a5503,70px 25px #118b05,75px 25px #118b05,80px 25px #0a5503,85px 25px #118b05,90px 25px #118b05,95px 25px #118b05,100px 25px #000,15px 30px #000,20px 30px #3edef4,25px 30px #3edef4,30px 30px #3edef4,35px 30px #3edef4,40px 30px #000,45px 30px #000,50px 30px #118b05,55px 30px #118b05,60px 30px #0a5503,65px 30px #118b05,70px 30px #118b05,75px 30px #118b05,80px 30px #118b05,85px 30px #0a5503,90px 30px #118b05,95px 30px #118b05,100px 30px #000,15px 35px #000,20px 35px #3edef4,25px 35px #3edef4,30px 35px #3edef4,35px 35px #3edef4,40px 35px #0baee5,45px 35px #0baee5,50px 35px #000,55px 35px #118b05,60px 35px #0a5503,65px 35px #118b05,70px 35px #118b05,75px 35px #118b05,80px 35px #118b05,85px 35px #0a5503,90px 35px #118b05,95px 35px #118b05,100px 35px #000,10px 40px #000,15px 40px #3edef4,20px 40px #3edef4,25px 40px #0baee5,30px 40px #3edef4,35px 40px #0baee5,40px 40px #0baee5,45px 40px #3edef4,50px 40px #3edef4,55px 40px #000,60px 40px #000,65px 40px #000,70px 40px #118b05,75px 40px #118b05,80px 40px #118b05,85px 40px #0a5503,90px 40px #118b05,95px 40px #000,5px 45px #000,10px 45px #000,15px 45px #0baee5,20px 45px #3edef4,25px 45px #3edef4,30px 45px #3edef4,35px 45px #3edef4,40px 45px #3edef4,45px 45px #3edef4,50px 45px #3edef4,55px 45px #3edef4,60px 45px #3edef4,65px 45px #000,70px 45px #118b05,75px 45px #118b05,80px 45px #000,85px 45px #000,90px 45px #000,95px 45px #0baee5,100px 45px #000,5px 50px #000,10px 50px #000,15px 50px #0baee5,20px 50px #3edef4,25px 50px #3edef4,30px 50px #3edef4,35px 50px #0baee5,40px 50px #3edef4,45px 50px #3edef4,50px 50px #3edef4,55px 50px #3edef4,60px 50px #000,65px 50px #0baee5,70px 50px #000,75px 50px #000,80px 50px #000,85px 50px #0baee5,90px 50px #0baee5,95px 50px #0baee5,100px 50px #000,5px 55px #000,10px 55px #3edef4,15px 55px #3edef4,20px 55px #3edef4,25px 55px #3edef4,30px 55px #0baee5,35px 55px #3edef4,40px 55px #000,45px 55px #000,50px 55px #3edef4,55px 55px #3edef4,60px 55px #0baee5,65px 55px #0baee5,70px 55px #0baee5,75px 55px #0baee5,80px 55px #0baee5,85px 55px #000,90px 55px #0baee5,95px 55px #fff,100px 55px #000,5px 60px #000,10px 60px #0baee5,15px 60px #3edef4,20px 60px #3edef4,25px 60px #3edef4,30px 60px #3edef4,35px 60px #000,40px 60px #fe0100,45px 60px #fff,50px 60px #fff,55px 60px #3edef4,60px 60px #0baee5,65px 60px #000,70px 60px #0baee5,75px 60px #000,80px 60px #fff,85px 60px #000,90px 60px #000,95px 60px #000,10px 65px #000,15px 65px #0baee5,20px 65px #3edef4,25px 65px #3edef4,30px 65px #3edef4,35px 65px #000,40px 65px #fe0100,45px 65px #fff,50px 65px #3edef4,55px 65px #0baee5,60px 65px #000,65px 65px #0baee5,70px 65px #0baee5,75px 65px #0baee5,80px 65px #000,15px 70px #000,20px 70px #000,25px 70px #0baee5,30px 70px #0baee5,35px 70px #0baee5,40px 70px #0baee5,45px 70px #0baee5,50px 70px #0baee5,55px 70px #000,60px 70px #0baee5,65px 70px #0baee5,70px 70px #0baee5,75px 70px #0baee5,80px 70px #000,25px 75px #000,30px 75px #000,35px 75px #000,40px 75px #000,45px 75px #000,50px 75px #000,55px 75px #000,60px 75px #000,65px 75px #fff,70px 75px #3edef4,75px 75px #fff,80px 75px #000,65px 80px #000,70px 80px #000,75px 80px #000 }
        }

        .pikachu {
            @include base;

            width: 110px;
            height: 95px;

            &:before { box-shadow:30px 0 #000,35px 0 #000,90px 0 #000,25px 5px #000,30px 5px #000,35px 5px #000,85px 5px #000,90px 5px #ff0,95px 5px #000,25px 10px #000,30px 10px #ff0,35px 10px #000,80px 10px #000,85px 10px #ff0,90px 10px #ffe100,95px 10px #ffe100,100px 10px #000,20px 15px #000,25px 15px #ff0,30px 15px #ff0,35px 15px #000,60px 15px #000,65px 15px #000,70px 15px #000,75px 15px #000,80px 15px #ff0,85px 15px #ffe100,90px 15px #ffe100,95px 15px #ffe100,100px 15px #000,20px 20px #000,25px 20px #ff0,30px 20px #ffe100,35px 20px #000,50px 20px #000,55px 20px #000,60px 20px #000,65px 20px #000,70px 20px #000,75px 20px #000,80px 20px #ffe100,85px 20px #ffe100,90px 20px #ffe100,95px 20px #000,15px 25px #000,20px 25px #ff0,25px 25px #ff0,30px 25px #ff0,35px 25px #ff0,40px 25px #000,45px 25px #000,50px 25px #ff0,55px 25px #ff0,60px 25px #000,65px 25px #000,70px 25px #000,75px 25px #ffe100,80px 25px #ffe100,85px 25px #ffe100,90px 25px #000,10px 30px #000,15px 30px #ff0,20px 30px #ff0,25px 30px #ff0,30px 30px #ff0,35px 30px #ff0,40px 30px #ff0,45px 30px #ff0,50px 30px #ff0,55px 30px #ff0,60px 30px #000,70px 30px #000,75px 30px #ffe100,80px 30px #ffe100,85px 30px #000,5px 35px #000,10px 35px #fff,15px 35px #ff0,20px 35px #ff0,25px 35px #ff0,30px 35px #ff0,35px 35px #ff0,40px 35px #ff0,45px 35px #ff0,50px 35px #ff0,55px 35px #ffe100,60px 35px #000,75px 35px #000,80px 35px #ffe100,85px 35px #ffe100,90px 35px #000,5px 40px #000,10px 40px #000,15px 40px #ff0,20px 40px #ff0,25px 40px #ff0,30px 40px #ff0,35px 40px #ff0,40px 40px #ff0,45px 40px #ff0,50px 40px #ff0,55px 40px #ff0,60px 40px #ffe100,65px 40px #000,80px 40px #000,85px 40px #ffe100,90px 40px #000,5px 45px #000,10px 45px #ff0,15px 45px #ff0,20px 45px #ff0,25px 45px #ff0,30px 45px #fff,35px 45px #000,40px 45px #ff0,45px 45px #ff0,50px 45px #ff0,55px 45px #ff0,60px 45px #ffe100,65px 45px #ffe100,70px 45px #000,75px 45px #000,80px 45px #ffe100,85px 45px #000,10px 50px #000,15px 50px #ff0,20px 50px #ff0,25px 50px #ff0,30px 50px #000,35px 50px #000,40px 50px red,45px 50px red,50px 50px #ff0,55px 50px #ffe100,60px 50px #ffe100,65px 50px #ffe100,70px 50px #000,75px 50px #000,80px 50px #000,15px 55px #000,20px 55px #ffe100,25px 55px #ff0,30px 55px #ff0,35px 55px #ff0,40px 55px red,45px 55px #ffe100,50px 55px #ffe100,55px 55px #ffe100,60px 55px #ffe100,65px 55px #000,70px 55px #000,75px 55px #000,15px 60px #000,20px 60px #ff0,25px 60px #ffe100,30px 60px #ffe100,35px 60px #ffe100,40px 60px #ffe100,45px 60px #ffe100,50px 60px #000,55px 60px #ffe100,60px 60px #ffe100,65px 60px #ffe100,70px 60px #ffe100,75px 60px #000,20px 65px #000,25px 65px #000,30px 65px #ffe100,35px 65px #ff0,40px 65px #ff0,45px 65px #000,50px 65px #ff0,55px 65px #ffe100,60px 65px #ffe100,65px 65px #ffe100,70px 65px #000,75px 65px #000,20px 70px #000,25px 70px #ffe100,30px 70px #000,35px 70px #ff0,40px 70px #ff0,45px 70px #ffe100,50px 70px #000,55px 70px #ffe100,60px 70px #ffe100,65px 70px #ffe100,70px 70px #ffe100,75px 70px #000,20px 75px #000,25px 75px #000,30px 75px #000,35px 75px #000,40px 75px #000,45px 75px #ffe100,50px 75px #ffe100,55px 75px #ffe100,60px 75px #ffe100,65px 75px #ffe100,70px 75px #000,45px 80px #000,50px 80px #000,55px 80px #000,60px 80px #ffe100,65px 80px #000,70px 80px #000,50px 85px #000,55px 85px #ff0,60px 85px #ff0,65px 85px #ffe100,70px 85px #000,55px 90px #000,60px 90px #000,65px 90px #000 }
        }
    }
}
</style>
