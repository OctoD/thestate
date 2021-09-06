open Test

let samevalueint = (~message = ?, a: int, b: int) =>
  assertion(~message?, ~operator="samevalueint", (a, b) => a === b, a, b)

let samevaluestr = (~message = ?, a: string, b: string) =>
  assertion(~message?, ~operator="samevaluestr", (a, b) => a === b, a, b)

test("creates a store, adds a mutation, adds a listener and mutate the store", () => {
  let store = 100->Thestate.make
  let increment = store->Thestate.mutation((x, ()) => x + 1)
  let changes = ref(0)
  let cancel = store->Thestate.listen(_ => changes := changes.contents + 1)

  samevalueint(~message = "store value is 100", store->Thestate.getstate, 100)
  increment()
  samevalueint(~message = "store value is 101", store->Thestate.getstate, 101)
  samevalueint(~message = "listener was invoked once", changes.contents, 1)

  cancel()
  increment()

  samevalueint(~message = "store value is 102", store->Thestate.getstate, 102)
  samevalueint(~message = "unsubscribed listener was not invoked again", changes.contents, 1)
})

test("creates two stores and make them talk with the listen fn", () => {
  let store1 = 0->Thestate.make
  let store2 = 0->Thestate.make

  let increment1 = store1->Thestate.mutation((x, p) => x + p)
  let increment2 = store2->Thestate.mutation((x, p) => x + p)

  let _1 = store1->Thestate.listen(increment2)

  20->increment1

  samevalueint(~message = "store1 value is 20", store1->Thestate.getstate, 20)
  samevalueint(~message = "store2 value is 20", store2->Thestate.getstate, 20)

  20->increment2

  samevalueint(~message = "store1 value is 20", store1->Thestate.getstate, 20)
  samevalueint(~message = "store2 value is 40", store2->Thestate.getstate, 40)
})

type mystate = {
  name: string,
  age: int,
}

let mystate = (name: string, age: int) =>
  { name, age }

test("creates a more complex store", () => {
  let store = mystate("lorem", 21)->Thestate.make

  let setage = store->Thestate.mutation((state, age) => { age, name: state.name })
  let setname = store->Thestate.mutation((state, name) => { name, age: state.age })

  35->setage
  "paolo"->setname

  samevalueint(~message = "age is 35", (store->Thestate.getstate).age, 35)
  samevaluestr(~message = "name is paolo", (store->Thestate.getstate).name, "paolo")
})

test("tests pass fn", () => {
  let store = ""->Thestate.make

  let set = store->Thestate.mutation(Thestate.pass)

  "lorem"->set

  samevaluestr(~message = "store value is lorem", store->Thestate.getstate, "lorem")
})