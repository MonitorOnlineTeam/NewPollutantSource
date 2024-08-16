import { Table } from 'antd';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import React, { useEffect, useRef, useState } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import SdlTable from '@/components/SdlTable'
import { useTablePipeline, features, BaseTable } from 'ali-react-table'
import {
  buildDrillTree,
  buildRecordMatrix,
  convertDrillTreeToCrossTree,
  CrossTable,
  DrillNode,
} from 'ali-react-table/pivot'
import 'antd/dist/antd.css';

const VirtualTable = (props) => {

  const { dataSource, columns } = props
  console.log(dataSource, columns, 122222)

  function transformArray(arr,key) {
    return arr.reduce((acc, curr) => {
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
          title:curr[key],
          children: []
        });
      }
  
      return acc;
    }, []);
}

  const transformed = transformArray(dataSource,'year');
  let lastTop = 0
  const rectMap = new Map()
  transformed.forEach((d,index) => {
    
    rectMap.set(d.year, {
      left: 0,
      right: 1,
      top: lastTop,
      bottom: lastTop +  (d.children?.length + 1),
    })
    lastTop += ( d.children?.length + 1)
  })
  console.log(rectMap)
  return dataSource.length > 0 ? <BaseTable defaultColumnWidth={100}  stickyTop={4} dataSource={dataSource} 
  columns={[
    {
      title: '年度',
      code: 'year',
      key: 'year',
      width: 80,
      lock: true,
      getSpanRect(value) {
        console.log(value)
        return rectMap.get(value)
      },
    },
      ...columns]} 
  
  /> : null
};


export default VirtualTable;
