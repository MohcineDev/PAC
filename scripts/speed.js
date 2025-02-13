export let moveEnimiesX = 3
export let moveEnimiesY = 5
export const movePlayerSpeed = 5
export let bulletSpeed = 6

const settings = document.querySelector('.settings')
export const HorInput = document.querySelector('.settings #hor input')
export const VerInput = document.querySelector('.settings #ver input')
export const bulletInput = document.querySelector('.settings #bullet input')

const minHor = document.querySelector('.settings #hor span:nth-of-type(1)')
const maxHor = document.querySelector('.settings #hor span:nth-of-type(2)')
const minVer = document.querySelector('.settings #ver span:nth-of-type(1)')
const maxVer = document.querySelector('.settings #ver span:nth-of-type(2)')
const minBullet = document.querySelector('.settings #bullet span:nth-of-type(1)')
const maxBullet = document.querySelector('.settings #bullet span:nth-of-type(2)')

const horValue = document.querySelector('[for="hor"] em')
const verValue = document.querySelector('[for="ver"] em')
const bulletValue = document.querySelector('[for="bullet"] em')
const open = document.querySelector('nav #open')

horValue.textContent = HorInput.value
minHor.textContent = HorInput.min
maxHor.textContent = HorInput.max

verValue.textContent = VerInput.value
minVer.textContent = VerInput.min
maxVer.textContent = VerInput.max

bulletValue.textContent = bulletInput.value
minBullet.textContent = bulletInput.min
maxBullet.textContent = bulletInput.max

HorInput.oninput = (e) => {
    console.log(e);
    horValue.textContent = e.target.value
    console.log(moveEnimiesX);
    
    moveEnimiesX = parseInt(e.target.value)
    console.log(moveEnimiesX);
}
VerInput.oninput = (e) => {
    console.log(e);
    verValue.textContent = e.target.value
    moveEnimiesY = parseInt(e.target.value)
}
bulletInput.oninput = (e) => {
    console.log(e);
    bulletValue.textContent = e.target.value
    bulletSpeed = parseInt(e.target.value)
}

open.onclick = () => {
    settings.classList.toggle('open')
}

let index = 0

export const writeTitle = (elem, txt) => {
    let a = txt.length

    if (index < a) {

        elem.textContent += txt.charAt(index)
        index++
        setTimeout(() => {
            writeTitle(elem, txt)
        }, 80)

    }
}

