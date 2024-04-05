import { Show } from 'pota/web'

export function Tag(props) {
	return (
		<>
			<Show when={props.mark === true}>
				<mark>{'<' + props.children + '/>'}</mark>{' '}
			</Show>
			<Show when={!props.mark}>{'<' + props.children + '/> '}</Show>
		</>
	)
}
