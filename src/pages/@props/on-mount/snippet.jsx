function Component() {
  return (
    <main
      on:mount={node => console.log(node, 'on Component mounted')}
    >
      Content
    </main>
  )
}
