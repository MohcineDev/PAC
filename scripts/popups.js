import { writeTitle } from './speed.js'
import { gameSetting, init, enimieContainer, createEnimies, gameLoop, handleCountDown, enemiesShooting } from './script.js'

///game over
const restartPopup = document.querySelector('.restart-popup')
const restartBtn = restartPopup.querySelector('button')
const gameWinBtn = document.querySelector('.game-win-popup button')
export const restartScore = restartPopup.querySelector('span')

//start Popup
export const startPopup = document.querySelector('.start-popup')
const startBtn = startPopup.querySelector('button')

//pause Popup
const pausePopup = document.querySelector('.pause-popup')
const pauseRestartBtn = pausePopup.querySelector('button:nth-of-type(1)')
const pauseResumeBtn = pausePopup.querySelector('button:nth-of-type(2)')

writeTitle(startPopup.querySelector('h1'), 'Space invader #')


// start game button
startBtn.onclick = () => {
    init()
    document.body.classList.add('playing')
}


//resume button in the  pause popup
pauseResumeBtn.onclick = () => {
    gameSetting.canShoot = true
    gameLoop()
    handleCountDown()
    enemiesShooting()
    document.body.classList.add('playing')
    document.body.classList.remove('paused')

}

// button events
pauseRestartBtn.onclick = () => restartGAME()
restartBtn.onclick = () => restartGAME()
gameWinBtn.onclick = () => restartGAME()

function restartGAME() {
    enimieContainer.innerHTML = ''
    createEnimies()
    document.body.classList.remove('over')
    ///remove wwin if exist
    document.body.classList.remove('win')
    
    ///remove paused if exist
    document.body.classList.remove('paused')

    init()
}


document.addEventListener('keyup', e => {

    if (e.key === ' ') {
        if (startPopup.checkVisibility()) {
            startBtn.click()
            console.log('start btn')
        }
    
    }
})