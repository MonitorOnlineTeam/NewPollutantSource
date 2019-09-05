// 获取附件列表数据
export function getAttachmentDataSource(value) {
  const fileInfo = value ? value.split(';') : [];
  return fileInfo.map(item => {
    const itemList = item.split('|');
    return {
      name: itemList[0],
      attach: `${itemList.pop()}${itemList[0]}`
    }
  })
}