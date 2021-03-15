import Eventbus from '../eventbus'

const paletteContainerElement = document.querySelector('[data-palette] [data-container]')
const customPaletteInputElements = [...document.querySelectorAll('[data-custom-palette-input]')]

let currentPalette = 0
const palettes = [
    [
        '405010',
        '708028',
        'a0a840',
        'd0d058'
    ], [
        '2d1b00',
        '1e606e',
        '5ab9a8',
        'c4f0c2'
    ], [
        '08050c',
        '822d30',
        'eb754d',
        'f8b581'
    ], [
        '2c2137',
        '764462',
        'a96868',
        'edb4a1'
    ], [
        '00303b',
        '4e494c',
        'd4984a',
        'ffffc7'
    ], [
        '301221',
        '854576',
        '9e81d0',
        'eebff5'
    ], [
        '181010',
        '84739c',
        'f7b58c',
        'ffefff'
    ]
]

const checkIfValidHexColor = text => /^[0-9A-F]{6}$/i.test(text)

export const getCurrentColorForDigit = (digit) => {
    const customPaletteColor = customPaletteInputElements[digit].value.trim()
    return checkIfValidHexColor(customPaletteColor) ? customPaletteColor : palettes[currentPalette][digit]
}

const changePalette = (index) => {
    currentPalette = index;
    Eventbus.emit('colorPaletteChanged')
}

export const buildPaletteConfig = () => {
    for (let i = 0; i < palettes.length; i++) {
        const radio = document.createElement('input')
        radio.type = 'radio'
        radio.name = 'palette'
        radio.value = i + ''
        radio.checked = i === 0

        radio.addEventListener('change', () => {
            changePalette(i)
        })

        const label = document.createElement('label')
        label.append(radio)
        palettes[i].forEach((color, index) => {
            const block = document.createElement('div')
            block.classList.add('block')
            block.style.setProperty('--bg', `#${color}`)
            label.append(block)
        })

        paletteContainerElement.append(label)
    }
}

customPaletteInputElements.forEach(element => {
    element.addEventListener('input', () => Eventbus.emit('customPaletteChanged'))
})
