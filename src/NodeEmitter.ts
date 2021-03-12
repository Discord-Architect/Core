import MiddlewaresType from './Types/MiddlewaresType'
import MiddlewareInterface from './Interfaces/MiddlewareInterface'
import CustomMap from './Utils/CustomMap'

type Listener = (...args: Array<any>) => Promise<void>

class Emitter {
	private listeners: CustomMap<string, Array<Listener>> = new CustomMap()
	public async register(target: MiddlewaresType, ...args: Array<any>): Promise<void> {
		const listenerList = this.listeners.get(target)
		if (listenerList) {
			for (const listener of listenerList) {
				await listener(...args)
			}
		}
	}

	public listen(middleware: MiddlewareInterface): void {
		this.listeners.computeIfAbsent(middleware.target, () => []).push((...args: Array<any>) => middleware.run(...args))
	}
}

const NodeEmitter: Emitter = new Emitter()

export { NodeEmitter }
