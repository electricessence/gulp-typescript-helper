/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Module} from "./Module";
import {Target} from "./Target";
import * as gulp from "gulp";
import * as sourcemaps from "gulp-sourcemaps";
import * as typescript from "gulp-typescript";
import * as replace from "gulp-replace";
import * as mergeStreams from "merge2";
import {streamToPromise, PromiseFactory, Executor} from "stream-to-promise-agnostic";
import {BuildHelperBase} from "./BuildHelperBase";
import mergeValues from "./mergeValues";
import {CoreTypeScriptOptions} from "./CoreTypeScriptOptions";

// Default to Q since Q is a dependency of orchestra which is a dependency of gulp.
// noinspection TypeScriptValidateJSTypes
let StreamConvert = streamToPromise(<T>(e:Executor<T>) => require("q").promise(e));

function endsWith(source:string, pattern:string):boolean
{
	return source.lastIndexOf(pattern)==(source.length - pattern.length);
}

const REMOVE_EMPTY_LINES_REGEX = /(\n\s*$)+/gm;
const REMOVE_EXTRANEOUS_ES6_HELPERS = /\n?^(\s|\t)*\b(var|const|let)\s+(__extends|__generator)\s*=\s*\w+(\.\w+)*(\s*;)?(\s|\t)*$/gm;

export class BuildHelper extends BuildHelperBase<BuildHelper.Params>
{
	/**
	 * Removes any helper defined constants that are not needed in ES6 so the compiler can omit any imports.
	 * For simplicity must be defined by a const and explicitly exist on a single line.
	 * @returns {BuildHelper}
	 */
	removeExtraneousES6Helpers():this
	{
		this.addPreProcess(source =>
			source.pipe(replace(REMOVE_EXTRANEOUS_ES6_HELPERS, ""))
		);
		return this;
	}

	protected onExecute():PromiseLike<File[]>
	{
		const options = this.compilerOptions,
		      from    = this.sourceFolder,
		      to      = this.destinationFolder;

		const declaration = options.declaration;

		let tsStart = gulp.src(from + '/**/*.ts');
		for(let p of this._preProcessors)
		{
			tsStart = p(tsStart);
		}

		if(options.sourceMap) tsStart = tsStart.pipe(sourcemaps.init());
		const tsResult = tsStart.pipe(typescript(options));
		let dts = tsResult.dts;

		// We need to retain jsDoc comments in .d.ts files.
		if(options.removeComments) {
			let o = mergeValues({},options);
			delete o.removeComments;
			dts = tsStart.pipe(typescript(o)).dts;
		}

		let js:any = declaration ? tsResult.js : tsResult;

		if(this._minify) // noinspection JSDeprecatedSymbols
			js = js.pipe(this.getPostProcess());
		// noinspection JSDeprecatedSymbols
		js = js.pipe(replace(REMOVE_EMPTY_LINES_REGEX, ""));
		if(options.sourceMap) 	// noinspection JSDeprecatedSymbols
			js = js.pipe(sourcemaps.write('.', this.sourceMapOptions));
		// noinspection JSDeprecatedSymbols
		js = js.pipe(replace(REMOVE_EMPTY_LINES_REGEX, ""));  // Since gulp-typescript is 'different'

		const stream = declaration
			?
			mergeStreams([
				gulp.src([from + '/**/*.d.ts']),
				dts,
				js
			])
			: js;

		return StreamConvert.toPromise<File[]>(stream.pipe(gulp.dest(to)));


	}

}

export module BuildHelper
{


	export type Params = CoreTypeScriptOptions & typescript.Settings;


	//noinspection JSUnusedLocalSymbols
	export function inject(promiseFactory:PromiseFactory):FactoryConstructor
	{
		StreamConvert = streamToPromise(promiseFactory);
		return Factory;
	}

	export class Factory
	{

		compilerOptionDefaults:Params;

		constructor(
			public sourceFolder:string|null,
			public destinationFolder:string|null = './',
			defaults?:Params)
		{

			this.compilerOptionDefaults
				= mergeValues({}, defaults); // Make a copy...
		}

		static from(sourceFolder:string, defaults?:Params):Factory
		{
			return new Factory(sourceFolder, null, defaults);
		}

		static fromTo(
			sourceFolder:string,
			destinationFolder:string,
			defaults?:Params):Factory
		{
			return new Factory(sourceFolder, destinationFolder, defaults);
		}


		static at(path:string, defaults?:Params):Factory
		{
			return new Factory(path, path, defaults);
		}

		static defaults(options:Params):Factory
		{
			return new Factory(
				null,
				null,
				options);
		}

		from(sourceFolder:string):Factory
		{
			return new Factory(
				sourceFolder,
				this.destinationFolder,
				this.compilerOptionDefaults);
		}

		to(destinationFolder:string):Factory
		{
			return new Factory(
				this.sourceFolder,
				destinationFolder,
				this.compilerOptionDefaults);
		}

		at(targetFolder:string):Factory
		{
			return new Factory(
				targetFolder,
				targetFolder,
				this.compilerOptionDefaults);
		}

		defaults(options:Params):Factory
		{
			return new Factory(
				this.sourceFolder,
				this.destinationFolder,
				options);
		}

		init(toSubFolder?:string, target?:Target.Type, module?:Module.Type):BuildHelper
		{
			let source = this.sourceFolder;
			if(!source) throw new Error("Need to define a source folder before initializing.");

			let dest = this.destinationFolder;
			if(!dest) throw new Error("Need to define a base destination folder before initializing.");
			if(toSubFolder)
			{
				if(!endsWith(dest, '/')) dest += '/';
				dest += toSubFolder;
			}

			const options:Params = {};
			if(target) options.target = target;
			if(module) options.module = module;

			return new BuildHelper(source, dest, mergeValues(options, this.compilerOptionDefaults));
		}

		addOptions(value:Params):Factory
		{
			return new Factory(this.sourceFolder, this.destinationFolder, mergeValues(value, this.compilerOptionDefaults));
		}

		target(value:Target.Type):Factory
		{
			return this.addOptions({target: value});
		}

		module(value:Module.Type):Factory
		{
			return this.addOptions({module: value});
		}


	}


	export interface FactoryConstructor
	{
		new (
			sourceFolder:string,
			destinationFolder?:string,
			defaults?:Params):Factory;

		from(sourceFolder:string, defaults?:Params):Factory;

		fromTo(
			sourceFolder:string,
			destinationFolder:string,
			defaults?:Params):Factory;


		at(path:string, defaults?:Params):Factory;

		defaults(options:Params):Factory;

	}

}
