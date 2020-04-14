/*
 * @Author: Jiaqi
 * @Date: 2020-01-02 15:53:37
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-02-19 18:42:52
 * @desc: table组件
 */
import React, { PureComponent } from 'react';
import {
  Table,
} from 'antd';
import styles from './index.less'
import { Resizable } from 'react-resizable';
import { connect } from 'dva'

// const DEFAULT_WIDTH = 180;


const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

@connect(({ global }) => ({
  clientHeight: global.clientHeight,
}))
class SdlTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      _props: {},
      columns: props.columns,
      computeHeight: null,
    };

    this.components = {
      header: {
        cell: ResizeableTitle,
      },
    };
  }

  getOffsetTop = (obj) => {
    let offsetCountTop = obj.offsetTop;
    let parent = obj.offsetParent;
    while (parent !== null) {
      offsetCountTop += parent.offsetTop;
      parent = parent.offsetParent;
    }
    return offsetCountTop;
  }

  componentDidMount() {
    // 动态计算表格纵向位置
    setTimeout(() => {
      // let fr=this.refs.polytableframe;
      if (!this._calledComponentWillUnmount) {
        // let otherHeight = this.props.pagination ? 136 : 100;
        this.setState({
          computeHeight: (this.sdlTableFrame && this.getOffsetTop(this.sdlTableFrame) || 0) + 140
        }, () => {
          console.log("computeHeight=", this.state.computeHeight)
        });
      }
    }, 50);
  }


  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width || defaultWidth,
      };
      return { columns: nextColumns };
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSource !== nextProps.dataSource) {
      let _props = {};
      if (nextProps.dataSource && nextProps.dataSource.length > 4 && !nextProps.className) {
        _props.className = "sdlTable"
      }
      this.setState({
        _props
      })
    }
    if (this.props.columns !== nextProps.columns) {
      this.setState({
        columns: nextProps.columns
      })
    }
  }

  render() {
    const { defaultWidth, resizable, clientHeight } = this.props;
    const { _props, columns } = this.state;

    let fixedHeight = this.state.computeHeight;
    let scrollYHeight = (this.props.scroll && this.props.scroll.y) ? this.props.scroll.y : (fixedHeight ? clientHeight - fixedHeight : "");
    // 处理表格长度，防止错位
    let _columns = (columns || []).map((col, index) => {
      return {
        render: (text, record) => {
          return text && <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>
        },
        ...col,
        width: col.width || defaultWidth,
        onHeaderCell: column => ({
          width: column.width,
          onResize: resizable ? this.handleResize(index) : undefined,
        })
      }
    })

    const scrollXWidth = _columns.map(col => col.width).reduce((prev, curr) => prev + curr, 0);
    return (
      <div ref={el => this.sdlTableFrame = el}>
        <Table
          ref={(table) => { this.sdlTable = table }}
          rowKey={record => record.id || record.ID}
          size="small"
          components={resizable ? this.components : undefined}
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
          scroll={{ x: this.props.scroll && this.props.scroll.x && this.props.scroll.x || scrollXWidth, y: scrollYHeight }}
          columns={_columns}
          pagination={{ pageSize: 20 }}
          {..._props}
        />
      </div>
    );
  }
}

SdlTable.defaultProps = {
  defaultWidth: 180,
  resizable: false
}

export default SdlTable;
