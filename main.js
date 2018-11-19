window.Event = new Vue();

Vue.component('codeblox', {
    template: `
        <div class="codeblox">
            <snippet lang="js" title="Example code snippet component" :content="rawCode"></snippet>
        </div>
    `,
    data() {
        return {
            rawCode: this.$root.code,
        }
    },
    mounted() {
        var self = this;
        Event.$on('updateCode', self.updateCode)
    },
    methods: {
        updateCode(str) {
            console.log(`Code is being updated to ${str}`)
            this.rawCode = str;
        }
    }
})

Vue.component('snippet', {
    props: {
        lang: String,
        title: String,
        content: String,
    },
    template: `
    <div class="codeBlock">
        <div class="codeTitle">{{title}}</div>
        <div class="codeBodyGutter">
            <div v-for="line in totalCode" class="codeLine">
                <code-gutter :lang="lang" :model="line"></code-gutter>
            </div>
        </div>
        <div class="codeBody" contenteditable="true" spellcheck="false" @input="getHTML">
            <div v-for="line in totalCode" class="codeLine">
                <code-line :lang="lang" :model="line"></code-line>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            totalCode: []
        }
    },
    methods: {
        sendMsg(evt) {
            Event.$emit('updateCode')
        },
        getHTML(evt) {
            // console.log(evt.target.outerText)
            // if (/\n/gm.test(evt.target.outerText)) {
            //     console.log('found newlines in outer')
                
            // }
            // console.log(evt.target.innerText)
            // if (/\n/gm.test(evt.target.innerText)) {
            //     console.log('found newlines in inner')
            // }
            // console.log(evt.target.textContent)
            // if (/\n/gm.test(evt.target.textContent)) {
            //     console.log('found newlines in content')
            // }
            // console.log(evt.target.innerHTML)
            console.log(evt)
            // Event.$emit('updateCode', evt.target.textContent)
        },
        splitCode: function(code) {
            var res = code.split(/(\\r)/gm), mirror = [];
            for (var i = 0; i < res.length; i++)
                if (res[i] !== '\\r') { mirror.push(res[i]) }
            this.parseCode(mirror);
        },
        parseCode(array) {
            // console.log(array)
            this.totalCode = [];
            for (var i = 0; i < array.length; i++) {
                this.totalCode[i] = {
                    index: i + 1,
                    value: array[i],
                }
            }
            console.log(this.totalCode);
        }
    },
    mounted() {
        this.splitCode(this.content);
    }
})

Vue.component('code-gutter', {
    props: {
        lang: String,
        model: Object,
    },
    template: `
        <div class="codeGutterWrap">
            <span class="codeGutter">{{model.index}}</span>
            <div class="lineBreak"></div>
        </div>
        `,

})

Vue.component('code-line', {
    props: {
        lang: String,
        model: Object,
    },
    mounted() {
        var self = this;
        window.addEventListener('keyup', self.checkForFocus)
    },
    methods: {
        // Doesn't work for anything but parent, can't do line by line
        checkForFocus(evt) {
            // console.log(document.activeElement)
        }
    },
    template: `
        <div class="codeLineWrap">
            <code-segments :lang="lang" :val="model.value"></code-segments>
        </div>
    `,
})

Vue.component('code-segments', {
    props: {
        lang: String,
        val: String,
    },
    // <span class="codeContentInside">{{val}}</span>
    // :class="piece.class"
    template: `
        <div class="codeContent">
            <span v-for="piece in segments" :style="piece.style" v-text="piece.value"></span>
        </div>
        `,
    data() {
        return {
            segments: [ 
                {
                    value: '',
                    class: '',
                    style: '',
                }
            ],
        }
    },
    methods: {
        checkForTokens(str, recheck=false) {
            if (!recheck) {
                console.log('Checking for tokens:')
                console.log(str)
                if (!Array.isArray(str)) { str = [str] }
                if (/^\s{1,}/gm.test(str[0])) {
                    var tab = str[0].match(/^\s{1,}/);
                    str[0] = str[0].replace(/^\s{1,}/, '')
                    var child = {
                        value: tab[0],
                        class: 'syntax-' + 'Tab',
                        style: 'color: ' + this.$root.getCSS('syntax-Idle')
                    }
                    str = [].concat(child, str);
                    console.log('Found a tabbed area')
                }
            }
            var tokens = ['Global', 'MethodSolo', 'Object', 'MethodObject'];
            for (var i = 0; i < tokens.length; i++) {
                var suffix = 'is' + tokens[i], last = str.length - 1;
                var which = 0;
                for (var s = 0; s < str.length; s++) {
                    // console.log(str[s])
                    if ((typeof str[s] == 'string' || str[s] instanceof String)) {
                        // console.log('This will be acted on')
                        which = s;
                    }
                }
                if (this.$root.rx.js[suffix].test(str[which])) {
                    // console.log(str[which])
                    var hasToken = str[which].match(this.$root.rx.js[suffix]);
                    if (hasToken.length) {
                        hasToken = this.$root.removeEmptyValues(hasToken);
                        // console.log(`Bare tokens for type ${tokens[i]}:`)
                        console.log(`${tokens[i]} : ${hasToken}`)
                        for (var t = 0; t < hasToken.length; t++) {
                            if (tokens[i] == 'MethodObject') {
                             hasToken[t] = hasToken[t].substring(1, hasToken[t].length);   
                            }
                            if (!this.$root.rx.js.isEmpty.test(str[which])) {
                                console.log(`Acting on ${str[which]} : ${tokens[i]}`)
                                var child = {
                                    value: hasToken[t],
                                    class: 'syntax-' + tokens[i],
                                    style: 'color: ' + this.$root.getCSS('syntax-' + tokens[i])
                                }
                                if (tokens[i] == 'Object') {
                                    if (this.$root.rx.js.isObjectGlobal.test(hasToken[t])) {
                                        child.style = 'color: ' + this.$root.getCSS('syntax-Attr')
                                    }
                                }
                                if (tokens[i] == 'MethodObject') {
                                console.log(`This is method : ${child.value}`)
                                child.value.substring(1, child.value.length);
                                    if (/^\./.test(str[which])) {
                                        str[which] = str[which].substring(1, str[which].length);
                                    }
                                    var punc = {
                                        value: '.',
                                        class: 'syntax-Dot',
                                        style: 'color: ' + this.$root.getCSS('syntax-Idle')
                                    }
                                    // hasToken[t] = hasToken[t].substring(1,hasToken[t].length);
                                    str.splice(which, 0, punc);
                                    last++;
                                    which++;
                                    if (this.$root.rx.js.isMethodGlobal.test(hasToken[t])) {
                                        console.log('This method is global')
                                        child.style = 'color: ' + this.$root.getCSS('syntax-Escape-Char')
                                    }
                                }

                                var stringPos = str[which].indexOf(hasToken[t]);
                                console.log(`Found token ${hasToken} at ${stringPos}`)
                                // if at beginning or end
                                if ((stringPos == 0) | (stringPos == (str[which].length - child.value.length))) {
                                    str[which] = str[which].replace(this.$root.rx.js[suffix], '');
                                    var remainder = str[which];
                                    if ((stringPos < 1) && (which == 0)) {
                                        console.log('Placing at the front of stream')
                                        str = [].concat(child, str);
                                    } else if ((which == last) && (stringPos == (str[which].length - hasToken[t].length))) {
                                        console.log('Placing at the end of stream')
                                        str = [].concat(str, child);
                                    } else if (which == last) {
                                        console.log(`This is a split value at ${which} : ${str[which]} : ${child.value}`)

                                        remainder = remainder.replace(child.value, '');
                                        // if (/^\(/.test(remainder)) {
                                        //     console.log('This is an open bracket')
                                        //     remainder = remainder.substring(1, remainder.length);
                                        //     var openbrack = {
                                        //         value: '(',
                                        //         class: 'syntax-Bracket',
                                        //         style: 'color: ' + this.$root.getCSS('syntax-Idle')
                                        //     }
                                        //     // hasToken[t] = hasToken[t].substring(1,hasToken[t].length);
                                        //     str.splice(which, 0, openbrack);
                                        //     // last++;
                                        //     // which++;
                                        // }
                                        console.log(str)
                                        str.pop();
                                        if (stringPos == 0) {
                                            console.log('At the beginning')
                                            str = [].concat(str, child);
                                            str = [].concat(str, remainder)
                                        } else if (stringPos == (str[which].length - hasToken[t].length)) {
                                            console.log('At the ending')
                                            str = [].concat(str, remainder)
                                            str = [].concat(str, child);
                                        } else {
                                            console.log(`Split injection didn't work`)
                                        }
                                    } else {
                                        console.log(`Didn't catch: ${which}`)
                                    }
                                // otherwise split
                                } else {
                                    // This does not work
                                    console.log('This is a split value:')
                                    var split = str[which].split(child.value)
                                    var index = str.indexOf(child.value);
                                    if (index > -1) {
                                        str.splice(index, 1);
                                    }

                                    // if (stringPos == 0) {
                                    //     console.log('At the beginning')
                                    //     str = [].concat(str, child);
                                    //     str = [].concat(str, remainder)
                                    // } else if (stringPos == (str[which].length - hasToken[t].length)) {
                                    //     console.log('At the ending')
                                    //     str = [].concat(str, remainder)
                                    //     str = [].concat(str, child);
                                    // } else {
                                    //     console.log(`Split injection didn't work`)
                                    // }
                                    // str = [].concat(split[0], str);
                                    // str = [].concat(str, split[1]);

                                }
                                console.log(str)
                            }
                        }
                    }
                    //  else {
                    //     var stringPos = str[which].indexOf(hasToken[t]);
                    //     // str[which] = str[which].replace(this.$root.rx.js[suffix], '');
                    //     // check if empty
                    //     // if (!this.$root.rx.js.isEmpty.test(str[last])) {
                    //     if (stringPos > 0) {
                    //         str = [].concat(child, str);
                    //     } else {
                    //         str = [].concat(str, child);
                    //     }
                    //             // }
                    //             // Split the value to extract 'function' and apply the style
                    // }
                }
            }
            str = this.checkSegmentsForPlain(str);
            str = this.checkSegmentsForRawHTML(str);
            // console.log('Final results are')
            // console.log(str)
            return str;
        },
        checkSegmentsForPlain(str) {
            // console.log('Checking segments for any plains....')
            for (var i = 0; i < str.length; i++) {
                // console.log(str[i])
                if ((typeof str[i] == 'string' || str[i] instanceof String)) {
                    var child = {
                        value: str[i],
                        class: 'syntax-Idle',
                        color: 'color:' + this.$root.getCSS('syntax-Idle'),
                    }
                    console.log(`Converting ${i} to a plain segment`)
                    str[i] = child;
                }
            }
            return str;
        },
        checkSegmentsForRawHTML(str) {
            // Space and tab injection do not work.
            // console.log('Checking segments for any raw HTML...')
            for (var i = 0; i < str.length; i++) {
                console.log(str[i])
                if ((typeof str[i].value == 'string' || str[i].value instanceof String)) {
                    if (/\s/.test(str[i].value)) {
                        console.log(`Found a space`)
                        str[i].value.replace('/s', '&nbsp;')
                        console.log(str[i].value)
                    }
                    if (this.$root.rx.js.isEscapeChar.test(str[i].value)) {
                        console.log(`Found an escape character`)
                        str[i].value.replace('/t', '&nbsp;&nbsp;&nbsp;')
                    }
                    // str[i] = child;
                }
            }
            return str;
        },
        getSegments(str) {
            console.log('Getting segments...')
            this.segments = [];
            if (this.lang == 'js') {
                // str = [str]
                str = this.checkForTokens(str);
                console.log('line result will be')
                console.log(str);
                // first test if segment has globals like function or var
                // if (this.$root.rx.js.isGlobal.test(str[0])) {
                //     var hasGlobal = str[0].match(this.$root.rx.js.isGlobal);
                //     if (hasGlobal.length) {
                //         var child = {
                //             value: hasGlobal[0],
                //             class: 'syntax-global',
                //             style: 'color: ' + this.$root.getCSS('--color-global')
                //         }
                //         console.log('Found global:')
                //         console.log(hasGlobal);
                //         // If so, replace and append them to front
                //         str[0] = str[0].replace(this.$root.rx.js.isGlobal, '');
                //         str = [].concat(child, str);
                //         // Split the value to extract 'function' and apply the style
                //     }
                // }
            }
            this.segments = str;
            console.log('Full string is:')
            console.log(str)
            return str;
            // Assign all tokens as segments here. But by now I've back myself into a corner
            // where I can't have contenteditable="true"
        },
        updateMasterSegments() {
            console.log('Updating master:')
            this.$root.segments = this.segments
        }
    },
    mounted() {
        var self = this;
        this.getSegments(this.val);
        this.updateMasterSegments(self.segments)
    }
})


var app = new Vue({
    el: '#app',
    data: {
        fullHeight: document.documentElement.clientHeight,
        fullWidth: document.documentElement.clientWidth,
        rx: {
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
        },
        segments: [],
        code: String.raw`function exampleMethod() {\r   console.log('Testing');\r}`,
    },
    computed: {
        styleGlobal: function() {return this.getCSS('global')}
    },
    methods: {
        getCSS(prop) {
            return window.getComputedStyle(document.documentElement).getPropertyValue('--' + prop);
        },
        setCSS(prop, data) {
            document.documentElement.style.setProperty('--' + prop, data);
        },
        isEqualArray(array1, array2) {
            array1 = array1.join().split(','), array2 = array2.join().split(',');
            var errors = 0, result;
            for (var i = 0; i < array1.length; i++) {
                if (array1[i] !== array2[i])
                    errors++;
            }
            if (errors > 0)
                result = false;
            else
                result = true;
            return result;
        },
        removeEmptyValues(keyList, mirror = []) {
            // console.log(keyList);
            for (var i = 0; i < keyList.length; i++) {
                var targ = keyList[i];
                if (/^$/.test(targ)) {
                    // console.log('Empty');
                } else {
                    mirror.push(targ);
                }
            }
            return mirror;
        },
    }
});