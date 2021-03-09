import { Client } from 'discord.js'
import CommandInterface from './Interfaces/CommandInterface'
import EventInterface from './Interfaces/EventInterface'
import MiddlewareInterface from './Interfaces/MiddlewareInterface'

export default class Manager {
	public static commands: Map<'partial' | 'full', Map<string, CommandInterface>> = new Map().set('partial', new Map()).set('full', new Map())
	public static events: Map<string, Array<EventInterface<any>>> = new Map()
	public static middlewares: Map<string, Array<MiddlewareInterface>> = new Map()
	public static client: Client
}
