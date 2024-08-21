//虚列表格合并行  数据转换
export function virtualTransMergeMap(tableList, key){
   
    const mergeArray = tableList?.[0] && tableList.reduce((acc, curr) => {
      // 查找具有相同 key 的现有对象
      const existingObj = acc.find(obj => obj[key] === curr[key]);
  
      if (existingObj) {
        // 如果找到了相同的属性，将当前对象添加到 children 数组中
        existingObj.children = existingObj.children || [];
        existingObj.children.push(curr);
      } else {
        // 如果没有找到相同的 key，则创建一个新的对象，并将其添加到结果数组中
        // 注意这里我们不将当前对象添加到 children 数组中
        acc.push({
          ...curr,
          title: curr[key],
          children: []
        });
      }
  
      return acc;
    }, []);
    let lastTop = 0
    const rectMap = new Map()
    mergeArray?.[0] && mergeArray.forEach((d, index) => {
      rectMap.set(d.year, {
        left: 0,
        right: 1,
        top: lastTop,
        bottom: lastTop + (d.children?.length + 1),
      })
      lastTop += (d.children?.length + 1)
    })
    return rectMap;
  }