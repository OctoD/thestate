let splice = %raw(`
  function (array, index) {
    if (Array.isArray(array)) {
      array.splice(index, 1);
      return array;
    }

    throw new Error('Cannot splice from a non-array');
  }
`)

type listener<'state> = 'state => unit

type listenerarray<'state> = array<listener<'state>>

type state<'state> = {
  listeners: ref<listenerarray<'state>>,
  state: ref<'state>,
}

let getstate: (state<'state>) => 'state = state => state.state.contents;

let listen: (state<'state>, listener<'state>) => () => unit = (state, listener) => {
  let index = listener->Js.Array.push(state.listeners.contents)
  () => {
    state.listeners.contents = splice(state.listeners.contents, index - 1)
  }
}

let make: ('state) => state<'state> = state => {
  {
    listeners: ref([]),
    state: ref(state),
  }
}

let mutation: (state<'state>, ('state, 'payload) => 'state) => 'payload => unit = (
  state,
  mutation
) => payload => {
  state.state := mutation(state.state.contents, payload)
  Js.Array.forEach(listener => listener(state.state.contents), state.listeners.contents)
}
