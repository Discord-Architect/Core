import CommandInterface from './CommandInterface'
import EventInterface from './EventInterface'
import MiddlewareInterface from './MiddlewareInterface'

export default interface ContextInterface extends CommandInterface, MiddlewareInterface, EventInterface<any> {
	type: 'command' | 'event' | 'middleware'
	run(): Promise<void>
}
