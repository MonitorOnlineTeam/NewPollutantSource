import React, { PureComponent } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card, Form, Popconfirm, Col, Input, Select, Button, Table, Cascader, InputNumber, Divider, message, Icon, Tooltip, DatePicker } from 'antd';
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon'
import SdlTable from '@/components/SdlTable'
import PageLoading from '@/components/PageLoading'
import { router } from 'umi'

@connect(({ loading, qualityControl }) => ({
  workPatternList: qualityControl.workPatternList,
  loading: loading.effects["qualityControl/getWorkPatternList"],
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '工作模式',
          dataIndex: 'ModelName',
          width: "70%"
        },
        {
          title: "操作",
          width: "30%",
          align: "center",
          render: (text, record) => {
            return (
              <div>
                <Tooltip title="编辑">
                  <a onClick={() => {
                    router.push("/qualityControl/qcaManager/workPattern/edit/" + record.ModelName)
                  }}><EditIcon /></a>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="删除">
                  <Popconfirm
                    placement="left"
                    title="确认是否删除?"
                    onConfirm={() => {
                      this.del(record);
                    }}
                    okText="是"
                    cancelText="否">
                    <a href="#"><DelIcon /></a>
                  </Popconfirm>
                </Tooltip>
              </div>
            )
          }
        }
      ]
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'qualityControl/getWorkPatternList',
    })
  }


  // 删除工作模式
  del = (record) => {
    this.props.dispatch({
      type: "qualityControl/workPatternDelete",
      payload: {
        ModelName: record.ModelName
      }
    })
  }

  // 展开嵌套表格
  expandedRowRender = (record, index, indent, expanded) => {
    const columns = [
      {
        title: '标气名称',
        dataIndex: 'StandardGasName',
        width: 140,
      },
      {
        title: '配比气浓度',
        dataIndex: 'StandardValue',
        width: 140,
        render: (text, record, idx) => {
          let unit = "mg/m3";
          if (record.StandardGasCode === "02" || record.StandardGasCode === "03") {
            unit = "mg/m3"
          }
          if (record.StandardGasCode === "s01") {
            unit = "%"
          }
          return text ? text + unit : "-"
        }
      },
      {
        title: '总流量设定值',
        dataIndex: 'TotalFlowSetVal',
        width: 140,
      },
      {
        title: '满量程值',
        dataIndex: 'Range',
        width: 140,
        render: (text, record, idx) => {
          return text ? text : "-"
        }
      },
      {
        title: '通气时间',
        dataIndex: 'VentilationTime',
        width: 100,
        render: (text, record, idx) => {
          return text ? text + "分钟" : "-"
        }
      },
      {
        title: '稳定时间',
        dataIndex: 'StabilizationTime',
        width: 100,
        render: (text, record, idx) => {
          return text ? text + "分钟" : "-"
        }
      },
      {
        title: '质控周期',
        dataIndex: 'Cycle',
        width: 140,
        render: (text, record, idx) => {
          if (text) {
            if (record.DateType === 0) {
              return `周期：${text}天 ${record.Hour}:${record.Minutes}`
            } else {
              return `周期：${record.Hour}小时 ${record.Minutes}分`
            }
          }
          return "-"
        }
      }
    ]

    return <Table style={{ margin: "10px 0" }} size="middle" border={false} columns={columns} dataSource={record.ModelList} pagination={false} />;
  }


  render() {
    const { columns, dataSource } = this.state;
    const { workPatternList, loading } = this.props;
    if (loading) {
      return <PageLoading />
    }
    return (
      <BreadcrumbWrapper>
        <Card>
          <Table
            size="small"
            loading={loading}
            // rowKey={record => record.key}
            // expandedRowKeys={expandedRowKeys}
            // defaultExpandAllRows={!!id}
            columns={columns}
            dataSource={workPatternList}
            // scroll={{ x: 300 }}
            defaultExpandAllRows
            expandedRowRender={this.expandedRowRender}
            // onExpand={(expanded, record) => {
            //   if (expanded) {
            //     this.setState({
            //       expandedRowKeys: [
            //         ...expandedRowKeys,
            //         record.key,
            //       ],
            //     })
            //   } else {
            //     const rowKeys = _.remove(expandedRowKeys, n => n != record.key);
            //     console.log('rowKeys=', rowKeys)
            //     this.setState({
            //       expandedRowKeys: [
            //         ...rowKeys,
            //       ],
            //     })
            //   }
            // }}
            expandedRows={expandedRows => {
            }}
            // bordered={false}
            pagination={false}
            size="middle"
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;
