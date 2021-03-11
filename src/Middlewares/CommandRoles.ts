import { GuildMember } from 'discord.js'
import { Middleware, BaseMiddleware } from '../Modules/Middleware'
import CommandReceived from './CommandReceived'

@Middleware('app:command:execute')
export default class CommandRoles implements BaseMiddleware {
	public async run(context: CommandReceived): Promise<any> {
		const { sender, command, message } = context
		if (command.roles) {
			const hasRole = (sender: GuildMember | null, roles: Array<string>) => {
				if (!sender) return false
				return roles.some((role: string) => sender.roles.cache.has(role))
			}

			if (!hasRole(sender, command.roles)) {
				context.setCancelled(true)
				return await message.reply('You are not allowed to execute this command.')
			}
		}
	}
}
