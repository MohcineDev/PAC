const canvas = document.querySelector('.canvas')
const player = document.querySelector('.player')

let moveVer = player.offsetTop

let moveAmount = 5
let playerInitX = canvas.clientWidth / 2 - player.clientWidth / 2
let playerInitY = canvas.clientHeight - player.clientHeight - 20
let moveHor = playerInitX
console.log('playerInitY : ', playerInitY)
player.style.transform = `translate(${playerInitX}px)`

function getPlayerXRelativeToCanvas(player, canvas) {
    const playerRect = player.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()

    return playerRect.left - canvasRect.left
}

let keys = {

}

document.addEventListener('keyup', e => {
    keys[e.key] = false
})

document.addEventListener('keydown', e => {
    keys[e.key] = true
    // Pause logic remains unchanged
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        console.log('pause')
        pause()
    }
    //space
    if (e.key === ' ') {
        createBullet(playerX)
    }
})

     
function test(){
    const canvasWidth = canvas.clientWidth
    const playerWidth = player.clientWidth

    //player x pos
    const playerX = getPlayerXRelativeToCanvas(player, canvas)
    if (keys['ArrowLeft'] && playerX > 0) {
        moveHor -= moveAmount
    }

    if (keys['ArrowRight'] && playerX + playerWidth < canvasWidth) {
        moveHor += moveAmount
    }

    requestAnimationFrame(test)

    player.style.transform = `translateX(${moveHor}px)`
}

let bullets = []
let bulletYMove = playerInitY

function moveBullet(bullet) {
    let bulletREC = bullet.getBoundingClientRect()
    let canvasREC = canvas.getBoundingClientRect()

    bulletYMove -= moveAmount
    bullet.style.top = `${bulletYMove}px`
    requestAnimationFrame(moveBullet)
}

function createBullet(playerX) {
    const bullet = document.createElement('span')
    bullet.classList.add('bullet')
    bullet.style.left = `${playerX}px`
    bullet.style.top = `${playerInitY}px`
    bullet.style.transform = `translate(50%)`

    canvas.appendChild(bullet)
    bullets.push(bullet)
    moveBullet(bullet)
}
requestAnimationFrame(test)
