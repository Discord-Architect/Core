import { GuildMember, Message } from 'discord.js'
import CommandInterface from '../Interfaces/CommandInterface'

export default class CommandReceived {
	constructor(
		readonly sender: GuildMember | null,
		readonly args: Array<string>,
		readonly message: Message,
		readonly command: CommandInterface,
		private cancelled: boolean = false
	) {
		this.setCancelled = this.setCancelled.bind(this)
	}

	public setCancelled(bool: boolean): void {
		this.cancelled = bool
	}

	public isCancelled(): boolean {
		return this.cancelled
	}
}
