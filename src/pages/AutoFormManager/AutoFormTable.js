import React, { PureComponent, Fragment } from 'react';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { DeleteOutlined, DownOutlined, ExportOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Card,
  Row,
  Col,
  Table,
  Badge,
  Progress,
  Tooltip,
  Select,
  Modal,
  Tag,
  Divider,
  Dropdown,
  Menu,
  Popconfirm,
  message,
  Upload,
} from 'antd';
import { router } from "umi";
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon'
import AttachmentView from '@/components/AttachmentView'
import TableText from '@/components/TableText'
import { getAttachmentDataSource } from './utils'
import { getRowCuid } from '@/utils/utils';
import config from '@/config'
import styles from './index.less';
import SdlTable from '@/components/SdlTable'
import defaultSettings from '../../../config/defaultSettings'
import {
  ToolTwoTone
} from '@ant-design/icons';
const { confirm } = Modal;

// 默认长度
const DEFAULT_WIDTH = 180;

@connect(({ loading, autoForm, global }) => ({
  loading: loading.effects['autoForm/getAutoFormData'],
  getConfigLoading: loading.effects['autoForm/getPageConfig'],
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
      otherParams: {}
    };
    this._SELF_ = { btnEl: [], configId: props.configId, moreBtns: [] };

    this.loadDataSource = this.loadDataSource.bind(this);
    this.onTableChange = this.onTableChange.bind(this);
    this._renderHandleButtons = this._renderHandleButtons.bind(this);
    this._handleTableChange = this._handleTableChange.bind(this);
    this.moreClick = this.moreClick.bind(this);
    this.delRowData = this.delRowData.bind(this);
    this.batchDel = this.batchDel.bind(this);
  }

  componentWillMount = () => {
    const { onRef } = this.props;
    onRef && onRef(this);
  };

  componentDidMount() {
    // this.loadDataSource();
    this.props.sort? this.loadDataSource({SortFileds:"RegionCode",IsAsc: true}) : this.loadDataSource()
    if (this.props.getPageConfig) {
      this.props.dispatch({
        type: 'autoForm/getPageConfig',
        payload: {
          configId: this.props.configId,
        }
      });
    }
  }

  loadDataSource(params) {
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId: this.props.configId,
        searchParams: this.props.searchParams,
        otherParams: params || this.state.otherParams,
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
    const { current, pageSize } = pagination;
    let sorterObj = {};
    if (sorter.order) {
      sorterObj = {
        IsAsc: sorter.order === 'ascend',
        SortFileds: sorter.field,
      };
      this.setState({
        otherParams: sorterObj
      })
      // sorterObj.IsAsc = sorter.order === "ascend"
      // sorterObj.SortFileds = sorter.field;
    }
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
      this.loadDataSource(sorterObj);
    }, 0);
  }
  //行删除
  delRowData(record) {
    const { keys, dispatch, searchParams, configId } = this.props;
    if (this.props.onDelete) {
      this.props.onDelete(record, record(keys[configId][0]));
      return;
    }
    const postData = {};
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
        searchParams: searchParams
      },
    })
  }
  //批量删除
  batchDel() {
    const postData = this.state.delPostData;
    const { dispatch, configId } = this.props;
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
  }
  _renderHandleButtons() {
    const { opreationButtons, keys, dispatch, btnsAuthority, match, parentcode, configId } = this.props;
    this._SELF_.btnEl = []; this._SELF_.moreBtns = [];
    const { btnEl, moreBtns } = this._SELF_;
    return opreationButtons[configId] ? opreationButtons[configId].map(btn => {
      switch (btn.DISPLAYBUTTON) {
        case 'add':
          // if (btnsAuthority.includes('add')) {
          return (
            <Button
              style={{ marginRight: 8 }}
              key={btn.DISPLAYBUTTON}
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                //this.props.onAdd ? this.props.onAdd() : dispatch(routerRedux.push(`/${match.params.parentcode || parentcode}/autoformmanager/${configId}/autoformadd`));
                this.props.onAdd ? this.props.onAdd() : dispatch(routerRedux.push(`/${parentcode || match.params.parentcode}/autoformmanager/${configId}/autoformadd`));
              }}
            >添加
                    </Button>
          );
          // }
          break;
        case 'alldel':
          return (
            <Button
              disabled={this.state.selectedRowKeys.length <= 0}
              style={{ marginRight: 8 }}
              icon={<DeleteOutlined />}
              key={btn.DISPLAYBUTTON}
              type="primary"
              onClick={() => {
                this.batchDel();
              }}
            >批量删除
                           </Button>
          );
          break;
        case 'print':
          moreBtns.push({ type: 'printer', text: '打印' })
          break;
        // return <Button icon="printer" key={btn.DISPLAYBUTTON} type="primary">打印</Button>;
        case 'exp':
          if (opreationButtons[configId].length === 1) {
            return (
              <Button
                style={{ marginRight: 8 }}
                icon={<ExportOutlined />}
                key={btn.DISPLAYBUTTON}
                type="primary"
                onClick={() => {
                  this.export();
                }}
              >导出
                           </Button>
            );
          } else {
            moreBtns.push({ type: 'export', text: '导出' })
          }
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


  componentWillReceiveProps(nextProps) {
    if ((JSON.stringify(this.props.searchParams) !== JSON.stringify(nextProps.searchParams)) || (this.props.configId !== nextProps.configId)) {
      this.props.dispatch({
        type: 'autoForm/getAutoFormData',
        payload: {
          configId: nextProps.configId,
          searchParams: nextProps.searchParams,
          otherParams: nextProps.otherParams,
        },
      });
    }
  }

  export = () => {
    const { dispatch, configId, searchParams } = this.props;
    let conditionWhere = {};
    if (searchParams) {
      conditionWhere = {
        ConditionWhere: JSON.stringify(
          {
            rel: '$and',
            group: [{
              rel: '$and',
              group: [
                ...searchParams,
              ],
            }],
          }),
      }
    }
    dispatch({
      type: 'autoForm/exportDataExcel',
      payload: {
        configId,
        IsPaging: false,
        // ...conditionWhere
      },
    })
  }

  // 更多按钮点击
  moreClick(e) {
    const { dispatch, configId } = this.props;
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
        this.export()
        break;
      default:
        break;
    }
  }

  render() {
    const { loading, selectedRowKeys } = this.state;
    const { tableInfo, searchForm, keys, dispatch, configId, btnsAuthority, match, parentcode } = this.props;
    const columns = tableInfo[configId] ? tableInfo[configId]["columns"] : [];
    const checkboxOrRadio = tableInfo[configId] ? tableInfo[configId]["checkboxOrRadio"] * 1 : 1;
    const { pageSize = 20, current = 1, total = 0 } = searchForm[configId] || {}
    const parentCode = match && match.params && match.params.parentcode || parentcode;
    // 计算长度
    const _columns = (columns || []).map(col => {
      if (col.type === '上传') {
        return {
          ...col,
          width: 200,
          render: (text, record) => {
            const attachmentDataSource = getAttachmentDataSource(text);
            return (
              <AttachmentView dataSource={attachmentDataSource} />
            )
          },
        }
      }
      return {
        ...col,
        width: col.width,
        render: (text, record) => {
          text = text ? text + "" : text;
          const type = col.formatType;
          if (type === "标签") {
            const types = text ? (text.indexOf("|") ? text.split("|") : text.split(",")) : []
            return types.map(item => {
              return <Tag>{item}</Tag>
            })
          }
          if (type === "超链接") {
            let porps = {}
            if (col.otherConfig) {
              porps = {
                onClick: () => {
                  router.push(`${col.otherConfig}/${text}`)
                }
              }
            }
            // return <TableText content={text} {...porps} />
            return <a style={{ wordWrap: 'break-word', wordBreak: 'break-all' }} {...porps}>{text}</a>
          }
          return text && <div className={styles.ellipsisText}>
            {/* {type === '超链接' &&
              <a style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</a>
            } */}
            {type == '小圆点' && <Badge status="warning" text={text} />}
            {/* {type === '标签' && <Tag>{text}</Tag>} */}
            {type === '进度条' && <Progress percent={text} />}
            {!type && text}
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
      let leftMenuWidth = config.isShowTabs && defaultSettings.layout === "sidemenu" ? 255 : 0
      const isFixed = scrollXWidth > (window.innerWidth - 64 - 48 - leftMenuWidth) ? 'right' : ''
      _columns.length && _columns.push({
        align: 'center',
        title: '操作',
        width: configId=='GasOutputNew'? 220 :  180,
        fixed: isFixed,
        render: (text, record) => {
          const returnKey = keys[configId] && record[keys[configId][0]];
          return <div>
            {
              this._SELF_.btnEl.map((item, index) => {
                // if (item.type === 'edit' && btnsAuthority.includes('edit')) {
                if (item.type === 'edit') {
                  // const uid = record.
                  return (
                    <Fragment key={item.type}>
                      <Tooltip title="编辑">
                        <a onClick={() => {
                          const filterList = columns.filter(itm => itm.type == '上传')[0] || {};
                          const key = filterList.dataIndex;
                          const cuid = getRowCuid(record, key)
                          const postData = {};
                          keys[configId].map(item => {
                            if (record[item]) {
                              postData[item] = record[item]
                            }
                          })
                          this.props.onEdit ? this.props.onEdit(record, returnKey) : dispatch(routerRedux.push(`/${parentCode}/AutoFormManager/${configId}/AutoFormEdit/${JSON.stringify(postData)}/${cuid}`))
                          // dispatch(routerRedux.push(`/${parentCode}/AutoFormManager/${configId}/AutoFormEdit/${JSON.stringify(postData)}/${uid}`))
                        }}><EditIcon /></a>
                      </Tooltip>
                      {
                        // this._SELF_.btnEl.length - 1 !== index && btnsAuthority.includes('view') && <Divider type="vertical" />
                        this._SELF_.btnEl.length - 1 !== index && <Divider type="vertical" />
                      }
                    </Fragment>);
                }
                // if (item.type === 'view' && btnsAuthority.includes('view')) {
                if (item.type === "view") {
                  return (<Fragment key={item.type}>
                    <Tooltip title="详情">
                      <a onClick={() => {
                        const postData = {};
                        keys[configId].map(item => {
                          if (record[item]) {
                            postData[item] = record[item]
                          }
                        })
                        this.props.onView ? this.props.onView(record, returnKey) : dispatch(routerRedux.push(`/${parentCode}/AutoFormManager/${configId}/AutoFormView/${JSON.stringify(postData)}`))
                      }}><DetailIcon /></a>

                    </Tooltip>
                    {
                      // this._SELF_.btnEl.length - 1 !== index && btnsAuthority.includes('del') && <Divider type="vertical" />
                      this._SELF_.btnEl.length - 1 !== index && <Divider type="vertical" />
                    }
                  </Fragment>);
                }
                // if (item.type === 'del' && btnsAuthority.includes('del')) {
                if (item.type === 'del') {
                  return (<Fragment key={item.type}>
                    <Tooltip title="删除">
                      <Popconfirm
                        placement="left"
                        title="确认是否删除?"
                        onConfirm={() => {
                          this.delRowData(record);
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
              this.props.appendHandleRows && this.props.appendHandleRows(record, returnKey)
            }
          </div>
        },
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
      headers: {
        authorization: 'authorization-text',
      },
      action: '/api/rest/PollutantSourceApi/AutoFormDataApi/ImportDataExcel',
      data: {
        ConfigID: configId,
      },
      onChange: (info) => {
        if (info.file.status === 'done') {
          this.loadDataSource();
          message.success("导入成功");
          this.setState({
            visible: false
          })
        } else if (info.file.status === 'error') {
          message.error('上传文件失败！')
        }
        // this.setState({
        //   fileList: info.fileList
        // })
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
                  return (
                    <Menu.Item key={item.type}>
                      <LegacyIcon type={item.type} />
                      {item.text}
                    </Menu.Item>
                  );
                })
              }
            </Menu>}>
              <Button>
                更多操作 <DownOutlined />
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
        <SdlTable
          rowKey={(record, index) => {
            if (keys[configId]) {
              // return record[keys[configId][0]];
              return `${current}-${index}`
            }
          }}
          // size="small"
          loading={this.props.loading}
          // className={styles.dataTable}
          dataSource={dataSource}
          // rowClassName={
          //   (record, index, indent) => {
          //     if (index === 0) {
          //       return;
          //     }
          //     if (index % 2 !== 0) {
          //       return 'light';
          //     }
          //   }
          // }
          onChange={this._handleTableChange}
          rowSelection={rowSelection}
          onRow={(record, index) => ({
            onClick: event => {
              const { selectedRowKeys } = this.state;
              let rowkey = `${current}-${index}`;
              let rows = this.state.selectedRows || [];
              let keys = selectedRowKeys;
              if (selectedRowKeys.some(item => item == rowkey)) {
                keys = keys.filter(item => item !== rowkey)
                rows = rows.filter(item => item.rn !== (index + 1))
                // keys.splice(index, 1)
              } else {
                // keys = keys.concat([index])
                keys = checkboxOrRadio === 1 ? [rowkey] : keys.concat([rowkey]);
                rows = checkboxOrRadio === 1 ? [record] : rows.concat([record]);
              }
              this.setState({
                selectedRowKeys: keys,
                selectedRows: rows
              }, () => {
                this.props.rowChange && this.props.rowChange(this.state.selectedRowKeys, record)
              })
            },
          })}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize,
            current,
            // onShowSizeChange: this.onTableChange,
            onShowSizeChange: this.onTableChange,
            pageSizeOptions: ['10', '20', '30', '40'],
            total,
          }}
          {...this.props}
          // scroll={{ x: this.props.scroll.x || scrollXWidth, y: this.props.scroll.y || 'calc(100vh - 390px)' }}
          // scroll={scroll}
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
                  <UploadOutlined /> 请选择文件
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
