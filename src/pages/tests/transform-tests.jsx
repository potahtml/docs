import { render } from 'pota'

render(() => (
	<div>
		<div
			data-undefined={undefined}
			data-null={null}
			data-true={true}
			data-false={false}
			data-void={void 0}
			data-a0={0}
			data-aminus1={-1}
			data-adecimal1={0.00003}
			data-abigint1={1n}
			data-empty={''}
			data-emptytemplate={`aloja from template`}
			data-emptytemplatefn={html` ${lala}`}
			data-emptytemplatefsn={` ${lala}`}
			data-emptywithfuction={' '.trim()}
			data-call={trim()}
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
		<div>1n - {1n}</div>
		<div>'' - {''}</div>
		<div>'' - {`aloja from template`}</div>
		<div>'' - {`aloja ${hotaloja} template`}</div>
		<div>'' - {``}</div>
		<div>' '.trim() - {' '.trim()}</div>
		<div>trim() - {trim()}</div>
		<div>
			() => {} - {() => {}}
		</div>
		<div>`asdasd` - {`asdasd`}</div>

		<tm-textarea>
			<iframe loading="lazy" />

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
))
