/**
 * 功  能：表格穿梭框
 * 创建人：jab
 * 创建时间：2023.5.8
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Switch, Table, Tag, Transfer } from 'antd';
import { connect } from "dva";
import difference from 'lodash/difference';
import SdlTable from '@/components/SdlTable';


const Index = (props) => {


    const TableTransfer = ({ leftColumns, rightColumns,loading,scroll,bordered,pagination, ...restProps }) => (
        <Transfer {...restProps}>
          {({
            direction,
            filteredItems,
            onItemSelectAll,
            onItemSelect,
            selectedKeys: listSelectedKeys,
            disabled: listDisabled,
          }) => {
            const columns = direction === 'left' ? leftColumns : rightColumns;
            const rowSelection = {
              getCheckboxProps: (item) => ({
                disabled: listDisabled || item.disabled,
              }),
              onSelectAll(selected, selectedRows) {
                const treeSelectedKeys = selectedRows
                  .filter((item) => !item.disabled)
                  .map(({ key }) => key);
                const diffKeys = selected
                  ? difference(treeSelectedKeys, listSelectedKeys)
                  : difference(listSelectedKeys, treeSelectedKeys);
                onItemSelectAll(diffKeys, selected);
              },
              onSelect({ key }, selected) {
                onItemSelect(key, selected);
              },
              selectedRowKeys: listSelectedKeys,
            };
            return (
              <SdlTable
                rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredItems}
                style={{
                  pointerEvents: listDisabled ? 'none' : undefined,
                }}
                onRow={({ key, disabled: itemDisabled }) => ({
                  onClick: () => {
                    if (itemDisabled || listDisabled) return;
                    onItemSelect(key, !listSelectedKeys.includes(key));
                  },
                })}
                loading={loading}
                scroll={scroll}
                bordered={bordered}
                pagination={pagination}
              />
            );
          }}
        </Transfer>
      );


  return <TableTransfer {...props}/>
};

export default Index;


