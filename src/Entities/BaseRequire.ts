import RequireContextType from '../Types/RequireContextType'

export default class BaseRequire {
	public static type: string = 'require'
	public _path: string = ''

	constructor(public name: string, public run: (context: RequireContextType) => Promise<boolean>) {}

	public set path(value: string) {
		this._path = value
	}

	public get path() {
		return this._path
	}
}
