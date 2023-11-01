import { Show } from 'pota'
import { H2 } from './headings.jsx'

export function Header(props) {
	return (
		<header>
			<Show when={props.title}>
				<H2 title={props.title}>{props.children}</H2>
			</Show>
			<Show when={!props.title}>{props.children}</Show>
		</header>
	)
}
