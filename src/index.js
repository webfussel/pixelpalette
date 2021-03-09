import './index.scss'

const drawBlockElement = document.querySelector('[data-number-block][data-maxlength]')
const compressedBlockElement = document.querySelector('[data-compressed-block]')
const uncompressedBlockElement = document.querySelector('[data-uncompressed-block]')
const gridSizeContainerElement = document.querySelector('[data-size] [data-container]')
const paletteContainerElement = document.querySelector('[data-palette] [data-container]')
const customPaletteInputelements = [...document.querySelectorAll('[data-custom-palette-input]')]
const templatesSelectElement = document.querySelector('[data-templates-select]')
const copy = document.querySelector('#copy')
const paste = document.querySelector('#paste')
const canvas = document.querySelector('#pixel')
const canvasContext = canvas.getContext('2d')

let currentGridSize = 0;
const gridSizes = [8, 16, 32]
const pixelSize = 16;

const temps = [
    {
        name: 'blank',
        grid: 8,
        template: '0'.repeat(gridSizes[currentGridSize] ** 2)
    },
    {
        name: 'red',
        grid: 16,
        template: '3333300000033333333301111110333333301111111103333330111111110333330001222210003333002000000200333020222222220203302222022022220333002202202200333300022112200033302200000000220330220000000022033300011001100033333010011001033333301110011103333333000330003333'
    }, {
        name: 'link',
        grid: 16,
        template: '3333330000033333333330112210333333300111001003333302012222002033330202000020203333020000000020333301100000011033333022022022033333301202202100333301012222101203330100000000020333012201111000333330220222210333333300111000033333300000022100333333000000000333'
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

const possibleNumbers = palettes[0].map((c, i) => i).join('')

// compressionblock = partSize * blockSize
const compression = {
    partSize: 2,
    blockSize: 8,
    compressionBlock () {
        return this.partSize * this.blockSize
    }
}

const setBlockInner = () => {
    drawBlockElement.innerText = '0'.repeat(+drawBlockElement.dataset.maxlength)
}

const checkIfValidHexColor = text => /^[0-9A-F]{6}$/i.test(text)

const compress = fields => {
    let current = ''
    let allBinary = ''
    const result = []
    for (let i = 0; i < fields.length; i++) {
        const newBinary = parseInt(fields[i], 10).toString(2)
        current += `${newBinary.length === 1 ? '0' : ''}${newBinary}`
        if (current.length === compression.compressionBlock()) {
            result.push(parseInt(current, compression.partSize).toString(compression.compressionBlock()).toUpperCase())
            allBinary += current
            current = ''
        }
    }

    compressedBlockElement.innerText = result.join('')
}

const redrawCanvas = fields => {
    if (!fields) fields = drawBlockElement.innerText
    compress(fields)
    let x = 0
    let y = 0

    for (let i = 0; i < fields.length; i++) {
        const digit = +fields[i]
        if (i !== 0) {
            if (i % gridSizes[currentGridSize] === 0) {
                x = 0
                y += pixelSize
            } else {
                x += pixelSize
            }
        }

        const customPaletteColor = customPaletteInputelements[digit].value.trim()
        const color = checkIfValidHexColor(customPaletteColor) ? customPaletteColor : palettes[currentPalette][digit]
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

    const maxLength = +target.dataset.maxlength

    if (!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(key)) ev.preventDefault()

    if (!possibleNumbers.includes(key)) return

    const {anchorOffset: index} = document.getSelection()
    target.innerText = `${target.innerText.substr(0, index)}${key}${target.innerText.substr(index + 1)}`
    moveCaret(target, index + 1)

    if (target.innerText.length > maxLength) {
        target.innerText = target.innerText.substr(0, maxLength)
    }

    redrawCanvas()
}

const changeGridSize = size => {
    currentGridSize = size
    const actualSize = gridSizes[size]
    const sizeRadios = [...document.querySelectorAll('input[name="size"]')]
    sizeRadios.forEach((element, index) => {
        element.checked = index === size
    })
    drawBlockElement.dataset.maxlength = `${(actualSize) ** 2}`
    drawBlockElement.style.setProperty('--grid-size', actualSize + '')
    setBlockInner()
    canvas.width = canvas.height = gridSizes[currentGridSize] * pixelSize
}

const buildGridSize = () => {
    for (let i = 0; i < gridSizes.length; i++) {
        const radio = document.createElement('input')
        radio.type = 'radio'
        radio.name = 'size'
        radio.value = gridSizes[i] + ''
        radio.checked = i === 0
        radio.addEventListener('change', () => {
            changeGridSize(i)
            redrawCanvas()
        })

        const label = document.createElement('label')

        label.append(radio)
        label.append(`${gridSizes[i]}x${gridSizes[i]}`)
        gridSizeContainerElement.append(label)
    }
}

const changePalette = (index) => {
    currentPalette = index;
    redrawCanvas()
}

const buildPalette = () => {
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

customPaletteInputelements.forEach(element => {
    element.addEventListener('input', () => {redrawCanvas()})
})


const buildTemplates = () => {
    temps.forEach(template => {
        const option = document.createElement('option')
        option.value = `${template.grid}|${template.template}`
        option.innerText = template.name
        templatesSelectElement.append(option)
    })
}

templatesSelectElement.addEventListener('change', ({target}) => {
    const [grid, template] = target.value.split('|')
    changeGridSize(gridSizes.findIndex(el => el === +grid))
    drawBlockElement.innerText = template
    redrawCanvas()
})

copy.addEventListener('click', () => {
    const textarea = document.createElement("textarea");
    textarea.textContent = drawBlockElement.innerText;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();
    try {
        copy.innerText = 'copied!'
        setTimeout(() => {
            copy.innerText = 'copy'
        }, 1000)
        return document.execCommand("copy");
    } catch (ex) {
        console.warn("Copy to clipboard failed.", ex);
        return false;
    } finally {
        document.body.removeChild(textarea);
    }
})

paste.addEventListener('click', () => {
    navigator.clipboard.readText()
        .then(text => {
            const maxLength = +drawBlockElement.dataset.maxlength
            const regex = new RegExp(`[^${possibleNumbers}]`, 'g')
            const insert = text.replace(regex, '').substr(0, maxLength)
            let rest = '0'.repeat(maxLength - insert.length > 0 ? maxLength - insert.length : 0)
            drawBlockElement.innerText = insert + rest
            redrawCanvas()
        })
        .catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
})


setBlockInner()
buildGridSize()
buildPalette()
buildTemplates()
redrawCanvas()

drawBlockElement.addEventListener('keydown', limitCharacters, false)