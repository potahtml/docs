import { signal, Show, Head } from 'pota'

function encode(text) {
	return encodeURIComponent(
		text
			.trim()
			.replace(/^#\s+/, '')
			.replace(/\s/g, '-')
			.replace(/\//g, '-')
			.replace(/-+/g, '-'),
	)
}

export function H2(props) {
	const [URL, setURL] = signal('')
	const [description, setDescription] = signal('')

	return (
		<>
			<h2 id={URL}>
				<a
					href={() => '#' + URL()}
					onMount={element => setURL(encode(element.textContent))}
				>
					{props.title}
				</a>
			</h2>
			<Show when={props.children}>
				<p onMount={element => setDescription(element.textContent)}>
					{props.children}
				</p>
			</Show>

			<Show when={props['no-meta'] === undefined}>
				<Head>
					<link
						rel="canonical"
						href={window.location.href}
					/>
					<title>{props.title} - pota</title>
					<meta
						name="description"
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
		<h3 id={URL}>
			<a
				href={() => '#' + URL()}
				onMount={element => {
					setURL(encode(element.textContent))
				}}
			>
				<span style="color:#58a6ff">#</span> {props.children}
			</a>
		</h3>
	)
}
