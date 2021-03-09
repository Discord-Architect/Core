import MiddlewaresType from '../Types/MiddlewaresType'
import BaseMiddleware from './BaseMiddleware'

export default interface MiddlewareInterface extends BaseMiddleware {
	target: MiddlewaresType
	path: string
	run(...args: any): Promise<void>
}
