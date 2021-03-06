/**
 * 展示事件
 * 1分钟以内 —— 刚刚
 * [1分钟,1小时） —— n分钟前（例:8分钟前
 * [1小时,24小时） —— n小时前（例: 8小时前
 * [24小时，自然日昨天0点） —— 昨天
 * [自然日昨天0点，自然日1月1日0点） —— 月-日（例: 8-5
 * 大于自然日1月1日0点 —— 年-月-日（例: 2016-8-5
 */

var assert = require('assert')
var formatter = require('./')

var now = new Date(2018, 1, 1, 11, 30, 2) // 2018-2-1 11:30:02
var _now = now.getTime()

var SECOND = 1000
var MINUTE = 60 * SECOND
var HOUR = 60 * MINUTE
var DAY = 24 * HOUR

describe('时间格式化', function() {
  describe('传入的参数必须是Date的实例', function() {
    it('如果参数`then`不是Date实例，应该抛出一个错误', function() {
      try {
        formatter(Date.now())
      } catch (err) {
        assert.ok(
          err instanceof TypeError &&
          err.message === 'formatter: argument \'then\' needs to be an instance of Date'
        )
      }
    })

    it('如果参数`now`不为`undefined`且不为Date实例，应该抛出一个错误', function() {
      try {
        formatter(new Date(2018, 0, 1), Date.now())
      } catch (err) {
        assert.ok(
          err instanceof TypeError &&
          err.message === 'formatter: argument \'now\' needs to be an instance of Date or undefined'
        )
      }
    })
  })
  describe('距离' + now.toLocaleString(), function() {
    it('1分钟以内，要返回\'刚刚\'', function() {
      assert.deepStrictEqual(formatter(new Date(_now - MINUTE + SECOND), now), '刚刚')
    })

    it('1分钟，要返回\'1分钟前\'', function() {
      assert.deepStrictEqual(formatter(new Date(_now - MINUTE), now), '1分钟前')
    })

    it('59分钟59秒，要返回\'59分钟前\'', function() {
      assert.deepStrictEqual(formatter(new Date(_now - HOUR + SECOND), now), '59分钟前')
    })

    it('1个小时，要返回\'1小时前\'', function() {
      assert.deepStrictEqual(formatter(new Date(_now - HOUR), now), '1小时前')
    })

    it('23个小时59分钟59秒，要返回\'23小时前\'', function() {
      assert.deepStrictEqual(formatter(new Date(_now - DAY + SECOND), now), '23小时前')
    })

    it('24个小时，要返回\'昨天\'', function() {
      assert.deepStrictEqual(formatter(new Date(_now - DAY), now), '昨天')
    })

    it('昨天零点，要返回\'昨天\'', function() {
      var then = new Date(2018, 0, 31)
      assert.deepStrictEqual(formatter(then, now), '昨天')
    })

    it('昨天零点前一秒，要返回\'1-30\'', function() {
      var then = new Date(2018, 0, 30, 23, 59, 59)
      assert.deepStrictEqual(formatter(then, now), '1-30')
    })

    it('2018-01-01 00:00:00，要返回\'1-1\'', function() {
      var then = new Date(2018, 0, 1)
      assert.deepStrictEqual(formatter(then, now), '1-1')
    })

    it('2017-12-31 23:59:59，要返回\'2017-12-31\'', function() {
      var then = new Date(2017, 11, 31, 23, 59, 59)
      assert.deepStrictEqual(formatter(then, now), '2017-12-31')
    })
  })
})
