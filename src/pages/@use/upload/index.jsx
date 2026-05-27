import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="upload">
				<mark>pota/use/upload</mark> ships an imperative file
				upload primitive plus two ref factories. Same upload
				pipeline (with progress, optional content-addressed
				dedup, cancellation) regardless of how the files arrive.
			</Header>

			<Section title="Exports">
				<Code
					code={`import {
  uploadFile,   // imperative: (file, options) → Promise<UploadResult>
  upload,       // ref factory for <input type="file">
  dropzone,     // ref factory for a drop target
} from 'pota/use/upload'`}
					render={false}
				/>
			</Section>

			<Section title="uploadFile — the primitive">
				<p>
					POSTs the file via <mark>XMLHttpRequest</mark> so
					progress is observable (<mark>fetch</mark> doesn't
					expose upload progress cross-browser). When{' '}
					<mark>existsUrl</mark> is provided, the file's
					SHA-1 hash is computed and a <mark>HEAD</mark> is
					issued against{' '}
					<mark>existsUrl(hash, file)</mark> first — a 2xx
					skips the upload and returns the cached URL. Pass
					an <mark>AbortSignal</mark> to cancel.
				</p>
				<Code
					code={`import { uploadFile } from 'pota/use/upload'

const { url, file, hash } = await uploadFile(file, {
  endpoint: '/api/upload',
  existsUrl: hash => '/cdn/' + hash,           // optional content-addressed dedup
  field: 'file',                                // form field name (default 'file')
  parseResponse: (text, xhr) => text,           // extract URL from response (default identity)
  onProgress: ({ file, loaded, total }) => {},
  signal: controller.signal,
})`}
					render={false}
				/>
			</Section>

			<Section title="upload — ref factory for file inputs">
				<p>
					Attaches to <mark>{`<input type="file">`}</mark>{' '}
					and uploads its selection on every{' '}
					<mark>change</mark>. After upload the input is
					cleared so re-selecting the same file fires{' '}
					<mark>change</mark> again — opt out with{' '}
					<mark>clearOnUpload: false</mark>. In-flight uploads
					abort when the surrounding scope disposes.
				</p>
				<Code
					code={`import { upload } from 'pota/use/upload'

<input
  type="file"
  multiple
  use:ref={upload({
    endpoint: '/api/upload',
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024,
    onUpload: results => attachAll(results),   // fires once with all successes
    onFile:   r => console.log('done', r.url), // per-file
    onError:  (err, file) => toast.error(file.name + ': ' + err.message),
    onReject: (file, reason) => toast.warn(file.name + ' rejected (' + reason + ')'),
  })}
/>`}
					render={false}
				/>
			</Section>

			<Section title="dropzone — ref factory for drop targets">
				<p>
					Turns the element into a drop target. Files dropped
					on the element run through the same pipeline as{' '}
					<mark>upload</mark> (filters → upload → callbacks).
					While files are being dragged over, the element
					gets a <mark>data-dragover</mark> attribute — style
					with <mark>[data-dragover]</mark> in CSS. The
					standard <mark>dragenter</mark> /{' '}
					<mark>dragleave</mark> counter pattern is used so
					crossing child elements doesn't strip the attribute
					mid-hover.
				</p>
				<Code
					code={`import { dropzone } from 'pota/use/upload'

<div
  use:ref={dropzone({
    endpoint: '/api/upload',
    accept: 'image/*,application/pdf',
    onUpload: results => /* ... */,
  })}
  class="drop-target"
>
  Drop files here
</div>

/* CSS */
.drop-target[data-dragover] { outline: 2px dashed #0a84ff; }`}
					render={false}
				/>
			</Section>

			<Section title="Filters: accept and maxSize">
				<p>
					<mark>accept</mark> mirrors{' '}
					<mark>{`<input accept>`}</mark>: MIME types (
					<mark>image/png</mark>), wildcard MIME (
					<mark>image/*</mark>), extensions with leading dot
					(<mark>.pdf</mark>), comma-separated lists.{' '}
					<mark>maxSize</mark> is in bytes. Files that don't
					match fire <mark>onReject(file, 'type' | 'size')</mark>{' '}
					and never hit the network.
				</p>
			</Section>
		</>
	)
}
