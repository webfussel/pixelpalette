import './index.scss'

const numberBlock = document.querySelector('[data-number-block][data-maxlength]')
const blockSize = [...document.querySelectorAll('input[name="size"]')]
const palette = document.querySelector('[data-palette]')
const canvas = document.querySelector('#pixel')
const canvasContext = canvas.getContext('2d')

let gridSize = 8;
const pixelSize = 16;

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
    ]
]


const setBlockInner = () => {
    numberBlock.innerText = '0'.repeat(+numberBlock.dataset.maxlength)
}

const redrawCanvas = (fields) => {
    if (!fields) fields = '0'.repeat(+numberBlock.dataset.maxlength)
    let x = 0
    let y = 0

    for (let i = 0; i < fields.length; i++) {
        const digit = +fields[i]
        if (i !== 0) {
            if (i % gridSize === 0) {
                x = 0
                y += pixelSize
            } else {
                x += pixelSize
            }
        }

        const color = palettes[currentPalette][digit]
        canvasContext.fillStyle = `#${color}`
        canvasContext.fillRect(x, y, pixelSize, pixelSize)
    }
}

const moveCaret = (el, pos) => {
    const range = document.createRange()
    const sel = window.getSelection()

    range.setStart(el.childNodes[0], pos)
    range.collapse(true)

    sel.removeAllRanges()
    sel.addRange(range)
}

const limitCharacters = ev => {
    const {key, target} = ev
    if (!target) return

    const maxLength = +target.dataset.maxlength

    if (!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(key)) ev.preventDefault()

    if (!'0123'.includes(key)) return

    const {anchorOffset: index} = document.getSelection()
    target.innerText = `${target.innerText.substr(0, index)}${key}${target.innerText.substr(index + 1)}`
    moveCaret(target, index + 1)

    if (target.innerText.length > maxLength) {
        target.innerText = target.innerText.substr(0, maxLength)
    }

    redrawCanvas(target.innerText)
}

setBlockInner()
numberBlock.addEventListener('keydown', limitCharacters, false)

blockSize.forEach(size => {
    size.addEventListener('change', ({target}) => {
        numberBlock.dataset.maxlength = `${(+target.value) ** 2}`
        numberBlock.style.setProperty('--grid-size', target.value)
        gridSize = +target.value
        setBlockInner()
        canvas.width = canvas.height = gridSize * pixelSize
        redrawCanvas(numberBlock.innerText)
    })
})

const changePalette = (index) => {
    currentPalette = index;
    redrawCanvas(numberBlock.innerText)
}

const buildPalette = () => {
    for (let i = 0; i < palettes.length; i++) {
        const radio = document.createElement('input')
        radio.type = 'radio'
        radio.name = 'palette'
        radio.value = i + ''
        radio.checked = i === 0

        const container = palette.querySelector('[data-container]')

        const label = document.createElement('label')
        label.append(radio)
        palettes[i].forEach((color, index) => {
            const block = document.createElement('div')
            block.classList.add('block')
            block.style.setProperty('--bg', `#${color}`)
            label.append(block)
        })

        container.append(label)
        radio.addEventListener('change', () => {
            changePalette(i)
        })

        palette.append(container)
    }
}

buildPalette()
redrawCanvas()