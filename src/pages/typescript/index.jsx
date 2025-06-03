import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<form>
			<Header title="TypeScript">
				<p>
					Some TypeScript examples and documentation. Please keep in
					mind that typings are a work in progress.
				</p>
			</Header>

			<Section title="Typing Props">
				<p>
					<tm-textarea
						grammar="tsx"
						theme="monokai"
						value={`
type Props = {
	name?: string
}

export function LoginMessage({ name = "Quack" }: Props) {
	return <p>Hi {name}</p>
}
						`.trim()}
						prop:editable={false}
					/>
				</p>
			</Section>

			<Section title="Spread">
				<p>
					<tm-textarea
						grammar="tsx"
						theme="monokai"
						value={`

import type { JSX } from 'pota'

type ButtonProps = JSX.IntrinsicElements['button']

function Button({ ...all }: ButtonProps) {
	return <button {...all} />
}
						`.trim()}
						prop:editable={false}
					/>
				</p>
			</Section>

			<Section title="Component With Children">
				<p>
					<tm-textarea
						grammar="tsx"
						theme="monokai"
						value={`

import type { JSX } from 'pota'

type WithChildren<T = {}> = T & { children?: JSX.Element }

type CardProps = {
	title: string
} & WithChildren

function Card({ title, children }: CardProps) {
	return (
		<section class="cards">
			<h2>{title}</h2>
			{children}
		</section>
	)
}
						`.trim()}
						prop:editable={false}
					/>
				</p>
			</Section>

			<Section title="Disallowing a prop">
				<p>
					<tm-textarea
						grammar="tsx"
						theme="monokai"
						value={`

import type { JSX } from 'pota'

type ButtonProps = Omit<JSX.IntrinsicElements['button'], 'type'>

function Button({ ...all }: ButtonProps) {
	return (
		<button
			type="button"
			{...all}
		/>
	)
}

// 💥 Type error, ´type´ is disallowed

export function Component() {
	return <Button type="button">Hi</Button>
}
						`.trim()}
						prop:editable={false}
					/>
				</p>
			</Section>

			<Section title="Making a prop required">
				<p>
					<tm-textarea
						grammar="tsx"
						theme="monokai"
						value={`

import type { JSX } from 'pota'

type MakeRequired<T, K extends keyof T> = Omit<T, K> &
	Required<{ [P in K]: T[P] }>

type ImgProps = MakeRequired<
	JSX.IntrinsicElements['img'],
	'alt' | 'src'
>

export function Img({ alt, ...all }: ImgProps) {
	return (
		<img
			alt={alt}
			{...all}
		/>
	)
}

// 💥 Type error, alt is missing

export function Component() {
	return <Img src="..." />
}
						`.trim()}
						prop:editable={false}
					/>
				</p>
			</Section>

			<Section title="Custom Element">
				<p>
					<tm-textarea
						grammar="tsx"
						theme="monokai"
						value={`

import type { JSX } from 'pota'

import { signal } from 'pota'

interface SomeElement {
	'some-string'?: string
	'some-number'?: number
	'some-other'?: number
}

declare module 'pota' {
	namespace JSX {
		interface IntrinsicElements {
			'some-element': HTMLAttributes<
				HTMLElement,
				SomeElement,
				HTMLEvents<HTMLElement>
			>
		}
	}
}

const [read, write] = signal('quack')

function Test() {
	return (
		<some-element
			some-string="quack"
			some-number={1}
			some-other={read()}
		/>
	)
}


						`.trim()}
						prop:editable={false}
					/>
				</p>
			</Section>
		</form>
	)
}
