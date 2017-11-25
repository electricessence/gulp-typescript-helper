/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Target} from "./Target";
import {Module} from "./Module";
export interface CoreTypeScriptOptions
{
	allowJs?:boolean;
	checkJs?:boolean;

	allowSyntheticDefaultImports?:boolean;
	allowUnreachableCode?:boolean;
	allowUnusedLabels?:boolean;

	alwaysStrict?:boolean;

	baseUrl?:string;
	charset?:string;

	declaration?:boolean;
	declarationDir?:string;

	diagnostics?:boolean;

	disableSizeLimit?:boolean;

	downlevelIteration?:boolean;

	emitBOM?:boolean;

	emitDecoratorMetadata?:boolean;
	experimentalDecorators?:boolean;

	forceConsistentCasingInFileNames?:boolean;

	importHelpers?:boolean;

	inlineSourceMap?:boolean;
	inlineSources?:boolean;

	isolatedModules?:boolean;

	jsx?:"React"|"Preserve";
	jsxFactory?:string;

	lib?:string[];
	noLib?:boolean;

	listEmittedFiles?:boolean;
	listFiles?:boolean;

	locale?:string;

	mapRoot?:string;

	maxNodeModuleJsDepth?:string;

	module?:Module.Type;
	moduleResolution?:string;

	newLine?:string;

	noEmit?:boolean;
	noEmitHelpers?:boolean;
	noEmitOnError?:boolean;
	noFallthroughCasesInSwitch?:boolean;

	noImplicitAny?:boolean;
	noImplicitReturns?:boolean;
	noImplicitThis?:boolean;
	noImplicitUseStrict?:boolean;


	noResolve?:boolean;
	noStrictGenericChecks?:boolean;

	noUnusedLocals?:boolean;
	outFile?:string;
	outDir?:string;

	paths?:{[key:string]:string|string[]}

	preserveConstEnums?:boolean;

	pretty?:boolean;
	project?:string;

	removeComments?:boolean;
	rootDir?:string;
	rootDirs?:string[];

	skipDefaultLibCheck?:boolean;
	skipLibCheck?:boolean;

	sourceMap?:boolean;
	sourceRoot?:string;
	sortOutput?:boolean;

	strictFunctionTypes?:boolean;
	strictNullChecks?:boolean;

	stripInternal?:boolean;

	suppressExcessPropertyErrors?:boolean;
	suppressImplicitAnyIndexErrors?:boolean;

	target?:Target.Type;
	traceResolution?:boolean;

	types?:string[];
	typeRoots?:string[];

}

export default CoreTypeScriptOptions;
