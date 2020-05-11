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
import $ from 'jquery'

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

@connect(({ global, loading }) => ({
  clientHeight: global.clientHeight,
  autoFormTableLoading: loading.effects['autoForm/getPageConfig'],
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
        // let otherHeight = this.props.pagination ? 136 : 96;
        this.setState({
          computeHeight: (this.sdlTableFrame && this.getOffsetTop(this.sdlTableFrame) || 0) + 110
        }, () => {
          // console.log("computeHeight=", this.state.computeHeight)
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

  getInitialColWidth = (col) => {
    const title = col.title;
    if (col.title.constructor === String) {
      if (title.indexOf('时间') != -1) {
        return col.width || 160;
      } else if (title.indexOf('状态') != -1) {
        return col.width || 150;
      } else if (title.indexOf('类型') != -1 || title.indexOf('风向') != -1 || title.indexOf('温度') != -1 || title.indexOf('风速') != -1 || title.indexOf('湿度') != -1 || title.indexOf('次数') != -1) {
        return 80;
      } else if (title == '行政区') {
        return col.width || 200;
      } else if (title == '企业名称') {
        return col.width || 240;
      } else if (title == 'AQI') {
        return 60;
      } else {
        return col.width || this.props.defaultWidth;
      }
    } else {
      return col.width || this.props.defaultWidth;
    }

  }

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

    if (this.props.loading !== nextProps.loading && nextProps.loading === false) {
      this.setState({
        computeHeight: (this.sdlTableFrame && this.getOffsetTop(this.sdlTableFrame) || 0) + 110
      }, () => {
      });
    }

    if (this.props.autoFormTableLoading !== nextProps.autoFormTableLoading && nextProps.autoFormTableLoading === false) {
      this.setState({
        computeHeight: (this.sdlTableFrame && this.getOffsetTop(this.sdlTableFrame) || 0) + 110
      }, () => {
      });
    }
  }

  render() {
    const { defaultWidth, resizable, clientHeight, pagination } = this.props;
    const { _props, columns } = this.state;

    let fixedHeight = this.state.computeHeight;
    let scrollYHeight = (this.props.scroll && this.props.scroll.y) ? this.props.scroll.y : (fixedHeight ? clientHeight - fixedHeight : "");
    // 没有分页高度 + 40
    let scrollY = pagination === false ? scrollYHeight + 40 : scrollYHeight;
    // 处理表格长度，防止错位
    let _columns = (columns || []).map((col, index) => {
      return {
        render: (text, record) => {
          return text && <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {text}
          </div>
        },
        ...col,
        width: this.getInitialColWidth(col),
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
          id="sdlTable"
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
          pagination={{ pageSize: 20 }}
          {...this.props}
          defaultWidth={80}
          scroll={{ x: this.props.scroll && this.props.scroll.x && this.props.scroll.x || scrollXWidth, y: scrollY }}
          columns={_columns}
          {..._props}
        />
      </div>
    );
  }
}

SdlTable.defaultProps = {
  defaultWidth: 130,
  resizable: false
}

export default SdlTable;
