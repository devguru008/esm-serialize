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

const objS = parser.Serialize(obj);
typeof objS === 'string';
parser.Unserialize(objS).say() === 'hi Bob';
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

const objWithSubObjS = parser.Serialize(objWithSubObj);
typeof objWithSubObjS === 'string';
parser.Unserialize(objWithSubObjS).obj.say() === 'hi Jeff';
```