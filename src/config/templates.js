import Eventbus from '../eventbus'

const templatesSelectElement = document.querySelector('[data-templates-select]')

const templates = [
    {
        name: 'blank',
        grid: 8,
        template: '0'.repeat(64)
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

/**
 * Resets template to blank.
 */
export const resetTemplate = () => {document.querySelector('[data-templates-select] option').selected = true}

templatesSelectElement.addEventListener('change', ({target}) => {
    const [grid, template] = target.value.split('|')
    Eventbus.emit('templateChanged', {gridSize: +grid, template})
})

/**
 * Builds the config area for templates.
 */
export const buildTemplatesConfig = () => {
    templates.forEach(template => {
        const option = document.createElement('option')
        option.value = `${template.grid}|${template.template}`
        option.innerText = template.name
        templatesSelectElement.append(option)
    })
}
