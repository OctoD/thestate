Thestate
========

Yet another global state manager.

Yes, it's done with push/sub

Yes, it's simple

Yes, it's made with Rescript

Why chosing it?

- Simple, really simple
- It's made with Rescript! ❤️
- It's very tiny
- Has `.d.ts` files for your js/ts apps
- Built both for commonjs and es6 spec

## install

```bash
yarn add thestate
```

If you are a js/ts dev, it's done. If you are using rescript (and I recommend it!), add the dependency to your *bsconfig.json* file

```json
"bs-dependencies": [
  "thestate"
]
```

## creating your first store (rescript)

You have four functions to know: 

- make, creates a store
- getstate, returns a store's value
- mutation, registers a mutation and returns a mutating function
- listen, adds a listener to all mutations in a single store

```rescript
let store = 100->Thestate.make
let increment = store->Thestate.mutation((state, payload) => state + payload)
let unsubscribelistener = store->Thestate.listen(state => Js.Console.log(state))

increment(100) // logs 200
store->Thestate.getstate->Js.Console.log // logs 200

unsubscribelistener()

increment(100) // does not log anymore, we have unsubscribed before
```

## creating your first store (js/ts)

```ts
import * as thestate from 'thestate';

const store = thestate.make(100);
const increment = thestate.mutation(store, (state: number, payload: number) => state + payload);
const unsubscribelistener = thestate.listen(store, console.log);

increment(100) // logs 200
console.log(thestate.getstate(store)) // logs 200

unsubscribelistener()
increment(100) // does not log anymore, we have unsubscribed before
```

## using it with react (rescript)

```rescript
// create your store normally
let store = 100->Thestate.make
// maybe with some mutations is better
let increment = store->Thestate.mutation((state, payload) => state + payload)

// wrap it using a hook (recommended)
let useCounter = () => {
  let (state, setstate) = React.useState(() => store->Thestate.getstate)
    
  React.useEffect0(() => {
    Some( store->Thestate.listen(state => setstate(_ => state)) )
  })

  state
}

module Increment = {
  @react.component
  let make = () => <button onClick={_ => increment(1)}> {"increment"->React.string} </button>
}

module Count = {
  @react.component 
  let make = () => {
    let count = useCounter()

    <React.Fragment>
      {`current state is ${count->Belt.Int.toString}`->React.string}
    </React.Fragment>
  }
}

module Counter = {
  @react.component
  let make = () => {
    <div>
      <Count />
      <Increment />
    </div>
  }
}
```

## using it with react (js/ts)

```tsx
import React, { useState, useEffect } from 'react';
import * as thestate from 'thestate';

const store = thestate.make(100)
const increment = thestate.mutation(store, (a: number, b: number) => a + b);

const useCounter = () => {
  const [state, setstate] = useState(thestate.getstate(store))

  useEffect(() => {
    thestate.listen(store, setstate)
  }, []);

  return state;
}

const Increment = () => {
  return (
    <button onClick={() => increment(1)}>
      increment
    </button>
  )
}

const Count = () => {
  const count = useCounter()
  
  return (
    <>{`current state is ${count}`}</>
  )
}

const Counter = () => {
  return (
    <div>
      <Count />
      <Increment />
    </div>
  )
}
```

## Contributions are really welcome

Any kind of contribution is really welcome, so don't be shy! 

