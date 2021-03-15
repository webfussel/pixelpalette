import Eventbus from './eventbus'

const drawBlockElement = document.querySelector('[data-number-block][data-maxlength]')
const copy = document.querySelector('#copy-draw')
const paste = document.querySelector('#paste-draw')

const possibleNumbers = '0123'

export const resetDrawBlock = () => {
    drawBlockElement.innerText = '0'.repeat(+drawBlockElement.dataset.maxlength)
}

export const setDrawBlockInner = content => drawBlockElement.innerText = content

export const getDrawBlockInner = () => drawBlockElement.innerText

export const setMaxLength = max => drawBlockElement.dataset.maxlength = `${max}`


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

    Eventbus.emit('drawBlockChanged')
}

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
            Eventbus.emit('drawBlockChanged')
        })
        .catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
})

drawBlockElement.addEventListener('keydown', limitCharacters, false)
