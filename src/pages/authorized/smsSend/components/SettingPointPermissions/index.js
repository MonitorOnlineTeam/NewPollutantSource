/**
 * 功  能：设置点位权限按钮
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Spin, Modal, Tooltip, Empty, Input, Button, Row, Space, message,Radio } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';
import { connect } from "dva";
import TreeTransfer from '@/components/TreeTransfer'
import SelectPollutantType from '@/components/SelectPollutantType';
import RegionList from '@/components/RegionList'

const namespace = 'smsSend'
const dvaPropsData = ({ global, loading }) => ({
  clientHeight: global.clientHeight,
  checkPointLoading: loading.effects[`${namespace}/GetPointUserMessageList`],
  entPointLoading: loading.effects[`common/getEntAndPointList`],
})

const Index = (props) => {

  const { record, checkPointLoading, entPointLoading } = props;
  const [visible, setVisible] = useState(false)
  const [entPointList, setEntPointList] = useState(false)
  const [pollutantType, setPollutantType] = useState(2)
  const [regionCode, setRegionCode] = useState('')
  const [entPointName, setEntPointName] = useState()
  const [checkedKeys, setCheckedKeys] = useState([])
  const [okLoading, setOkLoading] = useState(false)
  const pollutantTypelist = [{label:'废气',value:2,label:'废水',value:1}]

  useEffect(() => {
    if (visible) {
      pointAccessQuery()
    } else {
      setCheckedKeys([])
    }
  }, [visible])
  // 获取企业和排口
  const getEntAndPointList = (pollutantType, regionCode, entName) => {
    props.dispatch({
      type: `common/getEntAndPointList`,
      payload: {
        PollutantTypes: pollutantType,
        RegionCode: regionCode?.toString(),
        Name: entName,
        Status: [],
      },
      callback: res => {
        if (res.length) {
          setEntPointList(res)
        }
      },
    });
  }
  /**切换污染物 */
  const pollutantChange = e => {
    const pollTypeVal = e.target.value
    setPollutantType(pollTypeVal)
    props.dispatch({
      type: `${namespace}/GetPointUserMessageList`,
      payload: {
        UserGroup_ID: record?.ID,
        PollutantType: pollTypeVal,
        RegionCode: regionCode?.toString() || undefined,
      },
    });
    getEntAndPointList(pollTypeVal, regionCode, entPointName)
  }

  //查询
  const pointAccessQuery = () => {
    getEntAndPointList(pollutantType, regionCode, entPointName)
    props.dispatch({
      type: `${namespace}/GetPointUserMessageList`,
      payload: {
        UserGroup_ID: record?.ID,
        PollutantType: pollutantType,
        RegionCode: regionCode?.toString() || undefined,
      },
      callback: (data) => {
        setCheckedKeys(data)
      }
    });
  }
  const handleDataOK = (state, callback, checkedKeys) => {
    setOkLoading(true)
    props.dispatch({
      type: `${namespace}/InsertPointUserMessage`,
      payload: {
        Type: pollutantType,
        DGIMN: checkedKeys,
        UserID: record?.ID,
        RegionCode: regionCode?.toString() || undefined,
        state: state,
      },
      callback: res => {
        if (res.IsSuccess) {
          message.success('操作成功');
          props.onFinish && props.onFinish()
          callback()
        } else {
          res.Message && message.error(res.Message);
        }
        setOkLoading(false)
      },
    });
  };
  return <>
    <Tooltip title="设置点位访问权限">
      <a onClick={() => setVisible(true)}>
        <DatabaseOutlined style={{ fontSize: 16 }} />
      </a>
    </Tooltip>
    <Modal
      title={`设置点位访问权限${record?.name ? ` - ${record.name}` : ''}`}
      visible={visible}
      destroyOnClose
      onCancel={() => { setVisible(false) }}
      width={1100}
      footer={null}
      bodyStyle={{
        padding: '12px 24',
        overflowY: 'auto',
        maxHeight: props.clientHeight - 180,
      }}
    >
      {

        <>
          <Row style={{ marginBottom: 12 }}>
            <Space>
              <Radio.Group  value={pollutantType} onChange={pollutantChange}>
                {pollutantTypelist.map(item => {
                  return (
                    <Radio.Button key={item.value} value={item.value}>
                      {item.label}
                    </Radio.Button>
                  );
                })}
              </Radio.Group>
              <RegionList style={{ width: 180 }} placeholder='请选择行政区' onChange={(value) => { setRegionCode(value) }} />
              <Input.Group compact style={{ display: 'inline-block' }}>
                <Input style={{ width: 200 }} allowClear placeholder='请输入企业名称' onBlur={(e) => setEntPointName(e.target.value)} />
                <Button type="primary" loading={checkPointLoading} onClick={pointAccessQuery}>查询</Button>
              </Input.Group>
            </Space>
          </Row>
          {checkPointLoading || entPointLoading ? (
            <Spin
              style={{
                width: '100%',
                height: 'calc(100vh/2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              size="large"
            />
          ) : entPointList && entPointList.length > 0 ? (
            <Spin spinning={okLoading}>
              <TreeTransfer
                key="key"
                treeData={entPointList}
                checkedKeys={checkedKeys}
                targetKeysChange={(key, type, callback) => {
                  setCheckedKeys(key)
                  handleDataOK(type == 1 ? 1 : 2, callback, key)
                }}
              />
            </Spin>
          ) : (
                <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
        </>
      }
    </Modal>
  </>

};

export default connect(dvaPropsData)(Index);


