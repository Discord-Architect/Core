import { ClientEvents } from 'discord.js'

export default interface EventInterface<K extends keyof ClientEvents> {
	identifier: K
	path: string
	run(...args: Array<any>): Promise<void>
}
