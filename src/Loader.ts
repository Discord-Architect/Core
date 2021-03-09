import fs from 'fs'
import path from 'path'

export default class Loader {
	constructor(private dir: string) {}

	public fetch(): Array<string> {
		const baseDirectory: boolean = fs.existsSync(this.dir)
		if (!baseDirectory) return []

		const filelist: Array<any> = []
		const walkSync: (dir: string) => any[] = (dir: string) => {
			fs.readdirSync(dir).forEach((file: string) => {
				if (fs.statSync(path.join(dir, file)).isDirectory()) {
					return walkSync(path.join(dir, file))
				}
				return file.endsWith('.js') && filelist.push(path.join(dir, file))
			})
			return filelist
		}
		return walkSync(this.dir)
	}
}
