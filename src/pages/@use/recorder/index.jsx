import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="recorder">
				<mark>pota/use/recorder</mark> records audio (or audio +
				video) from the default input devices. Designed for
				chat-style voice / video messages: <mark>start()</mark>{' '}
				requests permission and begins,{' '}
				<mark>await stop()</mark> finalizes and returns a{' '}
				<mark>Blob</mark> ready to upload,{' '}
				<mark>cancel()</mark> discards. <mark>pause()</mark> /{' '}
				<mark>resume()</mark> when the browser supports them on
				<mark> MediaRecorder</mark>.
			</Header>

			<p>
				The mic / camera are released as soon as recording
				stops, is cancelled, or the surrounding scope is
				disposed — so the browser indicator turns off promptly
				even on early unmount.
			</p>

			<Section title="Shape">
				<Code
					code={`import { recorder } from 'pota/use/recorder'

const r = recorder({
  audio: true,
  video: false,
  // mimeType: 'audio/webm;codecs=opus',  // override auto-picked codec
  // maxDuration: 60_000,                  // auto-stop after 60s of active recording
})

await r.start()           // throws on permission deny / no device
// ...
const blob = await r.stop()    // Blob, ready to upload
// r.cancel()                  // discard instead

// reactive UI bindings
effect(() => {
  meterEl.style.transform = \`scaleX(\${r.amplitude()})\`
  durationEl.textContent = (r.duration() / 1000).toFixed(1) + 's'
})`}
					render={false}
				/>
			</Section>

			<Section title="Options">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>type</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>audio?</td>
							<td>
								boolean | MediaTrackConstraints
							</td>
							<td>
								capture audio (default <mark>true</mark>).
								Pass a constraints object (
								<mark>{`{ echoCancellation: true }`}</mark>
								) to refine.
							</td>
						</tr>
						<tr>
							<td>video?</td>
							<td>
								boolean | MediaTrackConstraints
							</td>
							<td>
								capture video (default <mark>false</mark>).
							</td>
						</tr>
						<tr>
							<td>mimeType?</td>
							<td>string</td>
							<td>
								override the auto-picked codec. Must pass{' '}
								<mark>MediaRecorder.isTypeSupported</mark>.
								Auto-picked from a prioritized list (
								<mark>webm/opus</mark> → <mark>webm</mark>{' '}
								→ <mark>mp4</mark> for audio; vp9 / vp8 /
								webm / mp4 for video).
							</td>
						</tr>
						<tr>
							<td>maxDuration?</td>
							<td>number (ms)</td>
							<td>
								auto-stop after this many ms of{' '}
								<em>active</em> recording (paused time
								doesn't count). The pending{' '}
								<mark>stop()</mark> promise (if any)
								resolves with the captured blob.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Reactive state">
				<p>
					The controller exposes signal readers for live
					feedback:
				</p>
				<ul>
					<li>
						<mark>recording()</mark> — <mark>boolean</mark>
					</li>
					<li>
						<mark>paused()</mark> — <mark>boolean</mark>
					</li>
					<li>
						<mark>duration()</mark> — active-recording time
						in ms; frozen while paused
					</li>
					<li>
						<mark>amplitude()</mark> — live mic level (RMS in{' '}
						<mark>0..1</mark>) for waveforms / pulsing dots
					</li>
					<li>
						<mark>permission()</mark> —{' '}
						<mark>'granted' | 'denied' | 'prompt' | 'unsupported'</mark>
					</li>
				</ul>
			</Section>

			<Section title="Errors">
				<p>
					<mark>start()</mark> rejects when permission is
					denied or no compatible device exists — wrap in{' '}
					<mark>try</mark> / <mark>catch</mark> to surface the
					reason to the user. The <mark>permission()</mark>{' '}
					signal reflects the live state from the Permissions
					API where supported.
				</p>
			</Section>
		</>
	)
}
