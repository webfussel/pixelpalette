import Eventbus from './eventbus'

const drawBlockElement = document.querySelector('[data-number-block][data-maxlength]')
const copy = document.querySelector('#copy-draw')
const paste = document.querySelector('#paste-draw')

const possibleNumbers = '0123'

/**
 * Resets the draw block and fills it up with zeros until max length.
 */
export const resetDrawBlock = () => {
    drawBlockElement.innerText = '0'.repeat(+drawBlockElement.dataset.maxlength)
}

/**
 * Sets the text of the draw block to given content string.
 * @param content {string} The new content of draw block
 */
export const setDrawBlockInner = content => drawBlockElement.innerText = content

/**
 * Gets the current text of the draw block.
 * @returns {string}
 */
export const getDrawBlockInner = () => drawBlockElement.innerText

/**
 * Sets the maximum number of characters in the draw block.
 * @param max {number} The maximum number of characters
 */
export const setMaxLength = max => {
    drawBlockElement.dataset.maxlength = `${max}`
}

/**
 * Moves the caret to given position.
 * @param el {Element} Element where the caret should be moved
 * @param pos {number} Position of the caret
 */
const moveCaret = (el, pos) => {
    const range = document.createRange()
    const sel = window.getSelection()

    range.setStart(el.childNodes[0], pos)
    range.collapse(true)

    sel.removeAllRanges()
    sel.addRange(range)
}

/**
 * Limits the number and character types that can be inserted into the draw block.
 * @param ev {KeyboardEvent} Keyboard event this function was called from
 */
const limitCharacters = ev => {
    const {key, target} = ev

    const maxLength = +target.dataset.maxlength

    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) ev.preventDefault()

    if (!possibleNumbers.includes(key)) return

    const {anchorOffset: index} = document.getSelection()
    target.innerText = `${target.innerText.substr(0, index)}${key}${target.innerText.substr(index + 1)}`
    moveCaret(target, index + 1)

    if (target.innerText.length > maxLength) {
        target.innerText = target.innerText.substr(0, maxLength)
    }

    Eventbus.emit('drawBlockChanged')
}

copy.addEventListener('click', () => {
    const textarea = document.createElement('textarea')
    textarea.textContent = drawBlockElement.innerText
    textarea.style.position = 'fixed'
    document.body.appendChild(textarea)
    textarea.select()
    try {
        copy.innerText = 'copied!'
        setTimeout(() => {
            copy.innerText = 'copy'
        }, 1000)
        return document.execCommand('copy')
    } catch (ex) {
        console.warn('Copy to clipboard failed.', ex)
        return false
    } finally {
        document.body.removeChild(textarea)
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
            Eventbus.emit('drawBlockChanged')
        })
        .catch(err => {
            console.error('Failed to read clipboard contents: ', err)
        })
})

drawBlockElement.addEventListener('keydown', limitCharacters, false)
