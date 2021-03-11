import CommandInterface from './Interfaces/CommandInterface'
import ContextInterface from './Interfaces/ContextInterface'
import EventInterface from './Interfaces/EventInterface'
import MiddlewareInterface from './Interfaces/MiddlewareInterface'
import RequireInterface from './Interfaces/RequireInterface'
import Logger from './Logger'
import Manager from './Manager'
import { NodeEmitter } from './NodeEmitter'
import Progress, { ProgressOptions } from './Progress'
import MiddlewareType from './Types/MiddlewaresType'

export default class Dispatcher {
	constructor(private files: Array<string>) {}

	public async dispatch() {
		const fetchFiles = new Progress(async () => {
			const buildUrl = '\\build'
			for (let file of this.files) {
				const res: any = await import(file)
				const type: 'command' | 'event' | 'middleware' | 'require' = res.default.type
				const constructable = Manager.constructables.computeIfAbsent(type, () => [])

				constructable.push({
					constructable: res.default,
					path: file.replace(buildUrl, '').replace('.js', '.ts')
				})
			}
		})

		await fetchFiles.progress({
			loading: 'Loading events...',
			resolve: `Loaded events`,
			reject: 'Failed loading'
		})

		await this.init('middleware', this.registerMiddleware, 'app:middlewares:loaded', {
			loading: '[Middlewares] Loading...',
			resolve: `[Middlewares] Loaded`,
			reject: '[Middlewares] Failed loading'
		})

		await this.init('require', this.registerRequire, 'app:prerequisites:loaded', {
			loading: '[Prerequisites] Loading...',
			resolve: `[Prerequisites] Loaded !`,
			reject: '[Prerequisites] Failed loading'
		})

		await this.init('event', this.registerEvent, 'app:events:loaded', {
			loading: '[Events] Loading...',
			resolve: `[Events] Loaded !`,
			reject: '[Events] Failed loading'
		})

		await this.init('command', this.registerCommand, 'app:commands:loaded', {
			loading: '[Commands] Loading...',
			resolve: `[Commands] Loaded !`,
			reject: '[Commands] Failed loading'
		})
	}

	private registerCommand(command: CommandInterface): void {
		if (Manager.commands.get('partial')?.has(command.tag)) {
			Logger.send('error', `The tag for command ${command.label} already exists but must be unique, please choose another one.\n${command.path}`)
		}

		Manager.commands.get('partial')?.set(command.tag, command)
		this.registerCommandByIdentifier(command.tag, command)
		command.alias?.forEach((alias: string) => this.registerCommandByIdentifier(alias, command))
	}

	private registerCommandByIdentifier(key: string, command: CommandInterface): void {
		const commands = Manager.commands.get('full')!
		if (!key) {
			Logger.send('error', `${command.label} command has an invalid or empty tag.\n${command.path}`)
		}

		if (commands.has(key)) {
			Logger.send('error', `The tag for command ${command.label} already exists but must be unique, please choose another one.\n${command.path}`)
		}

		commands.set(key, command)
	}

	private registerEvent(event: EventInterface<any>): void {
		const events = Manager.events.computeIfAbsent(event.identifier, () => [])
		Manager.client.on(event.identifier, async (...args: Array<any>) => await event.run(...args))
		events.push(event)
	}

	public registerMiddleware(middleware: MiddlewareInterface): Dispatcher {
		const middlewares = Manager.middlewares.computeIfAbsent(middleware.target, () => [])
		NodeEmitter.listen(middleware)
		middlewares.push(middleware)

		return this
	}

	public registerRequire(require: RequireInterface): void {
		const registeredRequire = Manager.requires.has(require.name)
		if (registeredRequire) {
			Logger.send('error', `The require component ${require.name} already exists but must be unique, please choose another one.\n${require.path}`)
		}

		Manager.requires.set(require.name, require)
	}

	private init(key: string, register: (object: any) => void, middleware: MiddlewareType, progressOptions: ProgressOptions): Promise<any> {
		const fetchFiles = new Progress(async () => {
			Manager.constructables.get(key)?.forEach((container) => {
				try {
					const context: ContextInterface = new container.constructable()
					if (context.unused) return

					context.path = container.path
					register(context)
				} catch (error) {}
			})
			NodeEmitter.register(middleware)
		})

		return fetchFiles.progress(progressOptions)
	}
}
