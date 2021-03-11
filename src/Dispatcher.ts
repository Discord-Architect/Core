import Env from '@discord-architect/env'
import Progress from './Progress'
import CommandInterface from './Interfaces/CommandInterface'
import ContextInterface from './Interfaces/ContextInterface'
import EventInterface from './Interfaces/EventInterface'
import MiddlewareInterface from './Interfaces/MiddlewareInterface'
import Logger from './Logger'
import Manager from './Manager'

export default class Dispatcher {
	constructor(private files: Array<string>) {}

	public async dispatch() {
		const modules: {
			command: (command: CommandInterface) => void
			event: (event: EventInterface<any>) => void
			middleware: (middleware: MiddlewareInterface) => void
			unknown: () => void
		} = {
			command: (command: CommandInterface) => this.registerCommand(command),
			event: (event: EventInterface<any>) => this.registerEvent(event),
			middleware: (middleware: MiddlewareInterface) => this.registerMiddleware(middleware),
			unknown: () => Logger.send('warn', 'Module is not defined')
		}

		const registerFiles = new Promise(async (resolve, reject) => {
			const start: number = Date.now()
			const buildUrl = '\\build'

			for (let file of this.files) {
				const res: any = await import(file)
				try {
					const module: ContextInterface = new res.default()
					module.path = file.replace(buildUrl, '').replace('.js', '.ts') as string
					modules[module.type || 'unknown'](module)
				} catch (error) {}
			}

			const end: number = Date.now()
			resolve(end - start)
		})

		await this.activeLoader(registerFiles)
	}

	private registerCommand(command: CommandInterface): void {
		if (Manager.commands.get('partial')?.has(command.tag)) {
			Logger.send('error', `The tag for command ${command.label} already exists but must be unique, please choose another one.\n${command.path}`)
		}
		Manager.commands.get('partial')?.set(command.tag, command)
	}

	private registerEvent(event: EventInterface<any>): void {
		this.registerEventByIdentifier(event.identifier, event)
	}

	public registerMiddleware(middleware: MiddlewareInterface): void {
		this.registerMiddlewareByIdentifier(middleware.target, middleware)
	}

	private registerEventByIdentifier(key: string, event: EventInterface<any>): void {
		const registeredEvent = Manager.events.has(key)
		if (registeredEvent) Manager.events.get(key)?.push(event)
		else Manager.events.set(key, [event])
	}

	private registerMiddlewareByIdentifier(key: string, middleware: MiddlewareInterface): void {
		const registeredMiddleware = Manager.middlewares.has(key)
		if (registeredMiddleware) Manager.middlewares.get(key)?.push(middleware)
		else Manager.middlewares.set(key, [middleware])
	}

	private async activeLoader(registerFiles: Promise<any>): Promise<void> {
		await new Progress(registerFiles).progress({
			loading: 'Loading files...',
			resolve: `Loaded files`,
			reject: 'Failed loading'
		})
	}
}
