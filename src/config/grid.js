import Eventbus from '../eventbus'

const gridSizeContainerElement = document.querySelector('[data-size] [data-container]')

let currentGridSize = 0;
const gridSizes = [8, 16, 32]

export const changeGridSize = size => {
    currentGridSize = size
    const gridSize = gridSizes[size]
    const sizeRadios = [...document.querySelectorAll('input[name="size"]')]
    sizeRadios.forEach((element, index) => {
        element.checked = index === size
    })
    Eventbus.emit('gridSizeChanged', {gridSize})
}

export const findGridSizeIndex = gridSize => gridSizes.findIndex(el => el === gridSize)

export const getCurrentGridSize = () => gridSizes[currentGridSize]

export const buildGridSizeConfig = () => {
    for (let i = 0; i < gridSizes.length; i++) {
        const radio = document.createElement('input')
        radio.type = 'radio'
        radio.name = 'size'
        radio.value = gridSizes[i] + ''
        radio.checked = i === 0
        radio.addEventListener('change', () => {
            changeGridSize(i)
            Eventbus.emit('gridSizeManuallyChanged', {gridSize: gridSizes[i]})
        })

        const label = document.createElement('label')

        label.append(radio)
        label.append(`${gridSizes[i]}x${gridSizes[i]}`)
        gridSizeContainerElement.append(label)
    }
}
