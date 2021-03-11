import BaseRequire from './BaseRequire'
import RequireContextType from '../Types/RequireContextType'

export default interface RequireInterface extends BaseRequire {
	name: string
	path: string
	run(context: RequireContextType): Promise<boolean>
}
