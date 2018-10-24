var queueFactory = require('./lib/queues')
var OverflowError = require('./lib/overflow-error')

function FunQueue (opts) {
  opts = opts || {}
  this.queueSize = opts.queueSize || Infinity
  this.concurrency = opts.concurrency || 1
  this.numberRunning = 0
  this.queue = queueFactory(opts.comparator, opts.queueSize)
}

FunQueue.prototype._execNext = function FunQueueExecNext () {
  if (this.queue.size() === 0 || this._pause) return

  var data = this.queue.shift()
  var func = data.func
  var args = data.args
  var resolve = data.resolve
  var reject = data.reject
  var self = this

  this.numberRunning++

  func.apply(null, args)
    .then(function (res) {
      self.numberRunning--
      resolve(res)
      self._execNext()
    })
    .catch(function (err) {
      self.numberRunning--
      reject(err)
      self._execNext()
    })
}

FunQueue.prototype.exec = function FunQueueExec (func, args) {
  var self = this
  return new Promise(function (resolve, reject) {
    self.queue.push({ func: func, args: args, resolve: resolve, reject: reject })
    if (self.queue.size() > self.queueSize) {
      var data = self.queue.pop()
      var rejectFunc = data.reject
      return rejectFunc(new OverflowError('Queue full'))
    }
    if (self.numberRunning < self.concurrency) self._execNext()
  })
}

FunQueue.prototype.pause = function FunQueuePause () {
  this._pause = true
}

FunQueue.prototype.resume = function FunQueueResume () {
  this._pause = false
  while (this.numberRunning < this.concurrency) {
    this._execNext()
  }
}

FunQueue.OverflowError = OverflowError

module.exports = FunQueue
