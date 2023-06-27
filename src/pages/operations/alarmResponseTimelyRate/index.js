/**
 * 功  能：报警响应及时率
 * 创建人：jab
 * 创建时间：2023.06.27
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import styles from './styles.less';

import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'operations'

const dvaPropsData = ({ loading, operations }) => ({
  resNumTableTotal: operations.alarmResTimelyResNumTableTotal,
  resNumQueryPar: operations.alarmResTimelyResNumQueryPar,
  regQueryPar: operations.alarmResTimelyRegQueryPar,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getResponseList: (payload, callback) => {
      dispatch({
        type: `${namespace}/getResponseList`,
        payload: payload,
        callback: callback,
      })
    },
  }
}
const Index = (props) => {


  const [form] = Form.useForm();

  const { time, pollutantType, resNumTableTotal, regQueryPar, resNumQueryPar } = props;

  useEffect(() => {
    onFinish(1)
  }, [])

  const commonCol = (type) =>[
    {
      title: '报警响应情况',
      width: 200,
      children: [
        {
          title: '总数',
          dataIndex: 'allCount',
          key: 'allCount',
          width: 50,
          align: 'center',
          render: (text, record) => {
            return <Button type="link" onClick={() => { responseNum(record, '',type) }}>{text}</Button>
          }
        },
        {
          title: "响应及时数",
          dataIndex: 'responseCount',
          key: 'responseCount',
          width: 100,
          align: 'center',
          render: (text, record) => {
            return <Button type="link" onClick={() => { responseNum(record, 1,type) }}>{text}</Button>
          }
        },
        {
          title: "响应超时数",
          dataIndex: 'noResponseCount',
          key: 'noResponseCount',
          width: 100,
          align: 'center',
          render: (text, record) => {
            return <Button type="link" onClick={() => { responseNum(record, 2,type) }}>{text}</Button>
          }
        },
        {
          title: '及时率',
          dataIndex: 'rate',
          key: 'rate',
          width: 100,
          align: 'center',
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text && text}
                  size="small"
                  style={{ width: '80%' }}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}
                />
              </div>
            );
          }
        },
      ],
    }
  ]
  const regColumns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '省',
      dataIndex: 'provinceName',
      key: 'provinceName',
      align: 'center',
      render: (text, record, index) => {
        return <Button type="link" onClick={() => { regDetail(record) }}>{text}</Button>
      }
    },
    ...commonCol('reg'),
  ];
  const cityColumns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return index+1
      }
    },
    {
      title: '省',
      dataIndex: 'provinceName',
      key: 'provinceName',
      align: 'center',
      render: (text, record, index) => {
        if (text == '合计') {
          return { children: text, props: { colSpan: 2 }, };
        } else {
          return text
        }
      }
    },
    {
      title: '市',
      dataIndex: 'cityName',
      key: 'cityName',
      align: 'center',
      render: (text, record, index) => {
        return { props: { colSpan: text == '合计' ? 2 : 1 }, children: text, };
      }
    },
    ...commonCol('city'),
  ];
  const resNumColumns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '省',
      dataIndex: 'provinceName',
      key: 'provinceName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '市',
      dataIndex: 'cityName',
      key: 'cityName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '站点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '报警类型',
      dataIndex: 'alarmTypeName',
      key: 'alarmTypeName',
      align: 'center',
      ellipsis: true,
      width: 100,
    },
    {
      title: '报警详情',
      dataIndex: 'alarmMsg',
      key: 'alarmMsg',
      align: 'left',
      ellipsis: true,
      width: 180,
    },
    {
      title: '报警生成时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '响应及时状态',
      dataIndex: 'responseStatus',
      key: 'responseStatus',
      align: 'center',
      ellipsis: true,
      width: 100,
    },
  ];




  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      layout='inline'
      onFinish={() => { onFinish(1) }}
      initialValues={{
        pollutantType: pollutantType,
        time: time ? time : [moment().add(-30, 'd'), moment()],
        exceptionType: [],
      }}
    >
      <Form.Item name='time' label='日期'>
        <RangePicker_ format='YYYY-MM-DD' allowClear={false} />
      </Form.Item>
      <Form.Item label='监测点类型' name='pollutantType'>
        <Select placeholder='请选择' style={{ width: 120 }} allowClear>
          <Option value={'2'}>废气</Option>
          <Option value={'1'}>废水</Option>
        </Select>
      </Form.Item>
      <Form.Item label='报警类型' name='exceptionType'>
        <Select style={{ width: 220 }} placeholder='请选择' allowClear  mode="multiple"  maxTagCount={2}  maxTagPlaceholder="...">
          <Option value={0}>超标报警</Option>
          <Option value={2}>异常报警</Option>
          <Option value={12}>缺失报警</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType='submit' loading={regTableLoading}>
          查询
       </Button>
      </Form.Item>
    </Form>

  }
  const [regTableLoading, setRegTableLoading] = useState(false)
  const [regTable, setRegTable] = useState([])
  const [cityTableLoading, setCityTableLoading] = useState(false)
  const [cityTable, setCityTable] = useState([])

  const onFinish = async (type, regionCode) => {  //查询  par参数 分页需要的参数 
    type == 1 ? setRegTableLoading(true) : setCityTableLoading(true)
    try {
      const values = await form.validateFields();
      props.getResponseList(type == 1 ? {
        ...values,
        pointType: 1,
        beginTime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
      } : { ...regQueryPar, pointType: 2, regionCode: regionCode }, (res) => {
        if (type == 1) {
          setRegTableLoading(false)
          setRegTable(res)
        } else {
          setCityTableLoading(false)
          setCityTable(res)
        }
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const [cityDetailVisible, setCityDetailVisible] = useState(false)
  const [cityDetailTitle, setCityDetailTitle] = useState()
  const regDetail = (record) => {
    setCityDetailVisible(true)
    setCityDetailTitle(`${record.provinceName}-报警响应及时率详情`)
    onFinish(2, record.regionCode)
  }


  const resNumQuest = (pageIndexs, pageSizes,regionCode, status, par) => {
    setResNumLoading(true)
    setPageIndex(pageIndexs)
    setPageSize(pageSizes)
    props.getResponseList(par ? par : {
      ...regQueryPar,
      regionCode:regionCode,
      pointType: 3,
      status: status,
      entName: resNumEntName,
      pageIndex: pageIndexs,
      pageSize: pageSizes,
    }, (res) => {
      setResNumLoading(false)
      setResNumTable(res)
    })
  }
  const [resNumVisible, setResNumVisible] = useState(false)
  const [resNumTitle, setResNumTitle] = useState()
  const [resNumLoading, setResNumLoading] = useState(false)
  const [resNumTable, setResNumTable] = useState([])
  const [resNumRegionCode, setResNumRegionCode] = useState()
  const responseNum = (record, status,type) => {
    setResNumVisible(true)
    setResNumTitle(`${record.provinceName}${type=='city' ? record.cityName : ''}-报警响应情况`)
    setResNumStatus(status)
    setResNumRegionCode(record.regionCode)
    resNumQuest(1, 20,record.regionCode,status)
  }
  const [resNumEntName, setResNumEntName] = useState()
  const [resNumStatus, setResNumStatus] = useState('')
  const resStatusChange = (e) => {
    setResNumStatus(e.target.value)
    resNumQuest(1, 20,resNumRegionCode, status)
  }
  const resNumSearchComponents = () => {
    return <Form
      layout='inline'
      style={{ paddingBottom: 12 }}
      initialValues={{
        status: '',
      }}
    >
      <Form.Item>
        <Input placeholder='请输入企业名称' allowClear onChange={(e) => setResNumEntName(e.target.value)} />
      </Form.Item>
      <Form.Item >
        <Radio.Group value={resNumStatus} onChange={resStatusChange}>
          <Radio.Button value=''>全部</Radio.Button>
          <Radio.Button value={1}>响应及时</Radio.Button>
          <Radio.Button value={2}>响应超时</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item>
        <Button type='primary' loading={resNumLoading} onClick={()=>{resNumQuest(1, 20, resNumRegionCode,resNumStatus)}}>查询</Button>
      </Form.Item>
    </Form>

  }
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    resNumQuest(PageIndex, PageSize,resNumRegionCode, resNumStatus, { ...resNumQueryPar, pageIndex: PageIndex, pageSize: PageSize })
  }


  return (
    <BreadcrumbWrapper>
      <Card title={searchComponents()}>
        <SdlTable
          loading={regTableLoading}
          bordered
          dataSource={regTable}
          columns={regColumns}
          pagination={false}
        />
        <Modal
          title={cityDetailTitle}
          wrapClassName='spreadOverModal'
          visible={cityDetailVisible}
          onCancel={() => { setCityDetailVisible(false) }}
          footer={null}
        >
          <SdlTable
            loading={cityTableLoading}
            bordered
            dataSource={cityTable}
            columns={cityColumns}
            pagination={false}
            footer={null}
          />
        </Modal>
        <Modal
          title={resNumTitle}
          wrapClassName={`spreadOverModal`}
          className={ styles.resNumModalSty}
          visible={resNumVisible}
          onCancel={() => { setResNumVisible(false) }}
          footer={null}
          zIndex={1000}
        >
          {resNumSearchComponents()}
          <SdlTable
            loading={resNumLoading}
            resizable
            dataSource={resNumTable}
            columns={resNumColumns}
            pagination={{
              total: resNumTableTotal,
              pageSize: pageSize,
              current: pageIndex,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange,
            }}
          />
        </Modal>
      </Card>
    </BreadcrumbWrapper>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);