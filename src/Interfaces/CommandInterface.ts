import { PermissionResolvable } from 'discord.js'
import BaseCommand from './BaseCommand'

export default interface CommandInterface extends BaseCommand {
	label: string
	description: string
	usage: string
	tag: string
	alias?: Array<string>
	roles?: Array<string>
	permissions?: Array<PermissionResolvable>
	path: string
}
