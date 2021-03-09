import { ClientEvents } from 'discord.js'

export default class BaseEvent<K extends keyof ClientEvents> {
	public type: string = 'event'
	public _path: string = ''

	constructor(public identifier: K, public run: (...args: any) => Promise<void>) {}

	public set path(value: string) {
		this._path = value
	}

	public get path() {
		return this._path
	}
}
