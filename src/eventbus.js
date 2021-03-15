export default class Eventbus {

    static #events = {}

    static emit(eventName, details) {
        if (!eventName) throw TypeError(`Parameter eventName is not correctly filled. Expected: string with length > 0, got ${eventName}`)

        Eventbus.#events[eventName]?.forEach(cb => cb(details))
    }

    static on(eventName, cb) {
        if (!eventName) throw TypeError(`Parameter eventName is not correctly filled. Expected: string with length > 0, got ${eventName}`)

        const allEvents = eventName.split(' ')

        allEvents.forEach(event => {
            if (!Eventbus.#events[event]) Eventbus.#events[event] = []

            Eventbus.#events[event].push(cb)
        })
    }
}
