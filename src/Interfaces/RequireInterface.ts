import BaseRequire from './BaseRequire'
import RequireContextType from '../Utils/RequireContext'

export default interface RequireInterface extends BaseRequire {
	name: string
	pattern: RegExp
	path: string
	isValid(context: RequireContextType): Promise<boolean>
}
