# codeblox

## Pocket text editor component for code snippets

![](https://thumbs.gfycat.com/EmptyVengefulClumber-size_restricted.gif)

## custom regex

``` javascript
js: {
    isGlobal: /(function|typeof|return|continue|try|catch|finally|var|new|const|let|or|if|else)(\s)/gm,
    isComment: /\/\/.{1,}/gm,
    isMethod: /[^\s]*(?=\(\w{0,}\))/gm,
    isMethodSolo: /[^\s\.]\w*(?=\(\w{0,}\))/,
    isMethodObject: /\.\w*(?=\([\w|\'|\`|\"|\,|\s]{0,}\))/,
    isMethodGlobal: /(log|replace|test|concat)(?=\()/gm,
    isObject: /\w*(?=\.)/gm,
    isObjectGlobal: /(console|String|Object|Array)/gm,
    isObjectProp: /\.\w{1,}/gm,
    isMethodFull: /([^\s])(\w)*(?=\(\w{0,}\))|((?!=\.)\w{1,}(?=\())/gm,
    isString: /["'`].*?["'`]/gm,
    isTemplateString: /[`](.*?)[`]/gm,
    isEscapeChar: /\\./gm,
    isTab: /\\t/gm,
    isPunct: /[{}();,.\[\]=:\-\+\?\/\|<>&$%*!]/gm,
    isSpecialPunct: /[=:\-\+\?\/\|<>&$%*!]/gm,
    isRegEx: /\/.{1,}\//gm,
    isEmpty: /^$/,
}
```