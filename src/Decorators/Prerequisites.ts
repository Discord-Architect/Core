import BaseRequire from '../Entities/BaseRequire'

type PrerequisitesContext = {
	name: string
}

export default function Prerequisites(context: PrerequisitesContext) {
	return (target: Function) => {
		return class Prerequisites extends BaseRequire {
			constructor() {
				super(context.name, target.prototype.isValid)
			}
		}
	}
}
