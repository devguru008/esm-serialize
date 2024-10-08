import parser from '../index';

describe('Parser#Serialize(obj, ignoreNativeCode)', () => {
  let obj: any;

  beforeAll(() => {
    obj = {
      name: 'Bob',
      say: function() {
        return 'hi ' + this.name;
      },
      nl: null
    };
  });

  test('should return a string', () => {
    expect(typeof parser.serialize(obj)).toBe('string');
  });
});

describe('Parser#Unserialize(obj)', () => {
  let obj: any;

  beforeAll(() => {
    obj = {
      name: 'Bob',
      say: function() {
        return 'hi ' + this.name;
      },
      nl: null
    };
  });

  test('should return an object', () => {
    const objSer = parser.unserialize(parser.serialize(obj));
    expect(typeof objSer).toBe('object');
  });
});
