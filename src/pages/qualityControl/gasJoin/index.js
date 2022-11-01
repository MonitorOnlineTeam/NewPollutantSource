import React, { Component, Fragment } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card } from 'antd';
import { connect } from 'dva'
import { Button, Row, Tooltip, Divider, Popconfirm } from 'antd';
import { router } from 'umi'
import PageLoading from "@/components/PageLoading"
import SdlTable from '@/components/SdlTable'
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon'




@connect(({ qualityControl, loading }) => {
  return {
    gasProList: qualityControl.gasProList,
    loading: loading.effects['qualityControl/getGasProList'],
  }
})

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      configId: "QCAGasPro",
      columns: [
        {
          title: '气瓶方案名称',
          dataIndex: 'QCGasProName',
          key: 'QCGasProName',
        },
        {
          title: '绑定气瓶',
          dataIndex: 'ComponentList',
          key: 'ComponentList',
        },
        {
          title: '绑定气瓶数量',
          dataIndex: 'GasBottleCount',
          key: 'GasBottleCount',
        },
        {
          title: '操作',
          dataIndex: 'handle',
          key: 'handle',
          render: (text, record, index) => {
            return <Fragment>
              <Tooltip title="编辑">
                <a onClick={() => {
                  this.onEdit(record.ID);
                }}><EditIcon /></a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  placement="left"
                  title="确认是否删除?"
                  onConfirm={() => {
                    this.onDeleteGas(record.ID);
                  }}
                  okText="是"
                  cancelText="否">
                  <a href="#">
                    <DelIcon />
                  </a>
                </Popconfirm>
              </Tooltip>
            </Fragment>
          }
        },
      ]
    }
  }

  componentDidMount() {
    this.getPageData();
  }


  componentDidUpdate(prevProps, prevState) {
    if (prevProps.gasProList !== this.props.gasProList) {
      if (this.props.gasProList.length === 0) {
        this.onAdd(true);
      } else if (this.props.gasProList.length === 1) {
        this.onEdit(this.props.gasProList[0].ID, true);
      }
    }
  }

  getPageData = () => {
    this.props.dispatch({
      type: 'qualityControl/getGasProList',
      payload: {
      }
    });
  }

  onEdit = (id, isOnly) => {
    router.push({
      pathname: `/qualityControl/qcaManager/gasJoin/editGas/${id}`,
      query: {
        isOnly,
        tabName: '气瓶标气管理 - 编辑',
      }
    })
  }

  onAdd = (isOnly) => {
    router.push({
      pathname: "/qualityControl/qcaManager/gasJoin/addGas",
      query: {
        tabName: '气瓶标气管理 - 添加',
      }
    })
  }

  // 删除气瓶方案
  onDeleteGas = (id) => {
    this.props.dispatch({
      type: 'qualityControl/deleteGasProOne',
      payload: {
        ID: id
      }
    }).then(() => {
      this.getPageData();
    })
  }

  render() {
    const { columns } = this._SELF_;
    return (
      <BreadcrumbWrapper>
        <Card>
          <Row style={{ margin: '10px 0' }}>
            <Button type="primary" onClick={this.onAdd}>添加</Button>
          </Row>
          <SdlTable
            loading={this.props.loading}
            columns={columns}
            dataSource={this.props.gasProList}
          />
          {/* <AutoFormTable
            configId={this._SELF_.configId}
            // onDelete={(record, key) => {
            //   this.onDelete(record, key);
            // }}
            onAdd={() => {
              router.push({
                pathname: "/qualityControl/qcaManager/gasJoin/addGas",
                query: {
                  tabName: '气瓶标气管理 - 添加',
                }
              })
            }}
            onEdit={(record, key) => {
              const cuid = getRowCuid(record, "dbo.T_Base_StandardLibrary.AttachmentID")
              router.push({
                pathname: `/platformconfig/StandardLibrary/editLibrary/${key}/${cuid}`,
                query: {
                  tabName: '标准库管理 - 编辑',
                }
              })
            }}
            onView={(record, key) => {
              router.push({
                pathname: `/platformconfig/StandardLibrary/viewLibrary/${key}`,
                query: {
                  tabName: '标准库管理 - 详情',
                }
              })
            }}
          /> */}
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;