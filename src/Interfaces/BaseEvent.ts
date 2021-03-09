export default interface BaseEvent {
	run(...args: any): Promise<void>
}
