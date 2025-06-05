function Component() {
  return (
    <main
      connected={node => console.log(node, 'on Component mounted')}
    >
      Content
    </main>
  )
}
