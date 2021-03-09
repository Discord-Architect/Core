import chalk from 'chalk'
import { Client, Message } from 'discord.js'
import path from 'path'
import Env from '@discord-architect/env'
import Progress from './Progress'
import Dispatcher from './Dispatcher'
import Guard from './Guard'
import CommandInterface from './Interfaces/CommandInterface'
import MiddlewareInterface from './Interfaces/MiddlewareInterface'
import Loader from './Loader'
import Logger from './Logger'
import Manager from './Manager'
import { NodeEmitter } from './NodeEmitter'

export default class Ignitor {
	constructor() {
		this.load()
	}

	private env: {
		TOKEN: string | undefined
		PARTIALS: string
		SRC_DIR: string | undefined
	} = {
		TOKEN: Env.get('SECRET_TOKEN'),
		PARTIALS: Env.get('PARTIALS') || '[]',
		SRC_DIR: Env.get('SRC_DIR')
	}

	private async load(): Promise<void> {
		console.clear()
		Logger.sendCustom('info', chalk.bold(chalk.underline('Starting application\n')))
		const env = {}
		const files: Array<string> = new Loader(path.join(process.cwd(), 'build', this.env.SRC_DIR || 'src')).fetch()

		Manager.client = new Client({
			partials: JSON.parse(this.env.PARTIALS)
		})

		const dispatcher: Dispatcher = new Dispatcher(files)
		await dispatcher.dispatch()

		await new Progress(
			new Promise(async (resolve, reject) => {
				const start: number = Date.now()
				const token: string = await Manager.client.login(this.env.TOKEN)
				if (token) {
					const end: number = Date.now()
					resolve(end - start)
				} else reject()
			})
		).progress({
			loading: 'Connecting to discord client',
			resolve: 'Connecting to discord client',
			reject: ''
		})

		this.init()
	}

	private async init(): Promise<void> {
		const guard: Guard = new Guard()

		Manager.client.on('message', async (message: Message) => await guard.protect(message))

		await this.loadMiddlewares()
		await this.loadEvents()
		await this.loadCommands()

		NodeEmitter.register('app::ready')
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

	private async loadEvents(): Promise<void> {
		await new Progress(
			new Promise((resolve, reject) => {
				const start: number = Date.now()
				Manager.events.forEach(async ([event]) => {
					Manager.client.on(event.identifier, async (...args: any) => await event.run(args))
				})
				const end: number = Date.now()
				resolve(end - start)
				NodeEmitter.register('app::events::loaded')
			})
		).progress({
			loading: 'Loading events...',
			resolve: `Loaded events`,
			reject: 'Failed loading'
		})
	}

	private async loadCommands(): Promise<void> {
		await new Progress(
			new Promise((resolve, reject) => {
				const start: number = Date.now()
				Manager.commands.get('partial')?.forEach((command) => {
					this.registerCommandByIdentifier(command.tag, command)
					command.alias?.forEach((alias: string) => this.registerCommandByIdentifier(alias, command))
				})
				const end: number = Date.now()
				resolve(end - start)
				NodeEmitter.register('app::commands::loaded')
			})
		).progress({
			loading: 'Loading commands...',
			resolve: `Loaded commands`,
			reject: 'Failed loading'
		})
	}

	private async loadMiddlewares(): Promise<void> {
		await new Progress(
			new Promise((resolve, reject) => {
				const start: number = Date.now()
				Manager.middlewares.forEach((_, key) => {
					const middlewares: Array<MiddlewareInterface> | undefined = Manager.middlewares.get(key)
					middlewares?.forEach((middleware) => {
						NodeEmitter.listen(middleware, middlewares)
					})
				})
				const end: number = Date.now()
				resolve(end - start)
				NodeEmitter.register('app::middlewares::loaded')
			})
		).progress({
			loading: 'Loading middlewares...',
			resolve: `Loaded middlewares`,
			reject: 'Failed loading'
		})
	}
}
