@genType
type listener<'state> = 'state => unit

@genType
type listenerarray<'state> = array<listener<'state>>

@genType
type state<'state> = {
  listeners: listenerarray<'state>,
  state: ref<'state>,
}

@genType
let listen: (state<'state>, listener<'state>) => () => unit = (state, listener) => {
  let index = listener->Js.Array.push(state.listeners)
  () => {
    let _ = Js.Array.spliceInPlace(~pos=index, ~remove=1, state.listeners)
  }
}

@genType
let make: ('state, ~listeners: listenerarray<'state>=?, unit) => state<'state> = (
  state,
  ~listeners=[],
  (),
) => {
  {
    listeners: listeners,
    state: ref(state),
  }
}

@genType
let mutation: (state<'state>, ('state, 'payload) => 'state, 'payload) => unit = (
  state,
  mutation,
  payload,
) => {
  state.state := mutation(state.state.contents, payload)
  Js.Array.forEach(listener => listener(state.state.contents), state.listeners)
}
