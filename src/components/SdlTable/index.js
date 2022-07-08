/*
 * @Author: Jiaqi
 * @Date: 2020-01-02 15:53:37
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-10-22 15:47:51
 * @desc: table组件
 */
import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import { connect } from 'dva';
import $ from 'jquery';
import styles from './index.less';

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
      headAndFooterHeight: 110,
      pageSize: 20,
    };

    this.components = {
      header: {
        cell: ResizeableTitle,
      },
    };
  }

  getOffsetTop = obj => {
    let offsetCountTop = obj.offsetTop;
    let parent = obj.offsetParent;
    while (parent !== null) {
      offsetCountTop += parent.offsetTop;
      parent = parent.offsetParent;
    }
    return offsetCountTop;
  };

  componentDidMount() {
    // 动态计算表格纵向位置
    setTimeout(() => {
      // let fr=this.refs.polytableframe;
      if (!this._calledComponentWillUnmount) {
        // let otherHeight = this.props.pagination ? 136 : 96;
        if (this.sdlTableFrame) {
          const tableThead = this.sdlTableFrame.getElementsByClassName('ant-table-thead');
          const tableTheadHeight = tableThead ? tableThead[0].offsetHeight : 0;
          const tableFooter = this.sdlTableFrame.getElementsByClassName('ant-table-footer');
          const tableFooterHeight = tableFooter.length ? tableFooter[0].offsetHeight : 0;
          const count = tableTheadHeight + 65 + tableFooterHeight;
          this.setState({
            headAndFooterHeight: count > 110 ? count : 110,
            computeHeight: this.getOffsetTop(this.sdlTableFrame) || 0,
          });
        }
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

  getInitialColWidth = col => {
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
      return col.width || this.props.defaultWidth;
    }
    if (title.props.children.includes('流量')) {
      return col.width || 130;
    }
    return col.width || this.props.defaultWidth;
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSource !== nextProps.dataSource) {
      const _props = {};
      if (nextProps.dataSource && nextProps.dataSource.length > 4 && !nextProps.className) {
        _props.className = 'sdlTable';
      }
      this.setState({
        _props,
      });
    }
    if (this.props.columns !== nextProps.columns) {
      this.setState({
        columns: nextProps.columns,
      });
    }

    if (this.props.loading !== nextProps.loading && nextProps.loading === false) {
      this.setState(
        {
          computeHeight: (this.sdlTableFrame && this.getOffsetTop(this.sdlTableFrame)) || 0,
        },
        () => { },
      );
    }

    if (
      this.props.autoFormTableLoading !== nextProps.autoFormTableLoading &&
      nextProps.autoFormTableLoading === false
    ) {
      this.setState(
        {
          computeHeight: (this.sdlTableFrame && this.getOffsetTop(this.sdlTableFrame)) || 0,
        },
        () => { },
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.columns !== prevState.columns) {
      const tableThead = this.sdlTableFrame.getElementsByClassName('ant-table-thead');
      const tableTheadHeight = tableThead ? tableThead[0].offsetHeight : 0;
      const tableFooter = this.sdlTableFrame.getElementsByClassName('ant-table-footer');
      const tableFooterHeight = tableFooter.length ? tableFooter[0].offsetHeight : 0;
      const count = tableTheadHeight + 65 + tableFooterHeight;
      this.setState({
        headAndFooterHeight: count > 110 ? count : 110,
      });
    }
  }

  render() {
    const { defaultWidth, resizable, clientHeight, pagination, align } = this.props;
    const { _props, columns, headAndFooterHeight } = this.state;

    const fixedHeight = this.state.computeHeight;
    const scrollYHeight =
      this.props.scroll && this.props.scroll.y
        ? this.props.scroll.y
        : fixedHeight
          ? clientHeight - fixedHeight - headAndFooterHeight
          : '';
    console.log("scrollYHeight=", scrollYHeight)
    // 没有分页高度 + 40
    const scrollY = pagination === false ? scrollYHeight + 40 : scrollYHeight;
    // 处理表格长度，防止错位
    const _columns = (columns || []).map((col, index) => ({
      render: (text, record) =>
      text && <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }} className={col.ellipsis||resizable? 'ant-table-cell-ellipsis' : null}>{text}</div>,
      align: align,
      ...col,
      width: this.getInitialColWidth(col),
      onHeaderCell: column => ({
        width: column.width,
        onResize: resizable ? this.handleResize(index) : undefined,
      }),
    }));

    const scrollXWidth = _columns.map(col => col.width).reduce((prev, curr) => prev + curr, 0);
    return (
      <div ref={el => (this.sdlTableFrame = el)}>
        <Table
          ref={table => {
            this.sdlTable = table;
          }}
          id="sdlTable"
          rowKey={(record, index) => record.id || record.ID || index}
          size="middle"
          components={resizable ? this.components : undefined}
          // className={styles.dataTable}
          rowClassName={(record, index, indent) => {
            if (index === 0) {
              return;
            }
            if (index % 2 !== 0) {
              return 'light';
            }
          }}
          bordered
          pagination={{
            defaultCurrent: 1,
            pageSize: this.state.pageSize,
            // showQuickJumper: true,
            total: this.props.dataSource ? this.props.dataSource.length : 0,
            showSizeChanger: true,
            onShowSizeChange: (current, size) => {
              this.setState({
                pageSize: size
              })
            },
            pageSizeOptions: ['10', '20', '30', '40', '100'],
          }}
          {...this.props}
          defaultWidth={80}
          scroll={{
            x: (this.props.scroll && this.props.scroll.x && this.props.scroll.x) || scrollXWidth,
            y: scrollY,
          }}
          columns={_columns}
          {..._props}
        />
      </div>
    );
  }
}

SdlTable.defaultProps = {
  defaultWidth: 130,
  resizable: false,
  dataSource: [],
}

export default SdlTable;
