import { restartScore } from './popups.js'
const moveEnimiesX = 3
const moveEnimiesY = 7
const movePlayerSpeed = 5
const bulletSpeed = 6

const canvas = document.querySelector('.canvas')
const optionsScore = document.querySelector('.options-score span')
const countDown = document.querySelector('.count-down')
const player = document.querySelector('.player')

const livesHeart = document.querySelectorAll(`.options-lives svg`)
const winScore = document.querySelector('.game-win-popup h1 span')
export let heartbeat = document.querySelector('.options-lives svg:last-child')

const playerWidth = player.clientWidth
let canvasREC = canvas.getBoundingClientRect()

addEventListener('resize', () => canvasREC = canvas.getBoundingClientRect())

let Score = 0
let REQID = null
let playing = false
export let isGameOver = false

let lives = 3
let playerREC = player.getBoundingClientRect()

let playerInitX = canvas.clientWidth / 2 - player.clientWidth / 2
let playerInitY = canvas.clientHeight - player.clientHeight

///center the player
player.style.transform = `translate(${playerInitX}px)`

let moveHor = playerInitX
let moveEnimiesHor = 0
let moveEnimiesVer = 0

let lastTime = performance.now();
let counter = 0

let fpsDisplay = document.querySelector('.fps')

function getPlayerXRelativeToCanvas(player, canvas) {
    const playerRect = player.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()

    return playerRect.left - canvasRect.left
}

let keys = {}

document.addEventListener('keyup', e => {
    keys[e.key] = false
})

export let gameSetting = {
    canShoot: true
}
let playerX = null
document.addEventListener('keydown', e => {
console.log(playing);

    keys[e.key] = true

    playerX = getPlayerXRelativeToCanvas(player, canvas)
    //space
    if (e.key === ' ' && playing) {
        if (gameSetting.canShoot) {

            createBullet(playerX)

            gameSetting.canShoot = false
            setTimeout(() => {
                gameSetting.canShoot = true
            }, 200)
        }
    } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {

        if (playing) {

            gameSetting.canShoot = false
            document.body.classList.add('paused')
            document.querySelector('.pause-popup span').textContent = countDown.textContent

            cancelAnimationFrame(REQID)
        }
    }
})

function movePlayer() {
    const canvasWidth = canvas.clientWidth
    const playerWidth = player.clientWidth

    //get player x pos
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
        bullets[i] ? (checkForCollision_bullet_enimie(bullets[i])
           , collision_between_bullets(bullets[i])
        ) : null
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
createEnimies()

let reverse = false
function containerEdge() {
    const invaders = document.querySelectorAll('.enemy')

    let left = canvasREC.right
    let right = canvasREC.left

    invaders.forEach(elem => {

        const enemyREC = elem.getBoundingClientRect()

        if (enemyREC.left < left)
            left = enemyREC.left
        if (enemyREC.right > right)
            right = enemyREC.right

    })
    return { left, right }
}

function moveEnimieContainer() {

    const { left, right } = containerEdge()

    if (!reverse && right < canvasREC.right) {
        moveEnimiesHor += moveEnimiesX
    } else if (!reverse && right >= canvasREC.right) {
        reverse = true
        moveEnimiesVer += moveEnimiesY
    }
    if (reverse && left > canvasREC.left) {
        moveEnimiesHor -= moveEnimiesX
    } else if (reverse && left <= canvasREC.left) {
        reverse = false
        moveEnimiesVer += moveEnimiesY
    }

    enimieContainer.style.transform = `translate(${moveEnimiesHor}px,${moveEnimiesVer}px)`
}

///colision betweeeeeen bullets
function collision_between_bullets(player_bullet) {
    let player_bullet_REC = player_bullet.getBoundingClientRect()
    if (Explo.time === 50) {
        Explo.hide = false
        Explo.time = 0
        explosion.style.display = 'none'
    }

    for (let i = 0; i < invadersBullet.length; i++) {
        let invadersBullet_REC = invadersBullet[i].getBoundingClientRect()

        if (player_bullet_REC.top < invadersBullet_REC.bottom &&
            (player_bullet_REC.left <= invadersBullet_REC.right && player_bullet_REC.left > invadersBullet_REC.left
                ||
                player_bullet_REC.right > invadersBullet_REC.left && player_bullet_REC.right < invadersBullet_REC.right
            )
        ) {

            Explo.hide = true

            // explosion.style.display = 'block'
            // explosion.style.left = player_bullet_REC.left + 'px'
            // explosion.style.top = player_bullet_REC.bottom + 'px'

            player_bullet.remove()
            invadersBullet[i].remove()
        }
    }

}

///collision between player bullet and the invader
function checkForCollision_bullet_enimie(bullet) {

    let invaders = document.querySelectorAll('.enemy')
    let bulletREC = bullet.getBoundingClientRect()

    for (let i = 0; i < invaders.length; i++) {
        let enimieREC = invaders[i].getBoundingClientRect()

        if (enimieREC.left < bulletREC.left && enimieREC.right > bulletREC.right && enimieREC.top < bulletREC.top && enimieREC.bottom > bulletREC.bottom
        ) {
            Score += 10
            optionsScore.textContent = Score
            bullet.remove()
            invaders[i].remove()
        }
    }
    if (invaders.length === 0) {
        gameWin()
    }
}

let howManyEnimiesCanShot = 0

///collision between enemies and the player
function checkForCollision_player_enimie() {
    let enimies = document.querySelectorAll('.enemy')

    for (let i = 0; i < enimies.length; i++) {
        let enimieREC = enimies[i].getBoundingClientRect()

        if (playerREC.top <= enimieREC.bottom) {
            gameOver('killed')
            // restartPopup.style.display = 'block'
        }
    }
}

export function enemiesShooting() {
    let invaders = document.querySelectorAll('.enemy')

    howManyEnimiesCanShot = Math.floor(Math.random() * 4)
    if (howManyEnimiesCanShot === 0) {
        howManyEnimiesCanShot++
    }

    let chosenEnimies = new Set()
    if (invaders) {

        while (chosenEnimies.size < Math.min(howManyEnimiesCanShot, invaders.length)) {

            const enemy = Math.floor(Math.random() * invaders.length)
            chosenEnimies.add(enemy)
        }
        if (invadersBullet.length < 2) { // limit bullets on screenn
            chosenEnimies.forEach(enemy => createEnimiesBullet(invaders[enemy]))
        }

    }
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
            ///remove the current bullet if it reaches canvas end
            // invadersBullet = invadersBullet.filter(b => b !== invadersBullet[i])
            invadersBullet.splice(i, 1)
            i--
            continue
        }
        if (invadersBullet[i])
            checkForCollision_player_invaderBullet(invadersBullet[i])

    }
}

function createEnimiesBullet(invader) {
    if (invader) {
        let invaderREC = invader.getBoundingClientRect()
        const bullet = document.createElement('span')
        bullet.classList.add('invader-bullet')
        bullet.style.left = `${invaderREC.left - canvasREC.left + (invaderREC.width / 2)}px`
        bullet.style.top = `${invaderREC.top - canvasREC.top + invaderREC.height - 5}px`
        
        canvas.appendChild(bullet)
        invadersBullet.push(bullet)
    }
}
const explosion = document.querySelector('.expl')

let player_invaderBullet = false
let Explo = {
    hide: false,
    time: 0
}
///collisoin between player and invaders bullet
function checkForCollision_player_invaderBullet(bullet) {
    //logic for display explo
    if (Explo.time === 50) {
        Explo.hide = false
        Explo.time = 0
        explosion.style.display = 'none'
    }

    let bulletREC = bullet.getBoundingClientRect()
    let playerREC = player.getBoundingClientRect()

    if (playerREC.top < bulletREC.bottom

        ///check bullet right with player left
        && (playerREC.left <= bulletREC.right && playerREC.right >= bulletREC.right
            ||
            ///check bullet left with player right
            playerREC.right >= bulletREC.left && playerREC.left <= bulletREC.left)
    ) {
        bullet.remove()
        Explo.hide = true

        // explosion.style.display = 'block'
        // explosion.style.left = bulletREC.left + 'px'
        // explosion.style.top = bulletREC.bottom + 'px'

        player_invaderBullet = true
        updateLives()
    }
}

function updateLives() {
    if (player_invaderBullet) {

        lives--
        if (lives === 0) {
            isGameOver = true
            document.querySelector(`.options-lives svg:nth-of-type(${lives + 1})`).classList.remove('heartbeat')
            document.querySelector(`.options-lives svg:nth-of-type(${lives + 1})`).style.display = 'none'
            gameOver('0 lives KFC')
        }
        if (lives > 0) {
            document.querySelector(`.options-lives svg:nth-of-type(${lives + 1})`).style.display = 'none'
            document.querySelector(`.options-lives svg:nth-of-type(${lives + 1})`).classList.remove('heartbeat')

            document.querySelector(`.options-lives svg:nth-of-type(${lives})`).classList.add('heartbeat')
            document.querySelector(`.heartbeat`).style.animationPlayState = "running";
        }

        player_invaderBullet = false

    }
}

// function updateFPS() {
//     const currentTime = performance.now();
//     const fps = Math.round(1000 / (currentTime - lastTime));
//     lastTime = currentTime;

//     fpsDisplay.textContent = `${fps}`;
// }

///to remove the setInterval
export function gameLoop() {

    if (!isGameOver) {
        counter++
        if (counter == 60) {
            handleCountDown()
            enemiesShooting()

            counter = 0
        }
        if (Explo.hide) {
            Explo.time++
        }
        movePlayer()
        moveBullet()
        //updateFPS()
        moveInvadersBullet()
        moveEnimieContainer()
        checkForCollision_player_enimie()
        REQID = requestAnimationFrame(gameLoop)
    }

}
function removeDOMBullets() {
    const DOM_bullets = document.querySelectorAll('.bullet, .invader-bullet')
    DOM_bullets.forEach(elem => {
        elem.remove()
    })

    bullets = []
    invadersBullet = []
}

export function init() {
    playing = true
    moveEnimiesHor = 0
    isGameOver = false
    moveEnimiesVer = 0
    lives = 3
    enimieContainer.style.transform = `translate(0px,0px)`
    gameSetting.canShoot = true

    countDown.textContent = '01:10'

    restartScore.textContent = 0

    livesHeart.forEach(elem => elem.style.display = 'block')

    removeDOMBullets()
    ////////options
    optionsScore.textContent = 0
    Score = 0

    Array.from(document.querySelectorAll(`.options-lives svg.heartbeat`), elem =>
        elem.classList.remove('heartbeat')
    )
    gameLoop()
}


///count-down
export function handleCountDown() {

    let startCount = countDown.textContent.split(':')

    let minutes = parseInt(startCount[0])
    let seconds = parseInt(startCount[1])

    if (seconds === 0 && minutes > 0) {

        minutes--
        seconds = 59
        countDown.textContent = minutes + ':' + seconds
    } else if (seconds > 0) {
        // seconds--
        countDown.textContent = `${minutes} : ${seconds < 10 ? '0' + seconds : seconds}`
    }
    rerer(seconds, minutes)

}
function rerer(seconds, minutes) {
    if (seconds > 0) {
        seconds--
    } else if (minutes > 0) {

        minutes--
        seconds = 59
    }
    let t = `${minutes} : ${seconds < 10 ? '0' + seconds : seconds}`
    countDown.textContent = t

    if (seconds === 0 && minutes === 0) {
        gameOver('time\'s up')
    }
}

function gameOver(calledFrom) {
    playing = false
    gameSetting.canShoot = false
    isGameOver = true
    restartScore.textContent = Score + "."
    document.body.classList.add('over')
    document.querySelector('.restart-popup p').textContent = calledFrom

    Explo.hide = false
    Explo.time = 0
    explosion.style.display = 'none'
}

function gameWin() {
    isGameOver = true

    gameSetting.canShoot = false

    winScore.textContent = Score + "."
    document.body.classList.add('win')
}