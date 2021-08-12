@genType
type foo = Value1 | Value2 | Value3

"helloworld"
  ->Js.log

42
  ->Belt.Int.toString
  ->String.concat(list{"The answer is"})
  ->Js.log
