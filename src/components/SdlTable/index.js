import React, { PureComponent } from 'react';
import {
  Table
} from 'antd';
import styles from './index.less'

const DEFAULT_WIDTH = 180;

class SdlTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { columns } = this.props;
    // 处理表格长度，防止错位
    let _columns = (columns || []).map(col => {
      return {
        ...col,
        width: col.width || DEFAULT_WIDTH,
        render: (text, record) => {
          return text && <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>
        }
      }
    })
    
    let scrollXWidth = _columns.map(col => col.width).reduce((prev, curr) => prev + curr, 0);
    return (
      <Table
        rowKey={record => record.id || record.ID}
        size="middle"
        className={styles.dataTable}
        scroll={{ x: scrollXWidth }}
        rowClassName={
          (record, index, indent) => {
            if (index === 0) {
              return;
            }
            if (index % 2 !== 0) {
              return 'light';
            }
          }
        }
        {...this.props}
        columns={_columns}
      />
    );
  }
}

export default SdlTable;