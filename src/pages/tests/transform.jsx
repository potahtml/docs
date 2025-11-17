import { render } from 'pota'

const style = { style: '3', something: { value: 1 + 1 } }
const spread1 = (
	<div
		style="1"
		{...style}
		style="2"
		prop:not-identifier={/* @static */ ' '.trim()}
	/>
)
const spread2 = <div {...style} />
const spread3 = (
	<div
		{...style}
		{...{ ...style, ...style2 }}
		style="2"
		nada:nada="test"
	/>
)
const spread4 = <div {...{ ...style, ...style2 }} />

function Counter() {
	const a = 50
	const b = 60
	const c = 70

	return (
		<div
			style={{
				'padding-left': `clamp(${a}px, ${b}px, ${c}px)`,
				'padding-right': 'clamp(10px, 20px, 30px)',
				'padding-top': 'calc(12*6px)',
			}}
			style2={`clamp(${a}px, ${b}px, ${c}px)`}
		>
			<p>abc</p> {`clamp(${a}px, ${b}px, ${c}px)`}
		</div>
	)
}

const lala2 = 2

const component = (
	<div>
		<Counter />
		<div
			prop:not-identifier={/* @static  */ ' '.trim()}
			data-undefined={undefined}
			data-null={null}
			data-true={true}
			data-false={false}
			data-void={void 0}
			data-a0={0}
			data-aminus1={-1}
			data-adecimal1={0.00003}
			data-adecimal10={1 + 1}
			data-abigint1={1n}
			data-empty={''}
			data-emptytemplate={`aloja from template`}
			data-emptytemplatefn={html` ${lala}`}
			data-emptytemplatefsn={` ${lala}`}
			data-emptytemplatefsn1={` ${lala2}`}
			data-emptywithfuction={' '.trim()}
			data-call={fn()}
			on:click={() => {}}
			children="wth"
			class:mitrocondria={true}
			class={false}
			class={true}
			class={'opa'}
			class={'opa opa'}
			style={'border:0'}
			style={'border:3'}
			style:border={'0px'}
			style:background="0px"
			use:ref={function hola(node) {}}
			use:connected={function connected(node) {}}
			use:disconnected={function disconnected(node) {}}
			use:css={'class {color:red}'}
		/>
		<div>undefined - {undefined}</div>
		<div>null - {null}</div>
		<div>true - {true}</div>
		<div>false - {false}</div>
		<div>void 0 - {void 0}</div>
		<div>0 - {0}</div>
		<div>-10 - {-10}</div>
		<div>0.0222 - {0.0222}</div>
		<div>1+1 - {1 + 1}</div>
		<div>1n - {1n}</div>
		<div>'' - {''}</div>
		<div>'' - {`aloja from template`}</div>
		<div>'' - {`aloja ${hotaloja} template`}</div>
		<div>'' - {``}</div>
		<div>' '.trim() - {' '.trim()}</div>
		<div>fn() - {fn()}</div>
		<div>
			() => {} - {() => {}}
		</div>
		<div>`asdasd` - {`asdasd`}</div>
		<div
			children={1}
			use:ref={[fn1, fn2]}
			use:ref={fn1}
			on:click={[fn1, fn2]}
			use:bind={[fn1, fn2]}
			use:connected={[fn1, fn2]}
			use:disconnected={[fn1, fn2]}
		/>

		<tm-textarea>
			<iframe
				loading="lazy"
				style={{ bla: !!2, something: { value: 1 + 1 } }}
			/>

			<kilo:svg
				xmlns:kilo="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<kilo:path d="M10 10.5h1.5v3H10zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 15H6v-4.5H4.5V9h3v6zm5.5-1c0 .55-.45 1-1 1H9.5c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1H12c.55 0 1 .45 1 1v4zm6.5 1h-1.75L16 12.75V15h-1.5V9H16v2.25L17.75 9h1.75l-2.25 3 2.25 3z" />
			</kilo:svg>
		</tm-textarea>
	</div>
)

render(component)
