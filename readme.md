# codeblox

## Pocket text editor component for code snippets

![](https://thumbs.gfycat.com/SplendidOpulentIndochinahogdeer-size_restricted.gif)

I thought it'd be a good exercise to try and create a snippet component similar to [ones found on css-tricks.com](https://css-tricks.com/custom-scrollbars-in-webkit/) or Vue documentation while trying to adhere to [rules for best practices of code examples on site-point](https://www.sitepoint.com/best-practice-for-code-examples/):

* Code examples should be editable.

* Code examples should use good semantic markup.

* Tabs in code should not be converted to spaces.

* Code should have basic syntax highlighting.

* Code examples can have horizontal scrolling, but shouldn’t have vertical scrolling.

* Code examples should have line numbers, which are not included in text selection.

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