export default class JSONDecoder {
  private static isDate(str: string) {
    if (typeof str === 'string') {
      return (
        str.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/) !== null
      );
    } else return false;
  }
  private static objectDateParse(target: any) {
    Object.keys(target).map((objectKey) => {
      if (this.isDate(target[objectKey])) {
        target[objectKey] = new Date(target[objectKey]);
      }
    });
  }
  /**
   * オブジェクト、またはオブジェクトの配列を引数に取り、ISO8601形式のStringをDateに変換します。
   * @param target
   * @returns 変換したオブジェクト、またはオブジェクトの配列
   */
  static dateParse<T>(target: object | Array<object>) {
    if (Array.isArray(target)) {
      target.map((targetObject) => {
        return this.objectDateParse(targetObject);
      });
      return target as unknown as T;
    } else {
      this.objectDateParse(target);
      return target as unknown as T;
    }
  }
}
