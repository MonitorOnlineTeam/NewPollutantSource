import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Input,
  Card,
  Row,
  Col,
  Table,
  Form,
  Badge,
  Progress,
  Tooltip,
  Select, Modal, Tag, Divider, Dropdown, Icon, Menu, Popconfirm, message, Upload,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon'
import styles from './index.less';

const { confirm } = Modal;

// 默认长度
const DEFAULT_WIDTH = 180;

@connect(({ loading, autoForm, global }) => ({
  loading: loading.effects['autoForm/getAutoFormData'],
  searchForm: autoForm.searchForm,
  tableInfo: autoForm.tableInfo,
  opreationButtons: autoForm.opreationButtons,
  keys: autoForm.keys,
  btnsAuthority: global.btnsAuthority,
}))

class AutoFormTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      delPostData: {},
    };
    this._SELF_ = { btnEl: [], configId: props.configId, moreBtns: [] };

    this.loadDataSource = this.loadDataSource.bind(this);
    this.onTableChange = this.onTableChange.bind(this);
    this._renderHandleButtons = this._renderHandleButtons.bind(this);
    this._handleTableChange = this._handleTableChange.bind(this);
    this.moreClick = this.moreClick.bind(this);
  }

  componentDidMount() {
    this.loadDataSource();
  }

  loadDataSource(params) {
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId: this.props.configId,
        searchParams: this.props.searchParams,
        otherParams: params,
      },
    });
  }

  // 分页页数change
  onTableChange(current, pageSize) {
    this.props.dispatch({
      type: 'autoForm/updateState',
      payload: {
        searchForm: {
          ...this.props.searchForm,
          [this.props.configId]: {
            ...this.props.searchForm[this.props.configId],
            current,
            pageSize,
          },
        },
      },
    });
    setTimeout(() => {
      this.loadDataSource();
    }, 0);
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { keys, configId } = this.props;
    const postData = {};
    keys[configId].map(item => {
      // if (record[item]) {
      postData[item] = selectedRows.map(row => row[[item]]).toString()
      // }
    })
    this.setState({ selectedRowKeys, selectedRows, delPostData: postData });
    this.props.rowChange && this.props.rowChange(selectedRowKeys, selectedRows)
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  _handleTableChange(pagination, filters, sorter) {
    console.log('sorter=', sorter)
    if (sorter.order) {
      const sorterObj = {
        IsAsc: sorter.order === 'ascend',
        SortFileds: sorter.field,
      };
      // sorterObj.IsAsc = sorter.order === "ascend"
      // sorterObj.SortFileds = sorter.field;
      this.loadDataSource(sorterObj);
    }
  }

  _renderHandleButtons() {
    const { opreationButtons, keys, dispatch, btnsAuthority, match, parentcode } = this.props;
    this._SELF_.btnEl = []; this._SELF_.moreBtns = [];
    const { btnEl, configId, moreBtns } = this._SELF_;
    return opreationButtons[configId] ? opreationButtons[configId].map(btn => {
      switch (btn.DISPLAYBUTTON) {
        case 'add':
          if (btnsAuthority.includes('add')) {
            return <Button
              style={{ marginRight: 8 }}
              key={btn.DISPLAYBUTTON}
              icon="plus"
              type="primary"
              onClick={() => {
                this.props.onAdd ? this.props.onAdd() : dispatch(routerRedux.push(`/${match.params.parentcode || parentcode}/autoformmanager/${configId}/autoformadd`));
              }}
            >添加
                  </Button>;
          }
          break;
        case 'alldel':
          return <Button
            disabled={this.state.selectedRowKeys.length <= 0}
            style={{ marginRight: 8 }}
            icon="delete"
            key={btn.DISPLAYBUTTON}
            type="primary"
            onClick={() => {
              const postData = this.state.delPostData;
              confirm({
                title: '是否删除?',
                content: '确认是否删除',
                onOk() {
                  dispatch({
                    type: 'autoForm/del',
                    payload: {
                      configId,
                      FormData: JSON.stringify(postData),
                    },
                  })
                },
              });
            }}
          >批量删除
                         </Button>;
          break;
        case 'print':
          moreBtns.push({ type: 'printer', text: '打印' })
          break;
        // return <Button icon="printer" key={btn.DISPLAYBUTTON} type="primary">打印</Button>;
        case 'exp':
          moreBtns.push({ type: 'export', text: '导出' })
          break;
        //   return <Button
        //     icon="export"
        //     key={btn.DISPLAYBUTTON}
        //     type="primary"
        //     onClick={() => {
        //       dispatch({
        //         type: 'autoForm/exportDataExcel',
        //         payload: {
        //           configId
        //         }
        //       })
        //     }}
        //   >
        //     导出
        // </Button>;
        case 'imp':
          moreBtns.push({ type: 'import', text: '导入' })
          break;
        //   return <Button
        //     icon="import"
        //     key={btn.DISPLAYBUTTON}
        //     type="primary"
        //     onClick={() => {
        //       this.setState({
        //         visible: true,
        //       })
        //     }}
        //   >
        //     导入
        // </Button>;
        case 'edit':
          btnEl.push({
            type: 'edit',
          });
          break;
        case 'view':
          btnEl.push({
            type: 'view',
          });
          break;
        case 'del':
          btnEl.push({
            type: 'del',
          });
          break;
        default:
          break;
      }
    }) : null;
  }

  // 更多按钮点击
  moreClick(e) {
    const { dispatch } = this.props;
    const { configId } = this._SELF_;
    switch (e.key) {
      // 打印
      case 'printer':

        break;
      // 导入
      case 'import':
        this.setState({
          visible: true,
        })
        break;
      // 导出
      case 'export':
        dispatch({
          type: 'autoForm/exportDataExcel',
          payload: {
            configId,
          },
        })
        break;
      default:
        break;
    }
  }

  render() {
    const { loading, selectedRowKeys } = this.state;
    const { tableInfo, searchForm, keys, dispatch, configId, btnsAuthority, match,parentcode } = this.props;
    const columns = tableInfo[configId] ? tableInfo[configId]["columns"] : [];
    const checkboxOrRadio = tableInfo[configId] ? tableInfo[configId]["checkboxOrRadio"] * 1 : 1;
    const { pageSize = 10, current = 1, total = 0 } = searchForm[configId] || {}
    const parentCode = match && match.params && match.params.parentcode || parentcode;
    // 计算长度
    const _columns = (columns || []).map(col => {
      if (col.title === '文件') {
        return {
          ...col,
          width: 400,
          render: (text, record) => {
            const key = col.dataIndex;
            const fileInfo = record[key] ? record[key].split(';') : [];
            return (
              <div>
                {
                  fileInfo.map(item => {
                    const itemList = item.split('|');
                    return <Fragment>
                      <a target="_blank" href={`${itemList[itemList.length - 1]}${itemList[0]}`}>{itemList[0]}</a>
                      <a style={{ marginLeft: 10 }} href={`${itemList.pop()}${itemList[0]}`} download>下载</a>
                      <br />
                    </Fragment>
                  })
                }
              </div>
            )
          },
        }
      }
      return {
        ...col,
        width: col.width || DEFAULT_WIDTH,
        render: (text, record) => {
          const type = col.formatType;
          return text && <div>
            {type === '超链接' &&
              <a style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</a>
            }
            {type == '小圆点' && <Badge status="warning" text={text} />}
            {type === '标签' && <Tag>{text}</Tag>}
            {type === '进度条' && <Progress percent={text} />}
            {!type && <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
              {text}
            </div>}
          </div>
        },
      }
      // return col.width ? { width: DEFAULT_WIDTH, ...col } : { ...col, width: DEFAULT_WIDTH }
    });
    const buttonsView = this._renderHandleButtons();
    // let rowKey = [];
    // if(this.props.children instanceof Array){
    //   rowKey = this.props.children.filter(item=>item.key === "row");
    // } else if(this.props.children instanceof Object){
    //   rowKey = this.props.children.key === "row" && [this.props.children];
    // }
    // const showHandle = rowKey.length;
    // console.log("showHandle=",showHandle)
    const scrollXWidth = _columns.map(col => col.width).reduce((prev, curr) => prev + curr, 0);

    if (this._SELF_.btnEl.length || this.props.appendHandleRows) {
      const isFixed = scrollXWidth > (window.innerWidth - 64 - 48) ? 'right' : ''
      _columns.push({
        align: 'center',
        title: '操作',
        width: 180,
        fixed: isFixed,
        render: (text, record) => (
          <div>
            {
              this._SELF_.btnEl.map((item, index) => {
                if (item.type === 'edit' && btnsAuthority.includes('edit')) {
                  const filterList = columns.filter(itm => itm.title == '文件')[0] || {};
                  const key = filterList.dataIndex;
                  const fileInfo = record[key] && record[key].split(';')[0];
                  const list = fileInfo ? fileInfo.split('|') : [];
                  const uid = list[list.length - 2] || null;
                  // const uid = record.
                  return (
                    <Fragment key={item.type}>
                      <Tooltip title="编辑">
                        <a onClick={() => {
                          const postData = {};
                          keys[configId].map(item => {
                            if (record[item]) {
                              postData[item] = record[item]
                            }
                          })
                          // this.props.onEdit ? this.props.onEdit() : dispatch(routerRedux.push(`/AutoFormManager/AutoFormEdit/${configId}/${JSON.stringify(postData)}/${uid}`))
                          dispatch(routerRedux.push(`/${parentCode}/AutoFormManager/${configId}/AutoFormEdit/${JSON.stringify(postData)}/${uid}`))
                        }}><EditIcon /></a>
                      </Tooltip>
                      {
                        this._SELF_.btnEl.length - 1 !== index && btnsAuthority.includes('view') && <Divider type="vertical" />
                      }
                    </Fragment>);
                }
                if (item.type === 'view' && btnsAuthority.includes('view')) {
                  // if (item.type === "view") {
                  return (<Fragment key={item.type}>
                    <Tooltip title="详情">
                      <a onClick={() => {
                        const postData = {};
                        keys[configId].map(item => {
                          if (record[item]) {
                            postData[item] = record[item]
                          }
                        })
                        dispatch(routerRedux.push(`/${parentCode}/AutoFormManager/${configId}/AutoFormView/${JSON.stringify(postData)}`))
                      }}><DetailIcon /></a>

                    </Tooltip>
                    {
                      this._SELF_.btnEl.length - 1 !== index && btnsAuthority.includes('del') && <Divider type="vertical" />
                    }
                  </Fragment>);
                }
                if (item.type === 'del' && btnsAuthority.includes('del')) {
                  return (<Fragment key={item.type}>
                    <Tooltip title="删除">
                      <Popconfirm
                        placement="left"
                        title="确认是否删除?"
                        onConfirm={() => {
                          const postData = {
                          };
                          keys[configId].map(item => {
                            if (record[item]) {
                              postData[item] = record[item]
                            }
                          })
                          dispatch({
                            type: 'autoForm/del',
                            payload: {
                              configId,
                              FormData: JSON.stringify(postData),
                            },
                          })
                        }}
                        okText="是"
                        cancelText="否">
                        <a href="#"><DelIcon /></a>
                      </Popconfirm>
                    </Tooltip>
                    {
                      this._SELF_.btnEl.length - 1 !== index && <Divider type="vertical" />
                    }
                  </Fragment>)
                }
              })
            }
            {/* {
              React.Children.map(this.props.children, (child, i) => {
                // if (child.props["data-position"] === "row") {
                if (child.key === "row") {
                  return child
                }
              })
            } */}
            {
              this.props.appendHandleRows && this.props.appendHandleRows(record)
            }
          </div>
        ),
      });
    }


    const rowSelection = checkboxOrRadio ? {
      type: checkboxOrRadio == 1 ? 'radio' : 'checkbox',
      selections: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    } : false;
    const dataSource = tableInfo[configId] ? tableInfo[configId].dataSource : [];
    // const dataSource = _tabelInfo.dataSource

    const props = {
      name: 'file',
      multiple: true,
      action: 'http://172.16.9.52:8095/rest/PollutantSourceApi/AutoFormDataApi/ImportDataExcel',
      data: {
        ConfigID: configId,
      },
      // onChange(info) {
      //   const status = info.file.status;
      //   if (status !== 'uploading') {
      //     console.log(info.file, info.fileList);
      //   }
      //   if (status === 'done') {
      //     message.success(`${info.file.name} file uploaded successfully.`);
      //   } else if (status === 'error') {
      //     message.error(`${info.file.name} file upload failed.`);
      //   }
      // },
    };
    return (
      <Fragment>
        <Row className={styles.buttonWrapper}>
          {buttonsView}
          {this.props.appendHandleButtons && this.props.appendHandleButtons(this.state.selectedRowKeys, this.state.selectedRows)}
          {
            // 更多操作
            this._SELF_.moreBtns.length ? <Dropdown overlay={() => <Menu onClick={this.moreClick}>
                {
                  this._SELF_.moreBtns.map(item => {
                    return <Menu.Item key={item.type}>
                      <Icon type={item.type} />
                      {item.text}
                    </Menu.Item>
                  })
                }
              </Menu>}>
              <Button>
                更多操作 <Icon type="down" />
              </Button>
            </Dropdown> : null
          }
          {/* {
            React.Children.map(this.props.children, (child, i) => {
              // if (child.props["data-position"] === "top") {
              if (child.key === "top") {
                return child
              }
            })
          } */}

        </Row>
        <Table
          rowKey={(record, index) => index}
          size="small"
          loading={this.props.loading}
          // className={styles.dataTable}
          dataSource={dataSource}
          scroll={{ x: scrollXWidth, y: 'calc(100vh - 390px)' }}
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
          onChange={this._handleTableChange}
          rowSelection={rowSelection}
          onRow={(record, index) => ({
              onClick: event => {
                const { selectedRowKeys } = this.state;
                let keys = selectedRowKeys;
                if (selectedRowKeys.some(item => item == index)) {
                  keys = keys.filter(item => item !== index)
                  console.log('keys=',keys)
                  // keys.splice(index, 1)
                } else {
                  console.log('checkboxOrRadio=',checkboxOrRadio)
                  // keys = keys.concat([index])
                  keys = checkboxOrRadio === 1 ? [index] : keys.concat([index]);
                }
                // return;
                this.setState({
                  selectedRowKeys: keys
                })
              },
            })}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize,
            current,
            onChange: this.onTableChange,
            onShowSizeChange: this.onTableChange,
            pageSizeOptions: ['10', '20', '30', '40'],
            total,
          }}
          {...this.props}
          columns={_columns}
        />
        <Modal
          title="导入"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Row>
            <Col span={18}>
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> 请选择文件
                </Button>
              </Upload>
            </Col>
            <Col span={6} style={{ marginTop: 6 }}>
              <a onClick={() => {
                dispatch({
                  type: 'autoForm/exportTemplet',
                  payload: {
                    configId,
                  },
                })
              }}>下载导入模板</a></Col>
          </Row>
        </Modal>
      </Fragment>
    );
  }
}

export default AutoFormTable;
