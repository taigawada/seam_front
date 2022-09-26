export default class URLParams {
  static removeFalsy(params: any) {
    const result: object = {};
    Object.keys(params).map((param) => {
      if (params[param]) Object.assign(result, { [param]: params[param] });
    });
    return result;
  }
}
