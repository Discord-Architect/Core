export default function Unused() {
	return (target: Function) => {
		target.prototype.unused = true
	}
}
