import React, { PureComponent } from 'react'
import { Modal, Upload, Row, Col, message, Divider, Button, Select } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { connect } from 'dva';
import { INDUSTRYS, maxWait } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'

const industry = INDUSTRYS.cement;
const { Option } = Select;

@connect(({ loading, autoForm, CO2Emissions }) => ({
  tableInfo: autoForm.tableInfo,
  configIdList: autoForm.configIdList,
}))
class ImportData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      downloadTempVisible: false,
    };
  }

  // 下载导入模板
  onDownloadTemp = () => {
    const { EntCode } = this.state;
    if (!EntCode) {
      message.error('请选择企业！')
      return;
    }
    this.props.dispatch({
      type: 'downloadTemp',
      payload: {
        EntCode: EntCode,
        IndustryCode: industry,
        CalType: 'w-foss'
      }
    })
  }

  render() {
    const { downloadTempVisible, EntCode } = this.state;
    const { EntView = [] } = this.props.configIdList;

    const props = {
      name: 'file',
      multiple: true,
      // headers: {
      //   authorization: 'authorization-text',
      // },
      action: '/api/rest/PollutantSourceApi/AutoFormDataApi/ImportDataExcel',
      data: {
        ConfigID: '',
      },
      onChange: (info) => {
        if (info.file.status === 'done') {
          message.success("导入成功");
        } else if (info.file.status === 'error') {
          message.error('上传文件失败！')
        }
      },
    };

    return (
      <>
        <Divider type="vertical" style={{ height: 32, marginRight: 18 }} />
        <Upload {...props} style={{ marginLeft: 5 }} >
          <Button type="primary">
            <UploadOutlined />
            导入
          </Button>
        </Upload>
        <Button onClick={() => {
          this.setState({
            downloadTempVisible: true,
          })
        }}>
          <DownloadOutlined />
          下载导入模板
        </Button>
        <Modal
          title="下载导入模板"
          visible={downloadTempVisible}
          onOk={() => {

          }}
          onCancel={() => this.setState({ downloadTempVisible: false })}
        >
          <Select style={{ width: 300 }} placeholder="请选择企业" onChange={(value) => this.setState({ EntCode: value })}>
            {
              EntView.map(item => {
                return <Option value={item["dbo.EntView.EntCode"]} key={item["dbo.EntView.EntCode"]}>{item["dbo.EntView.EntName"]}</Option>
              })
            }
          </Select>
        </Modal>
      </>
    );
  }
}

export default ImportData;