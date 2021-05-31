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

// 转换base64
export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
