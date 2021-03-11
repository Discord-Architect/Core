import CommandInterface from './CommandInterface'
import EventInterface from './EventInterface'
import MiddlewareInterface from './MiddlewareInterface'
import RequireInterface from './RequireInterface'

export default interface ContextInterface extends CommandInterface, MiddlewareInterface, EventInterface<any>, RequireInterface {
	unused: boolean
	run(): Promise<void>
}
