import { moveEnimiesAmount, moveEnimiesDown, movePlayerSpeed, bulletSpeed, writeTitle } from './speed.js'
const canvas = document.querySelector('.canvas')
const popup = document.querySelector('.restart-popup')
const restart = popup.querySelector('button')
const player = document.querySelector('.player')
const playerWidth = player.clientWidth
const canvasREC = canvas.getBoundingClientRect()
const startPopup = document.querySelector('.start-popup')

writeTitle(startPopup.querySelector('h1'), 'Space invader #')

startPopup.querySelector('button').onclick = () => {
    init()
    startPopup.style.display = 'none'
    canvas.style.filter = 'none'
}

console.log('canvasREC: ', canvasREC)
let moveVer = player.offsetTop
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
let shooting = false
let canShoot = true
let playerX = null
document.addEventListener('keydown', e => {
    keys[e.key] = true

    playerX = getPlayerXRelativeToCanvas(player, canvas)
    //space
    if (e.key === ' ') {

        if (canShoot) {

            createBullet(playerX)

            shooting = true
            canShoot = false
            setTimeout(() => {
                canShoot = true
            }, 150)
        }
    }
})


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
    console.log(bullets.length)
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
        console.log(bullets[i])
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
    moveBullet()
}

const enimieContainer = document.createElement('div')
enimieContainer.style.width = `${5 * 60}px`
enimieContainer.classList.add('enimieContainer')

canvas.appendChild(enimieContainer)

function createEnimies() {
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
        moveEnimiesHor += moveEnimiesAmount
    } else if (!reverse && enimieREC.right == canvasREC.right) {
        reverse = true
        moveEnimiesVer += moveEnimiesDown
    }

    if (reverse && enimieREC.left > canvasREC.left) {
        moveEnimiesHor -= moveEnimiesAmount
    } else if (reverse && enimieREC.left == canvasREC.left) {
        reverse = false
        moveEnimiesVer += moveEnimiesDown
    }

    enimieContainer.style.transform = `translate(${moveEnimiesHor}px,${moveEnimiesVer}px )`
}

function checkForCollision_bullet_enimie(bullet) {
    let enimies = document.querySelectorAll('.enemy')
    let bulletREC = bullet.getBoundingClientRect()

    for (let i = 0; i < enimies.length; i++) {
        let enimieREC = enimies[i].getBoundingClientRect()

        if (enimieREC.left < bulletREC.left && enimieREC.right > bulletREC.right &&
            enimieREC.top < bulletREC.top && enimieREC.bottom > bulletREC.bottom
        ) {
            console.log(1111111111)
            bullet.remove()
            enimies[i].remove()
            //
        }
    }
}
console.log(playerREC);

let REQID
let isGameOver = false

function checkForCollision_player_enimie() {
    let enimies = document.querySelectorAll('.enemy')

    for (let i = 0; i < enimies.length; i++) {
        let enimieREC = enimies[i].getBoundingClientRect()

        if (playerREC.top <= enimieREC.bottom) {
            isGameOver = true
            console.log('REQID : ', REQID);
            popup.style.display = 'block'

        }
    }
}

createEnimies()

function gameLoop() {
    if (!isGameOver) {
        movePlayer()
        moveBullet()
        moveEnimieContainer()
        checkForCollision_player_enimie()
        REQID = requestAnimationFrame(gameLoop)
    }
}


restart.onclick = () => restartGAME()

function restartGAME() {
    isGameOver = false
    enimieContainer.innerHTML = ''
    createEnimies()

    init()
}

function init() {
    moveEnimiesHor = 0
    moveEnimiesVer = 0
    enimieContainer.style.transform = `translate(0px,0px)`
    popup.style.display = 'none'

    //////////////remove bulllllets
    const DOM_bullets = document.querySelectorAll('.bullet')
    bullets = []
    DOM_bullets.forEach(elem => {
        elem.remove()

    });

    gameLoop()
}

