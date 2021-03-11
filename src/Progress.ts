import Logger from './Logger'
import chalk from 'chalk'

export type ProgressOptions = {
	loading: string
	resolve: string
	reject: string
}

export default class Progress {
	private promise: Promise<any>

	constructor(executor: () => void) {
		this.promise = new Promise((resolve, reject) => {
			const start: number = Date.now()
			try {
				executor()
				resolve(Date.now() - start)
			} catch (error) {
				reject(error)
			}
		})
	}

	public async progress(message: ProgressOptions): Promise<void> {
		function loader() {
			let P = ['\\', '|', '/', '-']
			let x = 0
			return setInterval(() => {
				process.stdout.write(chalk.cyan(`\r${P[x++]} ${message.loading}`))
				x &= 3
			}, 250)
		}
		const load: NodeJS.Timeout = loader()
		try {
			const duration: number = await this.promise
			clearInterval(load)
			Logger.sendCustom('success', `[${this.formatDate(duration)}] ✔ ${message.resolve}`, true)
		} catch (error) {
			Logger.sendCustom('error', `❌ ${message.reject}`, true)
			clearInterval(load)
		}
	}

	private formatDate(duration: number): string {
		if (duration / 1000 > 1) return `${duration / 1000}s`
		else return `${duration}ms`
	}
}
