/**
 * 功  能：系统信息
 * 创建人：jab
 * 创建时间：2023.09.05
 */
import React, { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tabs, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Popover, Tag, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
import cuid from 'cuid';
const { TabPane } = Tabs;
const { Option } = Select;
const namespace = 'ctPollutantManger'




const dvaPropsData = ({ loading, ctPollutantManger, commissionTest, }) => ({
  manufacturerList: commissionTest.manufacturerList,
  systemModelList: ctPollutantManger.systemModelList,
  loadingSystemModel: loading.effects[`${namespace}/testGetSystemModelList`] || false,
  systemModelListTotal: ctPollutantManger.systemModelListTotal,
  cEMSSystemListLoading: loading.effects[`${namespace}/getCEMSSystemList`],
  operationCEMSSystemLoading: loading.effects[`${namespace}/operationCEMSSystem`],
  systemEditingKey: ctPollutantManger.systemEditingKey,
  systemData: ctPollutantManger.systemData,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getManufacturerList: (payload, callback) => { //厂家下拉列表
      dispatch({
        type: `commissionTest/getManufacturerList`,
        payload: payload,
        callback: callback
      })
    },
    testGetSystemModelList: (payload, callback) => { //cems系统型号 弹框
      dispatch({
        type: `${namespace}/testGetSystemModelList`,
        payload: payload,
        callback: callback,
      })
    },
    getCEMSSystemList: (payload, callback) => { // 获取监测点，系统信息，系统变更信息仪表信息，仪表变更信息
      dispatch({
        type: `${namespace}/getCEMSSystemList`,
        payload: payload,
        callback: callback,
      })
    },
  }
}




const Index = (props) => {

  const { manufacturerList, systemModelList, systemModelListTotal, systemEditingKey, systemData, } = props;

  const { dgimn, current } = props;


  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  useEffect(() => {

  }, []);

  const systemEdit = (record) => {
    form.setFieldsValue({
      ...record,
      SystemName: Number(record.SystemNameID),
    });
    if (record.type != "add") { //获取接口原有列表数据
      setSystemManufactorID(record.ManufactorID) //CEMS设备生产商
      setCemsVal(Number(record.SystemNameID))//系统名称 
    }
    props.updateState({ systemEditingKey: record.ID })
  }





  const systemCancel = (record, type) => {
    if (record.type === 'add' || type) { //新添加一行 删除 || 原有数据编辑的删除  不用走接口
      const dataSource = [...systemData];
      let newData = dataSource.filter((item) => item.ID !== record.ID)
      props.updateState({ systemData: newData })
      props.updateState({ systemEditingKey: '' })
    } else { //编辑状态
      props.updateState({ systemEditingKey: '' })
    }
  };


  const systemSave = async (record) => {
    try {
      const row = await form.validateFields();
      const newData = [...systemData];
      const key = record.ID;
      const index = newData.findIndex((item) => key === item.ID);
      if (index > -1) {
        const editRow = {
          SystemName: cemsVal == 465 ? '气态污染物CEMS' : '颗粒物污染物CEMS',
          ManufactorID: systemManufactorID,
          SystemNameID: cemsVal,
        };

        const item = record.type === 'add' ? { ...newData[index], ID: cuid() } : { ...newData[index] }
        newData.splice(index, 1, { ...item, ...row, ...editRow });
        props.updateState({ systemData: newData })
        props.updateState({ systemEditingKey: '' })
      } else {
        newData.push(row);
        props.updateState({ systemData: newData })
        props.updateState({ systemEditingKey: '' })
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }




  const isSystemEditing = (record) => record.ID === systemEditingKey;

  const systemCol = [{
    title: 'CEMS系统名称',
    dataIndex: 'SystemName',
    align: 'center',
    width: 120,
    editable: true,
  },
  {
    title: 'CEMS生产厂家',
    dataIndex: 'ManufactorName',
    align: 'center',
    editable: true,
  },
  {
    title: 'CEMS型号',
    dataIndex: 'SystemModel',
    align: 'center',
    editable: true,
  },
  {
    title: 'CEMS编号',
    dataIndex: 'CEMSNum',
    align: 'center',
    editable: true,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    render: (_, record) => {
      const editable = isSystemEditing(record);
      return editable ? (
        <span>
          <Typography.Link
            onClick={() => systemSave(record)}
            style={{
              marginRight: 8,
            }}
          >
            {record.type == 'add' ? "添加" : "保存"}
          </Typography.Link>
          <span onClick={() => { systemCancel(record) }} style={{ marginRight: 8 }}>
            <a>{record.type == 'add' ? "删除" : "取消"}</a>{/*添加的删除 和编辑的取消*/}
          </span>
          <span onClick={() => { systemCancel(record, 'del') }}> {/*编辑的删除 */}
            <a>{!record.type && "删除"}</a>
          </span>
        </span>
      ) : (
          <Typography.Link disabled={systemEditingKey !== ''} onClick={() => systemEdit(record)}>
            编辑
          </Typography.Link>
        );
    },
  },]



  const systemCols = systemCol.map((col) => {

    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isSystemEditing(record),
      }),
    };
  });


  const generatorCol = [
    {
      title: '生产厂家',
      dataIndex: 'ManufactorName',
      key: 'ManufactorName',
      align: 'center',
    },
    {
      title: '系统名称',
      dataIndex: 'SystemName',
      key: 'SystemName',
      align: 'center',
    },
    {
      title: '系统型号',
      dataIndex: 'SystemModel',
      key: 'SystemModel',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      render: (text, record) => {
        return <Button type='primary' size='small' onClick={() => { systemColChoice(record) }}> 选择 </Button>
      }
    },

  ]


  const [gaschoiceData, setGaschoiceData] = useState()

  const [pmchoiceData, setPmchoiceData] = useState()

  const [systemManufactorID, setSystemManufactorID] = useState()
  const [choiceManufacturer, setChoiceManufacturer] = useState(false); //系统信息 选择生产商
  const systemColChoice = (record) => {

    form.setFieldsValue({ ManufactorName: record.ManufactorName, SystemModel: record.SystemModel, });
    setSystemManufactorID(record.ID)
    setManufacturerPopVisible(false)
    setChoiceManufacturer(true)
  }




  const onManufacturerClearChoice = (value) => { //CEMS-系统信息 厂家清除
    form.setFieldsValue({ ManufactorName: value, });
    setSystemManufactorID(value)
    setChoiceManufacturer(false)
  }


  const [pageIndex2, setPageIndex2] = useState(1)
  const [pageSize2, setPageSize2] = useState(10)
  const onFinish2 = async (pageIndex2, pageSize2, cemsVal, ) => { //生成商弹出框 查询

    setPageIndex2(pageIndex2)
    try {
      const values = await form2.validateFields();
      props.testGetSystemModelList({
        pageIndex: pageIndex2,
        pageSize: pageSize2,
        SystemName: cemsVal,
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const handleTableChange2 = async (PageIndex, PageSize) => { //分页
    const values = await form2.validateFields();
    setPageSize2(PageSize)
    setPageIndex2(PageIndex)
    props.testGetSystemModelList({ ...values, SystemName: cemsVal, PageIndex, PageSize })
  }







  const systemPopContent = <Form //系统信息-cems生产厂家 弹框
    form={form2}
    name="advanced_search3"
    onFinish={() => { setPageIndex2(1); onFinish2(1, pageSize2, cemsVal) }}
    initialValues={{
      ManufactorID: manufacturerList[0] && manufacturerList[0].ID,
    }}

  >
    <Row>
      <Form.Item style={{ marginRight: 8 }} name='ManufactorID' >
        <Select placeholder='请选择生产厂家' showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: 200 }}>
          {
            manufacturerList[0] && manufacturerList.map(item => {
              return <Option key={item.ID} value={item.ID}>{item.ManufactorName}</Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item style={{ marginRight: 8 }} name="SystemModel">
        <Input allowClear placeholder="请输入系统型号" />
      </Form.Item>
      <Form.Item name="MonitoringType" hidden>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType='submit'>
          查询
     </Button>
      </Form.Item>
    </Row>
    <SdlTable scroll={{ y: 'calc(100vh - 500px)' }}
      loading={props.loadingSystemModel} bordered dataSource={systemModelList} columns={generatorCol}
      pagination={{
        total: systemModelListTotal,
        pageSize: pageSize2,
        current: pageIndex2,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: handleTableChange2,
      }}
    />
  </Form>



  const handleSystemAdd = () => { //添加系统信息
    if (systemEditingKey) {
      message.warning('请先保存数据')
      return
    } else {
      form.resetFields();
      form.setFieldsValue({ SystemName: cemsVal })
      props.updateState({ systemEditingKey: systemEditingKey + 1 })
      const newData = {
        type: 'add',
        ID: systemEditingKey + 1,
      }
      props.updateState({ systemData: [...systemData, newData] })
      setChoiceManufacturer(false)
    }
  }






  const [manufacturerPopVisible, setManufacturerPopVisible] = useState(false)
  const manufacturerPopVisibleClick = () => { // cems-系统信息 设备生产厂家
    setManufacturerPopVisible(true)
    form.setFieldsValue({ SystemName: cemsVal })
    setTimeout(() => {
      onFinish2(1, 10, cemsVal)
    })

  }


  const [cemsVal, setCemsVal] = useState(465)
  const cemsChange = (val) => {
    setCemsVal(val)
  }
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    name,
    children,
    ...restProps
  }) => {
    let inputNode = '';
     if (dataIndex === 'SystemName') {
      inputNode = <Select placeholder='请选择' onChange={cemsChange} disabled={choiceManufacturer}>
        <Option value={465}>气态污染物CEMS</Option>
        <Option value={466}>颗粒物污染物CEMS</Option>
      </Select>
    } else if (inputType === 'number') {
      inputNode = <InputNumber style={{ width: '100%' }} placeholder={`请输入`} />
    } else {
      inputNode = <Input disabled={ title === 'CEMS型号' ? choiceManufacturer : false} placeholder={`请输入`} />
    }
    return (
      <td {...restProps}>
        {editing ? (
          dataIndex === 'ManufactorName' ?  //CEMS-系统信息 生产厂家
            <Form.Item name={`${dataIndex}`} style={{ margin: 0 }}>
              <Select onClick={() => { manufacturerPopVisibleClick() }} onChange={onManufacturerClearChoice} allowClear showSearch={false} dropdownClassName={'popSelectSty'} placeholder="请选择"> </Select>
            </Form.Item>
            :
            <Form.Item
              name={`${dataIndex}`}
              style={{ margin: 0 }}
              rules={[{ required: dataIndex === 'CEMSNum' || dataIndex === 'FactoryNumber' || dataIndex === 'Number', message: `请输入`, },]}
            >
              {inputNode}
            </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };



  return (
    <div className={styles.deviceManagerSty} style={{ display: current == 1 ? 'block' : 'none' }}>
      <Form form={form} name="advanced_search" >
        <><div>
          <SdlTable
            components={{
              body: {
                cell: EditableCell,
              }
            }}
            bordered
            dataSource={systemData}
            columns={systemCols}
            rowClassName="editable-row"
            scroll={{ y: 'auto' }}
            loading={props.cEMSSystemListLoading}
            className={`${styles.systemListSty}`}
            pagination={false}
            size='small'
          />
        </div>
          <Button style={{ margin: '10px 0 15px 0' }} type="dashed" block icon={<PlusOutlined />} onClick={() => handleSystemAdd()} >
            添加系统信息
       </Button></>
      </Form>

      {/**cems 系统信息  cems生产厂家弹框 */}
      <Modal visible={manufacturerPopVisible} getContainer={false} onCancel={() => { setManufacturerPopVisible(false) }} destroyOnClose footer={null} closable={false} maskStyle={{ display: 'none' }} wrapClassName='noSpreadOverModal'>
        {systemPopContent}
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);