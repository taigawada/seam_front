/**
 * @constructor
 * @classdesc 一定間隔で関数を実行するタイマークラス
 * @param {() => unknown} fn コールバック関数
 * @param {number} interval ミリ秒
 */
export default class IntervalTimer {
  fn: () => unknown;
  interval: number;
  timer: number | null;
  constructor(fn: () => unknown, interval: number) {
    this.fn = fn;
    this.interval = interval;
    this.timer = setInterval(fn, interval);
  }
  stop(): IntervalTimer {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    return this;
  }
  start(): IntervalTimer {
    if (!this.timer !== null) {
      this.stop();
      this.timer = setInterval(this.fn, this.interval);
    }
    return this;
  }
  reset(newInterval: number = this.interval): IntervalTimer {
    this.interval = newInterval;
    return this.stop().start();
  }
}
