import RequireContextType from '../Utils/RequireContext'

export default class BaseRequire {
	public static type: string = 'require'
	public pattern: RegExp
	public _path: string = ''

	constructor(public name: string, public isValid: (context: RequireContextType) => Promise<boolean>) {
		this.pattern = new RegExp(name)
	}

	public set path(value: string) {
		this._path = value
	}

	public get path() {
		return this._path
	}
}
