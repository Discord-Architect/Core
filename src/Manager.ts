import { Client } from 'discord.js'
import CommandInterface from './Interfaces/CommandInterface'
import EventInterface from './Interfaces/EventInterface'
import MiddlewareInterface from './Interfaces/MiddlewareInterface'
import RequireInterface from './Interfaces/RequireInterface'
import Constructable from './Types/ConstructableType'
import CustomMap from './Utils/CustomMap'

export default class Manager {
	public static commands: Map<'partial' | 'full', Map<string, CommandInterface>> = new Map().set('partial', new Map()).set('full', new Map())
	public static events: CustomMap<string, Array<EventInterface<any>>> = new CustomMap()
	public static middlewares: CustomMap<string, Array<MiddlewareInterface>> = new CustomMap()
	public static requires: Map<string, RequireInterface> = new Map()
	public static constructables: CustomMap<string, Array<{ constructable: Constructable<any>; path: string }>> = new CustomMap()
	public static client: Client
}
