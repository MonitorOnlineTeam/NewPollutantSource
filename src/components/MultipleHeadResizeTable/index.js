import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
 
const components = {
  header: {
    cell: (props) => {
      const { onResize, width, ...restProps } = props;
      if (!width) {
        return <th {...restProps} />;
      }
      return (
        <Resizable width={width} height={0} onResize={onResize}>
          <th {...restProps} />
        </Resizable>
      );
    },
  },
};
 
function modifyDeepTreeNodeValueFn({ colList, modifyObj, indexes }) {
  let colList_ = colList;
  let tempArr = [...colList_];
 
  function modifyDeepTreeNodeValue(indexes) {
    const indexLen = indexes.length;
    for (let i = 0; i < indexLen; i++) {
      const index_ = indexes[i];
      if (i < indexLen - 1) {
        const targetArr = tempArr[index_];
        if (!targetArr) {
          break;
        }
        tempArr = (tempArr[index_] && tempArr[index_].children) || [];
      } else {
        const target = tempArr[index_];
        if (!target) {
          break;
        }
        tempArr[index_] = {
          ...target,
          ...modifyObj,
        };
      }
    }
  }
 
  if (indexes.length === 1) {
    const index_ = indexes[0];
    colList_[index_] = {
      ...colList_[index_],
      ...modifyObj,
    };
    return colList_;
  }
 
  modifyDeepTreeNodeValue(indexes);
  return colList_;
}
 
export default function ResizeTable(props) {
  const [selfColumns, setSelfColumns] = useState([]);
  const { columns } = props;
 
  useEffect(() => {
    setSelfColumns([...columns]);
  }, [columns]);
 
  const handleResize = (indexes) => {
    return (e, d) => {
      const { width } = d.size;
      const nextColumns = modifyDeepTreeNodeValueFn({
        colList: selfColumns,
        modifyObj: { width },
        indexes,
      });
      setSelfColumns([...nextColumns]);
    };
  };
  const setColumnsResizeable = (cols, indexes = []) => {
    return [...cols].map((colItem, index) => {
      const { children, width } = colItem;
      const currentIndexes = [...indexes, index];
      const children_ = Array.isArray(children)
        ? setColumnsResizeable(children, currentIndexes)
        : null;
      return {
        ...colItem,
        onHeaderCell: () => ({
          width,
          onResize: handleResize(currentIndexes),
        }),
        children: children_,
        indexes: currentIndexes,
      };
    });
  };
  const columns_ = setColumnsResizeable(selfColumns);
  console.log(columns_);
  return <Table {...props} size='middle' columns={columns_} components={components} />;
}
