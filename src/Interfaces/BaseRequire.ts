import RequireContextType from '../Utils/RequireContext'

export default interface BaseRequire {
	isValid(context: RequireContextType): Promise<boolean>
}
