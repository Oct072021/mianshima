export const useMap = () => {
  const loginStatusMap: { [index: string]: { label: string; type: 'success' | 'danger' } } = {
    成功: { label: '成功', type: 'success' },
    失败: { label: '失败', type: 'danger' },
  }
  const operateStatusMap: { [index: string]: { label: string; type: 'success' | 'danger' } } = {
    登录成功: { label: '登录成功', type: 'success' },
    登录失败: { label: '登录失败', type: 'danger' },
  }

  const operateLogStatusMap: { [index: number]: { label: string; type: 'success' | 'danger' } } = {
    1: { label: '成功', type: 'success' },
    0: { label: '失败', type: 'danger' },
  }

  return {
    loginStatusMap,
    operateStatusMap,
    operateLogStatusMap,
  }
}
