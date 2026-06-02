// Ambient typing for CSS module imports. Makes
// `import styles from './X.module.css'` typecheck under checkJs.
// No per-class autocomplete — keys are an open string map.
declare module '*.module.css' {
	const classes: { readonly [key: string]: string }
	export default classes
}

// plain stylesheets imported for their side effects only.
declare module '*.css' {}
