// 格式化数据
export const formatDataSource = (dataSource) => {
  return dataSource.map(item => {
    return {
      key: item.Key,
      title: item.Value,
    }
  })
}