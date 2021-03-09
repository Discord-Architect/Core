export default class BaseMiddleware {
	public type: string = 'middleware'
	public _path: string = ''

	constructor(public target: string, public run: () => Promise<void>) {}

	public set path(value: string) {
		this._path = value
	}

	public get path() {
		return this._path
	}
}
