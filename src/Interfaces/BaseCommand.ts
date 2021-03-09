import { Message } from 'discord.js'

export default interface BaseCommand {
	run(message: Message, args: Array<string>): Promise<void>
}
