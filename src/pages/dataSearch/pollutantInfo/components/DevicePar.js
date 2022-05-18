

/**
 * 功  能：污染源信息 设备参数
 * 创建人：jab
 * 创建时间：2022.04.02
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Space,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,FilterFilled,CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
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

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'pollutantInfo'




const dvaPropsData =  ({ loading,pollutantInfo,global }) => ({
  tableDatas:pollutantInfo.monitorParamTableDatas,
  tableTotal:pollutantInfo.monitorParamTableTotal,
  tableLoading: loading.effects[`${namespace}/getMonitorPointParamOfPoint`],
  exportLoading:loading.effects[`${namespace}/exportMonitorPointParamOfPoint`],
  clientHeight: global.clientHeight,
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
        type: `${namespace}/getMonitorPointParamOfPoint`,
        payload:payload,
      })
    },
    exportData : (payload,callback) =>{ // 导出
      dispatch({
        type: `${namespace}/exportMonitorPointParamOfPoint`,
        payload:payload,
        callback:callback
      })
      
    },

    
    
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  

  const  { tableDatas,tableTotal,tableLoading,exportLoading} = props;
  

  useEffect(() => {
   onFinish(pageIndex,pageSize)
  },[]);
  const [filteredInfo,setFilteredInfo] = useState(null) 

//   const [paramNameStatus,setParamNameStatus] = useState(null) 


//   const selectedVal = {
//     ParamName : paramNameStatus,
//   } 
//   const   getFilterProps = dataIndex => {
    
//     const selectFlag =  `${dataIndex},${selectedVal[dataIndex]}` === filteredInfo;
//   return {
//     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//       <div>
//          <Radio.Group onChange={(e)=>{ 
//            dataIndex=='ParamName'?  setParamNameStatus(e.target.value) : 
//            null ; 
//            }} value={selectedVal[dataIndex]}>
//          <Space direction="vertical">
//            <Radio value={'1'} style={{padding:'5px 12px 0 12px'}}>已维护</Radio>
//            <Radio value={'0'} style={{padding:'0  12px 5px 12px'}}>未维护</Radio>
//            </Space>
//          </Radio.Group>
          
//           <div className='ant-table-filter-dropdown-btns'>
//           <Button  disabled={!selectFlag && !selectedVal[dataIndex]} size="small" type="link" onClick={()=>{
//            dataIndex=='ParamName'?  setParamNameStatus(null) :  
//             null;
//               confirm({ closeDropdown: false })
//               setFilteredInfo(null)
//               onFinish(pageIndex,pageSize)
//             }}>
//             重置
//           </Button>
//           <Button disabled={!selectFlag && !selectedVal[dataIndex]} type="primary" onClick={() => {
//               confirm({ closeDropdown: false })
//               setFilteredInfo(`${dataIndex},${selectedVal[dataIndex]}`)

//               onFinish(pageIndex,pageSize,`${dataIndex},${selectedVal[dataIndex]}`)
//              }
//              }  size="small" >
//             确定
//           </Button>
//           </div>
//       </div>
//     ),
//     filterIcon: filtered => {     
//        return <FilterFilled style={{ color: selectFlag ? '#1890ff' : undefined }} />
//     },
//   }
// }
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
      title: '行政区',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },

    {
      title: '企业名称',
      dataIndex: 'EntName',
      key:'EntName',
      align:'center',
    },
    {
        title: '监测点名称',
        dataIndex: 'PointName',
        key:'PointName',
        align:'center',
      },
      {
        title: '监测点类型',
        dataIndex: 'PollutantTypeName',
        key:'PollutantTypeName',
        align:'center',
      },
    {
      title: '设备参数类别',
      dataIndex: 'ParamName',
      key:'ParamName',
      align:'center',
      width:180,
      // ...getFilterProps('ParamName'),
      filters: [
        { text: '已维护', value: '1' },
        { text: '未维护', value: '0' },
      ],
      filterMultiple:false,
    },
  ];

 



  const onFinish  = async (pageIndexs,pageSizes,filters) =>{  //查询
    try {
      const values = await form.validateFields();

      props.getTableData({
        ...values,
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

  const searchComponents = () =>{
    return <><Form
    form={form}
    name="advanced_search"
    onFinish={() => { setPageIndex(1);  onFinish(1, pageSize,filteredInfo)}}
    initialValues={{
    }}
    layout='inline'
  >    
        <Form.Item label='企业名称' name='EntName'>
       <Input allowClear placeholder='请输入'/>
      </Form.Item>
      <Form.Item label='行政区' name='RegionCode' >
        <RegionList levelNum={2} />
      </Form.Item>
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
  <div style={{color:'#f5222d',paddingTop:12,fontSize:14}}> 设备参数类别是异常小时数记录电子表单的一个字段，设置后，运维工程师才能在APP上填写异常小时数记录电子表单。
</div>
  </>
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

