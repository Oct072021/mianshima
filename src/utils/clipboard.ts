import Clipboard from 'clipboard'
import { ElMessage } from 'element-plus'

export default function handleClipboard(text: string, e: HTMLElement) {
  const clipboard = new Clipboard(e, {
    text: () => text,
  })
  clipboard.on('success', () => {
    ElMessage({
      message: 'Copy successfully',
      type: 'success',
    })
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    ElMessage({
      message: 'Copy successfully',
      type: 'error',
    })
    clipboard.destroy()
  })
  e.click()
}
