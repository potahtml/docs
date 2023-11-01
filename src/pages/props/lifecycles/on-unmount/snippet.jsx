function Component() {
  return (
    <main
      onUnmount={node =>
        console.log(node, 'on Component is about to unmount')
      }
    >
      Content
    </main>
  )
}
