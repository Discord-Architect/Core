type Middleware =
	| 'app:middlewares:loaded'
	| 'app:events:loaded'
	| 'app:commands:loaded'
	| 'app:prerequisites:loaded'
	| 'app:files:fetched'
	| 'app:ready'
	| 'app:guard:ready'
	| 'app:command:execute'
	| 'app:message:received'

export default Middleware
