/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

export module Module {
	export const
		NONE:types.None         = 'None',
		COMMONJS:types.CommonJS = 'CommonJS',
		SYSTEMJS:types.SystemJS = 'System',
		AMD:types.AMD           = 'AMD',
		UMD:types.UMD           = 'UMD',
		ES6:types.ES6           = 'ES6',
		ES2015:types.ES2015     = 'ES2015',
		ESNEXT:types.ESNext     = 'ESNext';

	export module types
	{
		export type None = 'None'|'none'
		export type CommonJS = 'CommonJS'|'commonjs'
		export type SystemJS = 'System'|'system'
		export type AMD = 'AMD'|'amd'
		export type UMD = 'UMD'|'umd'
		export type ES6 = 'ES6'|'es6'
		export type ES2015 = 'ES2015'|'es2015'
		export type ESNext = 'ESNext'|'esnext'
	}

	export type Type
		= types.None
		| types.CommonJS
		| types.SystemJS
		| types.AMD
		| types.UMD
		| types.ES6
		| types.ES2015
		| types.ESNext;

}

export default Module;
