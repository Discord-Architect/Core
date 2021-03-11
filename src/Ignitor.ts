import chalk from 'chalk'
import { Client, ClientOptions, Message } from 'discord.js'
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
import CommandRoles from './Middlewares/CommandRoles'
import CommandPermissions from './Middlewares/CommandPermissions'
import CommandPrerequisites from './Middlewares/CommandPrerequisites'

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

		const entryFiles = path.join(process.cwd(), 'build', this.env.SRC_DIR || 'src')
		const loader = new Loader(entryFiles)
		const files: Array<string> = loader.fetch()

		const clientOptions: ClientOptions = {
			partials: JSON.parse(this.env.PARTIALS)
		}

		Manager.client = new Client(clientOptions)

		const dispatcher: Dispatcher = new Dispatcher(files)
			.registerMiddleware(new CommandRoles() as MiddlewareInterface)
			.registerMiddleware(new CommandPermissions() as MiddlewareInterface)
			.registerMiddleware(new CommandPrerequisites() as MiddlewareInterface)

		dispatcher.dispatch()

		const progressOptions = {
			loading: 'Connecting to discord client',
			resolve: 'Connecting to discord client',
			reject: ''
		}

		new Progress(async () => {
			const token: string = await Manager.client.login(this.env.TOKEN)
			if (!token) throw ''
		}).progress(progressOptions)

		await this.init()
	}

	private async init(): Promise<void> {
		const guard: Guard = new Guard()

		Manager.client.on('message', async (message: Message) => await guard.protect(message))

		NodeEmitter.register('app:ready')
	}
}
