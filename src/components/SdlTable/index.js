/*
 * @Author: Jiaqi
 * @Date: 2020-01-02 15:53:37
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-01-13 14:03:17
 * @desc: table组件
 */
import React, { PureComponent } from 'react';
import {
  Table,
} from 'antd';
import styles from './index.less'

// const DEFAULT_WIDTH = 180;

class SdlTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { columns, defaultWidth } = this.props;
    let _props = {}
    if (this.sdlTable && this.sdlTable.props.dataSource && this.sdlTable.props.dataSource.length && this.sdlTable.props.dataSource.length > 5) {
      _props = {
        className: "sdlTable"
      }
    }
    // 处理表格长度，防止错位
    let _columns = (columns || []).map(col => {
      return {
        render: (text, record) => {
          return text && <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>
        },
        ...col,
        width: col.width || defaultWidth,
      }
    })

    const scrollXWidth = _columns.map(col => col.width).reduce((prev, curr) => prev + curr, 0);
    return (
      <Table
        ref={(table) => { this.sdlTable = table }}
        rowKey={record => record.id || record.ID}
        size="small"
        // className={styles.dataTable}
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
        bordered
        {...this.props}
        defaultWidth={80}
        scroll={{ x: this.props.scroll.x || scrollXWidth, y: this.props.scroll && this.props.scroll.y && this.props.scroll.y }}
        columns={_columns}
        {..._props}
      />
    );
  }
}

SdlTable.defaultProps = {
  defaultWidth: 180
}

export default SdlTable;
