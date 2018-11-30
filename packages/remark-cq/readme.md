# remark-cq

[**remark**][remark] plug-in to import code in markdown using [cq](https://github.com/fullstackio/cq)

## Installation

[npm][npm-install]:

```bash
npm install remark-cq
```

## Usage

For example:

```javascript
var remark = require("remark");
var cq = require("remark-cq");
const unified = require("unified");
const reParse = require("remark-parse");
const stringify = require("rehype-stringify");
const remark2rehype = require("remark-rehype");
const remarkStringify = require("remark-stringify");

const render = (text, config) =>
    unified()
        .use(reParse)
        .use(cq, config)
        .use(remark2rehype)
        .use(stringify)
        .processSync(text);

const markup = `
The code:

{lang=javascript,crop-query=.dogs}  
<<[](test.js)`;

const html = render(markup, { root: __dirname }).contents;

console.log(html);
```

Given a file `test.js` containing:

```javascript
// test.js
var a = 1;
const dogs = () => "Like snuggles";
var b = 2;
```

Yields:

```html
<p>The code:</p>
<pre><code class="language-javascript">const dogs = () => "Like snuggles";
</code></pre>
```

Similarly, you can render to markdown like this:

```javascript
const renderMarkdown = (text, config) =>
    unified()
        .use(reParse)
        .use(remarkStringify)
        .use(cq, config)
        .processSync(text);
```

and then above example would render into:

````md
The code:

```javascript
const dogs = () => "Like snuggles";
```
````

## API

### `remark.use(cq, options)`

## Options

-   `root`: path to look for relative files
-   `undent`: undent the code (default `true`)
-   the rest are passed to `cq`

## License

[MIT][license] © [Nate Murray][author]

<!-- Definitions -->

[npm-install]: https://docs.npmjs.com/cli/install
[license]: LICENSE
[author]: http://fullstack.io
[remark]: https://github.com/wooorm/remark