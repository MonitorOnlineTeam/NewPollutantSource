

/**
 * 功  能：污染源信息 监测点系数
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

const namespace = 'pollutantInfo'




const dvaPropsData =  ({ loading,pollutantInfo,global,common, }) => ({
  tableDatas:pollutantInfo.systemModelTableDatas,
  tableTotal:pollutantInfo.systemModelTableTotal,
  tableLoading: loading.effects[`${namespace}/getSystemModelOfPoint`],
  exportLoading:loading.effects[`${namespace}/exportSystemModelOfPoint`],
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
        type: `${namespace}/getSystemModelOfPoint`,
        payload:payload,
      })
    },
    exportData : (payload,callback) =>{ // 导出
      dispatch({
        type: `${namespace}/exportSystemModelOfPoint`,
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
          type: `remoteSupervision/getPointByEntCode`,
          payload: payload,
          callback: callback
        })
      },

    
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  
  const [ manufacturerId, setManufacturerId] = useState(undefined)

  const  { tableDatas,tableTotal,tableLoading,exportLoading} = props;
  

  useEffect(() => {
    onFinish(pageIndex,pageSize)
  },[]);
  const columns = [
    {
        title: '序号',
        align: 'center',
        width:80,
        render:(text,record,index)=>{
          return index+1
        }
      },
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        align: 'center',
      },
      {
        title: `企业名称`,
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
        title: '监测点类别',
        dataIndex: 'PollutantTypeName',
        key: 'PollutantTypeName',
        align: 'center',
      },
  ];

 



  const onFinish  = async (pageIndexs,pageSizes,filters) =>{  //查询
    try {
      const values = await form.validateFields();
      props.getTableData({
        ...values,
        ManufacturerId:manufacturerId,
        pageIndex:pageIndexs,
        pageSize:pageSizes,
       ...filters,
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
    setFilteredInfo(props.filteredHandle(filters))
    onFinish(PageIndex, PageSize,props.filteredHandle(filters))
   

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
    onFinish={() => { setPageIndex(1);  onFinish(1, pageSize,filteredInfo) }}
    initialValues={{
      month: moment(moment().format('YYYY-MM'))
    }}
    layout='inline'
    onValuesChange={onValuesChange}
  >
        <Spin  size='small' spinning={props.regLoading} style={{ left:20 }}>
        <Form.Item label='行政区' name='RegionCode' >
          <RegionList levelNum={3} style={{ width: 150 }}/>
        </Form.Item>
        </Spin>
        <Spin spinning={props.entLoading} size='small'>
        <Form.Item label='企业' name='EntCode' style={{ marginLeft:8,marginRight:8 }}>
          <EntAtmoList  style={{ width: 200}} />
        </Form.Item>
        </Spin>
        <Spin spinning={pointLoading} size='small' style={{left:20 }}>
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
        <Button icon={<ExportOutlined />}   loading={exportLoading}  onClick={()=>{ exports()} }>
            导出
         </Button> 
      </Form.Item>
  </Form>
  }
  return (
    <div  className={styles.pollutantInfoSty}>
    <Card title={searchComponents()}>
      <SdlTable
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
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);

