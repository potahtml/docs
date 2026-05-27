import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="stream">
				<mark>pota/use/stream</mark> bundles the small{' '}
				<mark>MediaStream</mark> / <mark>MediaStreamTrack</mark>{' '}
				ergonomic helpers you reach for when wiring up cameras,
				microphones, or screen capture — copying tracks between
				streams and stopping things cleanly.
			</Header>

			<Section title="Track copying">
				<p>
					<mark>copyAudioTracks(src, dst)</mark> replaces the
					destination's audio tracks with clones of the
					source's. <mark>copyVideoTracks(src, dst)</mark> does
					the same for video. The destination's existing tracks
					of that kind are removed first, so calling the helper
					twice doesn't accumulate tracks.
				</p>
				<Code
					code={`import { copyAudioTracks } from 'pota/use/stream'

const mic = await navigator.mediaDevices.getUserMedia({ audio: true })
copyAudioTracks(mic, recorder.stream)`}
					render={false}
				/>
			</Section>

			<Section title="Track removal">
				<p>
					<mark>removeAudioTracks(stream)</mark> /{' '}
					<mark>removeVideoTracks(stream)</mark> remove tracks
					from a stream without stopping the underlying
					capture. Pair with <mark>copy*</mark> to swap a
					device live.
				</p>
			</Section>

			<Section title="Stopping">
				<p>
					<mark>stopTrack(track)</mark> calls{' '}
					<mark>track.stop()</mark>.{' '}
					<mark>stopTracks(stream)</mark> stops every audio
					and video track on a <mark>MediaStream</mark>.{' '}
					<mark>stopStream(streamOrRecorder)</mark> is the
					polymorphic form — accepts a <mark>MediaStream</mark>{' '}
					(stops its tracks) or a <mark>MediaRecorder</mark>{' '}
					(calls <mark>recorder.stop()</mark>). Useful as a
					single teardown call in a <mark>cleanup</mark>.
				</p>
				<Code
					code={`import { stopStream } from 'pota/use/stream'
import { cleanup } from 'pota'

const stream = await navigator.mediaDevices.getUserMedia({ video: true })
cleanup(() => stopStream(stream))`}
					render={false}
				/>
			</Section>
		</>
	)
}
