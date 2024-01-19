import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Collapse, Row, Col, Checkbox, Button } from 'antd';
import styles from '../styles.less';

const { Panel } = Collapse;

// 根据结果处理数据源
function matchGuids(arrayA, arrayB) {
  let result = {};

  arrayA.forEach(item => {
    item.ModelBaseList.forEach(subItem => {
      subItem.ModelList.forEach(model => {
        if (arrayB.includes(model.ModelGuid)) {
          const typeName = subItem.ModelTypeName || item.ModelBaseTypeName;
          if (!result[typeName]) {
            result[typeName] = [];
          }
          result[typeName].push(model.ModelGuid);
        }
      });
    });
  });

  return result;
}

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  modelList: AbnormalIdentifyModel.modelList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const Index = props => {
  const { dispatch, modelList, DGIMN } = props;
  const [dataSource, setDataSource] = useState([]);
  const [checkedList, setCheckedList] = useState({});

  useEffect(() => {
    GetDataAttributeAndPointList();
  }, [DGIMN]);

  // 获取模型选配数据
  const GetDataAttributeAndPointList = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetDataAttributeAndPointList',
      payload: {
        DGIMN: DGIMN,
      },
      callback: res => {
        const result = matchGuids(modelList, res);
        console.log(result);
        setCheckedList(result);
      },
    });
  };

  // 保存模型选配数据
  const AddDataAttributeAndPoint = () => {
    let modelGuidList = [];
    for (const key in checkedList) {
      modelGuidList = modelGuidList.concat(checkedList[key]);
    }
    console.log('modelGuidList', modelGuidList);
    // return;
    dispatch({
      type: 'AbnormalIdentifyModel/AddDataAttributeAndPoint',
      payload: {
        DGIMN: DGIMN,
        modelGuidList: modelGuidList,
      },
    });
  };

  // 渲染模型Item
  const renderModelGroup = modelGroupData => {
    const { ModelList, ModelTypeName } = modelGroupData;
    let content = ModelList.map(item => {
      return (
        <Col key={item.ModelGuid} span={6} style={{ marginBottom: 10 }}>
          <Checkbox key={item.ModelGuid} value={item.ModelGuid}>
            {item.ModelName}
          </Checkbox>
        </Col>
      );
    });
    return (
      <Checkbox.Group
        style={{ width: '100%' }}
        value={checkedList[ModelTypeName]}
        onChange={checkedValue => onChange(checkedValue, ModelTypeName)}
      >
        <Row>{content}</Row>
      </Checkbox.Group>
    );
  };

  // 模型状态改变
  const onChange = (list, name) => {
    // setCheckedList(list);
    // setIndeterminate(!!list.length && list.length < plainOptions.length);
    // setCheckAll(list.length === plainOptions.length);

    let _checkedList = { ...checkedList };
    _checkedList[name] = list;
    setCheckedList(_checkedList);
  };

  // 全选模型
  const onCheckAllChange = (e, modelGroupData) => {
    e.stopPropagation();
    const { ModelList, ModelTypeName } = modelGroupData;
    let _checkedList = { ...checkedList };

    if (e.target.checked) {
      // 选中
      _checkedList[ModelTypeName] = ModelList.map(item => item.ModelGuid);
    } else {
      // 不选中
      _checkedList[ModelTypeName] = [];
    }
    setCheckedList(_checkedList);
  };

  console.log('checkedList', checkedList);
  return (
    <div className={`${styles.PageWrapper} autoHeight`} style={{ position: 'relative' }}>
      <Card title="通用库" style={{ marginBottom: 10 }} bodyStyle={{ paddingTop: 0 }}>
        {modelList.map(item => {
          return (
            <div key={item.ModelTypeCode}>
              <div
                className="innerCardTitle"
                style={{ fontSize: 15, marginTop: 14, marginBottom: 14 }}
              >
                {item.ModelBaseTypeName}
              </div>
              {item.ModelBaseList && item.ModelBaseList.length > 1 ? (
                item.ModelBaseList.map(itm => {
                  return (
                    <Collapse ghost collapsible="icon">
                      <Panel
                        style={{ position: 'relative' }}
                        header={
                          <div>
                            <span style={{ marginRight: 10, fontWeight: 'bold' }}>
                              {itm.ModelTypeName}
                            </span>
                            <Checkbox
                              style={{ position: 'absolute' }}
                              indeterminate={
                                checkedList[itm.ModelTypeName] &&
                                checkedList[itm.ModelTypeName].length > 0 &&
                                checkedList[itm.ModelTypeName].length < itm.ModelList.length
                              }
                              onChange={e => onCheckAllChange(e, itm)}
                              checked={
                                checkedList[itm.ModelTypeName] &&
                                checkedList[itm.ModelTypeName].length === itm.ModelList.length
                              }
                            ></Checkbox>
                          </div>
                        }
                        key={item.ModelTypeCode}
                      >
                        <div style={{ paddingLeft: 30 }}>{renderModelGroup(itm)}</div>
                      </Panel>
                    </Collapse>
                  );
                })
              ) : (
                <div style={{ paddingLeft: 30 }}>
                  {renderModelGroup({
                    ...item.ModelBaseList[0],
                    ModelTypeName: item.ModelBaseTypeName,
                  })}
                </div>
              )}
            </div>
          );
        })}
      </Card>
      <Card title="行业库" style={{ marginBottom: 10 }}></Card>
      <Card title="个性库" style={{ marginBottom: 30 }}></Card>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          background: '#fff',
          padding: 10,
          width: 'calc(100vw - 366px)',
        }}
      >
        <Button type="primary" style={{ float: 'right' }} onClick={AddDataAttributeAndPoint}>
          保存
        </Button>
      </div>
    </div>
  );
};

export default connect(dvaPropsData)(Index);
