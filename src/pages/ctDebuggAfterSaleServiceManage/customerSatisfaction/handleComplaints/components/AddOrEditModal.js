/*
 * @Author: JiaQi
 * @Date: 2024-04-02 11:09:09
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-04-29 10:42:17
 * @Description:  客户投诉解决页面内容
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  Popconfirm,
  Select,
  Space,
  Row,
  Col,
  message,
  Divider,
  Tooltip,
  DatePicker,
  Modal,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DeleteOutlined, ExportOutlined, SelectOutlined } from '@ant-design/icons';
import AllViewModal from './AllViewModal';
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon';
import styles from '../../index.less';
import cuid from 'cuid';
import SdlUpload from '@/pages/AutoFormManager/SdlUpload';

const { TextArea } = Input;

let timeout;

const dvaPropsData = ({ loading, common }) => ({
  largeRegionList: common.CtLargeRegionList,
  queryLoading: loading.effects[`customer/GetCustomerComplaintsList`],
  exportLoading: loading.effects[`customer/ExportServiceHotline`],
  saveLoading: loading.effects['customer/AddOrUpdateServiceHotline'],
});

const AddOrEditModal = props => {
  const [form] = Form.useForm();

  const [provinceList, setProvinceList] = useState([]); // 大区、省份列表
  const [complaintsProjectList, setComplaintsProjectList] = useState([]); // 项目列表全部数据
  const [searchProjectList, setSearchProjectList] = useState([]); // 项目列表搜索结果
  const [uploadId, setUploadId] = useState(cuid());
  const [fileList, setFileList] = useState([]);

  const {
    saveLoading,
    dispatch,
    largeRegionList,
    ID,
    onCancel,
    onSuccessCallback,
    isModalOpen,
  } = props;

  useEffect(() => {
    GetCustomerComplaintsProject();
    // 编辑时获取详情
    ID && isModalOpen && GetCustomerComplaintsView();
  }, [ID]);

  // 获取项目编号
  const GetCustomerComplaintsProject = () => {
    dispatch({
      type: 'customer/GetCustomerComplaintsProject',
      payload: {},
      callback: res => {
        setComplaintsProjectList(res);
      },
    });
  };

  // 获取详情
  const GetCustomerComplaintsView = () => {
    dispatch({
      type: 'customer/GetCustomerComplaintsView',
      payload: {
        ID,
      },
      callback: res => {
        form.setFieldsValue({
          ...res,
          ReceiveComplaintDate: moment(res.ReceiveComplaintDate),
          files: res?.files?.AttachID,
        });

        let _fileList = res?.files?.ImgList.map((img, index) => {
          return {
            uid: res.files.ImgNameList[index],
            status: 'done',
            url: `/${img}`,
          };
        });

        setFileList(_fileList);
        setUploadId(res?.files?.AttachID);
        // 根据大区获取省份
        let provinceList_temp = largeRegionList.find(item => item.ID == res.ServiceAreaCode)
          .ChildList;
        setProvinceList(provinceList_temp);
      },
    });
  };

  // 保存添加或编辑
  const onAddOrEdit = status => {
    form.validateFields().then(values => {
      dispatch({
        type: 'customer/AddOrEditCustomerComplaints',
        payload: {
          ID,
          ...values,
          ReceiveComplaintDate: values.ReceiveComplaintDate.format('YYYY-MM-DD HH:mm:ss'),
          Status: status,
        },
        callback: res => {
          message.success('操作成功！');
          onSuccessCallback();
        },
      });
    });
  };

  //
  const handleSearch = newValue => {
    console.log('search-newValue', newValue);
    // console.log('complaintsProjectList', complaintsProjectList);
    if (newValue) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      timeout = setTimeout(() => {
        let searchProjectList_temp = complaintsProjectList.filter(
          item => item.ProjectCode.indexOf(newValue) > -1,
        );
        console.log('searchProjectList_temp', searchProjectList_temp);
        setSearchProjectList(searchProjectList_temp);
      }, 300);
    } else {
      setSearchProjectList([]);
    }
  };

  const handleChange = (value, option) => {
    let data = option['data-projectData'];
    if (value) {
      form.setFieldsValue({
        ProjectName: data.ProjectName,
        ServiceAreaCode: data.ServiceAreaCode,
        Province: data.Province,
      });

      // 根据大区获取省份
      let provinceList_temp = largeRegionList.find(item => item.ID == data.ServiceAreaCode)
        .ChildList;
      console.log('provinceList_temp', provinceList_temp);
      setProvinceList(provinceList_temp);
    }
  };
  return (
    <Modal
      title={ID ? '编辑' : '登记'}
      visible={isModalOpen}
      width={1100}
      destroyOnClose
      confirmLoading={saveLoading}
      footer={[
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
        <Button
          style={{display: ID ? 'none' : 'inline'}}
          key="save"
          type="primary"
          loading={saveLoading}
          onClick={() => {
            onAddOrEdit(1);
          }}
        >
          保存
        </Button>,
        <Button key="submit" type="primary" loading={saveLoading} onClick={() => onAddOrEdit(2)}>
          提交
        </Button>,
      ]}
      onCancel={onCancel}
    >
      <Form
        className={styles.hotPhoneForm}
        form={form}
        layout="horizontal"
        initialValues={{}}
        labelCol={{
          flex: '150px',
        }}
        wrapperCol={{
          flex: 1,
        }}
      >
        <Row align="middle">
          <Col span={12}>
            <Form.Item
              name="ProjectCode"
              label="项目编号"
              rules={[
                {
                  required: true,
                  message: '项目编号不能为空！',
                },
              ]}
            >
              <Select
                showSearch
                // value={value}
                placeholder={'项目编号'}
                // style={props.style}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleChange}
                notFoundContent={null}
              >
                {searchProjectList.map(item => {
                  return (
                    <Option value={item.ProjectCode} key={item.ProjectCode} data-projectData={item}>
                      {item.ProjectCode}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ProjectName"
              label="项目名称"
              rules={[
                {
                  required: true,
                  message: '请选择项目名称！',
                },
              ]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ServiceAreaCode"
              label="大区名称"
              rules={[
                {
                  required: true,
                  message: '请选择大区名称！',
                },
              ]}
            >
              <Select
                placeholder="大区名称"
                style={{ width: '100%' }}
                allowClear
                onChange={(value, option) => {
                  if (value) {
                    setProvinceList(option['data-childList']);
                  } else {
                    setProvinceList([]);
                  }
                  form.setFieldsValue({ Province: undefined });
                }}
              >
                {largeRegionList.map(item => {
                  return (
                    <Option value={`${item.ID}`} key={`${item.ID}`} data-childList={item.ChildList}>
                      {item.LargeRegion}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="Province"
              label="省份"
              rules={[
                {
                  required: true,
                  message: '请选择省份！',
                },
              ]}
            >
              <Select placeholder="请选择省份" style={{ width: '100%' }} allowClear>
                {provinceList.map(item => {
                  return (
                    <Option value={item.RegionCode} key={item.RegionCode}>
                      {item.RegionName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ReceiveComplaintDate"
              label="接收投诉日期"
              rules={[
                {
                  required: true,
                  message: '请选择接收投诉日期！',
                },
              ]}
            >
              <DatePicker placeholder="请选择接收投诉日期！" style={{ width: '100%' }} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="Complainant"
              label="被投诉人"
              rules={[
                {
                  required: true,
                  message: '请填写被投诉人！',
                },
              ]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ComplaintCustomerName"
              label="投诉客户名称"
              rules={[
                {
                  required: true,
                  message: '请填写投诉客户名称！',
                },
              ]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ComplaintCustomerPhone"
              label="投诉客户联系方式"
              rules={[
                {
                  required: true,
                  message: '请填写投诉客户联系方式！',
                },
              ]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ComplaintCompanyName"
              label="投诉单位名称"
              rules={[
                {
                  required: true,
                  message: '请填写投诉单位名称！',
                },
              ]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ComplaintMethods"
              label="投诉方式"
              rules={[
                {
                  required: true,
                  message: '请填写投诉方式！',
                },
              ]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="ProblemDescription"
              label="投诉问题内容"
              rules={[
                {
                  required: true,
                  message: '请填写投诉问题内容！',
                },
              ]}
            >
              <TextArea rows={3} placeholder="请填写投诉问题内容！" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="files" label="附件">
              <SdlUpload
                fileList={fileList}
                accept="image/*"
                cuid={uploadId}
                uploadSuccess={id => {
                  form.setFieldsValue({ files: id });
                  setUploadId(id);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default connect(dvaPropsData)(AddOrEditModal);
