/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../typings/tsd" />

import {Module} from "./Module";
import {Target} from "./Target";
import * as gulp from "gulp";
import * as sourcemaps from "gulp-sourcemaps";
import * as typescript from "gulp-typescript";
import * as replace from "gulp-replace";
import * as mergeStreams from "merge2";
import {StreamToPromise} from "stream-to-promise-agnostic/StreamToPromise";
import {TypeScriptRendererBase} from "./TypeScriptRendererBase";
import mergeValues from "./mergeValues";
import {CoreTypeScriptOptions} from "./CoreTypeScriptOptions";

var StreamConvert:StreamToPromise;

function endsWith(source:string, pattern:string):boolean
{
	return source.lastIndexOf(pattern)==(source.length - pattern.length);
}

const REMOVE_EMPTY_LINES_REGEX = /(\n\s*$)+/gm;

export class TypeScriptRenderer extends TypeScriptRendererBase<TypeScriptRenderer.Params>
{
	protected onRender():PromiseLike<File[]>
	{
		const options = this.compilerOptions,
		      from    = this.sourceFolder,
		      to      = this.destinationFolder;

		const declaration = options.declaration || options.declarationFiles;

		var tsStart = gulp.src(from + '/**/*.ts');
		if(options.sourceMap) tsStart = tsStart.pipe(sourcemaps.init());
		var tsResult = tsStart.pipe(typescript(options));

		var js = declaration ? tsResult.js : tsResult;
		if(this._minify) js = js.pipe(this.getPostProcess());
		if(options.sourceMap)
			js = js.pipe(sourcemaps.write('.', this.sourceMapOptions));

		js = js.pipe(replace(REMOVE_EMPTY_LINES_REGEX, "")); // Since gulp-typescript is 'different'

		const stream = declaration
			?
			mergeStreams([
				gulp.src([from + '/**/*.d.ts']),
				tsResult.dts,
				js
			])
			: js;

		return StreamConvert.toPromise<File[]>(stream.pipe(gulp.dest(to)));


	}

}

export module TypeScriptRenderer {


	export type Params = CoreTypeScriptOptions & typescript.Params;


	export function inject(Promise:PromiseConstructorLike|string):FactoryConstructor
	{
		var p:any = typeof Promise==="string" ? Promise = require(<string>Promise) : Promise;
		StreamConvert = new StreamToPromise(p);
		return Factory;
	}

	export class Factory
	{

		compilerOptionDefaults:Params;

		constructor(
			public sourceFolder:string,
			public destinationFolder:string = './',
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

		init(toSubFolder?:string, target?:Target.Type, module?:Module.Type):TypeScriptRenderer
		{
			var dest = this.destinationFolder;
			if(!dest) throw new Error("Need to define a base destination folder before initializing.");
			if(toSubFolder)
			{
				if(!endsWith(dest, '/')) dest += '/';
				dest += toSubFolder;
			}

			var options:Params = {};
			if(target) options.target = target;
			if(module) options.module = module;

			return new TypeScriptRenderer(this.sourceFolder, dest, mergeValues(options, this.compilerOptionDefaults));
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
