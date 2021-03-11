import { PermissionResolvable } from 'discord.js'
import BaseCommand from './BaseCommand'
import RequireInterface from './RequireInterface'

export default interface CommandInterface extends BaseCommand {
	label: string
	description: string
	usage: string
	tag: string
	alias?: Array<string>
	roles?: Array<string>
	permissions?: Array<PermissionResolvable>
	requires: Array<{ name: string; pointer: RequireInterface }>
	path: string
}
