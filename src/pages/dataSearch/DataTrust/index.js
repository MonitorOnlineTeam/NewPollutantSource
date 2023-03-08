/*
 * @Author: JiaQi 
 * @Date: 2023-03-03 15:40:27 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-03-07 16:25:27
 * @Description: 数据不可信查询
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card, Col, Row, Button, Space, Select, DatePicker, message, Tag } from 'antd'
import SelectEntAndPoint from '@/components/Select-entAndPoint'
import SdlTable from '@/components/SdlTable'
import moment from 'moment';

const { RangePicker } = DatePicker;



const dvaPropsData = ({ loading, dataSearch, }) => ({
  dataTrustDataSource: dataSearch.dataTrustDataSource,
  dataTrustTotal: dataSearch.dataTrustTotal,
  loading: loading.effects['dataSearch/getUnTrustedList']
})
const dvaDispatch = (dispatch) => {
  return {
    // 获取数据不可信列表
    getUnTrustedList: (payload) => {
      dispatch({
        type: `dataSearch/GetUnTrustedList`,
        payload: payload,
      })
    },
  }
}

const DataTrust = (props) => {

  const { dataTrustDataSource, dataTrustTotal, loading } = props;
  const beginTime = moment().subtract(1, 'days').format('YYYY-MM-DD HH:00:00');
  const endTime = moment().format('YYYY-MM-DD HH:59:59');
  const [time, setTime] = useState([moment(beginTime), moment(endTime)]);
  const [dataType, setDataType] = useState('HourData');
  const [DGIMN, setDGIMN] = useState();
  const [columns, setColumns] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    if (DGIMN) {
      getUnTrustedList();
    }
  }, [pageIndex, pageSize]);

  console.log('props', props)


  // 获取数据不可信信息
  const getDataTruseMsg = (record) => {
    if (record.DataTrusted === false && record.DeviceTrusted === false) {
      // 两种数据不可信
      return <Tag color="error">数据、身份不可信</Tag>
    } else if (record.DataTrusted === false) {
      // 数据不可信
      return <Tag color="error">数据不可信</Tag>
    } else if (record.DeviceTrusted === false) {
      // 身份不可信
      return <Tag color="error">身份不可信</Tag>
    } else {
      return '-';
    }
  }

  // 根据MN获取表头
  const getTableColumns = () => {
    props.dispatch({
      type: 'dataSearch/getReportColumns',
      payload: {
        DGIMN: DGIMN,
        ColumnType: "UnTrustedColumn"
      },
      callback: (res) => {
        let columns = [{
          title: '监测点',
          dataIndex: 'PointName',
          key: 'PointName',
          width: 240,
          render: (text, record) => {
            return `${record.EntName} - ${text}`
          }
        }, {
          title: '时间',
          dataIndex: 'Time',
          key: 'Time',
        },
        {
          title: '原因',
          dataIndex: 'DataTrusted',
          key: 'DataTrusted',
          render: (text, record) => {
            return getDataTruseMsg(record)
          }
        }];
        res.map(item => {
          if (item.ChildColumnHeaders) {
            let children = item.ChildColumnHeaders.map(itm => {
              return {
                title: itm.ChildColumnName,
                dataIndex: itm.ChildColumnCode,
                width: 140,
                align: 'center',
                render: (value, row, index) => {
                  const obj = {
                    children: value,
                    props: {},
                  };
                  return obj;
                },
              }
            })
            columns.push({
              title: item.ParenntColumnName,
              children: children
            })
          } else {
            columns.push({
              title: item.ParenntColumnName,
              dataIndex: item.ParenntColumnCode,
              // width: 200,
              align: 'center',
            })
          }
        })
        setColumns(columns)
      }
    })
  }

  // 获取table数据
  const getUnTrustedList = () => {
    props.dispatch({
      type: `dataSearch/getUnTrustedList`,
      payload: {
        BeginTime: time[0].format("YYYY-MM-DD HH:mm:ss"),
        EndTime: time[1].format("YYYY-MM-DD HH:mm:ss"),
        IsAsc: true,
        DGIMN: DGIMN,
        Type: dataType,
        PageIndex: pageIndex,
        PageSize: pageSize
      },
    })
  }

  // 数据类型改变事件
  const onDataTypeChange = value => {
    let beginTime = moment().subtract(1, 'days').format('YYYY-MM-DD HH:00:00');
    let endTime = moment().format('YYYY-MM-DD HH:59:59');
    if (value === 'DayData') {
      beginTime = moment().subtract(1, 'month').format('YYYY-MM-DD HH:00:00');
      endTime = moment().format('YYYY-MM-DD 23:59:59');
    }
    setTime([moment(beginTime), moment(endTime)])
    setDataType(value);
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setPageIndex(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return <BreadcrumbWrapper>
    <Card>
      <Row align="middle">
        <Space>
          <Col>
            <label style={{ marginLeft: 20 }}>时间：</label>
            <RangePicker
              value={time}
              showTime
              onChange={(value, dateString) => {
              }}
              onOk={value => {
                setTime(value)
              }}
            />
          </Col>
          <Col>
            <label style={{ marginLeft: 20 }}>监测点：</label>
            <SelectEntAndPoint style={{ width: 300 }} onChange={value => {
              setDGIMN(value[1]);
            }} />
          </Col>
          <Col>
            <label style={{ marginLeft: 20 }}>数据类型：</label>
            <Select
              defaultValue={dataType}
              style={{
                width: 120,
              }}
              allowClear
              options={[
                {
                  value: 'HourData',
                  label: '小时',
                },
                {
                  value: 'DayData',
                  label: '日',
                },
              ]}
              onChange={onDataTypeChange}
            />
          </Col>
          <Button type="primary" loading={loading} style={{ marginRight: 10 }} onClick={() => {
            if (!DGIMN) {
              message.error('请选择监测点！');
              return;
            }
            getTableColumns();
            setPageIndex(1);
            setPageSize(20)
            if (pageIndex === 1 && pageSize === 20) {
              getUnTrustedList();
            }
          }}>查询</Button>
        </Space>
      </Row>
      <SdlTable
        loading={loading}
        style={{ marginTop: 20 }}
        rowKey={(record, index) => index}
        // loading={loading}
        columns={columns}
        dataSource={dataTrustDataSource}
        onChange={handleTableChange}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          sorter: true,
          total: dataTrustTotal,
          pageSize: pageSize,
          current: pageIndex,
          pageSizeOptions: ['10', '20', '30', '40', '50'],
        }}
        // pagination={false}
        // rowClassName={""}
        // defaultWidth={80}
        // scroll={{ x: '1200px' }}
        bordered
      />
    </Card >
  </BreadcrumbWrapper >
}

export default connect(dvaPropsData)(DataTrust);