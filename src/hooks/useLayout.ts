import { useLayoutEffect, useState } from "react"

interface Size {
  width: number
  height: number
}
export default function useLayout<T extends Element>(ref: React.RefObject<T>) {
  const [contentBoxSize, setContentBoxSize] = useState<Size>()
  const [borderBoxSize, setBorderBoxSize] = useState<Size>()

  useLayoutEffect(() => {
    if (!ref.current) return
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { contentBoxSize, borderBoxSize } = entry
        const cb = contentBoxSize[0]
        const bb = borderBoxSize[0]

        if (cb) setContentBoxSize({ height: cb.blockSize, width: cb.inlineSize})
        if (bb) setBorderBoxSize({ height: bb.blockSize, width: bb.inlineSize})
      }
    })

    resizeObserver.observe(ref.current)
    return () => resizeObserver.disconnect()
  }, [ref])

  return { contentBoxSize, borderBoxSize }
}