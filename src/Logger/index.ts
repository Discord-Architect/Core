import chalk from 'chalk'

type MessageType = 'success' | 'error' | 'info' | 'warn' | 'base'

class Logger {
	private message: string = ''

	public send(type: MessageType, message: string): void {
		this.message = message

		const dispatch: any = {
			success: () => this.success(),
			error: () => this.error(),
			info: () => this.info(),
			warn: () => this.warn()
		}

		dispatch[type]()
	}

	public sendCustom(type: MessageType, message: string, clearLine?: boolean): void {
		this.message = message

		if (clearLine) {
			process.stdout.clearLine(0)
			process.stdout.cursorTo(0)
		}

		const dispatch: any = {
			success: () => this.customSuccess(),
			info: () => this.customInfo(),
			warn: () => this.customWarn(),
			error: () => this.customError()
		}

		dispatch[type]()
	}

	private success(): void {
		console.log(chalk.green(`\n\n✔ ${chalk.underline.bold('Success')}\n${this.message}\n\n`))
	}

	private error(): void {
		console.log(chalk.redBright(`\n\n❌ ${chalk.underline.bold('Error')}\n${this.message}\n\n`))
		process.exit()
	}

	private info(): void {
		console.log(chalk.cyan(`\n\n💬 ${chalk.underline.bold('Info')}\n${this.message}\n\n`))
	}

	private warn(): void {
		console.log(chalk.yellowBright(`\n\n🔖 ${chalk.underline.bold('Warn')}\n${this.message}\n\n`))
	}

	private customSuccess(): void {
		console.log(chalk.green(this.message))
	}

	private customInfo(): void {
		console.log(chalk.cyan(this.message))
	}

	private customWarn(): void {
		console.log(chalk.yellowBright(this.message))
	}

	private customError(): void {
		console.log(chalk.redBright(this.message))
	}
}

export default new Logger()
