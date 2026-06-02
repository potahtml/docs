import { accent } from './theme.js'
import { logoDataURI } from './logo.js'

// The header logo: an <img> whose source is the accent-tinted logo,
// rebuilt reactively whenever the active accent changes (theme toggle,
// custom seed). Same data-URI the favicon uses — see ./logo.js.
export function Logo(props) {
	const size = props.size ?? 24
	return (
		<img
			alt="pota"
			width={size}
			height={size}
			src={() => logoDataURI(accent.read(), size)}
		/>
	)
}
