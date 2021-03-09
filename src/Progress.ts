import Logger from './Logger'
import chalk from 'chalk'

export default class Progress {
	constructor(private promise: Promise<any>) {}

	public async progress(message: { loading: string; resolve: string; reject: string }, callbacks?: Array<() => void>): Promise<void> {
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
			if (callbacks) callbacks.forEach((callback) => callback())
		} catch (error) {
			clearInterval(load)
			Logger.sendCustom('error', `❌ ${message.reject}`, true)
		}
	}

	private formatDate(duration: number): string {
		if (duration / 1000 > 1) return `${duration / 1000}s`
		else return `${duration}ms`
	}
}
