import { GuildMember, Message, PermissionResolvable } from 'discord.js'
import Logger from './Logger'
import Env from '@discord-architect/env'
import Manager from './Manager'
import path from 'path'
import { NodeEmitter } from './NodeEmitter'
import CommandInterface from './Interfaces/CommandInterface'
import { CommandContext } from './Middlewares'

export default class Guard {
	constructor() {
		NodeEmitter.register('app:guard:ready')
	}

	private env: {
		PREFIX: string | undefined
		COMMANDS_AUTO_REMOVE: string | boolean
		COMMANDS_REMOVE_TIMEOUT: number
	} = {
		PREFIX: Env.get('CLIENT_PREFIX'),
		COMMANDS_AUTO_REMOVE: Env.get('COMMANDS_AUTO_REMOVE') || true,
		COMMANDS_REMOVE_TIMEOUT: parseInt(Env.get('COMMANDS_REMOVE_TIMEOUT')!) || 0
	}

	public async protect(message: Message): Promise<void | Message> {
		if (message.author?.bot) {
			return
		}

		if (!this.env.PREFIX) {
			return Logger.send('error', `The token of your bot is not defined or is equal to null. Please define a valid prefix.\n${path.join(process.cwd(), '.env')}`)
		}

		if (message.content.startsWith(this.env.PREFIX)) {
			const sender: GuildMember | null = message.member
			const args: Array<string> = message.content.split(' ')
			const commandName: string = args[0].replace(this.env.PREFIX, '')

			const commands: Map<string, CommandInterface> | undefined = Manager.commands.get('full')
			const command: CommandInterface | undefined = commands?.get(commandName)

			if (command) {
				if (this.env.COMMANDS_AUTO_REMOVE) {
					await message.delete({ timeout: this.env.COMMANDS_REMOVE_TIMEOUT })
				}

				const commandContext = new CommandContext(sender, args, message, command)
				NodeEmitter.register('app:command:execute', commandContext)

				if (commandContext.isCancelled()) {
					return
				}

				return await command?.run(message, args)
			}
		}

		NodeEmitter.register('app:message:received', message)
	}
}
