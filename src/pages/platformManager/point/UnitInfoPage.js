import React, { PureComponent } from 'react';
import { Modal, Card, Button, Row, Col, Input, Popconfirm, List, message } from 'antd';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva'
import { RollbackOutlined } from '@ant-design/icons'

@connect(({ loading, entManage }) => ({
  unitInfoList: entManage.unitInfoList,
  pointInstrumentList: entManage.pointInstrumentList,
}))
class UnitInfoPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      entCode: props.match.params.entCode,
      entName: props.match.params.entName,
      CrewName: '',
      selectedRow: {},
    };
    this.CONST = {};
  }

  componentDidMount() {
    this.getUnitList();
  }


  // 删除机组
  onDelete = (CrewCode) => {
    this.props.dispatch({
      type: 'entManage/DeleteCrewInfo',
      payload: {
        CrewCode: CrewCode
      },
      callback: () => {
        message.success('添加成功！')
        this.getUnitList()
      }
    })
  }

  // 获取机组列表
  getUnitList = () => {
    const { entCode } = this.state;
    this.props.dispatch({
      type: 'entManage/getUnitList',
      payload: {
        EntCode: entCode
      }
    })
  }

  // 添加机组
  AddCrewInfo = () => {
    const { entCode, CrewName } = this.state;
    if (!CrewName) {
      message.error('请填写机组名称！');
      return;
    }
    this.props.dispatch({
      type: 'entManage/AddCrewInfo',
      payload: {
        CrewName: CrewName,
        EntCode: entCode
      },
      callback: () => {
        message.success('添加成功！')
        this.setState({ visible: false }, () => { this.getUnitList() })
      }
    })
  }

  // 修改机组
  UpdateCrewInfo = () => {
    const { CrewName, CrewCode } = this.state;
    if (!CrewName) {
      message.error('请填写机组名称！');
      return;
    }
    this.props.dispatch({
      type: 'entManage/UpdateCrewInfo',
      payload: {
        CrewCode: CrewCode,
        CrewName: CrewName,
      },
      callback: () => {
        message.success('修改成功！')
        this.setState({ visible: false }, () => { this.getUnitList() })
      }
    })
  }

  render() {
    const { visible, CrewName, CrewCode, entName } = this.state;
    const { unitInfoList } = this.props;
    return (
      <BreadcrumbWrapper title="机组信息">
        <Card
          title={
            <span>
              {entName}
              <Button
                style={{ marginLeft: 10 }}
                onClick={() => {
                  history.go(-1);
                }}
                type="link"
                size="small"
              >
                <RollbackOutlined />
                返回上级
              </Button>
            </span>
          }
        >
          <Button type="primary" onClick={() => {
            this.setState({
              visible: true,
              CrewName: undefined,
              CrewCode: undefined,
            })
          }
          }
            style={{ marginBottom: 16 }}>添加</Button>
          <List
            bordered
            dataSource={unitInfoList}
            renderItem={item => {
              const delInfo = item.Flag ? '确认是否删除？' : '机组下存在核算数据，如删除可能会导致报告无法统计企业核算数据，确认是否删除？';
              const actions1 = [<a key="list-loadmore-edit" onClick={() => {
                this.setState({ visible: true, CrewName: item.CrewName, CrewCode: item.CrewCode })
              }}
              >编辑</a>,
              <Popconfirm
                placement="left"
                title={delInfo}
                onConfirm={() => {
                  this.onDelete(item.CrewCode)
                }}
                okText="是"
                cancelText="否">
                <a key="list-loadmore-more">删除</a>
              </Popconfirm>
              ];
              return <List.Item
                actions={actions1}
              >
                {item.CrewName}
              </List.Item>
            }}
          />
          <Modal
            title={CrewCode ? '编辑机组信息' : "添加机组信息"}
            visible={visible}
            onOk={CrewCode ? this.UpdateCrewInfo : this.AddCrewInfo}
            onCancel={() => this.setState({ visible: false })}
          >
            <Row>
              <Col className="ant-form-item-label" span={4}>
                <label className="ant-form-item-required">
                  机组名称
                </label>
              </Col>
              <Col span={16}>
                <Input value={CrewName} placeholder="请填写机组名称！" onChange={e => {
                  this.setState({ CrewName: e.target.value })
                }} />
              </Col>
            </Row>
          </Modal>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default UnitInfoPage;