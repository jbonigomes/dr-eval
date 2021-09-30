export default () => {
  const initialWidth = localStorage.getItem('width') || '70%'
  const initialLanguage = localStorage.getItem('language') || 'javascript'
  const initialCode = localStorage.getItem(`code.${initialLanguage}`) || ''

  return {
    initialCode,
    initialWidth,
    initialLanguage,
  }
}
