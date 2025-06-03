import { Switch, Match } from 'pota/components'

function Component() {
  return (
    <Switch fallback="Nothing got rendered!">
      <Match when={0}>0</Match>
      <Match when={undefined}>undefined</Match>
      <Match when={false}>false</Match>
    </Switch>
  )
}
