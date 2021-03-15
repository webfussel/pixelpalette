import './index.scss'
import Eventbus from './eventbus'
import {buildGridSizeConfig, changeGridSize, findGridSizeIndex, getCurrentGridSize} from './config/grid'
import {buildTemplatesConfig, resetTemplate} from './config/templates'
import {buildPaletteConfig, getCurrentColorForDigit} from './config/palette'
import {compress} from './compression'
import {getDrawBlockInner, resetDrawBlock, setDrawBlockInner, setMaxLength} from './drawblock'

const canvas = document.querySelector('#pixel')
const canvasContext = canvas.getContext('2d')

const pixelSize = 16;

/**
 * Redraws the canvas with given fields string.
 * If no fields are given it defaults to current draw block inner text.
 * @param [fields] {string} Containing the fields to draw to the canvas
 */
const redrawCanvas = fields => {
    if (!fields) fields = getDrawBlockInner()
    compress(fields)
    let x = 0
    let y = 0

    for (let i = 0; i < fields.length; i++) {
        const digit = +fields[i]
        if (i !== 0) {
            if (i % getCurrentGridSize() === 0) {
                x = 0
                y += pixelSize
            } else {
                x += pixelSize
            }
        }

        canvasContext.fillStyle = `#${getCurrentColorForDigit(digit)}`
        canvasContext.fillRect(x, y, pixelSize, pixelSize)
    }
}

resetDrawBlock()
buildGridSizeConfig()
buildPaletteConfig()
buildTemplatesConfig()
redrawCanvas()

Eventbus.on('gridSizeManuallyChanged', () => {
    resetTemplate()
    resetDrawBlock()
    redrawCanvas()
})

Eventbus.on('gridSizeChanged', ({gridSize}) => {
    setMaxLength(gridSize ** 2)
    canvas.width = canvas.height = gridSize * pixelSize
    document.body.style.setProperty('--grid-size', gridSize + '')
    redrawCanvas()
})

Eventbus.on('templateChanged', ({gridSize, template}) => {
    changeGridSize(findGridSizeIndex(gridSize))
    setDrawBlockInner(template)
    redrawCanvas()
})

Eventbus.on('customPaletteChanged colorPaletteChanged drawBlockChanged', () => {
    redrawCanvas()
})
