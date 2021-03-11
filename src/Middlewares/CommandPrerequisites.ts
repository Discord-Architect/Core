import { Middleware, BaseMiddleware } from '../Modules/Middleware'
import CommandContext from './CommandContext'
import RequireContext from '../Utils/RequireContext'

@Middleware('app:command:execute')
export default class CommandPrerequisites implements BaseMiddleware {
	public async run(context: CommandContext): Promise<void> {
		const { sender, args, command, message } = context

		for (const { name, pointer } of command.requires) {
			const reqireContext = new RequireContext(name, sender, args, message, command, pointer)
			const execute = await pointer.isValid(reqireContext)

			if (!execute) {
				return context.setCancelled(true)
			}
		}
	}
}
