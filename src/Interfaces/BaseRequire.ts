import RequireContextType from '../Types/RequireContextType'

export default interface BaseRequire {
	run(context: RequireContextType): Promise<boolean>
}
