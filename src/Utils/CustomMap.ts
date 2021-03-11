export default class CustomMap<k, v> extends Map<k, v> {
	constructor() {
		super()
	}
	public computeIfAbsent(key: k, creator: () => v): v {
		let value: v | undefined = super.get(key)

		if (!value) {
			value = creator()
			super.set(key, value)
		}
		return value
	}
}
