import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Modal,
  Select,
  Tree,
  Space,
  Button,
  Form,
  message,
  Popconfirm,
  Spin,
} from 'antd';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';
import _ from 'lodash';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  entAndPointLoading: loading.effects['common/getEntAndPointList'],
});

const PointTraining = props => {
  const [entAndPointForm] = Form.useForm();

  const { dispatch, open, title, onOk, onCancel, entAndPointLoading } = props;

  const [checkedKeys, setCheckedKeys] = useState(props.checkedKeys);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    getEntAndPointList({
      outputType: 0,
    });
  }, []);

  // 关联排口 - 弹窗form
  const onEntAndPointFormFinish = async () => {
    const values = await entAndPointForm.validateFields();
    getEntAndPointList(values);
  };

  // 获取企业和排口
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
        // ModelGuid: ID,
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
          <EntAtmoList noFilter style={{ width: 200 }} onChange={(value, Option) => {}} />
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

  return (
    <Modal
      centered
      // title={title}
      title="排口选取"
      open={open}
      wrapClassName="spreadOverModal"
      destroyOnClose
      onOk={() => {
        onOk(checkedKeys);
        // entAndPointForm.resetFields();
      }}
      onCancel={() => {
        entAndPointForm.resetFields();
        onCancel();
      }}
    >
      <Form
        name="basic"
        form={entAndPointForm}
        layout="inline"
        // layout={'vertical'}
        style={{ paddingTop: '10px' }}
        initialValues={{
          // industryTypeCode: '1',
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
  );
};

export default connect(dvaPropsData)(PointTraining);
