import './index.scss'

const numberBlock = document.querySelector('[data-number-block][data-maxlength]')
const blockSize = [...document.querySelectorAll('input[name="size"]')]
const palette = document.querySelector('[data-palette]')
const templates = document.querySelector('#templates')
const canvas = document.querySelector('#pixel')
const canvasContext = canvas.getContext('2d')

let gridSize = 8;
const pixelSize = 16;

const temps = [
    {
        name: 'blank',
        grid: 8,
        template: '0'.repeat(gridSize ** 2)
    },
    {
        name: 'red',
        grid: 16,
        template: '3333300000033333333301111110333333301111111103333330111111110333330001222210003333002000000200333020222222220203302222022022220333002202202200333300022112200033302200000000220330220000000022033300011001100033333010011001033333301110011103333333000330003333'
    }, {
        name: 'link',
        grid: 16,
        template: '3333330000033333333330112210333333300111001003333302013333002033330203000030203333020000000020333301100000011033333022022022033333301202202100333301012222101203330100000000020333012201111000333330220222210333333300111000033333300000022100333333000000000333'
    }
]

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

const changeBlockSize = size => {
    numberBlock.dataset.maxlength = `${(size) ** 2}`
    numberBlock.style.setProperty('--grid-size', size)
    gridSize = size
    setBlockInner()
    canvas.width = canvas.height = gridSize * pixelSize
}

blockSize.forEach(size => {
    size.addEventListener('change', ({target}) => {
        changeBlockSize(+target.value)
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

const buildTemplates = () => {
    temps.forEach(template => {
        const option = document.createElement('option')
        option.value = `${template.grid}|${template.template}`
        option.innerText = template.name
        templates.append(option)
    })
}

templates.addEventListener('change', ({target}) => {
    const [grid, template] = target.value.split('|')
    changeBlockSize(grid)
    numberBlock.innerText = template
    redrawCanvas(numberBlock.innerText)
})

buildPalette()
buildTemplates()
redrawCanvas()