<template>
    <div class="trinket-capsule">
        <div class="wrapper">
            <div class="capsule-machine pix">
                <div class="toy-box" />
                <div class="lock-cover" />
                <div class="cover a" />
                <div class="cover b" />
                <div class="cover c" />
                <div class="cover d" />
                <div class="cover e" />
                <div class="circle pix">
                    <div class="handle" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Bus from '@/utils/bus'

export default {
    mounted() {
        const settings = {
            capsuleNo: 20,
            isTurningHandle: false,
            isHandleLocked: false,
            handlePrevDeg: 0,
            handleDeg: 0,
            handleRotate: 0,
            flapRotate: 0,
            collectedNo: 0,
        }

        const container = document.querySelector('.trinket-capsule')

        const elements = {
            wrapper: container.querySelector('.wrapper'),
            capsuleMachine: container.querySelector('.capsule-machine'),
            circle: container.querySelector('.circle'),
            handle: container.querySelector('.handle'),
            toyBox: container.querySelector('.toy-box'),
        }

        const vector = {
            x: 0,
            y: 0,
            create: function(x, y) {
                const obj = Object.create(this)
                obj.x = x
                obj.y = y
                return obj
            },
            setXy: function({ x, y }) {
                this.x = x
                this.y = y
            },
            setAngle: function(angle) {
                const length = this.magnitude()
                this.x = Math.cos(angle) * length
                this.y = Math.sin(angle) * length
            },
            setLength: function(length) {
                const angle = Math.atan2(this.y, this.x)
                this.x = Math.cos(angle) * length
                this.y = Math.sin(angle) * length
            },
            magnitude: function() {
                return Math.sqrt(this.x * this.x + this.y * this.y)
            },
            multiply: function(n) {
                return this.create(this.x * n, this.y * n)
            },
            addTo: function(v2) {
                this.x += v2.x
                this.y += v2.y
            },
            multiplyBy: function(n) {
                this.x *= n
                this.y *= n
            },
        }

        const rotatePoint = ({ angle, axis, point }) => {
            const a = degToRad(angle)
            const aX = point.x - axis.x
            const aY = point.y - axis.y
            return {
                x: (aX * Math.cos(a)) - (aY * Math.sin(a)) + axis.x,
                y: (aX * Math.sin(a)) + (aY * Math.cos(a)) + axis.y,
            }
        }

        const px = num => `${num}px`
        const randomN = max => Math.ceil(Math.random() * max)
        const degToRad = deg => deg / (180 / Math.PI)
        const radToDeg = rad => Math.round(rad * (180 / Math.PI))
        const angleTo = ({ a, b }) => Math.atan2(b.y - a.y, b.x - a.x)
        const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)))
        const getPage = (e, type) => e.type[0] === 'm' ? e[`page${type}`] : e.touches[0][`page${type}`]
        const calcCollectedX = () => settings.collectedNo % 10 * 32
        const calcCollectedY = () => Math.floor(settings.collectedNo / 10) * 32
        const nearest360 = n => n === 0 ? 0 : (n - 1) + Math.abs(((n - 1) % 360) - 360)

        const setStyles = ({ el, x, y, w, deg }) => {
            if (w) el.style.width = w
            el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
        }

        const lineData = [
            {
                start: { x: 0, y: 280 },
                end: { x: 160, y: 360 },
                point: 'end',
                axis: 'start',
                id: 'flap_1'
            },
            {
                start: { x: 160, y: 360 },
                end: { x: 320, y: 280, },
                point: 'start',
                axis: 'end',
                id: 'flap_2'
            },
            {
                start: { x: 70, y: 340 },
                end: { x: 230, y: 490 },
                point: 'start',
                axis: 'end',
                id: 'ramp'
            }
        ]

        const getRandomToy = () => {
            return ['bunny', 'duck-yellow', 'duck-pink', 'star', 'water-melon', 'panda', 'dino', 'roboto-san', 'roboto-sama', 'penguin', 'turtle'][randomN(11) - 1]
        }

        const items = elements.capsuleMachine.querySelectorAll('.capsule-wrapper')
        items.forEach(i => {
            elements.capsuleMachine.removeChild(i)
        })

        new Array(settings.capsuleNo).fill('').forEach(() => {
            const capsule = Object.assign(document.createElement('div'),
                { className: 'capsule-wrapper pix',
                    innerHTML: `<div class="capsule">
                          <div class="lid"></div>
                          <div class="${getRandomToy()} toy pix"></div>
                          <div class="base ${['red', 'pink', 'white', 'blue'][randomN(4) - 1]}"></div>
                        </div>`
                })
            elements.capsuleMachine.appendChild(capsule)
        })
        lineData.forEach(() => {
            [
                Object.assign(document.createElement('div'),
                    { className: 'line-start', innerHTML: '<div class="line"></div>' }),
                Object.assign(document.createElement('div'), { className: 'line-end' })
            ].forEach(ele => {
                elements.capsuleMachine.appendChild(ele)
            })
        })

        const lineStarts = container.querySelectorAll('.line-start')
        const lines = container.querySelectorAll('.line')
        const lineEnds = container.querySelectorAll('.line-end')
        const toys = container.querySelectorAll('.toy')
        const { width: capsuleMachineWidth, height: capsuleMachineHeight } = elements.capsuleMachine.getBoundingClientRect()

        const handleAxis = () => {
            const { left: handleX, top: handleY } = elements.circle.getBoundingClientRect()
            const { top, left } = elements.capsuleMachine.getBoundingClientRect()
            return {
                x: handleX - left + 80,
                y: handleY - top + 80
            }
        }

        const updateLines = () => {
            lineData.forEach((l, i) => {
                l.length = distanceBetween(l.start, l.end)
                setStyles({
                    el: lineStarts[i],
                    x: l.start.x,
                    y: l.start.y,
                    deg: radToDeg(angleTo({
                        a: l.start,
                        b: l.end
                    }))
                })
                setStyles({ el: lines[i], w: px(l.length) })
                setStyles({ el: lineEnds[i], x: l.end.x, y: l.end.y })
            })
        }

        const capsuleData = Array.from(container.querySelectorAll('.capsule-wrapper')).map((c, i) => {
            const data = {
                ...vector,
                el: c,
                id: i,
                deg: 0,
                radius: 36, // actual radius should be 32, but setting it higher
                bounce: -0.3, // this reduces the velocity gradually
                friction: 0.99,
                toy: toys[i]
            }

            data.velocity = data.create(0, 1) // ? velocity is another vector
            data.velocity.setLength(10)
            data.velocity.setAngle(degToRad(90))
            data.setXy({
                x: randomN(capsuleMachineWidth - 32),
                y: randomN(capsuleMachineHeight - 250),
            })

            // gravity
            data.acceleration = data.create(0, 4)
            data.accelerate = function(acceleration) {
                this.velocity.addTo(acceleration)
            }
            return data
        })

        const getNewPosBasedOnTarget = ({ start, target, distance: d, fullDistance }) => {
            const { x: aX, y: aY } = start
            const { x: bX, y: bY } = target
            const remainingD = fullDistance - d
            return {
                x: Math.round(((remainingD * aX) + (d * bX)) / fullDistance),
                y: Math.round(((remainingD * aY) + (d * bY)) / fullDistance)
            }
        }

        const shake = () => {
            capsuleData.forEach(c => {
                c.velocity.setAngle(degToRad(randomN(270)))
                c.velocity.setXy({ x: 10, y: 10 })
                c.accelerate(c.acceleration)
            })
            elements.capsuleMachine.classList.add('shake')
            setTimeout(() => elements.capsuleMachine.classList.remove('shake'), 500)
        }

        const rotateLines = angles => {
            angles.forEach((angle, i) => {
                const { axis, point } = lineData[i]
                lineData[i][point] = rotatePoint({
                    angle,
                    axis: lineData[i][axis],
                    point: lineData[i][point]
                })
            })
        }

        const openFlap = () => {
            if (settings.flapRotate > -20) {
                settings.flapRotate -= 2
                rotateLines([2, -2, -4])
                updateLines()
                setTimeout(openFlap, 30)
            } else {
                setTimeout(closeFlap, 800)
            }
        }

        const closeFlap = () => {
            if (settings.flapRotate < 0) {
                settings.flapRotate += 1
                if (settings.flapRotate === 0) {
                    [
                        { x: 160, y: 360 },
                        { x: 160, y: 360 },
                        { x: 70, y: 340 },
                    ].forEach((item, i) => {
                        lineData[i][lineData[i].point].x = item.x
                        lineData[i][lineData[i].point].y = item.y
                    })
                    settings.isHandleLocked = false
                } else {
                    rotateLines([-1, 1, 2])
                }
                updateLines()
                setTimeout(closeFlap, 30)
            }
        }

        const release = () => {
            settings.flapRotate = 0
            settings.isHandleLocked = true
            setTimeout(openFlap, 30)
        }

        capsuleData.forEach(c => {
            c.el.addEventListener('click', () => {
                const { width: bodyWidth, height: bodyHeight } = elements.wrapper.getBoundingClientRect()
                const { top, left } = elements.capsuleMachine.getBoundingClientRect()
                const { left: toyBoxLeft, top: toyBoxTop } = elements.toyBox.getBoundingClientRect()

                elements.wrapper.classList.add('lock')
                c.el.classList.add('enlarge')
                c.selected = true

                setStyles({
                    el: c.el,
                    x: (bodyWidth / 2) - left,
                    y: (bodyHeight / 2) - top,
                    deg: nearest360(c.deg)
                })
                setStyles({ el: c.toy, deg: 0 })
                setTimeout(() => c.el.classList.add('open'), 700)
                setTimeout(() => {
                    elements.wrapper.classList.remove('lock')
                    c.toy.classList.add('collected')
                    setStyles({
                        el: c.el,
                        x: toyBoxLeft - left + 16 + calcCollectedX(),
                        y: toyBoxTop - top + 16 + calcCollectedY(),
                    })
                    settings.collectedNo++
                }, 1800)
            })
            setStyles(c)
        })

        const spaceOutCapsules = c => {
            capsuleData.forEach(c2 => {
                if (c.id === c2.id || c2.selected) return
                const distanceBetweenCapsules = distanceBetween(c, c2)
                if (distanceBetweenCapsules < (c.radius * 2)) {
                    c.velocity.multiplyBy(-0.6)
                    const overlap = distanceBetweenCapsules - (c.radius * 2)
                    c.setXy(
                        getNewPosBasedOnTarget({
                            start: c,
                            target: c2,
                            distance: overlap / 2,
                            fullDistance: distanceBetweenCapsules
                        })
                    )
                }
            })
        }

        const hitCheckLines = c => {
            lineData.forEach(l => {
                const d1 = distanceBetween(c, l.start)
                const d2 = distanceBetween(c, l.end)
                if (d1 + d2 >= l.length - c.radius && d1 + d2 <= l.length + c.radius) {
                    const dot = (((c.x - l.start.x) * (l.end.x - l.start.x)) + ((c.y - l.start.y) * (l.end.y - l.start.y))) / Math.pow(l.length, 2)
                    const closestXy = {
                        x: l.start.x + (dot * (l.end.x - l.start.x)),
                        y: l.start.y + (dot * (l.end.y - l.start.y))
                    }
                    const fullDistance = distanceBetween(c, closestXy)

                    if (fullDistance < c.radius) {
                        c.velocity.multiplyBy(-0.6)
                        const overlap = fullDistance - (c.radius)
                        c.setXy(
                            getNewPosBasedOnTarget({
                                start: c,
                                target: closestXy,
                                distance: overlap / 2,
                                fullDistance
                            })
                        )
                    }
                }
            })
        }

        const hitCheckCapsuleMachineWalls = c => {
            const buffer = 5
            if (c.x + c.radius + buffer > capsuleMachineWidth) {
                c.x = capsuleMachineWidth - (c.radius + buffer)
                c.velocity.x = c.velocity.x * c.bounce
            }
            if (c.x - (c.radius + buffer) < 0) {
                c.x = c.radius
                c.velocity.x = c.velocity.x * c.bounce
            }
            if (c.y + c.radius + buffer > capsuleMachineHeight) {
                c.y = capsuleMachineHeight - c.radius - buffer
                c.velocity.y = c.velocity.y * c.bounce
            }
            if (c.y - c.radius < 0) {
                c.y = c.radius
                c.velocity.y = c.velocity.y * c.bounce
            }
        }

        const animateCapsules = () => {
            capsuleData.forEach((c, i) => {
                if (c.selected) return
                c.prevX = c.x
                c.prevY = c.y

                c.accelerate(c.acceleration)
                c.velocity.multiplyBy(c.friction)
                c.addTo(c.velocity)

                spaceOutCapsules(c)
                hitCheckLines(c)
                hitCheckCapsuleMachineWalls(c)

                if (Math.abs(c.prevX - c.x) < 2 && Math.abs(c.prevY - c.y) < 2) {
                    c.velocity.setXy({ x: 0, y: 0 })
                    c.setXy({ x: c.prevX, y: c.prevY })
                } else {
                    if (Math.abs(c.prevX - c.x)) {
                        // rotate capsule
                        setStyles({
                            el: c.toy,
                            deg: c.deg + (c.x - c.prevX) * 2
                        })
                        c.deg += (c.x - c.prevX) * 2
                    }
                }
                setStyles(capsuleData[i])
            })
        }

        const grabHandle = e => {
            if (settings.isHandleLocked) return
            const { top, left } = elements.capsuleMachine.getBoundingClientRect()
            settings.isTurningHandle = true
            settings.handleDeg = radToDeg(angleTo({
                a: {
                    x: getPage(e, 'X') - left,
                    y: getPage(e, 'Y') - top
                },
                b: handleAxis()
            }))
            settings.handleRotate = 0
            Bus.emit('hideCursor')
        }

        const releaseHandle = () => {
            settings.isTurningHandle = false
            setStyles({
                el: elements.handle,
                deg: 0
            })
            Bus.emit('showCursor')
        }

        const rotateHandle = e => {
            if (!settings.isTurningHandle || settings.isHandleLocked) return
            const { top, left } = elements.capsuleMachine.getBoundingClientRect()

            settings.prevHandleDeg = settings.handleDeg
            const deg = radToDeg(angleTo({
                a: { x: getPage(e, 'X') - left, y: getPage(e, 'Y') - top },
                b: handleAxis()
            }))
            settings.handleDeg = deg

            const diff = settings.handleDeg - settings.prevHandleDeg

            if (diff >= 1) {
                setStyles({
                    el: elements.handle,
                    deg: settings.handleRotate
                })
            }

            if (diff > 0 && diff < 50) settings.handleRotate += diff
            if (settings.handleRotate > 350) {
                setStyles({
                    el: elements.handle,
                    deg: 10
                })
                release()
                settings.isTurningHandle = false
            }
        }

        ;['mousedown', 'touchstart'].forEach(action => {
            elements.handle.addEventListener(action, grabHandle)
        })

        ;['mouseup', 'mouseleave', 'touchend'].forEach(action => {
            elements.circle.addEventListener(action, releaseHandle)
        })

        ;['mousemove', 'touchmove'].forEach(action => {
            window.addEventListener(action, rotateHandle)
        })

        updateLines()
        setInterval(animateCapsules, 30)
    }
}
</script>

<style lang="scss">
.trinket-capsule{
    cursor: pointer;
    position: relative;
    .wrapper {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        /*   padding-top: 130px; */
    }

    .pix {
        background-size: calc(var(--w) * var(--m)) calc(var(--h) * var(--m)) !important;
        background-repeat: no-repeat !important;
        image-rendering: pixelated;
    }

    .toy-box {
        position: absolute;
        top: -84px;
        width: 320px;
        height: 64px;
    }

    .capsule-machine {
        width: 320px;
        height: 500px;
        --m: 4;
        --w: 80px;
        --h: 125px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAB9CAYAAAA1I+RFAAAAAXNSR0IArs4c6QAAAchJREFUeF7t08Ftg0AARcFsPS7QNbhA10O0SGuR2Ipw3tHDgcOKx2H4jK8X13a/bq/OP/1sXG7jt8GPA3DnJnKEfADCO4e3nlqIOyC89/COiAD/Z7dXc4XD+oLgRAQIsAnE2gIBRoGYWyDAKBBzCwQYBWJugQCjQMwtEGAUiLkFAowCMbdAgFEg5hYIMArE3AIBRoGYWyDAKBBzCwQYBWJugQCjQMwtEGAUiLkFAowCMbdAgFEg5hYIMArE3AIBRoGYWyDAKBBzCwQYBWJugQCjQMwtEGAUiLkFAowCMbdAgFEg5hYIMArE3AIBRoGYWyDAKBBzCwQYBWJugQCjQMwtEGAUiLkFAowCMbdAgFEg5hYIMArE3AIBRoGYWyDAKBBzCwQYBWJugQCjQMwtEGAUiLkFAowCMbdAgFEg5hYIMArE3AIBRoGYWyDAKBBzCwQYBWJugQCjQMwtEGAUiLkFAowCMbdAgFEg5hYIMArE3AIBRoGYWyDAKBBzCwQYBWJugQCjQMwtEGAUiLkFAowCMbdAgFEg5hYIMArEfMx+u1+3+J6PzMflNgCGT/8AtML3FSferPbbuvzK5yAX3hMgyL8Bj3DryW9l1KLLccC7FgAAAABJRU5ErkJggg==);
    }

    .capsule-machine.shake {
        animation: forwards shake 0.5s;
    }

    @keyframes shake {
        0%, 40%, 80% {
            margin-left: 5px;
        }
        20%, 60%, 100% {
            margin-left: -5px;
        }
    }

    .capsule-machine::after {
        position: absolute;
        content: '';
        width: calc(var(--w) * var(--m));
        height: calc(var(--h) * var(--m));
        background-size: calc(var(--w) * var(--m)) calc(var(--h) * var(--m)) !important;
        background-repeat: no-repeat !important;
        image-rendering: pixelated;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAB9CAYAAAA1I+RFAAAAAXNSR0IArs4c6QAAAg9JREFUeF7t3VFOg1AABVHZ/6JrIKFWJeXB8FVOP5FL0tOpGNPo9LXxeDwej63jdz82TdP01+DXgRVu68S7483Pf8vnCTh/EdxYJq9WCyC8MbjXs1YzgMftlsUTUH0nBVdEgADPC8TlEp8CzysCPG/3cyNR4HlFBZ63U2C0AwjwCoF4Dd8DAUaBOFcgwCgQ5woEGAXiXIEAo0CcKxBgFIhzBQKMAnGuQIBRIM4VCDAKxLkCAUaBOFcgwCgQ5woEGAXiXIEAo0CcKxBgFIhzBQKMAnGuQIBRIM4VCDAKxLkCAUaBOFcgwCgQ5woEGAXiXIEAo0CcKxBgFIhzBQKMAnGuQIBRIM4VCDAKxLkCAUaBOFcgwCgQ5woEGAXiXIFXAcbr3Hq+/Pm7WwvEJw8QYBSIcwUCjAJxrkCAUSDOFQgwCsS5AgFGgThXIMAoEOcKBBgF4lyBAKNAnCsQYBSIcwUCjAJxrkCAUSDOFQgwCsS5AgGOC+z9+98zn9K4RYF7cH9fgiOQHw94FG/FHEX8aMCzeEcQPxaw4o0iAty5B+29lT8S8Kr6RioEOPBT0LsKAQL8L+AtPFDFu1MAAowCca5AgFEgzhUIMArEuQIBRoE4VyDAKBDnCoyA8/wqxFv+PvAC/+FLTPOZe8rDV7vZiXPlAMOL/gRU4XHFNb6lwPXhrTwG+XqD+gUI8j3g1p39G7BRXt/gk08UAAAAAElFTkSuQmCC);
        pointer-events: none;
        z-index: 1;
        transition: 0.5s;
    }

    .capsule-machine.see-through::after,
    .capsule-machine.see-through .circle {
        opacity: 0.3;
    }

    .wrapper.lock {
        pointer-events: none;
    }

    .lock-cover {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: 1s;
        background-color: transparent;
        pointer-events: none;
    }

    .wrapper.lock .lock-cover {
        background-color: #fab2cc;
        opacity: 0.8;
        z-index: 10;
    }

    .capsule {
        position: absolute;
        left: calc((var(--w) * var(--m)) / var(--offset));
        top: calc((var(--h) * var(--m)) / var(--offset));
        width: calc(var(--w) * var(--m));
        height: calc(var(--h) * var(--m));
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .lid,
    .base {
        position: absolute;
        --h-m: var(--m) / 2;
        width: calc(var(--w) * var(--m));
        height: calc(var(--h) * var(--h-m));
        background-size: calc(var(--w) * var(--m)) calc(var(--h) * var(--h-m)) !important;
        background-repeat: no-repeat !important;
        image-rendering: pixelated;
    }

    .lid {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAADlJREFUKFNjZEAD/////48uhsxnZGRkROHDODCN6ApwWQBTBzYNpJmQRmwGgfQwkqMZ2dWjBvz/DwCs+Tv1GZ2dFQAAAABJRU5ErkJggg==);
        top: 0;
        --start: 0;
        --end: -100px;
    }

    .base {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAADBJREFUKFNj/O/Y/p+BAsA4agADIyj8yA0Hxv2VjGADyDEEpBmkD24AsQbBNMLUAwDsrRnng7/G/QAAAABJRU5ErkJggg==);
        bottom: 0;
        --start: 0;
        --end: 100px;
    }

    .base.white {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAAC1JREFUKFNj/P///38GCgDjqAEMjKDwIzccGEEAFgGkGgLTCzeAWIOQLQXpAQC80x/1FKzGmwAAAABJRU5ErkJggg==);
    }

    .base.pink {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAADBJREFUKFNj/O/Y/p+BAsA4agADIyj8yA0Hxv2VjGADyDEEpBmkD24AsQbBNMLUAwDsrRnng7/G/QAAAABJRU5ErkJggg==);
    }

    .base.red {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAADBJREFUKFNj/G9m9p+BAsA4agADIyj8yA0HxlOnGMEGkGMISDNIH9wAYg2CaYSpBwAEFBgbcBUePAAAAABJRU5ErkJggg==);
    }

    .base.blue {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAADBJREFUKFNj1Nn36D8DBYBx1AAGRlD4kRsOV5zkGMEGkGMISDNIH9wAYg2CaYSpBwAPYhoAi8QRLQAAAABJRU5ErkJggg==);
    }
    /* #2cbee2 */

    .capsule-wrapper.open .lid,
    .capsule-wrapper.open .base {
        animation: open-capsule forwards 1s;
    }

    @keyframes open-capsule {
        0% {
            transform: translateY(var(--start));
            opacity: 1;
        }
        100% {
            transform: translateY(var(--end));
            opacity: 0;
        }
    }

    .capsule-wrapper {
        /* border: 1px solid hotpink; */
        position: absolute;
        --m: 4;
        --w: 16px;
        --h: 16px;
        --offset: -2;
        width: 0;
        height: 0;
        transition: 0.05s;
        cursor: pointer;
    }

    .capsule-wrapper.enlarge {
        --m: 8;
        z-index: 11;
        transition: 0.8s;
        pointer-events: none;
    }

    .capsule-wrapper.enlarge .toy {
        --m: 4;
    }

    .capsule-wrapper.enlarge.open .toy {
        --m: 6;
    }

    .capsule-wrapper.enlarge.open .toy.collected {
        --m: 2;
    }

    .line-start,
    .line-end {
        position: absolute;
        height: 0;
        width: 0;
    }

    .line {
        position: absolute;
        height: 1px;
        width: 0;
        border-top: solid #ff3636 4px;
    }

    .circle {
        position: absolute;
        bottom: 30px;
        left: 26px;
        width: 160px;
        height: 160px;
        display: flex;
        align-items: center;
        z-index: 5;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAQJJREFUWEft2e0NAiEMBmAZRCfQIXRwHUIn0EG8YFJSsUD5CLSx98vkIPfkhdij53Yd1/H6fHOmPy4HxxlHjameiFH385713NPtFcbVYtlAgHFRKTlgudAicBQsBnOhWaDH9SZW2gMemkszCZyBA3wOSQJn4krIH+AKXA75BVyJSyH1ACWkR6UYEhQNlISLU/wkaMBSOSHuw5+3k5geXmYDNqxumOKX2RK0BHsS6J1re/A/ErRa3LjOoRarSFAaEh9DdbxRwzaR8OoVH+L1nOokpEi1QPS1PlYkWd08molsbr9hpP89uk84pIGJq9SoTisXBs8utoDjUiq2iU7V/BmfITaUSgYmL25tRwAAAABJRU5ErkJggg==);
        --w: 40px;
        --h: 40px;
        --m: 4;
        transition: 0.5s;
    }

    .circle::after {
        position: absolute;
        top: -10px;
        right: -22px;
        content: '';
        --w: 15px;
        --h: 15px;
        --m: 4;
        width: calc(var(--w) * var(--m));
        height: calc(var(--h) * var(--m));
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAGVJREFUOE9j1N376D8DErjsLMeIzMfHZkTXDFNMjCEotmAzCJ8hWJ1IrFfw+g/ZEGwuIBg4+AwgqBkUgDAD0G0nSTPIIGQDiNKMy3aSNSPbTrRmbLbTXjOuJEy0zdhSHdGasfkZAFdWOttEm2PiAAAAAElFTkSuQmCC);
        background-size: calc(var(--w) * var(--m)) calc(var(--h) * var(--m)) !important;
        background-repeat: no-repeat !important;
        image-rendering: pixelated;
    }

    .handle {
        position: relative;
        width: 160px;
        height: 50px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
    }

    .handle::after {
        position: absolute;
        top: -7px;
        content: '';
        --w: 40px;
        --h: 16px;
        --m: 4;
        width: calc(var(--w) * var(--m));
        height: calc(var(--h) * var(--m));
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAQCAYAAABk1z2tAAAAAXNSR0IArs4c6QAAANRJREFUSEvVlusNwjAMhMkgMAEdAgaHIWACGITKlU4K1plzQ4ho/+V1/nx2m5Zdh+d4ebyYzP18KN/KNwl4oNtpTzmm6/NtvgU4BZgFUm61AFPAXkA9gBfAUUAtwMXgoh5Sgmq9LqnFUGOvZ/spIBNCgCgQkrSzPmHM+bVoHqAhoG2oxbwQG9uZOgloINinxFhSOB+WWAECqE4GzisHo4TTJWYOeid8yVmJVc/59VWA6gUYsb704N9/ZpgTo76LmZtlm1ed6q+swxmHVKyUg0rkl79bMwwK5tMkyZ5mAAAAAElFTkSuQmCC);
        background-size: calc(var(--w) * var(--m)) calc(var(--h) * var(--m)) !important;
        background-repeat: no-repeat !important;
        image-rendering: pixelated;
    }

    .cover.white {
        position: absolute;
        bottom: 116px;
        width: 100%;
        height: calc(220px - 116px);
        background-color: white;
        z-index: 1;
        transition: 0.5s;
    }

    button {
        border: 0;
        background-color: white;
        padding: 4px 8px;
        font-family: 'Press Start 2P', sans-serif;
        font-size: 10px;
        margin-right: 10px;
    }

    .button-wrapper {
        position: absolute;
        left: 20px;
        bottom: 20px;
        z-index: 10;
    }

    .toy {
        position: absolute;
        --w: 16px;
        --h: 16px;
        --m: 2;
        width: calc(var(--w) * var(--m));
        height: calc(var(--h) * var(--m));
        z-index: -1;
        transition: 0.5s;
    }

    .bunny {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAIJJREFUOE+tU1sOwCAIk/sfmkVmDc/oMvyktdQiNOLhVSIHpfVAYn55RAIB56K+CWhWEb8LKBcD3RNntYMkm+xpRsDY1F3ROctBh9gnAPtrEiYDn4MZ47ZQBYAPAmU15wnJ/Yn592tH4OBufwYtDg4RmG9+2oWtdbsLEuafbTy5D/gDlg9nEQXylfgAAAAASUVORK5CYII=);
    }

    .duck-yellow {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAG9JREFUOE9jZKAQMFKonwGXAf+xGIxVLTbB//9fBGHoZ5RYBxLDUI8ugFUzzDRshuA0AKQY3SU4Dfj//z/Czy+DwRZSbAC22CHJC/iiF9kgkgIR2VCYIcPQAJA38SYmWBTDUiUpeQElDOGpk9LcCAA2WjgR81D3SgAAAABJRU5ErkJggg==);
    }

    .duck-pink {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAG5JREFUOE9jZKAQMFKonwGXAf+xGIxVLTbB//8d2zH0M+6vBIlhqEcXwKoZZho2Q3AaAFKM7hKcBvx/EYTwc6Qp2EKKDcAWOyR5AV/0IhtEUiAiGwozZBgaAPIm3sQEi2JYqiQlL6CEITx1UpobAdngNhF5e7c/AAAAAElFTkSuQmCC);
    }

    .star {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAJRJREFUOE+1U0EOwCAIk1/4Lh/qu/yFi0QIIp1ZtnlZ4mxpC1B6eeiA7/M/fHdH0HsrjKdc+RMV+41Aq0tVpAIpeEwgYSXxjcKdSlTYUBBW80QDGN2JhYUEPbYEkonNYFNysMFYH+LSezsHaCYWgt6KhmkGKPKuuM8sbCG6HWBlMESRbnoMB8wSUa6kbTxtneuIbukFwYNUEDYqJhQAAAAASUVORK5CYII=);
    }

    .water-melon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAIdJREFUOE/Fk0sOwCAIRGHXQ3kaD9bT9FDubCAZgx+qjU3qTmEeSAamzcML+kxEbp4XEBEd16n8FCLqdPntQ4Zo1JmAJJ5CLDoLUDGSAPDugABQKr8ASA2uAKtiM5ePASDbQT7MoP/CNuDXGYhB1H2rXbQ+UN8AMtsPz4lWp90MznQXZsW7+A1tU4YRf0fGXgAAAABJRU5ErkJggg==);
    }

    .panda {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAIVJREFUOE+1U1sOwCAIk/sf2gWirFSMLNv8UmzLwyrt5RLgd9hrHM96xTHj7gRa75EvglBLlQswkTsEoUVAs3LZ6YSEVQbK+PNu1wJg1hY+EcCaD9X8MIOHngoVlKafJHB3mEDxFf2l1Exsr6MVxmCdtwgU51AWmMDsY90fgrJO8K66EL8ABN49ETdlUwYAAAAASUVORK5CYII=);
    }

    .penguin {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAH5JREFUOE+1k9ENgDAIRGEL53JQ53ILTKvFeoAhQfvZ5q7HvZapuLioJzSQpKHqZoOseNzRtcZARIjZnwzOfjIY+WRfH3XwsmE9foLPDBI0TIKm6SRaWd6ayo0xRmJldxOKKbzFxxTmJSYTuCOc41/4EBvshwZaJLzScL/8Gw8v8zIR/QQO5QAAAABJRU5ErkJggg==);
    }

    .dino {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAIpJREFUOE+lk90RABEMhKMRFahC4apQgUbcMGLiL8vcveVGPpvNMvTzMz/7SQLyBWy5kH9kFxLsj96+AaK3JMGlJhpU92KQz01PgJsRyvWzisVEBNIA1UQXkroNBKjNmgoIQCMIH+pGdkm8zcQegDyYN6EqaPN2T7iWYTo9Jt5Ej3rL+THK8B2cDnzs+TgRPHoJSgAAAABJRU5ErkJggg==);
    }

    .roboto-san {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAKZJREFUOE+1k+0RgCAIhnWQmqCGqMFriJqgBqFDhdBAu+7yp8DDy5d39oPC5DVX9TM5AkBkeB/cXgHKrJY+hkkqDMtRqeg27XPPih6AbercuJ4qiGz/Aih1ysJKZHlVBW+aYAEw9vMUOLA1iaK0uCGYmZYGJ4Dd1p600XIxgAJQQQ1gKaD45jLJBlr7HcpJErkS8ZfdhHYgEpD1SDsqFSAa+OhReZUXbdFUEQlelEMAAAAASUVORK5CYII=);
    }

    .roboto-sama {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAKNJREFUOE+1U20RgCAMZS2sIxFMowkkjRG0ji3mMWHiGILeyR85x/vYG4ApLxQl0I6qP8NBxH2gLXQLfVoIpGrJH5OlrIj9/NDRVYJtYkc5wToaY51OFGo/EwTtoMJO0vaeHTSkUCLw0E9TiCAfaHUSiTrh4hRYmXr1aWvLOiOyAVKNubGDOgHj5PV808J5zRWntSBvmNJj8iSZO02w5iALWZIcuqhDD326nv0AAAAASUVORK5CYII=);
    }

    .turtle {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAKlJREFUOE+1k8ENgCAMRcvNERjGKRjBwRzBKRiGEbzVtAECpUWjkQtJ7X/wf8XBx+UMPRr1oX8oLHG3xMw8163TSAAucacmoL1dpUY7AFTdP4Bycj6tu83dDaj5dQbsPwelDkF8Z/ttBjVATEEFOH+wndbGEKIlLkSCzKYAmMI0A+eP6X9AdJxZELa7DFhcPEqI5l+GWAHaJLQJaACG5MCGgLW69RofP/ILf2RUEUrHVC0AAAAASUVORK5CYII=);
    }

    .cover {
        position: absolute;
        z-index: 4;
        cursor: auto;
    }

    .cover.a {
        top: 0;
        left: 0;
        width: 320px;
        height: 280px;
    }

    .cover.b {
        top: 280px;
        left: 0;
        width: 212px;
        height: 220px;
    }

    .cover.c {
        top: 280px;
        left: 212px;
        width: 108px;
        height: 108px;
    }

    .cover.d {
        bottom: 0;
        left: 212px;
        width: 80px;
        height: 24px;
    }

    .cover.e {
        bottom: 0;
        left: 292px;
        height: 112px;
        width: 28px;
    }

    a {
        color: white;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

}
</style>
