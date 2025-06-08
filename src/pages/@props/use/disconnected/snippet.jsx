function Component() {
  return (
    <main
      use:disconnected={node => {
        console.log(node, 'on Component is about to unmount')
      }}
    >
      Content
    </main>
  )
}
