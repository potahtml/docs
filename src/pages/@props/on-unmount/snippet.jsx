function Component() {
  return (
    <main
      on:unmount={node =>
        console.log(node, 'on Component is about to unmount')
      }
    >
      Content
    </main>
  )
}
