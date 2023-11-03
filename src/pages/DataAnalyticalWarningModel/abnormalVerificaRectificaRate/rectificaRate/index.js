/**
 * 功  能：  异常精准识别核实整改率 整改率
 * 创建人：jab
 * 创建时间：2023.10
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Spin, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Progress, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined, FileProtectOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import EntAtmoList from '@/components/EntAtmoList';
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
import { Resizable, ResizableBox } from 'react-resizable';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import RoleList from '@/components/RoleList'
import OperationCompanyList from '@/components/OperationCompanyList'
import { ModalNameConversion } from '../../CONST';
import RectificaRateDetail from './RectificaRateDetail'
import ImageView from '@/components/ImageView';

const { TextArea } = Input;
const { Option } = Select;
const namespace = 'rectificaRate'





const dvaPropsData = ({ loading, rectificaRate }) => ({
  tableDatas: rectificaRate.tableDatas,
  tableTotal: rectificaRate.tableTotal,
  tableLoading: rectificaRate.tableLoading,
  exportLoading: rectificaRate.exportLoading,
  tableDatas2: rectificaRate.tableDatas2,
  tableTotal2: rectificaRate.tableTotal2,
  tableLoading2: rectificaRate.tableLoading2,
  exportLoading2: rectificaRate.exportLoading2,
  tableDatas3: rectificaRate.tableDatas3,
  tableTotal3: rectificaRate.tableTotal3,
  tableLoading3: rectificaRate.tableLoading3,
  exportLoading3: rectificaRate.exportLoading3,
  queryPar: rectificaRate.queryPar,
  tableDatas4: rectificaRate.tableDatas4,
  tableTotal4: rectificaRate.tableTotal4,
  tableLoading4: rectificaRate.tableLoading4,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getModelWarningCheckedRectification: (payload) => { //列表
      dispatch({
        type: `${namespace}/getModelWarningCheckedRectification`,
        payload: payload,
      })
    },
    exportModelWarningCheckedRectification: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportModelWarningCheckedRectification`,
        payload: payload,
      })
    },
  }
}


const Index = (props) => {



  const [form] = Form.useForm();


  const textStyle = {
    width: '100%',
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };





  const { pollutantType, tableDatas, tableTotal, tableLoading, exportLoading, queryPar, tableDatas2, tableTotal2, tableLoading2, exportLoading2, tableDatas3, tableTotal3, tableLoading3, exportLoading3, tableDatas4, tableTotal4, tableLoading4, } = props;
  useEffect(() => {
    onFinish(null, 1);
  }, []);

  let commonCol = (type) => [
    {
      title: '已核实次数',
      dataIndex: 'RectificationCount',
      key: 'RectificationCount',
      align: 'center',
      render: (text, record) => {
        return <a onClick={() => { rectificationNum(record, 0, type) }}>{text}</a>
      }
    },
    {
      title: '已整改次数',
      dataIndex: 'RectificationCount',
      key: 'RectificationCount',
      align: 'center',
      render: (text, record) => {
        return <a onClick={() => { rectificationNum(record, 1, type) }}>{text}</a>
      }
    },
    {
      title: '待整改次数',
      dataIndex: 'NoRectificationCount',
      key: 'NoRectificationCount',
      align: 'center',
      render: (text, record) => {
        return <a onClick={() => { rectificationNum(record, 2, type) }}>{text}</a>
      }
    },
    {
      title: '整改率',
      dataIndex: 'RectificationRate',
      key: 'RectificationRate',
      align: 'center',
      render: (text, record) => {
        return record.RegionName=='全部合计'? '-' : <Progress percent={text && text.replace("%", "")} size="small" style={{ width: '85%' }} status='normal' format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text}</span>} />
      }
    },

  ]
  let regCityCommonCol = (type) => [
    {
      title: '精准识别报警企业数',
      dataIndex: 'CountEnt',
      key: 'CountEnt',
      align: 'center',
    },
    {
      title: '精准识别报警监测点数',
      dataIndex: 'CountPoint',
      key: 'CountPoint',
      align: 'center',
    },
    ...commonCol(type),

  ]
  const [regionCode, setRegionCode] = useState()
  const [regionName, setRegionName] = useState()

  const columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '省',
      dataIndex: 'RegionName',
      key: 'RegionName',
      align: 'center',
      render: (text, record) => {
        const regCode = record.RegionCode || queryPar.regionCode;
        return <a onClick={() => { setPointType(2); setRegionCode(regCode); setRegionName(record.RegionName); onFinish({ ...queryPar, regionCode: regCode }, 2) }}>{text}</a>
      }
    },

    ...regCityCommonCol(1),
  ];
  const columns2 = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '省',
      dataIndex: 'RegionName',
      key: 'RegionName',
      align: 'center',
      render: (text, record, index) => {
        if (text == '全部合计') {
          return { children: text, props: { colSpan: 0 }, };
        } else {
          return text
        }
      }
    },
    {
      title: '市',
      dataIndex: 'CityName',
      key: 'CityName',
      align: 'center',
      render: (text, record, index) => {
        const regCode = record.CityCode ? record.CityCode : regionCode
        const element = <a onClick={() => { setPointType(3); setRegionCode(regCode); onFinish({ ...queryPar, regionCode: regCode }, 3) }}>{text}</a>
        return { props: { colSpan: text == '全部合计' ? 2 : 1 }, children: element, };
      }
    },
    ...regCityCommonCol(2),
  ];
  const columns3 = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex3 - 1) * pageSize3;
      }
    },
    {
      title: '省',
      dataIndex: 'RegionName',
      key: 'RegionName',
      align: 'center',
      render: (text, record, index) => {
        if (text == '全部合计') {
          return { children: text, props: { colSpan: 2 }, };
        } else {
          return text
        }
      }
    },
    {
      title: '市',
      dataIndex: 'CityName',
      key: 'CityName',
      align: 'center',
      render: (text, record, index) => {
        return { props: { colSpan: text == '全部合计' ? 0 : 1 }, children: text, };
      }
    },
    {
      title: '企业名称',
      dataIndex: 'EntName',
      key: 'EntName',
      align: 'center',
    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
    },
    {
      title: '运维负责人',
      dataIndex: 'OperationsUserName',
      key: 'OperationsUserName',
      align: 'center',
    },
    ...commonCol(3),
  ];

  const [rectificaDetailVisible, setRectificaDetailVisible] = useState(false)
  const [modelRectificaGuid, setModelRectificaGuid] = useState()
  const [isOpen, setIsOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageList, setImageList] = useState([]);
  const columns4 = [
    {
      title: '编号',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      ellipsis: true,
      render: (text, record, index) => {
        return (pageIndex4 - 1) * pageSize4 + index + 1;
      },
    },
    {
      title: '企业名称',
      dataIndex: 'EntName',
      key: 'EntName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key: 'PointName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '整改状态',
      dataIndex: 'RectificationStatusName',
      key: 'RectificationStatusName',
      width: 120,
    },
    {
      title: '整改描述',
      dataIndex: 'RectificationDes',
      key: 'RectificationDes',
      width: 200,
      ellipsis: true,
      render: (text, record) => {
        return (
          <Tooltip title={text}>
            <span style={textStyle}>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '整改附件',
      dataIndex: 'RectificationMaterialList',
      key: 'RectificationMaterialList',
      width: 100,
      ellipsis: true,
      render: (text, record) => {
        return (
          text?.[0]&&<a title={text} onClick={()=>{
            setIsOpen(true)
            setImageIndex(0)
            const imgList = text.map(item=>`/${item}`)
            setImageList(imgList)
          }}>
            查看附件
          </a>
        );
      },
    },
    {
      title: '整改人',
      dataIndex: 'OperationsUserName',
      key: 'OperationsUserName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '整改时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      width: 180,
      ellipsis: true,
      sorter: (a, b) => moment(a.CheckedTime).valueOf() - moment(b.CheckedTime).valueOf(),
    },
    {
      title: '操作',
      key: 'handle',
      fixed: 'right',
      width: 100,
      render: (text, record) => {
        return (
          <Tooltip title="查看">
            <a
              onClick={e => {
                setRectificaDetailVisible(true)
                setModelRectificaGuid(record.ID)
              }}
            >
              <DetailIcon style={{ fontSize: 16 }} />
            </a>
          </Tooltip>
        );
      },
    },
  ];
  const [pointType, setPointType] = useState(1)
  const onFinish = async (queryPar, pointType) => {  //查询
    try {
      const values = await form.validateFields();
      const par = queryPar ? { ...queryPar, pointType: pointType } :
        {
          ...values,
          bTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
          eTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
          time: undefined,
          pointType: pointType,
        }
      props.getModelWarningCheckedRectification({
        ...par,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }


  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = async (PageIndex, PageSize) => { //行政区 分页
    setPageIndex(PageIndex)
    setPageSize(PageSize)
  }
  const [pageIndex2, setPageIndex2] = useState(1)
  const [pageSize2, setPageSize2] = useState(20)
  const handleTableChange2 = async (PageIndex, PageSize) => { //市 分页
    setPageIndex2(PageIndex)
    setPageSize2(PageSize)
  }

  const [pageIndex3, setPageIndex3] = useState(1)
  const [pageSize3, setPageSize3] = useState(20)
  const handleTableChange3 = (PageIndex, PageSize) => { //企业 分页
    setPageIndex3(PageIndex)
    setPageSize3(PageSize)
  }
  const [rectificationNumVisible, setRectificationNumVisible] = useState(false)
  const [rectificationNumTitle, setRectificationNumTitle] = useState(false)

  const rectificationNum = (row, status, type) => { //整改详情
    setRectificationNumVisible(true)
    const alarmName = status == 0 ? '已核实次数' : status == 1 ? '已整改次数' : '待整改次数'
    const regCityPointName = type == 1 ? row.RegionName : type == 2 ? row.CityName == '全部合计' ? regionName : row.CityName : row.EntName

    setRectificationNumTitle(`${regCityPointName} - ${alarmName}`)
    setPageIndex4(1)
    const regCode = type == 1 ? row.RegionCode : type == 2 ? row.CityCode || regionCode : undefined;
    onFinish({ ...queryPar, regionCode: regCode, dgimn: row.DGIMN && row.DGIMN, status: status, }, 4)

  }
  const [pageIndex4, setPageIndex4] = useState(1)
  const [pageSize4, setPageSize4] = useState(20)
  const handleTableChange4 = (PageIndex, PageSize) => { //核实次数 分页
    setPageIndex4(PageIndex)
    setPageSize4(PageSize)
  }

  const exports = (queryPar, pointType) => { //导出
    props.exportModelWarningCheckedRectification({
      ...queryPar,
      pointType: pointType,
    })
  }
  const [entCode, setEntCode] = useState()
  const searchComponents = () => {
    return pointType == 1 ? <Form
      form={form}
      layout='inline'
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => { setPointType(1); onFinish(null, 1) }}
      initialValues={{
        time: [moment().subtract(1, 'month').startOf('day'), moment().endOf('day'),],
      }}
    >
      <Form.Item label="日期查询" name="time">
        <RangePicker_ allowClear style={{ width: 350 }} showTime={{
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }} />
      </Form.Item>
      <Form.Item label="行政区" name="regionCode">
        <RegionList style={{ width: 170 }} placeholder='请输入' />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType='submit' loading={tableLoading} style={{ marginRight: 8 }}>
          查询
       </Button>
        <Button icon={<ExportOutlined />} onClick={() => { exports(queryPar, 1) }} loading={exportLoading} style={{ marginRight: 6 }}>
          导出
            </Button>
      </Form.Item>
    </Form>
      :
      pointType == 2 ?
        <Form layout='inline'>
          <Form.Item>
            <Button icon={<ExportOutlined />} onClick={() => { exports({ ...queryPar, regionCode: regionCode }, 2) }} loading={exportLoading2} style={{ marginRight: 6 }}>
              导出
      </Button>
            <Button icon={<RollbackOutlined />} onClick={() => { setPointType(1) }} style={{ marginRight: 6 }}>
              返回
          </Button>
          </Form.Item>
        </Form>
        :
        <Form layout='inline'>
          <Form.Item >
            <EntAtmoList onChange={(value) => { onFinish({ ...queryPar, regionCode: regionCode, entCode: value }, 3); setEntCode(value); }} style={{ width: 260 }} />
          </Form.Item>
          <Form.Item>
            <Button icon={<ExportOutlined />} onClick={() => { exports({ ...queryPar, regionCode: regionCode, entCode: entCode }, 3) }} loading={exportLoading3} style={{ marginRight: 5 }}>
              导出
          </Button>
            <Button icon={<RollbackOutlined />} onClick={() => { setPointType(2) }} style={{ marginRight: 6 }}>
              返回
          </Button>
          </Form.Item>
        </Form>
  }
  return (
    <BreadcrumbWrapper>
      <div className={styles.equipmentManufacturListSty}>
        <Card title={searchComponents()}>
          {pointType == 1 ? <SdlTable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            pagination={false}
          /> :
            pointType == 2 ? <SdlTable
              loading={tableLoading2}
              bordered
              dataSource={tableDatas2}
              columns={columns2}
              pagination={false}
            /> :
              <SdlTable
                loading={tableLoading3}
                bordered
                dataSource={tableDatas3}
                columns={columns3}
                pagination={{
                  total: tableTotal3,
                  pageSize: pageSize3,
                  current: pageIndex3,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: handleTableChange3,
                }}
              />
          }
        </Card>
        <Modal //整改详情
          visible={rectificationNumVisible}
          title={rectificationNumTitle}
          footer={null}
          wrapClassName='spreadOverModal'
          onCancel={() => { setRectificationNumVisible(false) }}
          destroyOnClose
        >
          <SdlTable
            loading={tableLoading4}
            bordered
            align="center"
            dataSource={tableDatas4}
            columns={columns4}
            pagination={{
              total: tableTotal4,
              pageSize: pageSize4,
              current: pageIndex4,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange4,
            }}
          />
        </Modal>
        <Modal //整改详情
          visible={rectificaDetailVisible}
          footer={null}
          wrapClassName={`spreadOverModal ${styles.rectificaDetailSty}`}
          onCancel={() => { setRectificaDetailVisible(false) }}
          destroyOnClose
          bodyStyle={{
            padding: 0,
          }}
        >
          <RectificaRateDetail  onCancel={() => { setRectificaDetailVisible(false) }} match={{ params: { id: modelRectificaGuid } }} hideBreadcrumb  height='calc(100vh - 52px)' />
        </Modal>
        {/* 查看附件弹窗 */}
        <ImageView
          isOpen={isOpen}
          images={imageList?.length ? imageList : []}
          imageIndex={imageIndex}
          onCloseRequest={() => {
            setIsOpen(false);
          }}
        />
      </div>
    </BreadcrumbWrapper>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);