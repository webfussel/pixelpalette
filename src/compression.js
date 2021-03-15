const compressedBlockElement = document.querySelector('[data-compressed-block]')
const uncompressedBlockElement = document.querySelector('[data-uncompressed-block]')

const comp = {
    chunk: 2,
    fromBase: 4,
    toBase: 16
}

const uncompress = compressed => {
    const result = []
    for (let i = 0; i < compressed.length; i++) {
        let binary = parseInt(compressed[i], comp.toBase).toString(2)
        binary = '0'.repeat(4).substr(binary.length) + binary;

        let current = ''
        for (let j = 0; j < binary.length; j++) {
            current += binary[j]
            if (current.length === 2) {
                result.push(parseInt(current, 2).toString(10))
                current = ''
            }
        }
    }

    uncompressedBlockElement.innerText = result.join('')
}

export const compress = fields => {
    const regex = new RegExp('.{1,' + comp.chunk + '}', 'g')
    const res = fields.match(regex).map(chunk => parseInt(chunk, comp.fromBase).toString(comp.toBase)).join('').toUpperCase()
    compressedBlockElement.innerText = res || 0
    uncompress(res)
}
