import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Checkbox, Input, Button, Tree, message, Form } from 'antd';
import styles from './styles.less';
const { DirectoryTree } = Tree;

const { Search } = Input;

const dvaPropsData = ({ loading, point }) => ({
  loadingPointList: loading.effects['standardLibrary/GetStandardPointList'] || false,
});

const CopyAddModal = props => {
  const { dispatch, open, onCancel, onOk, DGIMN, pollutantType, loadingPointList } = props;
  const [form] = Form.useForm();
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      getPointList();
    }
  }, [open]);

  // 获取监测点列表
  const getPointList = () => {
    setLoading(true);
    dispatch({
      type: 'standardLibrary/GetStandardPointList',
      payload: {
        DGIMN: DGIMN,
        PollutantCode: pollutantType, // 废水 1
        Enalbe: 1,
      },
      callback: res => {
        if (res && res.length > 0) {
          // 按企业分组
          const groupedData = {};
          res.forEach(item => {
            if (!groupedData[item.ParentCode]) {
              groupedData[item.ParentCode] = {
                title: item.ParentName,
                key: item.ParentCode,
                selectable: false,
                children: [],
              };
            }

            // 排除当前监测点
            if (item.DGIMN !== DGIMN) {
              groupedData[item.ParentCode].children.push({
                title: item.PointName,
                key: item.DGIMN,
                DGIMN: item.DGIMN,
                isLeaf: true,
              });
            }
          });

          // 转换为树形结构数组
          const treeDataArray = Object.values(groupedData).filter(
            group => group.children.length > 0,
          );
          setTreeData(treeDataArray);
        } else {
          setTreeData([]);
        }
        setLoading(false);
      },
    });
  };

  // 处理搜索
  const handleSearch = value => {
    setSearchValue(value);
    if (value) {
      // 找到匹配的节点并展开其父节点
      const expandedKeys = [];
      const findMatchingNodes = nodes => {
        if (!nodes) return false;

        return nodes.some(node => {
          const matchTitle = node.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
          const hasMatchingChildren = node.children && findMatchingNodes(node.children);

          if (matchTitle || hasMatchingChildren) {
            if (!node.isLeaf) {
              expandedKeys.push(node.key);
            }
            return true;
          }
          return false;
        });
      };

      findMatchingNodes(treeData);
      setExpandedKeys(expandedKeys);
      setAutoExpandParent(true);
    } else {
      setExpandedKeys([]);
      setAutoExpandParent(false);
    }
  };

  // 处理树节点展开/收起
  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  // 处理选择监测点
  const onSelect = (selectedKeys, info) => {
    // 只允许选择监测点，不允许选择企业
    if (info.node.isLeaf) {
      setSelectedPoints(selectedKeys);
      form.setFieldsValue({ targetDGIMNs: selectedKeys });
    } else {
      message.warning('请选择监测点');
    }
  };

  // 处理确定按钮点击
  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        if (onOk) {
          let isParam = pollutantType == 1 ? 1 : values.copyDevice ? 1 : 0; // 废水默认传 1
          let body = {
            copyDGIMN: selectedPoints.toString(),
            isSystem: values.copySystem ? 1 : 0,
            isParam: isParam,
          };
          console.log('body', body);
          // return;
          onOk(body);
        }
      })
      .catch(errorInfo => {
        console.log('验证失败:', errorInfo);
      });
  };

  // 渲染树节点标题，高亮搜索结果
  const renderTreeNodeTitle = node => {
    if (!searchValue) {
      return node.title;
    }

    const index = node.title.toLowerCase().indexOf(searchValue.toLowerCase());
    if (index === -1) {
      return node.title;
    }

    const beforeStr = node.title.substring(0, index);
    const matchStr = node.title.substring(index, index + searchValue.length);
    const afterStr = node.title.substring(index + searchValue.length);

    return (
      <span>
        {beforeStr}
        <span style={{ color: '#f50' }}>{matchStr}</span>
        {afterStr}
      </span>
    );
  };

  return (
    <Modal
      title="复制添加"
      open={open}
      onCancel={() => {
        form.resetFields();
        setSelectedPoints([]);
        onCancel();
      }}
      destroyOnClose
      bodyStyle={{ padding: '0 24px' }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            form.resetFields();
            setSelectedPoints([]);
            onCancel();
          }}
        >
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          确定
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="inline"
        initialValues={{
          copySystem: true,
          copyDevice: true,
          targetDGIMNs: [],
        }}
      >
        <div className={styles.copyModalContent}>
          {pollutantType != 1 && (
            <div className={styles.copyRange}>
              <Form.Item
                label="复制范围"
                required
                style={{ marginBottom: 10 }}
                // labelCol={{ span: 6 }}
                // wrapperCol={{ span: 18 }}
              >
                <Form.Item
                  name="copySystem"
                  valuePropName="checked"
                  style={{ display: 'inline-block', marginRight: 20, marginBottom: 0 }}
                  rules={[
                    {
                      validator: (_, value) => {
                        const deviceValue = form.getFieldValue('copyDevice');
                        if (!value && !deviceValue) {
                          return Promise.reject('请至少选择一个复制范围');
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Checkbox>系统信息</Checkbox>
                </Form.Item>

                <Form.Item
                  name="copyDevice"
                  valuePropName="checked"
                  style={{ display: 'inline-block', marginBottom: 0 }}
                >
                  <Checkbox>设备信息</Checkbox>
                </Form.Item>
              </Form.Item>
            </div>
          )}
          <div className={styles.pointSelection}>
            <Form.Item
              label="选择复制测点："
              name="targetDGIMNs"
              rules={[{ required: true, message: '请选择至少一个监测点' }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <div style={{ paddingLeft: 10 }}>
                <Search
                  placeholder="搜索"
                  onSearch={handleSearch}
                  onChange={e => setSearchValue(e.target.value)}
                  style={{ width: '100%', marginBottom: 10 }}
                />
                {loading ? (
                  <div className={styles.loading}>加载中...</div>
                ) : treeData.length > 0 ? (
                  <DirectoryTree
                    defaultExpandAll
                    // showLine
                    // expandedKeys={expandedKeys}
                    // autoExpandParent={autoExpandParent}
                    // defaultExpandParent={true}
                    // onExpand={onExpand}
                    onSelect={onSelect}
                    selectedKeys={selectedPoints}
                    treeData={treeData}
                    titleRender={node => renderTreeNodeTitle(node)}
                  />
                ) : (
                  <div className={styles.noData}>没有可用的监测点</div>
                )}
              </div>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default connect(dvaPropsData)(CopyAddModal);
