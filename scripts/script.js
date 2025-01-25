import {
    moveEnimiesX, moveEnimiesY, movePlayerSpeed, bulletSpeed, HorInput
    , VerInput
    , bulletInput
} from './speed.js'
import { restartScore } from './popups.js'

const canvas = document.querySelector('.canvas')
const optionsScore = document.querySelector('.options-score span')
const countDown = document.querySelector('.count-down')
const player = document.querySelector('.player')
const playerWidth = player.clientWidth
const canvasREC = canvas.getBoundingClientRect()

let Score = 0
let REQID = null
export let isGameOver = false

let playerREC = player.getBoundingClientRect()

let playerInitX = canvas.clientWidth / 2 - player.clientWidth / 2
let playerInitY = canvas.clientHeight - player.clientHeight

let moveHor = playerInitX
let moveEnimiesHor = 0
let moveEnimiesVer = 0

player.style.transform = `translate(${playerInitX}px)`

function getPlayerXRelativeToCanvas(player, canvas) {
    const playerRect = player.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()

    return playerRect.left - canvasRect.left
}

let keys = {}

document.addEventListener('keyup', e => {
    keys[e.key] = false
})

let canShoot = true
let playerX = null
let paused = false
document.addEventListener('keydown', e => {
    keys[e.key] = true
    HorInput.blur()
    VerInput.blur()
    bulletInput.blur()

    playerX = getPlayerXRelativeToCanvas(player, canvas)
    //space
    if (e.key === ' ') {
        if (canShoot) {
            console.log(canShoot);

            createBullet(playerX)

            canShoot = false
            setTimeout(() => {
                canShoot = true
            }, 200)
        }
    } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        console.log('paused');

        canShoot = false
        paused = true
        document.body.classList.add('paused')
        clearInterval(countDownInterval)
        cancelAnimationFrame(REQID)
    }
})

// document.querySelector('.options-lives svg:last-child').remove()

function movePlayer() {
    const canvasWidth = canvas.clientWidth
    const playerWidth = player.clientWidth

    //player x pos
    const playerX = getPlayerXRelativeToCanvas(player, canvas)

    if (keys['ArrowLeft'] && playerX > 0) {
        moveHor -= movePlayerSpeed
    }

    if (keys['ArrowRight'] && playerX + playerWidth < canvasWidth) {
        moveHor += movePlayerSpeed
    }


    player.style.transform = `translateX(${moveHor}px)`
}

let bullets = []
let bulletYMove = playerInitY
let canshoooooooot = true;

function moveBullet() {

    for (let i = 0; i < bullets.length; i++) {

        let bTop = parseInt(bullets[i].style.top)
        bTop -= bulletSpeed
        bullets[i].style.top = `${bTop}px`

        ///the bullet height
        if (bTop <= -25) {
            bullets[i].remove()
            ///remove the curcreateBulletrent bullet
            bullets = bullets.filter(b => b !== bullets[i])
        }
        bullets[i] ? checkForCollision_bullet_enimie(bullets[i]) : console.log('111111112')
    }

}

function createBullet(playerX) {
    const bullet = document.createElement('span')
    bullet.classList.add('bullet')
    bullet.style.left = `${playerX + playerWidth / 2}px`
    bullet.style.top = `${playerInitY - 40}px`
    bullet.style.transform = `translate(-50%)`

    canvas.appendChild(bullet)
    bullets.push(bullet)
    //  moveBullet()
}

export const enimieContainer = document.createElement('div')
enimieContainer.style.width = `${5 * 60}px`
enimieContainer.classList.add('enimieContainer')

canvas.appendChild(enimieContainer)

export function createEnimies() {
    for (let index = 0; index < 5; index++) {
        for (let j = 0; j < 3; j++) {
            const ghostDiv = document.createElement('div')
            ghostDiv.classList.add('enemy')
            ghostDiv.style.transform = `translate(${60 * index}px, ${35 * j}px)`;
            ghostDiv.id = index + j
            enimieContainer.appendChild(ghostDiv)

        }
    }

}

let reverse = false

function moveEnimieContainer() {
    const enimieREC = enimieContainer.getBoundingClientRect()

    if (!reverse && enimieREC.right < canvasREC.right) {
        moveEnimiesHor += moveEnimiesX
    } else if (!reverse && enimieREC.right >= canvasREC.right) {
        reverse = true
        moveEnimiesVer += moveEnimiesY
    }

    if (reverse && enimieREC.left > canvasREC.left) {
        moveEnimiesHor -= moveEnimiesX
    } else if (reverse && enimieREC.left <= canvasREC.left) {
        reverse = false
        moveEnimiesVer += moveEnimiesY
    }

    enimieContainer.style.transform = `translate(${moveEnimiesHor}px,${moveEnimiesVer}px)`
}
function checkForCollision_bullet_enimie(bullet) {

    let enimies = document.querySelectorAll('.enemy')
    let bulletREC = bullet.getBoundingClientRect()

    for (let i = 0; i < enimies.length; i++) {
        let enimieREC = enimies[i].getBoundingClientRect()

        if (enimieREC.left < bulletREC.left && enimieREC.right > bulletREC.right &&
            enimieREC.top < bulletREC.top && enimieREC.bottom > bulletREC.bottom
        ) {
            Score += 10
            optionsScore.textContent = Score
            bullet.remove()
            enimies[i].remove()
        }
    }
}



let howManyEnimiesCanShot = 0

function checkForCollision_player_enimie() {
    let enimies = document.querySelectorAll('.enemy')

    for (let i = 0; i < enimies.length; i++) {
        let enimieREC = enimies[i].getBoundingClientRect()

        if (playerREC.top <= enimieREC.bottom) {
            gameOver()
            // restartPopup.style.display = 'block'
        }
    }
}

//////////TODO  : stop the interval on game pause

function enemiesShooting() {
    let invaders = document.querySelectorAll('.enemy')

    setInterval(() => {
        howManyEnimiesCanShot = Math.floor(Math.random() * 4)
        if (howManyEnimiesCanShot === 0) {
            howManyEnimiesCanShot++
        }

        for (let i = 0; i < howManyEnimiesCanShot; i++) {
            let enemy = Math.floor(Math.random() * invaders.length)
            createEnimiesBullet(invaders[enemy])
        }

    }, 1000)
}
let invadersBullet = []

function moveInvadersBullet() {

    for (let i = 0; i < invadersBullet.length; i++) {

        let bTop = parseInt(invadersBullet[i].style.top)
        bTop += bulletSpeed
        invadersBullet[i].style.top = `${bTop}px`

        ///the bullet height
        if (bTop >= canvasREC.height) {
            invadersBullet[i].remove()
            ///remove the curcreateBulletrent bullet
            invadersBullet = invadersBullet.filter(b => b !== invadersBullet[i])
        }
        //        enimiesBullet[i] ? checkForCollision_bullet_enimie(enimiesBullet[i]) : console.log('111111112')
    }

}

createEnimies()


function createEnimiesBullet(invader) {
    let invaderREC = invader.getBoundingClientRect()
    const bullet = document.createElement('span')
    bullet.classList.add('invader-bullet')
    bullet.style.left = `${invaderREC.left - canvasREC.left + (invaderREC.width / 2)}px`
    bullet.style.top = `${invaderREC.top - canvasREC.top + invaderREC.height - 5}px`
    // bullet.style.transform = `translate(50%)`

    canvas.appendChild(bullet)
    invadersBullet.push(bullet)
    //  moveBullet()
}


export function gameLoop() {
    if (!isGameOver) {


        movePlayer()
        moveBullet()
        moveInvadersBullet()
        moveEnimieContainer()
        checkForCollision_player_enimie()
        REQID = requestAnimationFrame(gameLoop)
    }
}

export function init() {
    moveEnimiesHor = 0
    isGameOver = false
    moveEnimiesVer = 0
    enimieContainer.style.transform = `translate(0px,0px)`
    canShoot = true
    ///
    countDown.textContent = '00:10'
    handleCountDown()

    ///restrat popup
    // restartPopup.style.display = 'none'
    restartScore.textContent = 0

    //////////////remove bulllllets
    const DOM_bullets = document.querySelectorAll('.bullet')

    bullets = []
    DOM_bullets.forEach(elem => {
        elem.remove()

    });
    ////////options
    optionsScore.textContent = 0
    Score = 0
    enemiesShooting()

    gameLoop()
}

let countDownInterval = null
///count-down
export function handleCountDown() {

    let startCount = countDown.textContent.split(':')
    let minutes = parseInt(startCount[0])
    let seconds = parseInt(startCount[1])
    console.log('seconds : ', seconds)

    if (seconds === 0 && minutes > 0) {

        minutes--
        seconds = 59
        countDown.textContent = minutes + ':' + seconds
    } else if (seconds > 0) {
        seconds--
        countDown.textContent = minutes + ':' + seconds
    }

    countDownInterval = setInterval(() => {

        if (seconds > 0) {

            seconds--

        } else if (minutes > 0) {

            minutes--
            seconds = 59
        }
        let t = minutes + ':' + seconds
        countDown.textContent = t


        if (seconds === 0 && minutes === 0) {
            clearInterval(countDownInterval)

            console.log(seconds, '\ngame over from timer');

            gameOver()
        }

    }, 1000)

}


function gameOver() {

    isGameOver = true
    restartScore.textContent = Score + "."
    document.body.classList.add('over')
}