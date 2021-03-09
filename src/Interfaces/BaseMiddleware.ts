export default interface BaseMiddleware {
	run(...args: any): Promise<void>
}
