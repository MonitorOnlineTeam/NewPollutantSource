/**
 * 功  能：运维绩效  个人绩效查询
 * 创建人：jab
 * 创建时间：2022.05.17
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag,Tabs, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,ProfileOutlined,CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import NumTips from '@/components/NumTips'
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

import PersonalShare  from './components/PersonalShare'
import PersonalWorkInfo  from './components/PersonalWorkInfo'
const userId = Cookie.get('currentUser') && JSON.parse(Cookie.get('currentUser')) && JSON.parse(Cookie.get('currentUser')).UserId;

const namespace = 'operaAchiev'
const dvaPropsData = ({ loading, operaAchiev, global }) => ({
  tableTotal: operaAchiev.personalPerformanceRateTotal,
  tableDatas: operaAchiev.personalPerformanceRateList,
  tableLoading:loading.effects[`${namespace}/getPersonalPerformanceRateList`],
  exportLoading:loading.effects[`${namespace}/exportPersonalPerformanceRate`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getPersonalPerformanceRateList: (payload) => { //列表
      dispatch({
          type: `${namespace}/getPersonalPerformanceRateList`,
          payload: payload,
      })
  },
   exportPersonalPerformanceRate: (payload) => { //导出
    dispatch({
        type: `${namespace}/exportPersonalPerformanceRate`,
        payload: payload
    })
   },
  }
}


const Index = (props) => {
  const [form] = Form.useForm();

  const {tableTotal, tableDatas, tableLoading, exportLoading, } = props;

   useEffect(()=>{
    onFinish()
   },[])

  const columns = [
    {
        title: '序号',
        align: 'center',
        width: 50,
        render: (text, record, index) => {
            return index + 1;
        }
    },
    {
        title: '员工编号',
        dataIndex: 'UserAccount',
        key: 'UserAccount',
        align: 'center',
    },
    {
        title: '姓名',
        dataIndex: 'UserName',
        key: 'UserName',
        align: 'center',
    },
    {
      title: '污染源气绩效套餐',
      dataIndex: 'GasPerformance',
      key: 'GasPerformance',
      align: 'center'
  },
    {
        title: '污染源水绩效套餐',
        dataIndex: 'WaterPerformance',
        key: 'WaterPerformance',
        align: 'center'
    },

    {
        title: <span>操作</span>,
        dataIndex: 'x',
        key: 'x',
        align: 'center',
        render: (text, record) => {
            return <span>
                <Fragment>
                    <Tooltip title="详情">
                        <a  onClick={()=>{detail(record)}}>  <ProfileOutlined style={{ fontSize: 16 }} /></a>
                    </Tooltip>
                </Fragment>
            </span>
        }
    },
];


  const onFinish = async () => {  //查询
    try {
      const values = await form.validateFields();
      const par = {
        ...values,
        Month: values.Month && moment(values.Month).format("YYYY-MM-01 00:00:00"),
        ID:userId,
      }
      props.getPersonalPerformanceRateList({ ...par })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }



  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState(null)
  const [detailPar, setDetailPar] = useState(null)

  const detail = (record) =>{
      setVisible(true)
      setDetailPar({
        Month: form.getFieldValue('Month').format("YYYY-MM-01 00:00:00"),
        UserAccount: record.UserAccount,
        UserName:record.UserName,
        UserId: record.UserId,
      })
      setTitle(`${record.UserName}`)  
  }

  const exports = async () => {
    const values = await form.getFieldsValue();
    const par = {
      ...values,
      Month: values.Month && moment(values.Month).format("YYYY-MM-01 00:00:00"),
    }
    props.exportPersonalPerformanceRate({...par})
};



  const searchComponents = () => {
    return <Form
      name="advanced_search"
      form={form}
      layout='inline'
      onFinish={() => { onFinish() }}
      initialValues={{
        Month: moment().add(-1, 'M'),
      }}
    >


      <Form.Item label='统计月份' name='Month'>
        <DatePicker picker="month" allowClear={false} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" loading={tableLoading}>
          查询
      </Button>
        <Button style={{ margin: '0 8px', }} onClick={() => { form.resetFields(); }}  >
          重置
      </Button>
      <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports() }}>
          导出
     </Button>
      </Form.Item>

    </Form>
  }



  return (
    <div>
      <BreadcrumbWrapper>

        <Card title={searchComponents()}>

          <SdlTable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            pagination={false}
          />
        </Card>
        <Modal
          title={title}
          visible={visible}
          footer={null}
          onCancel={() => { setVisible(false) }}
          destroyOnClose
          width='95%'
          // centered
        >
          <Tabs tabPosition='left'>
            <TabPane tab="个人分摊套数" key="1">
              <PersonalShare props  detailPar={detailPar}/>
            </TabPane>
            <TabPane tab='个人工单信息' key="2">
              <PersonalWorkInfo props  detailPar={detailPar}/>
            </TabPane>
          </Tabs>
        </Modal>
      </BreadcrumbWrapper>


    </div>
  );
};


export default connect(dvaPropsData, dvaDispatch)(Index);