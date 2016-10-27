/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import mergeValues from "./mergeValues";
import * as uglify from "gulp-uglify";
import {Module} from "./Module";
import {Target} from "./Target";
import {CoreTypeScriptOptions} from "./CoreTypeScriptOptions";
import {SourceMapWriteOptions} from "./SourceMapWriteOptions";
import ReadWriteStream = NodeJS.ReadWriteStream;

// Del types are currently busted: 20161027.  Just allow for <any> for now.
const del = require("../node_modules/del/index");

/**
 * Provided as a means for creating other build helpers.
 */
export abstract class BuildHelperBase<TOptions extends CoreTypeScriptOptions>
{

	public compilerOptions:TOptions;

	constructor(
		public sourceFolder:string,
		public destinationFolder:string,
		compilerOptions:TOptions)
	{

		this.sourceMapOptions = {
			sourceRoot: null
		};

		this.compilerOptions
			= mergeValues({}, compilerOptions); // Make a copy first...
	}

	protected _minify:boolean;

	minify(value:boolean = true):this
	{
		this._minify = value;
		return this;
	}

	sourceMapOptions:SourceMapWriteOptions;

	protected abstract onExecute():PromiseLike<File[]>;

	execute():PromiseLike<File[]>
	{

		var from = this.sourceFolder, to = this.destinationFolder;

		if(!from)
			throw new Error("No source folder.");
		if(!to)
			throw new Error("No destination folder.");

		// Validate first...
		if(this._clear && from==to)
			throw new Error("Cannot clear a source folder.");

		var {module, target} = this.compilerOptions;

		var message = 'Compiling TypeScript: ';
		if(module && module!=target) message += target + " " + module;
		else message += target || module;
		message += " " + (from==to ? from : (from + ' >> ' + to));


		function emitStart()
		{
			console.log(message);
		}

		if(!this._clear) emitStart();

		var render = this._clear
			? del(to + '/**/*').then(
			(results:string[])=>
			{
				if(results && results.length)
					console.info("Folder cleared:", to);
				emitStart();
				return this.onExecute();
			})
			: this.onExecute(); // Could hook up post render console logs here?

		render.then(()=>
		{
			//console.log(message,"COMPLETE");
		}, (err:any)=>
		{
			console.warn(message, "FAILED");
			console.error(err);
		});

		return render;
	}

	protected _clear:boolean;

	clear(value:boolean = true):this
	{
		this._clear = value;
		return this;
	}

	target(value:Target.Type):this
	{
		this.compilerOptions.target = value;
		return this;
	}

	module(value:Module.Type):this
	{
		this.compilerOptions.module = value;
		return this;
	}

	addOptions(options:TOptions):this
	{
		for(let key of Object.keys(options)) (<any>this.compilerOptions)[key] = (<any>options)[key];
		return this;
	}


	protected getPostProcess():ReadWriteStream
	{
		return uglifyPostProcess();
	}
}

function uglifyPostProcess():ReadWriteStream
{
	return uglify(<any>{
		preserveComments: 'license' // This is poorly typed :(
	})
}

export default BuildHelperBase;
