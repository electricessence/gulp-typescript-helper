/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Target} from "./Target";
import {Module} from "./Module";
export interface CoreTypeScriptOptions
{
	module?:Module.Type;
	noEmitOnError?:boolean;
	noExternalResolve?:boolean;
	noImplicitAny?:boolean;
	noLib?:boolean;
	removeComments?:boolean;
	sourceRoot?:string;
	sortOutput?:boolean;
	target?:Target.Type;
	typescript?:any;
	outFile?:string;
	outDir?:string;
	suppressImplicitAnyIndexErrors?:boolean;
	jsx?:string;
	declaration?:boolean;
	emitDecoratorMetadata?:boolean;
	experimentalDecorators?:boolean;
	experimentalAsyncFunctions?:boolean;
	moduleResolution?:string;
	noEmitHelpers?:boolean;
	preserveConstEnums?:boolean;
	isolatedModules?:boolean;
	sourceMap?:boolean;
	strictNullChecks?:boolean;
}

export default CoreTypeScriptOptions;
