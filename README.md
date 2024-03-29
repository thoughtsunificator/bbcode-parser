# bbcode-parser

bbcode-parser is a JavaScript implementation of the lightweight markup language [BBCode](https://en.wikipedia.org/wiki/BBCode).

If you wish to convert BBCode to HTML or HTML to BBCode see [bbcode-parser-template](https://github.com/thoughtsunificator/bbcode-parser-template).

## Getting Started

### Installing

- ``npm install  @thoughtsunificator/bbcode-parser``

### Usage

````javascript
import { Parser } from '@thoughtsunificator/bbcode-parser'

const bbDocument = Parser.parse("[b]Hey, thanks![/b]") // return a BBDocument instance

const bbElement bbDocument.documentElement.children[0] // Returns a bbElement
const text = bbDocument.documentElement.children[0].textContent // returns "Hey, thanks!"
````

## API

See [http://bbcode-parser.unificator.me](http://bbcode-parser.unificator.me).

## Try it out!

See [https://codesandbox.io/s/bbcode-parser-gth53](https://codesandbox.io/s/bbcode-parser-gth53).
