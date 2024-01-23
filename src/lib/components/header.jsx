import { Switch, Match } from 'pota'
import { H2 } from './headings.jsx'

export function Header(props) {
	return (
		<>
			<Switch>
				<Match when={props.title}>
					<H2 title={props.title}>{props.children}</H2>
				</Match>
				<Match when={!props.title}>
					<header>{props.children}</header>
				</Match>
			</Switch>
		</>
	)
}
