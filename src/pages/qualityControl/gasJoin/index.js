import React, { PureComponent } from 'react';
import { Card, List, Modal, Button, Select, message, Badge } from 'antd';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva'

const { Option } = Select;

@connect(({ loading, qualityControl }) => ({
  gasJoinListData: qualityControl.gasJoinListData,
  gasSelectList: qualityControl.gasSelectList,
  saveLoading: loading.effects['qualityControl/editQCAComponentInfo'],
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gasSelected: [],
      selectedRow: {},
    };
  }

  componentDidMount() {
    this.getQCAComponent()
    this.getQCAComponentInfoList()
  }


  getQCAComponent = () => {
    this.props.dispatch({
      type: 'qualityControl/getQCAComponent',
      payload: {}
    })
  }

  getQCAComponentInfoList = () => {
    this.props.dispatch({
      type: 'qualityControl/getQCAComponentInfoList',
      payload: {}
    })
  }

  onBindClick = () => {
    const { selectedRow, gasSelected } = this.state;
    // if (!gasSelected.length) {
    //   message.error('请选择要绑定的气瓶！');
    //   return;
    // }
    this.props.dispatch({
      type: 'qualityControl/editQCAComponentInfo',
      payload: {
        ID: selectedRow.ID,
        Cylinder: selectedRow.Cylinder,
        Components: gasSelected.toString(),
      },
      callback: () => {
        this.getQCAComponent();
        this.getQCAComponentInfoList();
        this.setState({
          visible: false,
          gasSelected: [],
        })
      }
    })
  }

  render() {
    const { gasSelected } = this.state;
    const { gasJoinListData, gasSelectList, saveLoading } = this.props;
    return (
      <BreadcrumbWrapper>
        <Card>
          <List
            itemLayout="horizontal"
            dataSource={gasJoinListData}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={<a href="https://ant.design">{item.Cylinder}</a>}
                  description={
                    item.Components ?
                      <div>
                        <Badge status="success" />
                        <span style={{ color: '#4c4c4c', fontWeight: '500' }}>{`已绑定气瓶：${item.Components}`}</span>
                      </div> :
                      '未绑定气瓶'
                  }
                />
                <Button type="primary" onClick={() => this.setState({ visible: true, selectedRow: item, gasSelected: item.Components ? item.Components.split(",") : [] })}>
                  绑定气瓶
                </Button>
              </List.Item>
            )}
          />
        </Card>
        <Modal
          title="绑定气瓶"
          destroyOnClose
          confirmLoading={saveLoading}
          visible={this.state.visible}
          onOk={this.onBindClick}
          onCancel={() => this.setState({ visible: false })}
        >
          <div>
            <Select value={gasSelected} style={{ width: '300px' }} maxTagCount={2} mode="multiple" placeholder="请选择要绑定的气瓶"
              onChange={(value) => {
                if (value.length > 2) {
                  message.error("最多只能绑定2个气瓶！");
                  return;
                }
                this.setState({
                  gasSelected: value
                })
              }}
            >
              {
                gasSelectList.map(item => {
                  return <Option key={item.key} value={item.key}>{item.name}</Option>
                })
              }
            </Select>
          </div>
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}

export default index;