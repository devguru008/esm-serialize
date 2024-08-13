export class Parser {
  private FUNCFLAG = '_$$ND_FUNC$$_';
  private CIRCULARFLAG = '_$$ND_CC$$_';
  private KEYPATHSEPARATOR = '_$$.$$_';
  private ISNATIVEFUNC = /^function\s*[^(]*\(.*\)\s*\{\s*\[native code\]\s*\}$/;

  private getKeyPath(obj: any, path: string): any {
    const paths = path.split(this.KEYPATHSEPARATOR);
    let currentObj = obj;
    paths.forEach((p, index) => {
      if (index) currentObj = currentObj[p];
    });
    return currentObj;
  }

  public Serialize(obj: any, 
    ignoreNativeFunc = false, 
    outputObj: any = {}, 
    cache: any = {}, 
    path = ''): string 
  {
    path = path || '$';
    cache = cache || {};
    cache[path] = obj;
    outputObj = outputObj || {};

    let key: PropertyKey;
    for(key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if(typeof obj[key] === 'object' && obj[key] !== null) {
          let subKey;
          let found = false;
          for(subKey in cache) {
            if (Object.prototype.hasOwnProperty.call(cache, subKey)) {
              if (cache[subKey] === obj[key]) {
                outputObj[key] = this.CIRCULARFLAG + subKey;
                found = true;
              }
            }
          }
          if (!found) {
            outputObj[key] = this.Serialize(obj[key], ignoreNativeFunc, outputObj[key], cache, path + this.KEYPATHSEPARATOR + key);
          }
        } else if(typeof obj[key] === 'function') {
          let funcStr = obj[key].toString();
          if(this.ISNATIVEFUNC.test(funcStr)) {
            if(ignoreNativeFunc) {
              funcStr = 'function() {throw new Error("Call a native function unserialized")}';
            } else {
              throw new Error('Can\'t serialize a object with a native function property. Use serialize(obj, true) to ignore the error.');
            }
          }
          outputObj[key] = this.FUNCFLAG + funcStr;
        } else {
          outputObj[key] = obj[key];
        }
      }
    }

    return (path === '$') ? JSON.stringify(outputObj) : outputObj;
  }

  public Unserialize(obj: any, originObj: any = {}) {
    let isIndex;
    if (typeof obj === 'string') {
      obj = JSON.parse(obj);
      isIndex = true;
    }
    originObj = originObj || obj;

    const circularTasks = [];
    let key;
    for(key in obj) {
      if(Object.prototype.hasOwnProperty.call(obj, key)) {
        if(typeof obj[key] === 'object') {
          obj[key] = this.Unserialize(obj[key], originObj);
        } else if(typeof obj[key] === 'string') {
          if(obj[key].indexOf(this.FUNCFLAG) === 0) {
            obj[key] = eval('(' + obj[key].substring(this.FUNCFLAG.length) + ')');
          } else if(obj[key].indexOf(this.CIRCULARFLAG) === 0) {
            obj[key] = obj[key].substring(this.CIRCULARFLAG.length);
            circularTasks.push({obj: obj, key: key});
          }
        }
      }
    }

    if (isIndex) {
      circularTasks.forEach(
        task => { task.obj[task.key] = this.getKeyPath(originObj, task.obj[task.key]); }
      );
    }
    return obj;
  }
}
export default new Parser();
