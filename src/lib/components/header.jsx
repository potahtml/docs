import { Switch, Match } from 'pota/web'
import { H2 } from './headings.jsx'

export function Header(props) {
	return (
		<Switch>
			<Match when={props.title}>
				<H2
					title={props.title}
					no-meta={props['no-meta']}
				>
					{props.children}
				</H2>
			</Match>
			<Match when={!props.title}>
				<header>{props.children}</header>
			</Match>
		</Switch>
	)
}
