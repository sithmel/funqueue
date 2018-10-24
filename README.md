# funcqueue-promise

A queue for asynchronous functions

You can use this to limit the concurrency and coordinate the execution of a group of functions.

### Compatibility
The module is written in ES5 but it requires "Promise" to be defined. Add a polyfill if your environment doesn't support that natively.

### Import the module
```js
const FunQueue = require('funqueue-promise')
```

### Create the queue
```js
const queue = new FunQueue()
```

## Execute an asynchronous function
Instead of running your function as usual:
```js
const result = await func(1, 2, 3)
```
You can use the queue:
```js
const result = await queue.exec(func, [1, 2, 3])
```
The default behaviour of the queue is to limit the number of concurrent functions in the queue to one. All functions that are not executed straight away are queued and executed in a FIFO.

## Increase the concurrency
You can increase the concurrency of the queue using the "concurrency"
```js
const queue = new FunQueue({ concurrency: 3 }) // 3 functions at the same time
```

## Limiting the size of the queue
You can decide to limit the size of the queue. When the queue is full the promise is rejected with an "OverflowError". You can find the error constructor attached to the constructor function:
```js
const queue = new FunQueue({ queueSize: 1 })
// ... execute other functions ...
try {
  await queue.exec(func, [1, 2, 3])
} catch (e) {
  if(e instanceof FunQueue.OverflowError) {
    console.log('The queue is full!')
  }
}
```

## Setting a priority
By default all functions queued are executed in the order they are called (FIFO). You can decide a different ordering using a comparator.
```js
const queue = new FunQueue({ comparator: (a, b) => a.args[0] - a.args[1] })
```
In the comparator you compare 2 queued functions and their arguments:
```js
const queue = new FunQueue({ comparator: (a, b) => 
// a.func, b.func are the functions in the queue
// a.args, b.args are arrays with the arguments
})
```

## Combine all options!
You can use all the options to set the queue to fit your needs.

## Pause/resume the execution
Using *pause* the functions already running are completed but all the ones waiting in the queue will be paused. Using *resume* is possible to le the execution resume.
```js
queue.pause()
queue.resume()
```
