/*
 * @Author: JiaQi
 * @Date: 2023-06-19 09:11:57
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-11-22 14:56:22
 * @Description：模型设置页面
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  message,
  Radio,
  Space,
  Divider,
  Button,
  Select,
  Modal,
  Tree,
  Spin,
} from 'antd';
import styles from '../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import ModelParamsConfig from './components/ModelParamsConfig';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import _ from 'lodash';
import { router } from 'umi';
import { RollbackOutlined } from '@ant-design/icons';
import { ModalNameConversion } from '@/pages/DataAnalyticalWarningModel/CONST';

const { TextArea } = Input;

const dvaPropsData = ({ loading, dataModel }) => ({
  relationDGIMN: dataModel.relationDGIMN,
  ModelInfoAndParams: dataModel.ModelInfoAndParams,
  entAndPointLoading: loading.effects['common/getEntAndPointList'],
  saveLoading: loading.effects['dataModel/SaveModelInfoAndParams'],
  relationDGIMNLoading: loading.effects['dataModel/GetModelRelationDGIMN'],
});

const Setting = props => {
  const [baseForm] = Form.useForm();
  const [pointForm] = Form.useForm();
  const [entAndPointForm] = Form.useForm();
  // const [] = Form.useForm();
  const {
    dispatch,
    entAndPointLoading,
    saveLoading,
    relationDGIMNLoading,
    relationDGIMN,
    ModelInfoAndParams,
  } = props;
  const [visible, setVisible] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [industryList, setIndustryList] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [pageIndex, setPageIndex] = useState(1);
  const { ModelNumber, ID } = props.match.params;
  const childRef = React.useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = () => {
    getListPager();
    GetModelInfoAndParams();
    GetModelRelationDGIMN();
  };

  // 获取行业
  const getListPager = () => {
    dispatch({
      type: 'dataModel/getListPager',
      payload: {
        configId: 'IndustryType',
      },
      callback: res => {
        console.log('res', res);
        setIndustryList(res.DataSource);
      },
    });
  };

  // 获取模型基础信息和参数配置
  const GetModelInfoAndParams = () => {
    dispatch({
      type: 'dataModel/GetModelInfoAndParams',
      payload: {
        modelGuid: ID,
      },
      callback: res => {
        baseForm.setFieldsValue({
          ...res.modelInfo,
          ModelName: ModalNameConversion(res.modelInfo.ModelName),
          SuitScene: ModalNameConversion(res.modelInfo.SuitScene),
        });
      },
    });
  };

  // 获取已关联排口
  const GetModelRelationDGIMN = () => {
    setPageIndex(1);
    setPageSize(20);
    const values = pointForm.getFieldsValue();
    dispatch({
      type: 'dataModel/GetModelRelationDGIMN',
      payload: {
        modelGuid: ID,
        regionCode: values.regionCode,
        entCode: values.entCode,
        industryTypeCode: values.industryTypeCode,
        outputType: values.outputType,
      },
      callback: res => {
        setDataSource(res.tableData.map((item, index) => ({ ...item, index: index + 1 })));
      },
    });
  };

  // 保存关联排口
  const SaveModelRelationDGIMN = () => {
    dispatch({
      type: 'dataModel/SaveModelRelationDGIMN',
      payload: {
        modelGuid: ID,
        dgimnList: checkedKeys,
      },
      callback: () => {
        setVisible(false);
        entAndPointForm.resetFields();
        GetModelRelationDGIMN();
      },
    });
  };

  const getEntAndPointList = (values = {}) => {
    dispatch({
      type: 'common/getEntAndPointList',
      payload: {
        Status: [],
        RunState: '',
        PollutantTypes: '2',
        // PageIndex: 1,
        // PageSize: 20,
        industryTypeCode: values.industryTypeCode,
        outputType: values.outputType,
        regionCode: values.regionCode,
        entCode: values.entCode,
        StopPointFlag: true,
        ModelGuid: ID,
      },
      callback: res => {
        // setTreeData(res);
        setTreeData([
          {
            key: '0-0',
            title: '全部',
            children: res,
          },
        ]);
      },
    });
  };

  const getColumns = () => {
    return [
      {
        title: '序号',
        // align: 'center',
        // dataIndex: 'index',
        // key: 'index',
        // width: 80,
        // render: (text, record, index) => {
        //   return index + 1;
        // },
      },
      {
        title: '企业名称',
        dataIndex: 'EntName',
        key: 'EntName',
      },
      {
        title: '排口名称',
        dataIndex: 'PointName',
        key: 'PointName',
      },
      {
        title: '排口编号',
        dataIndex: 'DGIMN',
        key: 'DGIMN',
      },
      {
        title: '行政区划',
        dataIndex: 'Region',
        key: 'Region',
      },
      {
        title: '排口所属行业',
        dataIndex: 'IndustryType',
        key: 'IndustryType',
      },
      {
        title: '关联时间',
        dataIndex: 'RelationTime',
        key: 'RelationTime',
        render: text => {
          return text || '-';
        },
      },
    ];
  };

  // 获取排口查询条件
  const getPointQueryCondition = () => {
    return (
      <>
        <Form.Item
          name="industryTypeCode"
          style={{
            marginBottom: 0,
          }}
        >
          <SearchSelect
            placeholder="请选择排口所属行业"
            style={{ width: 200 }}
            configId={'IndustryType'}
            itemName={'dbo.T_Cod_IndustryType.IndustryTypeName'}
            itemValue={'dbo.T_Cod_IndustryType.IndustryTypeCode'}
          />
        </Form.Item>
        <Form.Item name="regionCode">
          <RegionList noFilter style={{ width: 150 }} onSelect={(value, node, extra) => {}} />
        </Form.Item>
        <Form.Item name="entCode">
          <EntAtmoList
            noFilter
            style={{ width: 200 }}
            onChange={(value, Option) => {
              // setCurrentTitleName(Option.title);
            }}
          />
        </Form.Item>
        <Form.Item name="outputType">
          <Select placeholder="是否排放口" style={{ width: 120 }} allowClear>
            <Option key={1} value={1}>
              非排放口
            </Option>
            <Option key={0} value={0}>
              排放口
            </Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </>
    );
  };

  // 提交
  const onFinish = () => {
    baseForm
      .validateFields()
      .then(async values => {
        let modelParamsData = await childRef.current.onFinish();
        if (modelParamsData.dataAttribute !== false) {
          let body = {
            modelInfo: {
              ...ModelInfoAndParams.modelInfo,
              AbnormalNum: modelParamsData.AbnormalNum,
              IsCAbnormal: modelParamsData.IsCAbnormal,
              modelGuid: ID,
              ...values,
            },
            dataAttribute: modelParamsData.dataAttribute,
          };
          console.log('body', body);
          // return;
          dispatch({
            type: 'dataModel/SaveModelInfoAndParams',
            payload: body,
            callback: () => {
              GetModelInfoAndParams();
            },
          });
        }
      })
      .catch(errorInfo => {
        // message.warning('请输入完整的数据');
        return;
      });
  };

  // 获取已关联排口
  const onPointFormFinish = values => {
    GetModelRelationDGIMN();
  };

  // 关联排口 - 弹窗form
  const onEntAndPointFormFinish = async () => {
    const values = await entAndPointForm.validateFields();
    getEntAndPointList(values);
  };

  // console.log('checkedKeys', checkedKeys);

  return (
    <BreadcrumbWrapper titles=" / 设置">
      <div className={styles.CardPageWrapper}>
        <div style={{ background: '#fff', paddingBottom: '2px' }}>
          <Card
            title={<div className={styles.title}>基础信息</div>}
            bordered={false}
            extra={
              <Button onClick={() => router.goBack()}>
                <RollbackOutlined />
                返回上级
              </Button>
            }
          >
            <Form
              name="basic"
              form={baseForm}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              style={{ paddingTop: '10px' }}
              // initialValues={}
              // onFinish={onFinish}
              autoComplete="off"
            >
              <Row>
                <Col span={10}>
                  <Form.Item
                    label="场景名称"
                    name="ModelName"
                    rules={[
                      {
                        required: true,
                        message: '请输入场景名称',
                      },
                    ]}
                  >
                    <Input placeholder="请输入场景名称" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    label="适用场景"
                    name="SuitScene"
                    rules={[
                      {
                        required: true,
                        message: '请输入适用场景',
                      },
                    ]}
                  >
                    <Input placeholder="请输入适用场景" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    label="准确度"
                    name="Accuracy"
                    rules={[
                      {
                        required: true,
                        message: '请输入准确度',
                      },
                    ]}
                  >
                    <Input style={{ width: '100%' }} placeholder="请输入准确度" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    label="是否启用"
                    name="Status"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value={1}>启用</Radio>
                      <Radio value={0}>停用</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    label="场景描述"
                    name="ModelDes"
                    // labelCol={{ span: 5 }}
                    // wrapperCol={{ span: 15 }}
                    rules={[
                      {
                        required: true,
                        message: '请输入场景描述',
                      },
                    ]}
                  >
                    <TextArea rows={4} placeholder="请输入场景描述" />
                  </Form.Item>
                </Col>

                <Col span={10}>
                  <Form.Item
                    label="数据特征"
                    name="DataAttr"
                    rules={[
                      {
                        required: true,
                        message: '请输入数据特征',
                      },
                    ]}
                  >
                    <TextArea rows={4} placeholder="请输入数据特征" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          {ModelInfoAndParams.dataAttribute.length ? (
            <ModelParamsConfig
              ModelID={ID}
              Data={ModelInfoAndParams}
              industryList={industryList}
              onRef={childRef}
            />
          ) : (
            ''
          )}
          <Divider orientation="right" style={{ color: '#f6f0f0' }}>
            <Space>
              <Button type="primary" loading={saveLoading} onClick={() => onFinish()}>
                提交
              </Button>
              {/* <Button onClick={() => router.push('/DataAnalyticalWarningModel/Model')}>取消</Button> */}
            </Space>
          </Divider>
        </div>
        <Card
          title={<div className={styles.title}>关联排口</div>}
          style={{ marginTop: 10 }}
          bodyStyle={{ paddingBottom: 20 }}
        >
          <Form
            name="basic"
            form={pointForm}
            layout="inline"
            // layout={'vertical'}
            style={{ paddingTop: '10px' }}
            initialValues={{}}
            onFinish={onPointFormFinish}
            autoComplete="off"
          >
            <Button
              type="primary"
              onClick={() => {
                setVisible(true);
                setCheckedKeys(relationDGIMN);
                getEntAndPointList({
                  industryTypeCode: '1',
                  outputType: 0,
                });
              }}
            >
              关联排口
            </Button>
            <Divider type="vertical" style={{ height: 30, margin: '2px 20px' }} />
            {getPointQueryCondition()}
          </Form>
          <SdlTable
            loading={relationDGIMNLoading}
            scroll={{
              y: 400,
            }}
            style={{ marginTop: 16 }}
            dataSource={dataSource}
            columns={getColumns()}
            // pagination={{
            //   // defaultCurrent: 1,
            //   current: pageIndex,
            //   pageSize: pageSize,
            //   // showQuickJumper: true,
            //   total: dataSource.length,
            //   showSizeChanger: true,
            //   onChange: (current, size) => {
            //     setPageIndex(current);
            //     setPageSize(size);
            //   },
            // }}
          />
        </Card>
      </div>

      <Modal
        centered
        title="关联排口"
        visible={visible}
        wrapClassName="spreadOverModal"
        destroyOnClose
        onOk={() => {
          pointForm.resetFields();
          SaveModelRelationDGIMN();
        }}
        onCancel={() => {
          entAndPointForm.resetFields();
          setVisible(false);
        }}
      >
        <Form
          name="basic"
          form={entAndPointForm}
          layout="inline"
          // layout={'vertical'}
          style={{ paddingTop: '10px' }}
          initialValues={{
            industryTypeCode: '1',
            outputType: 0,
          }}
          onFinish={onEntAndPointFormFinish}
          autoComplete="off"
        >
          {getPointQueryCondition()}
        </Form>
        <Card
          bordered={false}
          style={{ marginTop: 16 }}
          bodyStyle={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }}
        >
          {entAndPointLoading ? (
            <Spin></Spin>
          ) : (
            <Tree
              checkable
              defaultExpandAll
              checkedKeys={checkedKeys}
              // onSelect={(selectedKeys, info) => {
              //   console.log('selected', selectedKeys, info);
              // }}
              onCheck={(keys, info) => {
                if (info.checked == true) {
                  let _keys = [];

                  // 处理全选，过滤掉企业key
                  if (info.node.key === '0-0') {
                    info.node.children.map(item => {
                      if (item.children.length) {
                        _keys = _keys.concat(item.children.map(i => i.key));
                      }
                    });
                  } else {
                    // 非全选
                    if (info.node.children) {
                      // 点击的父节点
                      _keys = info.node.children.map(item => item.key);
                    } else if (info.node.EntCode) {
                      // 点击的子节点
                      _keys = [info.node.key];
                    }
                  }
                  // 已选中数据 与 当前数据源选中数据去重
                  let _checkedKeys = [...checkedKeys].concat(_keys);
                  setCheckedKeys(_.uniq(_checkedKeys));
                } else {
                  let arr1 = [...checkedKeys];
                  let arr2 = [info.node.key];

                  // 处理反选全部，过滤掉企业key
                  if (info.node.key === '0-0') {
                    info.node.children.map(item => {
                      if (item.children.length) {
                        arr2 = arr2.concat(item.children.map(i => i.key));
                      }
                    });
                  } else {
                    if (info.node.children) {
                      arr2 = info.node.children.map(item => item.key).concat([info.node.key]);
                    } else if (info.node.EntCode) {
                      arr2.push(info.node.EntCode);
                    }
                  }
                  // 在原有数据中，排除掉反选的数据
                  let _checkedKeys = _.difference(arr1, arr2);
                  setCheckedKeys(_checkedKeys);
                }
              }}
              treeData={treeData}
            />
          )}
        </Card>
      </Modal>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Setting);
