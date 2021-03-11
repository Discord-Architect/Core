import { GuildMember, Message } from 'discord.js'
import CommandInterface from '../Interfaces/CommandInterface'

type RequireContextType = {
	readonly sender: GuildMember | null
	readonly args: Array<string>
	readonly message: Message
	readonly command: CommandInterface
}

export default RequireContextType
