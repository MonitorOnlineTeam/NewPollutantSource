/*
 * @Author: Jiaqi 
 * @Date: 2020-08-12 16:44:25 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-08-13 09:11:59
 * @Description: 工况参数页面
 */
import React, { PureComponent } from 'react';
import SdlTable from '@/components/SdlTable'
import { connect } from 'dva'
import { Badge } from "antd"
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons"


@connect(({ loading, working }) => ({
  flowTableData: working.flowTableData,
  loading: loading.effects["working/getFlowTableData"]
}))
class FlowChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '监测项目',
          // align: 'center',
          dataIndex: 'monitoringItems',
          render: (value, record, index) => {
            let obj = {
              children: <div style={{ textAlign: 'center', color: "#1890FF" }}>{value}</div>,
              props: {
                rowSpan: record.col
              },
            };
            return obj;
          }
        },
        {
          title: '工作参数',
          dataIndex: 'param',
        },
        {
          title: '状态',
          dataIndex: 'state',
          render: (text, record) => {
            switch (text) {
              case 0:
                return <Badge status="success" text="正常" />
              case 1:
                return <Badge status="warning" text="超下限" />
              case 2:
                return <Badge status="error" text="超上限" />
            }
          }
        },
        {
          title: '当前值',
          dataIndex: 'value',
        },
        {
          title: '正常范围',
          dataIndex: 'range',
        },
        {
          title: '单位',
          dataIndex: 'unit',
        },
        {
          title: '变更时间',
          dataIndex: 'monitorTime',
        },
        {
          title: '变更记录',
          dataIndex: 'oldValue',
          render: (text, record) => {
            let style = {
              fontSize: 14, color: "#52c41a", float: 'right', marginTop: 4
            }
            let icon = <ArrowUpOutlined style={style} />
            if (text > record.value) {
              icon = <ArrowDownOutlined style={{ ...style, color: "#ff4d4f" }} />
            }
            return <>
              {text}→{record.value}
              {icon}
            </>
          }
        }
      ]
    };
  }

  componentDidMount() {
    this.getTableDataSource()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.getTableDataSource();
    }
  }

  // 获取表格数据
  getTableDataSource = () => {
    this.props.dispatch({
      type: "working/getFlowTableData",
      payload: {
        DGIMN: this.props.DGIMN, 
        // DGIMN: "399435xd5febbc"
      }
    })
  }
  
  render() {
    const { flowTableData, loading } = this.props;
    const { columns } = this.state;
    return (
      <SdlTable loading={loading} dataSource={flowTableData} columns={columns} />
    );
  }
}

export default FlowChart;