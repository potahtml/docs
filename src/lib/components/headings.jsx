import { signal } from 'pota'
import { Show, Head } from 'pota/components'

function encode(text) {
	return encodeURIComponent(
		text
			.trim()
			.replace(/\s+/g, ' ')
			.replace(/^#\s+/, '')
			.replace(/\s/g, '-')
			.replace(/\//g, '-')
			.replace(/-+/g, '-'),
	)
}

function whitespace(text) {
	return text.trim().replace(/\s+/g, ' ')
}

export function H2(props) {
	const [URL, setURL] = signal(props.title)
	const [title, setTitle] = signal('')
	const [description, setDescription] = signal('')

	return (
		<>
			<h2 id={URL}>
				<a
					href={() => '#' + URL()}
					use:connected={element => {
						setTitle(element.innerText)
						setURL(encode(element.innerText))
					}}
				>
					{props.title}
				</a>
			</h2>
			<Show when={props.children}>
				<p
					use:connected={element =>
						setDescription(whitespace(element.innerText))
					}
				>
					{props.children}
				</p>
			</Show>

			<Show when={props['no-meta'] === undefined}>
				<Head>
					<title>{props['meta-title'] || props.title} - pota</title>
					<link
						rel="canonical"
						href={window.location.href}
					/>
					<meta
						property="og:url"
						content={window.location.href}
					/>
					<meta
						property="og:title"
						content={title}
					/>
					<meta
						name="description"
						content={description}
					/>
					<meta
						property="og:description"
						content={description}
					/>
				</Head>
			</Show>
		</>
	)
}

export function H3(props) {
	const [URL, setURL] = signal('')

	return (
		<h2 id={URL}>
			<a
				href={() => '#' + URL()}
				use:connected={element => {
					setURL(encode(element.innerText))
				}}
			>
				<span style="color:#58a6ff">#</span> {props.children}
			</a>
		</h2>
	)
}
