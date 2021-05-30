# bbcode-parser [![Build Status](https://travis-ci.com/thoughtsunificator/bbcode-parser.svg?branch=master)](https://travis-ci.com/thoughtsunificator/bbcode-parser)

bbcode-parser is a JavaScript implementation of the lightweight markup language [BBCode](https://en.wikipedia.org/wiki/BBCode).

If you wish to convert BBCode to HTML or HTML to BBCode see [bbcode-parser-template](https://github.com/thoughtsunificator/bbcode-parser-template).

## Getting Started

### Installing

#### Browser

- ``git submodule add https://github.com/thoughtsunificator/bbcode-parser lib/bbcode-parser``

#### Node.js

- ``npm install  @thoughtsunificator/bbcode-parser``
-  Add ``type: "module"`` to your package.json.

### Usage

````javascript
import { Parser } from '@thoughtsunificator/bbcode-parser' // or ./lib/bbcode-parser/index.js

const bbDocument = Parser.parse("[b]Hey, thanks![/b]") // return a BBDocument instance

const bbElement bbDocument.documentElement.children[0] // Returns a bbElement
const text = bbDocument.documentElement.children[0].textContent // returns "Hey, thanks!"
````

## API

See [https://thoughtsunificator.github.io/bbcode-parser](https://thoughtsunificator.github.io/bbcode-parser).

## Try it out!

See [https://codesandbox.io/s/bbcode-parser-gth53](https://codesandbox.io/s/bbcode-parser-gth53).
