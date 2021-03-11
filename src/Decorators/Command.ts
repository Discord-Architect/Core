import { PermissionResolvable } from 'discord.js'
import Logger from '../Logger'
import BaseCommand from '../Entities/BaseCommand'
import Manager from '../Manager'

type CommandContext = {
	label: string
	description: string
	tag: string
	usage?: Array<string>
	alias?: Array<string>
	roles?: Array<string>
	permissions?: Array<PermissionResolvable>
	require?: Array<string>
}

export default function Command(context: CommandContext) {
	const { label, description, usage, tag, alias, roles, permissions, require } = context

	return (target: Function) => {
		return class Command extends BaseCommand {
			constructor() {
				const reqs = (require || []).map((name: string) => {
					const req = Manager.require.get(name)

					if (!req) {
						Logger.send('error', `Prerequisite ${name} does not exist, please ensure that it does`)
					}

					return req!
				})
				super(label, description, tag, usage, alias, roles, permissions, reqs, target.prototype.run)
			}
		}
	}
}
