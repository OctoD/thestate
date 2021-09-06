export type listener<t> = (state: t) => void;

export type listenerarray<t> = listener<t>[];

export type state<t> = {
  readonly listeners: listenerarray<t>;
  readonly state: t;
}

export const getstate: <t>(state: state<t>) => t;
export const listen: <t>(state: state<t>, listener: listener<t>) => () => void;
export const pass: <t>(state: t, value: t) => t;
export const make: <t>(state: t) => state<t>;
export const mutation: <p, t>(state: state<t>, mutator: (state: t, payload: p) => t) => (payload: p) => void;

export const useState: <t>(store: state<t>) => t;
