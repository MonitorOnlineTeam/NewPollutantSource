/*
 * @Author: outman0611
 * @Date: 2024-08-13 16:23:56
 * @LastEditors: outman0611
 * @LastEditTime: 2024-08-28 18:52:35
 */
import {  BaseTable,useTablePipeline } from 'ali-react-table'
import { Spin,Empty } from 'antd'
import React, { useState, useEffect } from 'react';
import styles from './style.less'





const AntEmptyContent = React.memo(() => ( <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>))

function AntLoadingContentWrapper({ children, visible }) {
  return (
    <div className="ant-loading-content-wrapper" style={{ opacity: visible ? 0.6 : undefined }}>
      {children}
    </div>
  )
}

function BlockSpin() {
  return <Spin style={{ display: 'block' }} />
}

const VirtualTable = (props) => {


 
  const pipeline = useTablePipeline();

  if(props.dataSource?.[0]){
    pipeline.input({dataSource:props.dataSource, columns:props.columns })
    // pipeline.primaryKey('id')
    // 自定义数据处理逻辑: 白灰相间的背景色
    pipeline.appendRowPropsGetter((row, rowIndex) => {
      const color = rowIndex % 2 === 0 ? '#fff' : '#f0f2f5'
      return {
        style: { '--bgcolor': color },
      }
    })
  }

  return <div className={styles[props.className]}>
   <BaseTable
    stickyTop={6}
    defaultColumnWidth={100}
    {...props}
    isLoading={props.loading}
    useVirtual={ { horizontal:  props.useVirtual?.horizontal || true, vertical:  props.useVirtual?.horizontal || true,}}
    className={styles.virtualTableWrapper}
    components={{
      EmptyContent: AntEmptyContent,
      LoadingContentWrapper: AntLoadingContentWrapper,
      LoadingIcon: BlockSpin,
      ...props.components,
    }}
    {...pipeline.getProps()} 
  />
  </div>
}
export default  VirtualTable  