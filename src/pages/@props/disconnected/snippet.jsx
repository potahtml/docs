function Component() {
  return (
    <main
      disconnected={node =>
        console.log(node, 'on Component is about to unmount')
      }
    >
      Content
    </main>
  )
}
