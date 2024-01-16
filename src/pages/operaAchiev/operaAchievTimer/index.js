

/**
 * 功  能：绩效定时器
 * 创建人：jab
 * 创建时间：2022.05.19
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

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'operaAchiev'




const dvaPropsData =  ({ loading,operaAchiev,global }) => ({
  tableDatas:operaAchiev.systemModelTableDatas,
  tableTotal:operaAchiev.systemModelTableTotal,
  tableLoading: loading.effects[`${namespace}/getSystemModelOfPoint`],
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
        type: `${namespace}/getSystemModelOfPoint`,
        payload:payload,
      })
    },


    
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  


  const  { tableDatas,tableTotal,tableLoading,} = props;
  

  useEffect(() => {
    onFinish(pageIndex,pageSize)
  },[]);

  const columns = [
    {
        title: '序号',
        align: 'center',
        render: (text, record, index) => {
            return (index + 1) + (pageIndex-1)*pageSize;
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
      width:200,
    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key:'PointName',
      align:'center',
    },
    {
      title: '污染源类型',
      dataIndex: 'GasManufacturer',
      key:'GasManufacturer',
      align:'center',
    },
    {
      title: '工单类型系数',
      dataIndex: 'GasEquipment',
      key:'GasEquipment',
      align:'center',
    },
    {
      title: '运维频次系数',
      dataIndex: 'PMManufacturer',
      key:'PMManufacturer',
      align:'center',
    },  
    {
      title: '员工编号',
      dataIndex: 'PMEquipment',
      key:'PMEquipment', 
      align:'center',
    },
    {
      title: '个人分摊套数',
      dataIndex: 'PMEquipment',
      key:'PMEquipment', 
      align:'center',
    },
  ];

 



  const onFinish  = async (pageIndexs,pageSizes) =>{  //查询
    try {
      const values = await form.validateFields();
      props.getTableData({
        ...values,
        pageIndex:pageIndexs,
        pageSize:pageSizes,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }




  const handleTableChange = (PageIndex, PageSize) =>{
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex,PageSize)
  }



  const [pageSize,setPageSize]=useState(20)
  const [pageIndex,setPageIndex]=useState(1)


  return (
    <div  className={styles.achievInfoSty}>
   <BreadcrumbWrapper>
    <Card title={null}>
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        pagination={{
          total:tableTotal,
          pageSize: pageSize,
          current: pageIndex,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handleTableChange,
        }}
      />
   </Card>
   </BreadcrumbWrapper>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);

