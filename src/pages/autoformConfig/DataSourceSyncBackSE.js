import React, { PureComponent } from 'react'
import DbSourceTree from './components/DbSourceTree'
import { connect } from 'dva';
import { Card, Row, Col, Button, Upload, message, Checkbox, Space } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { API } from '@config/API'
import Cookie from 'js-cookie';
import config from '@/config'

@connect(({ loading, dbTree, dataSourceConfigModel, fieldConfigModel, getButtonData }) => ({
}))
class DataSourceSyncBackSE extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedIds: [],
      canOverride: false,
    };

    this.DbSourceTree = React.createRef();
  }

  componentDidMount() {
    //获取树形导航
    this.props.dispatch({
      type: 'dbTree/GetDBSourceTree',
      payload: {
        callback: () => {
        }
      }
    })
  }


  onCheck = (checkedKeys, info) => {
    let ids = info.checkedNodes.map(item => item.id);
    this.setState({
      checkedIds: ids
    })
  }

  // 导出
  ExportConsoleConfig = () => {
    if (!this.state.checkedIds.length) {
      message.error('请在左侧勾选导出配置！');
      return;
    }
    this.props.dispatch({
      type: 'dataSourceConfigModel/ExportConsoleConfig',
      payload: {
        keys: this.state.checkedIds
      }
    })
  }

  //加载树
  reloadTreeData = () => {
    this.props.dispatch({
      type: 'dbTree/DeleteTreeConfig',
      payload: {
        callback: () => {
        }
      }
    });
  }

  render() {
    const { canOverride, checkedIds } = this.state;
    console.log('1', this.DbSourceTree)
    let that = this;
    const props = {
      name: 'file',
      headers: {
        Authorization: "Bearer " + Cookie.get(config.cookieName)
      },
      action: API.autoFormApi.ImportConsoleConfig,
      data: {
        canOverride: canOverride,
        canClear: false
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success('上传成功！');
          that.reloadTreeData();
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };




    return <div>
      <DbSourceTree
        checkable
        onCheck={this.onCheck}
        ref={this.DbSourceTree}
      />
      <div style={{ flex: 1, marginLeft: 370 }}>
        <Card>
          <Row style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <Col span={6} style={{ textAlign: 'right', marginRight: 10 }}>导出：</Col>
            <Button disabled={!!!checkedIds.length} type="primary" onClick={this.ExportConsoleConfig}>导出配置信息</Button>
          </Row>
          {/* <Divider /> */}
          <Row style={{ display: 'flex', alignItems: 'center' }}>
            <Col span={6} style={{ textAlign: 'right', marginRight: 10 }}>选择导入配置文件：</Col>
            <Space>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>导入</Button>
              </Upload>
              <Checkbox checked={canOverride} onChange={e => this.setState({ canOverride: e.target.checked })}>是否覆盖已有配置信息</Checkbox>
            </Space>
          </Row>
        </Card>
      </div>
    </div >
  }
}

export default DataSourceSyncBackSE;
