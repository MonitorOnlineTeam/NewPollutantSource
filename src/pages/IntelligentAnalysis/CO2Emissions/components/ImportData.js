import React, { PureComponent } from 'react'
import { Modal, Upload, Row, Col, message, Divider, Button, Select } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { connect } from 'dva';
import { INDUSTRYS, maxWait } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'
import styles from './ImportData.less'

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
      type: 'CO2Emissions/downloadTemp',
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
      accept: ".xls,.xlsx",
      // fileList: [],
      // multiple: true,
      // headers: {
      //   authorization: 'authorization-text',
      // },
      action: '/api/rest/PollutantSourceApi/BaseDataApi/ImportGHGExcel',
      data: {},
      onChange: (info) => {
        if (info.file.status === 'done') {
          console.log('success=', info)
          this.props.onSuccess();
          message.success("导入成功");
        } else if (info.file.status === 'error') {
          console.log('error=', info)
          message.error('上传文件失败！' + info.file.response.Message)
        }
      },
    };

    return (
      <>
        <Divider type="vertical" style={{ height: 32, marginRight: 18 }} />
        <Upload {...props} style={{ marginLeft: 5 }} className={styles.myUpload} >
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
          onOk={this.onDownloadTemp}
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