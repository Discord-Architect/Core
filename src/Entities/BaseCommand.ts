import { PermissionResolvable } from 'discord.js'

export default class BaseCommand {
	public type: string = 'command'
	public _path: string = ''

	constructor(
		public label: string,
		public description: string,
		public tag: string,
		public usage: Array<string> = [],
		public alias: Array<string> = [],
		public roles: Array<string> | undefined,
		public permissions: Array<PermissionResolvable> | undefined,
		public run: () => Promise<void>
	) {}

	public set path(value: string) {
		this._path = value
	}

	public get path() {
		return this._path
	}
}
