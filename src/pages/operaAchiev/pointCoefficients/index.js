

/**
 * 功  能： 点位系数 点位系数清单 
 * 创建人：jab
 * 创建时间：2022.05.18
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Card,Space, Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,FilterFilled , CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import NumTips from '@/components/NumTips'
import styles from "../style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
import tableList from '@/pages/list/table-list';

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'operaAchiev'




const dvaPropsData =  ({ loading,operaAchiev,global,common, }) => ({
  tableDatas:operaAchiev.pointCoefficientList,
  tableTotal:operaAchiev.pointCoefficientTotal,
  tableLoading: loading.effects[`${namespace}/getPointCoefficientList`],
  exportLoading:loading.effects[`${namespace}/exportPointCoefficient`],
  loadingEditConfirm:loading.effects[`${namespace}/addOrEditPointCoefficient`],
  clientHeight: global.clientHeight,
  regLoading: loading.effects[`autoForm/getRegions`],
  entLoading:common.entLoading,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getTableData:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getPointCoefficientList`,
        payload:payload,
      })
    },
    exportData : (payload,callback) =>{ // 导出
      dispatch({
        type: `${namespace}/exportPointCoefficient`,
        payload:payload,
        callback:callback
      })
      
    },
    getEntByRegionCallBack: (payload, callback) => { //企业
        dispatch({
          type: `common/getEntByRegionCallBack`,
          payload: payload,
          callback: callback
        })
      },
    getPointByEntCode: (payload, callback) => { //监测点
        dispatch({
          type: `common/getPointByEntCode`,
          payload: payload,
          callback: callback
        })
      },
    addOrEditPointCoefficient: (payload, callback) => { //修改
        dispatch({
          type: `${namespace}/addOrEditPointCoefficient`,
          payload: payload,
          callback: callback
        })
      },
    
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  
  const [ manufacturerId, setManufacturerId] = useState(undefined)

  const  { tableDatas,tableTotal,tableLoading,exportLoading} = props;
  
  const isList =  props.match&&props.match.path ==='/operaAchiev/pointCoefficientList'? true : false;

  useEffect(() => {
    onFinish(pageIndex,pageSize)
  },[]);
  const columns = [
    {
        title: '序号',
        align: 'center',
        width:80,
        render:(text,record,index)=>{
          return  (index + 1) + (pageIndex-1)*pageSize;
        }
      },
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        align: 'center',
        ellipsis:true,
      },
      {
        title: `企业名称`,
        dataIndex: 'EntName',
        key: 'EntName',
        align: 'center',
        ellipsis:true,
      },
      {
        title: '监测点名称',
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
        ellipsis:true,
      },
      {
        title: '设备编号(MN)',
        dataIndex: 'DGIMN',
        key: 'DGIMN',
        align: 'center',
        ellipsis:true,
      },
      {
        title: '监测点类型',
        dataIndex: 'PollutantTypeName',
        key: 'PollutantTypeName',
        align: 'center',
        ellipsis:true,
      },
      {
        title: '系数',
        dataIndex: 'Coefficient',
        key: 'Coefficient',
        align: 'center',
        ellipsis:true,
      },
      {
        title: '运维负责人',
        dataIndex: 'OprationUserName',
        key: 'OprationUserName',
        align: 'center',
        ellipsis:true,
      },
      {
        title: '设备类型',
        dataIndex: 'EquipmentType',
        key: 'EquipmentType',
        align: 'center',
        ellipsis:true,
        width:150,
      },
      {
        title: '监测因子',
        dataIndex: 'PollutantNames',
        key: 'PollutantNames',
        align: 'center',
        ellipsis:true,
        width:150,
      },
      {
        title: '项目编号',
        dataIndex: 'ProjectCode',
        key: 'ProjectCode',
        align: 'center',
        ellipsis:true,
      },
      {
        title: '合同起止时间',
        dataIndex: 'ProjectTime' ,
        key: 'ProjectTime',
        align: 'center',
        ellipsis:true,
      },
      
      {
        title: '实际起止时间',
        dataIndex: 'AgreementTime',
        key: 'AgreementTime',
        align: 'center',
        ellipsis:true,
      },
      {
        title: '巡检频次',
        dataIndex: 'OprationFrequency',
        key: 'OprationFrequency',
        align: 'center',
        ellipsis:true,
      },
  ];

  isList&&columns.push({
    title: <span>操作</span>,
    dataIndex: 'x',
    key: 'x',
    align: 'center',
    width:80,
    render: (text, record) =>{
      return  <span>
             <Fragment><Tooltip title="编辑"> <a  onClick={()=>{edit(record)}} ><EditIcon /></a> </Tooltip></Fragment>

           </span>
    }
  },)
  
  const [fromVisible,setFromVisible] = useState(false)
  const [title,setTitle] = useState(null)
  const edit =  (record) => {
    setFromVisible(true);
    setTitle(`${record.EntName} - ${record.PointName}` )
    form2.resetFields();
    form2.setFieldsValue({
     ...record,
    })
  };
 
  const onModalOk  = async () =>{ //添加 or 编辑弹框
    try {
      const values = await form2.validateFields();//触发校验
      if(values.Coefficient<=0){
        message.warning('请输入大于0的监测点系数')
        return;
      }
       props.addOrEditPointCoefficient({
        ...values,
      },()=>{
        setFromVisible(false)
        onFinish(pageIndex,pageSize)
      })

      
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }

  const onFinish  = async (pageIndexs,pageSizes,) =>{  //查询
    try {
      const values = await form.validateFields();
      setPageIndex(pageIndexs)
      setPageSize(pageSizes)
      props.getTableData({
        ...values,
        pageIndex:pageIndexs,
        pageSize:pageSizes,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }




  // const handleTableChange = (PageIndex, PageSize) =>{
  //   setPageIndex(PageIndex)
  //   setPageSize(PageSize)
  //   onFinish(PageIndex,PageSize)
  // }

  const tableChange = (pagination, filters, sorter) =>{
    
    const  PageIndex = pagination.current,PageSize=pagination.pageSize;
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize,)
   

}
  const exports =  async () => {
    const values = await form.validateFields();
    props.exportData({
       ...values,
       pageIndex:undefined,
       pageSize:undefined,
    })
     
 };

  const [pageSize,setPageSize]=useState(20)
  const [pageIndex,setPageIndex]=useState(1)

  const [pointList, setPointList] = useState([])
  const [pointLoading, setPointLoading] = useState(false)
  const onValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'EntCode') {
      if (!hangedValues.EntCode) { //清空时 不走请求
        form.setFieldsValue({ DGIMN: undefined })
        setPointList([])
        return;
      }
      setPointLoading(true)
      props.getPointByEntCode({ EntCode: hangedValues.EntCode }, (res) => {
        setPointList(res)
        setPointLoading(false)
        console.log(res[0].DGIMN)
        form.setFieldsValue({ DGIMN: res[0].DGIMN })
      })
    }
  }
  const searchComponents = () =>{
    return <Form
    form={form}
    name="advanced_search"
    onFinish={() => { setPageIndex(1);  onFinish(1, pageSize,) }}
    initialValues={{
      month: moment(moment().format('YYYY-MM'))
    }}
    layout='inline'
    onValuesChange={onValuesChange}
  >
        <Spin  size='small' spinning={props.regLoading} style={{top:5, left:20 }}>
        <Form.Item label='行政区' name='RegionCode' >
          <RegionList levelNum={3} style={{ width: 150 }}/>
        </Form.Item>
        </Spin>
        <Spin spinning={props.entLoading} size='small' style={{top:5, }}>
        <Form.Item label='企业' name='EntCode' style={{ marginLeft:8,marginRight:8 }}>
          <EntAtmoList  style={{ width: 200}} />
        </Form.Item>
        </Spin>
        <Spin spinning={pointLoading} size='small' style={{top:5,left:20 }}>
          <Form.Item label='监测点名称' name='DGIMN' >

            <Select placeholder='请选择' allowClear  showSearch optionFilterProp="children" style={{ width: 150 }}>
              {
                pointList[0] && pointList.map(item => {
                  return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                })
              }
            </Select>
          </Form.Item>
        </Spin>

      <Form.Item>
        <Button   loading={tableLoading} type="primary" loading={tableLoading} htmlType="submit">
          查询
       </Button>
        <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
          重置
        </Button>
            {!isList&&<Button icon={<ExportOutlined />}   loading={exportLoading}  onClick={()=>{ exports()} }>
            导出
         </Button>}
      </Form.Item>
  </Form>
  }
  const cardComponents = () =>{
   return     <Card title={searchComponents()}>
   <SdlTable
     resizable
     loading = {tableLoading}
     bordered
     dataSource={tableDatas}
     columns={columns}
     onChange={tableChange}
     pagination={{
       total:tableTotal,
       pageSize: pageSize,
       current: pageIndex,
       showSizeChanger: true,
       showQuickJumper: true,
       // onChange: handleTableChange,
     }}
   />
</Card>
  }
  return (   
    <div  className={styles.operaAchievSty}>
      {!isList?
    <div>{cardComponents()}</div>
    :
    <BreadcrumbWrapper>
       {cardComponents()}
   </BreadcrumbWrapper>
}
   <Modal
        title={title}
        visible={fromVisible}
        onOk={onModalOk}
        confirmLoading={props.loadingEditConfirm}
        onCancel={()=>{setFromVisible(false)}}
        className={styles.fromModal}
        destroyOnClose
        // centered
      >
    <Form
      name="basic"
      form={form2}
    >
        <Form.Item   label="监测点系数" name="Coefficient"  rules={[  { required: true, message: '请输入监测点系数'  }]}>
        <InputNumber style={{ width: 200}}  placeholder='请输入' />
      </Form.Item>
      <Form.Item   name="DGIMN" hidden>
          <Input />
      </Form.Item> 
      <Form.Item   name="ID" hidden>
          <Input />
      </Form.Item> 
    </Form>
      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);

