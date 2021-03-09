import MiddlewaresType from './Types/MiddlewaresType'
import { EventEmitter } from 'events'
import MiddlewareInterface from './Interfaces/MiddlewareInterface'

class Emitter extends EventEmitter {
	public register(target: MiddlewaresType, ...args: any): void {
		this.emit(target, args)
	}

	public listen(middleware: MiddlewareInterface, ...args: any): void {
		this.on(middleware.target, async (...args) => await middleware.run(args))
	}
}

const NodeEmitter: Emitter = new Emitter()

export { NodeEmitter }
