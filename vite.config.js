import preact from '@preact/preset-vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    preact(),
    monacoEditorPlugin(),
  ],
})
