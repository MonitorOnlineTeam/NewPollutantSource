/*
 * @Author: Jiaqi
 * @Date: 2020-01-02 15:53:37
 * @Last Modified by: JiaQi
 * @Last Modified time: 2025-03-17 16:29:59
 * @desc: table组件
 */
import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import { connect } from 'dva';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
/****拖拽功能**** */
let dragingIndex = -1;

class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />),
    );
  }
}
const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);

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
      columns: props.columns.filter(col => !col?.hidden),
      computeHeight: null,
      headAndFooterHeight: 110,
      pageIndex: 1, 
      pageSize: 20,
      dataSource: [],
    };

    this.components = {
      header: {
        cell: ResizeableTitle,
      },
    };

    this.dragableComponents = {
      //拖拽功能
      body: {
        row: DragableBodyRow,
      },
    };
    this.totalComponents = {
      //拖拽功能&&表头伸缩
      header: {
        cell: ResizeableTitle,
      },
      body: {
        row: DragableBodyRow,
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
    // debugger;
    this.setState(
      {
        computeHeight: (this.sdlTableFrame && this.getOffsetTop(this.sdlTableFrame)) || 0,
      },
      () => {
        // console.log('computeHeight1', this.state.computeHeight)
      },
    );
    // 动态计算表格纵向位置
    setTimeout(() => {
      // let fr=this.refs.polytableframe;
      // if (!this._calledComponentWillUnmount) {
      //   // let otherHeight = this.props.pagination ? 136 : 96;
      //   if (this.sdlTableFrame) {
      //     const tableThead = this.sdlTableFrame.getElementsByClassName('ant-table-thead');
      //     const tableTheadHeight = tableThead ? tableThead[0].offsetHeight : 0;
      //     const tableFooter = this.sdlTableFrame.getElementsByClassName('ant-table-footer');
      //     const tableFooterHeight = tableFooter.length ? tableFooter[0].offsetHeight : 0;
      //     const count = tableTheadHeight + 228 + tableFooterHeight;
      //     // console.log('tableTheadHeight', tableTheadHeight);
      //     // console.log('tableFooterHeight', tableFooterHeight);
      //     this.setState({
      //       headAndFooterHeight: count > 110 ? count : 110,
      //       computeHeight: this.getOffsetTop(this.sdlTableFrame) || 0,
      //     });
      //   }
      // }
    }, 50);
  }

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width || this.props.defaultWidth,
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
      if (title.indexOf('序号') != -1) {
        return col.width || 54;
      }
      if (
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
    // if (this.props.columns !== nextProps.columns) {
    //   this.setState({
    //     columns: nextProps.columns,
    //   });
    // }

    if (this.props.loading !== nextProps.loading && nextProps.loading === false) {
      this.setState(
        {
          computeHeight: (this.sdlTableFrame && this.getOffsetTop(this.sdlTableFrame)) || 0,
        },
        () => {},
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
        () => {},
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.columns !== prevProps.columns ||
      this.props.dataSource !== prevProps.dataSource
    ) {
      // const tableThead = this.sdlTableFrame.getElementsByClassName('ant-table-thead');
      // const tableTheadHeight = tableThead ? tableThead[0].offsetHeight : 0;
      // const tableFooter = this.sdlTableFrame.getElementsByClassName('ant-table-footer');
      // const tableFooterHeight = tableFooter.length ? tableFooter[0].offsetHeight : 0;
      // const count = tableTheadHeight + 88 + tableFooterHeight;
      // debugger;
      // console.log('tableTheadHeight', tableTheadHeight);
      // console.log('tableFooterHeight', tableFooterHeight);
      this.setState({
        computeHeight: (this.sdlTableFrame && this.getOffsetTop(this.sdlTableFrame)) || 0,
        // headAndFooterHeight: count > 110 ? count : 110,
        columns: this.props?.columns?.filter(col => !col.hidden),
      });
    }

    if (this.props.dragable !== prevProps.dragable) {
      this.setState({ dataSource: this.props.dataSource });
    }

    // if (this.props.loading === false) {
    //   if (
    //     this.state.columns !== prevState.columns ||
    //     this.state.dataSource !== prevState.dataSource ||
    //     this.props.loading !== prevProps.loading
    //   ) {
    //     const tableThead = this.sdlTableFrame.getElementsByClassName('ant-table-thead');
    //     const tableTheadHeight = tableThead ? tableThead[0].offsetHeight : 0;
    //     const tableFooter = this.sdlTableFrame.getElementsByClassName('ant-table-footer');
    //     const tableFooterHeight = tableFooter.length ? tableFooter[0].offsetHeight : 0;
    //     const count = tableTheadHeight + 68 + tableFooterHeight;
    //     debugger;
    //     console.log('tableTheadHeight', tableTheadHeight);
    //     console.log('tableFooterHeight', tableFooterHeight);
    //     this.setState({
    //       computeHeight: (this.sdlTableFrame && this.getOffsetTop(this.sdlTableFrame)) || 0,
    //       headAndFooterHeight: count > 110 ? count : 110,
    //     });
    //   }
    // }
  }

  moveRow = (dragIndex, hoverIndex) => {
    //拖拽事件
    const { dataSource } = this.state;

    const dragRow = dataSource[dragIndex];

    this.setState(
      update(this.state, {
        dataSource: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      }),
    );
    this.props.dragData(this.state.dataSource);
  };

  render() {
    const { defaultWidth, resizable, clientHeight, pagination, align, dragable } = this.props;
    const { _props, columns } = this.state;

    let headAndFooterHeight = 0;
    if (this.sdlTableFrame) {
      const tableThead = this.sdlTableFrame.getElementsByClassName('ant-table-thead');
      const tableTheadHeight = tableThead ? tableThead[0].offsetHeight : 0;
      const tableFooter = this.sdlTableFrame.getElementsByClassName('ant-table-footer');
      const tableFooterHeight = tableFooter.length ? tableFooter[0].offsetHeight : 0;
      const count = tableTheadHeight + 68 + tableFooterHeight;
      headAndFooterHeight = count;
    }

    const fixedHeight = this.state.computeHeight;
    const scrollYHeight =
      this.props.scroll && this.props.scroll.y
        ? this.props.scroll.y
        : fixedHeight
        ? clientHeight - fixedHeight - headAndFooterHeight
        : '';
    // console.log('scrollYHeight', scrollYHeight)
    // 没有分页高度 + 40
    const scrollY =
      pagination === false && typeof scrollYHeight === 'number'
        ? // pagination === false && (this.props.scroll && !this.props.scroll.y)
          scrollYHeight + 40
        : scrollYHeight;

        // console.log('scrollY', scrollY)
        // console.log('computeHeight2', this.state.computeHeight)

    // 处理表格长度，防止错位
    const _columns = (columns || []).map((col, index) => ({
      render: (text, record) =>
        text && <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>,
      render: (text, record, index) =>
        col.title == '序号' && !col.dataIndex && !col.key && !col.render
          ? index + 1 + (this.state.pageIndex - 1) * this.state.pageSize
          : text && (
              <div
                style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
                className={col.ellipsis ? 'ant-table-cell-ellipsis' : null}
              >
                {text}
              </div>
            ),
      align: align || 'center',
      ...col,
      width:
        col.width == 'auto' || (!col.width && this.props.autowidth && col.title != '序号')
          ? false
          : this.getInitialColWidth(col) || defaultWidth,
      onHeaderCell: column => ({
        width:
          !col.width && this.props.autowidth && col.title != '序号'
            ? (document.getElementById('sdlTable')?.clientWidth - 54) / (columns.length - 1)
            : column.width, //自适应除序号列表格宽度 其他列能伸缩
        onResize: resizable ? this.handleResize(index) : undefined,
      }),
    }));
    const scrollXWidth = _columns.map(col => col.width).reduce((prev, curr) => prev + curr, 0);
    return (
      <DndProvider backend={HTML5Backend}>
        <div ref={el => (this.sdlTableFrame = el)}>
          <Table
            // ref={table => {
            //   this.sdlTable = table;
            // }}
            id="sdlTable"
            rowKey={(record, index) => record.id || record.ID || record.DGIMN || index}
            size="middle"
            // components={resizable ? this.components : undefined}
            components={
              resizable && dragable
                ? this.totalComponents
                : resizable
                ? this.components
                : dragable
                ? this.dragableComponents
                : undefined
            }
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
              // defaultCurrent: 1,
              current: this.state.pageIndex,
              pageSize: this.state.pageSize,
              // showQuickJumper: true,
              total: this.props.dataSource ? this.props.dataSource.length : 0,
              showSizeChanger: true,
              onChange: (current, size) => {
                this.setState({
                  pageIndex: current,
                  pageSize: size,
                });
                this.props.onPageChange && this.props.onPageChange(current, size);
              },
              pageSizeOptions: ['10', '20', '30', '40', '100'],
            }}
            defaultWidth={80}
            {...this.props}
            onRow={(record, index) => ({
              //拖拽功能
              index,
              onClick: this.props.onRow?.()?.onClick && this.props.onRow(record, index).onClick,
              moveRow: this.moveRow,
            })}
            columns={_columns}
            dataSource={dragable ? this.state.dataSource : this.props.dataSource}
            {..._props}
            scroll={
              this.props.scroll === false // || this.props.dataSource?.length==0
                ? {}
                : {
                    x:
                      (this.props.scroll && this.props.scroll.x && this.props.scroll.x) ||
                      scrollXWidth,
                    y: this.props.scroll?.y === 'hidden' ? undefined : scrollY,
                  }
            }
          />
        </div>
      </DndProvider>
    );
  }
}

SdlTable.defaultProps = {
  defaultWidth: 130,
  resizable: false,
  dataSource: [],
};

export default SdlTable;
