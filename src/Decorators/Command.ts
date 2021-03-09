import { PermissionResolvable } from 'discord.js'
import BaseCommand from '../Entities/BaseCommand'

type CommandContext = {
	label: string
	description: string
	tag: string
	usage?: Array<string>
	alias?: Array<string>
	roles?: Array<string>
	permissions?: Array<PermissionResolvable>
}

export default function Command(context: CommandContext) {
	const { label, description, usage, tag, alias, roles, permissions } = context

	return (target: Function) => {
		return class Command extends BaseCommand {
			constructor() {
				super(label, description, tag, usage, alias, roles, permissions, target.prototype.run)
			}
		}
	}
}
