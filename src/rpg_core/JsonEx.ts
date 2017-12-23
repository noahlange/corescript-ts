/**
 * The static class that handles JSON with object information.
 *
 * @class JsonEx
 */
export default class JsonEx {
  /**
   * The maximum depth of objects.
   */
  public static maxDepth: number = 100;

  /**
   * Converts an object to a JSON string with object information.
   */
  public static stringify(
    /** The object to be converted */
    object: any
  ): string {
    const circular: any[] = [];
    JsonEx._id = 1;
    const json = JSON.stringify(this._encode(object, circular, 0));
    this._cleanMetadata(object);
    this._restoreCircularReference(circular);

    return json;
  }

  /**
   * Makes a deep copy of the specified object.
   */
  public static makeDeepCopy(
    /** The object to be copied */
    object: any
  ) {
    return this.parse(this.stringify(object));
  }

  public static _restoreCircularReference(circulars: any[]) {
    circulars.forEach(([key, value, content]) => {
      value[key] = content;
    });
  }

  /**
   * Parses a JSON string and reconstructs the corresponding object.
   *
   * @static
   * @method parse
   * @param {String} json The JSON string
   * @return {Object} The reconstructed object
   */
  public static parse(json: string) {
    const circular: any[] = [];
    const registry = {};
    const contents = this._decode(JSON.parse(json), circular, registry);
    this._cleanMetadata(contents);
    this._linkCircularReference(contents, circular, registry);
    return contents;
  }
  protected static _id = 1;

  protected static _generateId() {
    return JsonEx._id++;
  }

  protected static _linkCircularReference(
    contents: any,
    circulars: any,
    registry: any
  ) {
    circulars.forEach((circular: any[]) => {
      const key = circular[0];
      const value = circular[1];
      const id = circular[2];
      value[key] = registry[id];
    });
  }

  protected static _cleanMetadata(object?: any) {
    if (!object) {
      return;
    }
    delete object['@'];
    delete object['@c'];
    if (typeof object === 'object') {
      Object.keys(object)
        .filter(k => typeof object[k] === 'object')
        .forEach(key => JsonEx._cleanMetadata(object[key]));
    }
  }

  protected static _encode(value: any, circular: any[], depth: number) {
    depth = depth || 0;
    if (++depth >= this.maxDepth) {
      throw new Error('Object too deep');
    }
    const type = Object.prototype.toString.call(value);
    if (type === '[object Object]' || type === '[object Array]') {
      value['@c'] = JsonEx._generateId();

      const constructorName = this._getConstructorName(value);
      if (constructorName !== 'Object' && constructorName !== 'Array') {
        value['@'] = constructorName;
      }
      for (const key in value) {
        if (value.hasOwnProperty(key) && !key.match(/^@./)) {
          if (value[key] && typeof value[key] === 'object') {
            if (value[key]['@c']) {
              circular.push([key, value, value[key]]);
              value[key] = { '@r': value[key]['@c'] };
            } else {
              value[key] = this._encode(value[key], circular, depth + 1);

              if (value[key] instanceof Array) {
                // wrap array
                circular.push([key, value, value[key]]);

                value[key] = {
                  '@c': value[key]['@c'],
                  '@a': value[key]
                };
              }
            }
          } else {
            value[key] = this._encode(value[key], circular, depth + 1);
          }
        }
      }
    }
    depth--;
    return value;
  }

  protected static _decode(value: any, circular: any[], registry: any) {
    const type = Object.prototype.toString.call(value);
    if (type === '[object Object]' || type === '[object Array]') {
      registry[value['@c']] = value;

      if (value['@']) {
        const constructor = (window as any)[value['@']];
        if (constructor) {
          value = this._resetPrototype(value, constructor.prototype);
        }
      }
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          if (value[key] && value[key]['@a']) {
            // object is array wrapper
            const body = value[key]['@a'];
            body['@c'] = value[key]['@c'];
            value[key] = body;
          }
          if (value[key] && value[key]['@r']) {
            // object is reference
            circular.push([key, value, value[key]['@r']]);
          }
          value[key] = this._decode(value[key], circular, registry);
        }
      }
    }
    return value;
  }

  /**
   * @static
   * @method _getConstructorName
   * @param {Object} value
   * @return {String}
   * @private
   */
  protected static _getConstructorName(value: any): string {
    let name = value.constructor.name;
    if (name === undefined) {
      const func = /^\s*function\s*([A-Za-z0-9_$]*)/;
      name = func.exec(value.constructor)[1];
    }
    return name;
  }

  /**
   * @static
   * @method _resetPrototype
   * @param {Object} value
   * @param {Object} prototype
   * @return {Object}
   * @private
   */
  protected static _resetPrototype(value: any, prototype: any) {
    if (Object.setPrototypeOf !== undefined) {
      Object.setPrototypeOf(value, prototype);
    } else if ('__proto__' in value) {
      value.__proto__ = prototype;
    } else {
      const newValue = Object.create(prototype);
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          newValue[key] = value[key];
        }
      }
      value = newValue;
    }
    return value;
  }
}
