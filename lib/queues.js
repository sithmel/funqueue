var Heap = require('little-ds-toolkit/lib/heap')
var MinMaxHeap = require('little-ds-toolkit/lib/min-max-heap')
var Dequeue = require('dequeue')

function FIFOQueue () {
  this.queue = new Dequeue()
}

FIFOQueue.prototype.push = function FIFOQueuePush (data) {
  this.queue.push(data)
}

FIFOQueue.prototype.shift = function FIFOQueueShift () {
  return this.queue.shift()
}

FIFOQueue.prototype.pop = function FIFOQueuePop () {
  return this.queue.pop()
}

FIFOQueue.prototype.size = function FIFOQueueSize () {
  return this.queue.length
}

function PriorityQueue (comparator) {
  this.heap = new Heap(comparator)
}

PriorityQueue.prototype.push = function PriorityQueuePush (data) {
  this.heap.push(data)
}

PriorityQueue.prototype.shift = function PriorityQueueShift () {
  return this.heap.pop()
}

PriorityQueue.prototype.pop = function PriorityQueuePop () {
  throw new Error('Not implemented error')
}

PriorityQueue.prototype.size = function PriorityQueueSize () {
  return this.heap.size()
}

function MinMaxPriorityQueue (comparator, queueSize) {
  this.heap = new MinMaxHeap(comparator)
  this.queueSize = queueSize
}

MinMaxPriorityQueue.prototype.push = function MinMaxPriorityQueuePush (data) {
  this.heap.push(data)
}

MinMaxPriorityQueue.prototype.shift = function MinMaxPriorityQueueShift () {
  return this.heap.popMin()
}

MinMaxPriorityQueue.prototype.pop = function MinMaxPriorityQueuePop () {
  return this.heap.popMax()
}

MinMaxPriorityQueue.prototype.size = function MinMaxPriorityQueueSize () {
  return this.heap.size()
}

function queueFactory (comparator, queueSize) {
  if (!comparator) {
    return new FIFOQueue()
  }
  if (typeof queueSize === 'number' && queueSize !== Infinity) {
    return new MinMaxPriorityQueue(comparator, queueSize)
  }
  return new PriorityQueue(comparator)
}

module.exports = queueFactory
