function Component() {
  return (
    <main
      use:connected={node => console.log(node, 'on Component mounted')}
    >
      Content
    </main>
  )
}
