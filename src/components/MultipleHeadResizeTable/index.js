import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import SdlTable from '@/components/SdlTable'

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

const  Index = (props) => {
  const [selfColumns, setSelfColumns] = useState([]);
  const { columns } = props;
  useEffect(() => {
    setSelfColumns([...columns]);
  }, [columns]);
  const getInitialColWidth = col => {
    const { title } = col;
    if (col.title.constructor === String) {
      if (title.indexOf('时间') != -1) {
        return col.width || 160;
      }
      if (title.indexOf('状态') != -1) {
        return col.width || 150;
      }
      if (
        title.indexOf('类型') != -1 ||
        title.indexOf('风向') != -1 ||
        title.indexOf('温度') != -1 ||
        title.indexOf('风速') != -1 ||
        title.indexOf('湿度') != -1 ||
        title.indexOf('次数') != -1
      ) {
        return col.width || 80;
      }
      if (title == '行政区') {
        return col.width || 200;
      }
      if (title == '企业名称') {
        return col.width || 240;
      }
      if (title == 'AQI') {
        return 60;
      }
      if (title.indexOf('流量') != -1) {
        return 130;
      }
      return col.width || props.defaultWidth;
    }
    if (title.props.children.includes('流量')) {
      return col.width || 130;
    }
    return col.width || props.defaultWidth;
  };
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
        width: getInitialColWidth(colItem),
        ellipsis: colItem.ellipsis==false? colItem.ellipsis : true,
        onHeaderCell: () => ({
          width:getInitialColWidth(colItem),
          onResize: handleResize(currentIndexes),
        }),
        children: children_,
        indexes: currentIndexes,
      };
    });
  };
  const columns_ = setColumnsResizeable(selfColumns);
  return <Table
    {...props}
    size="middle"
    rowClassName={(record, index, indent) => {
      if (index === 0) {
        return;
      }
      if (index % 2 !== 0) {
        return 'light';
      }
    }} columns={columns_} components={components} />;
}
Index.defaultProps = {
  defaultWidth: 120
}
export default Index