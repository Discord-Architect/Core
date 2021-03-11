import CommandInterface from './CommandInterface'
import EventInterface from './EventInterface'
import MiddlewareInterface from './MiddlewareInterface'
import RequireInterface from './RequireInterface'

export default interface ContextInterface extends CommandInterface, MiddlewareInterface, EventInterface<any>, RequireInterface {
	type: 'command' | 'event' | 'middleware' | 'require'
	run(): Promise<void>
	run(): Promise<boolean>
}
