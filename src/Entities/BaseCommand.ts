import { PermissionResolvable } from 'discord.js'
import RequireInterface from '../Interfaces/RequireInterface'

export default class BaseCommand {
	public static type: string = 'command'
	public _path: string = ''

	constructor(
		public label: string,
		public description: string,
		public tag: string,
		public usage: Array<string> = [],
		public alias: Array<string> = [],
		public roles: Array<string> | undefined,
		public permissions: Array<PermissionResolvable> | undefined,
		public requires: Array<{ name: string; pointer: RequireInterface }> = [],
		public run: () => Promise<void>
	) {}

	public set path(value: string) {
		this._path = value
	}

	public get path() {
		return this._path
	}
}
