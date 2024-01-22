function Component() {
  return (
    <main onMount={node => console.log(node, 'on Component mounted')}>
      Content
    </main>
  )
}
