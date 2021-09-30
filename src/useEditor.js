// TODO: revert back when PR is approved:
// https://github.com/biwascheme/biwascheme/pull/269
// import BiwaScheme from 'biwascheme'
import BiwaScheme from '../biwascheme'

import * as monaco from 'monaco-editor'
import { useState, useEffect } from 'preact/hooks'

export default (elementId, initialCode, initialLanguage) => {
  const [editor, setEditor] = useState(null)
  const [language, setLanguage] = useState(initialLanguage)
  const [result, setResult] = useState('Hint: use (⌘ + ↵) to run')

  const changeLanguage = ({ target }) => {
    setLanguage(target.value)
    localStorage.setItem('language', target.value)
    editor.getModel().updateOptions({ language: target.value })
    editor.getModel().setValue(localStorage.getItem(`code.${target.value}`) || '')
  }

  const run = (lang) => () => {
    try {
      localStorage.setItem(`code.${lang}`, editor.getValue())

      if (lang === 'javascript') {
        setResult(JSON.stringify(eval(editor.getValue()), null, 2))
      }

      if (lang === 'scheme') {
        (new BiwaScheme.Interpreter()).evaluate(editor.getValue(), (res) => {
          setResult(res.inspect ? res.inspect() : res, null, 2)
        })
      }
    } catch (e) {
      setResult(`Error: ${e.message}`)
    }
  }

  useEffect(() => {
    if (!editor) {
      setEditor(
        monaco.editor.create(document.getElementById(elementId), {
          fontSize: 18,
          theme: 'vs-dark',
          value: initialCode,
          automaticLayout: true,
          rulers: [80, 100, 120],
          language: initialLanguage,
          minimap: { enabled: false },
          renderLineHighlight: 'gutter',
        })
      )
    } else {
      editor.getModel().updateOptions({ tabSize: 2 })
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, run(language))
    }
  }, [editor, language])

  return {
    run,
    editor,
    result,
    language,
    changeLanguage,
  }
}
