import { GuildMember, PermissionResolvable } from 'discord.js'
import { Middleware, BaseMiddleware } from '../Modules/Middleware'
import CommandReceived from './CommandReceived'

@Middleware('app:command:execute')
export default class CommandPermissions implements BaseMiddleware {
	public async run(context: CommandReceived): Promise<any> {
		const { sender, command, message } = context
		if (command.permissions) {
			const hasPermissions = (sender: GuildMember | null, permissions: Array<PermissionResolvable>) => {
				if (!sender) return false
				return permissions?.some((permission: PermissionResolvable) => sender.permissions.has(permission))
			}

			if (!hasPermissions(sender, command.permissions)) {
				context.setCancelled(true)
				return await message.reply('You are not allowed to execute this command.')
			}
		}
	}
}
