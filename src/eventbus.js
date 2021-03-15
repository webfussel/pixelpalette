/**
 * Event emitter and receiver class.
 */
export default class Eventbus {

    static #events = {}

    /**
     * Executes all events added to given event name with details as parameter.
     * @param eventName {string} Name of the event
     * @param [details] {object} Containing more information about the event
     */
    static emit(eventName, details = {}) {
        if (!eventName) throw TypeError(`Parameter eventName is not correctly filled. Expected: string with length > 0, got ${eventName}`)

        Eventbus.#events[eventName]?.forEach(cb => cb(details))
    }

    /**
     * Adds callback to given event name.
     * @param eventName {string} Name of the event
     * @param cb {Function} Callback to execute on emitting the event
     */
    static on(eventName, cb) {
        if (!eventName) throw TypeError(`Parameter eventName is not correctly filled. Expected: string with length > 0, got ${eventName}`)

        const allEvents = eventName.split(' ')

        allEvents.forEach(event => {
            if (!Eventbus.#events[event]) Eventbus.#events[event] = []

            Eventbus.#events[event].push(cb)
        })
    }
}
