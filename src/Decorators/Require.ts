import BaseRequire from '../Entities/BaseRequire'

type RequireContext = {
	name: string
}

export default function Require(context: RequireContext) {
	return (target: Function) => {
		return class Require extends BaseRequire {
			constructor() {
				super(context.name, target.prototype.isValid)
			}
		}
	}
}
