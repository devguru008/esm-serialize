# esm-serialize

Serialize a object including it's function into a JSON with Typescript.


## Install

```
npm install esm-serialize
```

## Usage

```javascript
import parser from 'esm-serialize';
```

Serialize an object including it's function:


```javascript
const obj = {
  name: 'Bob',
  say: function() {
    return 'hi ' + this.name;
  }
};

const objS = parser.serialize(obj);
typeof objS === 'string';
parser.unserialize(objS).say() === 'hi Bob';
```

Serialize an object with a sub object:

```javascript
const objWithSubObj = {
  obj: {
    name: 'Jeff',
    say: function() {
      return 'hi ' + this.name;
    }
  }
};

const objWithSubObjS = parser.serialize(objWithSubObj);
typeof objWithSubObjS === 'string';
parser.unserialize(objWithSubObjS).obj.say() === 'hi Jeff';
```