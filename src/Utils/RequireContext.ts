import { GuildMember, Message } from 'discord.js'
import { RequireInterface } from 'src/Interfaces'
import CommandInterface from '../Interfaces/CommandInterface'

export default class RequireContext {
	private groups: { [key: string]: string } | undefined

	constructor(
		readonly name: string,
		readonly sender: GuildMember | null,
		readonly args: Array<string>,
		readonly message: Message,
		readonly command: CommandInterface,
		readonly requireInterface: RequireInterface
	) {
		this.groups = requireInterface.pattern.exec(name)?.groups
	}

	public get(group: string): string | undefined {
		return this.groups ? this.groups[group] : undefined
	}
}
