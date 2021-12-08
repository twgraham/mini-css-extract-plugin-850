# Reproduction of [issue #850](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/850) in mini-css-extract-plugin

### Steps
1. Clone repo
2. Install dependencies (`npm install` or `yarn install`)
3. Execute webpack build `npm run build` or `yarn build`

The output of the build should show that a vendor chunk package name (`codemirror` in this case) could not be determined from the context. The output is of the CSS module is logged showing the context is to the project root, not the css location. As a result, the CSS module will be named `[module number].css`

If you downgrade `mini-css-extract-plugin` to `2.3.0`, the output of the build won't print out the CSS module since the package name could be determined from the context. The output should then be `vendor.codemirror.css`.

Debugging code exists inside of `optimization.splitChunks.cacheGroups` in the webpack config.

```ts
{
    vendor: {
        test: /[\\/]node_modules[\\/]/,
        name(module: Module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context?.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)

            if (packageName == null) {
                console.error('Null package name, context may be incorrect', module)
                return undefined
            }

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `vendor.${packageName[1].replace('@', '')}`
        }
    }
}
```
