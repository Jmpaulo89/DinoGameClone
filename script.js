import { setupGround, updateGround } from './ground.js'
import {updateDino, setupDino,getDinoReact, setDinoLose } from './dino.js'
import { updateCactus, setupCactus, getCactusRects } from './cactus.js'

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldEl = document.querySelector('[data-world]')
const scoreElem = document.querySelector('[data-score]')
const startScreenElem = document.querySelector('[data-start-screen]')

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
window.addEventListener('touchstart', handleStart, {once:true})



let lastTime
let speedScale
let score
function update(time){
    if(lastTime == null){
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = (time) - lastTime
    lastTime = time
    updateGround(delta, speedScale)
    updateDino(delta, speedScale)
    updateSpeedScale(delta)
    updateCactus(delta, speedScale)
    updateScore(delta)
    if(checkLose()) return handleLose()
    
    window.requestAnimationFrame(update)
}

function updateSpeedScale(delta){
    speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta){
    score += delta
    scoreElem.textContent = Math.floor(score)
}

function checkLose(){
    const dinoReact = getDinoReact()
    return getCactusRects().some(react => isCollision(react, dinoReact))
}

function isCollision(react1, react2){
    return (
        react1.left< react2.right && 
        react1.top < react2.bottom &&
        react1.right > react2.right &&
        react1.bottom > react2.top
)}

function handleStart(){
    lastTime = null
    score = 0
    setupDino()
    speedScale = 1
    setupCactus()
    setupGround()
    startScreenElem.classList.add('hide')
    window.requestAnimationFrame(update)
}

function handleLose(){
    setDinoLose()
    setTimeout(()=>{
        document.addEventListener('click', handleStart, {once: true})
        startScreenElem.classList.remove('hide')
    },100)
}

function setPixelToWorldScale(){
    let worldToPixelScale
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT)
    {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH
    } else{
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT
    }

    worldEl.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
    worldEl.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`

}

