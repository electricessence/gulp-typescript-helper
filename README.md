gulp-typescript-helper
========================

#### Provides a single simplified means for rendering TypeScript with:
* Source Maps
* Declaration Files
* Minification

#### Other features:
* Resolves using promises instead of streams for more easy of use and flexibility.
* Use whatever Promise library you want. 

### Usage:

###### Write your tasks like this:
```ts
gulp.task(
    TASK.DIST_UMD,
    ()=> renderer
        .init(
            MODULE.UMD + '.min',
            TARGET.ES5,
            MODULE.UMD)
        .clear()
        .minify()
        .render()
        .then(()=>
            savePackage(MODULE.UMD, MODULE.UMD + '.min'))
);
```

See more real use cases and examples here:
https://github.com/electricessence/TypeScript.NET/blob/master/_gulp/dist.ts
