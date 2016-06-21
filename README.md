gulp-typescript-helper
======================

#### Provides a single simplified means for building TypeScript with:
* Source Maps
* Declaration Files
* Minification

#### Other features:
* Resolves using promises instead of streams for more easy of use and flexibility.
* Use whatever Promise library you want. 

### Usage:

###### Write your tasks like this:
```ts
	import {Target, Module, CoreTypeScriptOptions, BuildHelper} from "gulp-typescript-helper";
		
	const DEFAULTS:CoreTypeScriptOptions = {
	    noImplicitAny: true,
	    removeComments: true,
	    noEmitHelpers: true,
	    sourceMap: true,
	    declaration: true
	});
	
	
	const builder = BuildHelper
	    // Setup the builder by injecting a promise constructor.
	    .inject(PromiseFactory) // Optional: will use Q as a default.
	    // Define your source folder and destination base path.
	    .fromTo(PATH.SOURCE, "./dist" , DEFAULTS);
	
	// Subsequent tasks are simplified down to this:
	gulp.task(
	    TASK.DIST_UMD,
	    ()=> builder
	        .init(
	            MODULE.UMD + '.min',
	            TARGET.ES5,
	            MODULE.UMD)
	        .clear() // Clears the destination directory.
	        .minify() // Signals to enable minification (uglify).
	        .execute() // Commences the build pipeline
	        .then(()=>
	            /* Whatever steps you want to do before completion */) //
	);
```

See more real use cases and examples here:
https://github.com/electricessence/TypeScript.NET/blob/master/_gulp/dist.ts
