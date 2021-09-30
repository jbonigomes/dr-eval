import { render } from 'preact'

import useDrag from './useDrag'
import useEditor from './useEditor'
import useInitialSettings from './useInitialSettings'

const App = () => {
  const {
    initialCode,
    initialWidth,
    initialLanguage,
  } = useInitialSettings()

  const {
    drag,
    width,
    isDragging,
  } = useDrag(initialWidth)

  const {
    run,
    editor,
    result,
    language,
    changeLanguage,
  } = useEditor('monaco', initialCode, initialLanguage)

  return (
    <div className={`flex ${isDragging ? 'selectNone' : ''}`}>
      <div style={{ width: `${width}` }}>
        <div id="monaco"></div>
        <select value={language} onChange={changeLanguage}>
          <option value="javascript">JavaScript</option>
          <option value="scheme">Scheme</option>
        </select>
        <button onClick={run(language)}>
          Run (⌘ + ↵)
        </button>
      </div>
      <div className="handler" onMouseDown={drag}></div>
      <div className="resultLeft">$</div>
      <div className="result">
        <pre>{result}</pre>
      </div>
    </div>
  )
}

render(<App />, document.getElementById('root'))
