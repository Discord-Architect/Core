import BaseMiddleware from '../Entities/BaseMiddleware'
import MiddlewareContext from '../Types/MiddlewaresType'

export default function Command(context: MiddlewareContext) {
	return (target: Function) => {
		return class Command extends BaseMiddleware {
			constructor() {
				super(context, target.prototype.run)
			}
		}
	}
}
