import { useState } from 'preact/hooks'

export default (initialWidth) => {
  const [width, setWidth] = useState(initialWidth)
  const [isDragging, setIsDragging] = useState(false)

  const dragFn = ({ clientX }) => {
    const _width = clientX * 100 / document.body.clientWidth

    if (_width < 95 && _width > 10) {
      setWidth(`${_width}%`)
      localStorage.setItem('width', `${_width}%`)
    }
  }

  const drag = () => {
    setIsDragging(true)
    document.addEventListener('mousemove', dragFn)
    document.addEventListener('mouseup', () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', dragFn)
    })
  }

  return {
    drag,
    width,
    isDragging,
  }
}
