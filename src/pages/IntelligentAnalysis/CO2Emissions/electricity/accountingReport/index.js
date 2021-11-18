import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Row, Col, Button, Card, Tooltip, Form, Select, Modal, DatePicker, Spin } from 'antd'
import { DownloadOutlined, FileWordTwoTone, FolderViewOutlined } from '@ant-design/icons';
import { connect } from 'dva'
import moment from 'moment'
import FileViewer from 'react-file-viewer';
import { CustomErrorComponent } from 'custom-error';

const { Meta } = Card;
const { Option } = Select;


@connect(({ loading, CO2Material, common }) => ({
  loading: loading.effects['CO2Material/getCO2ReportList'],
  CO2ReportList: CO2Material.CO2ReportList,
  entList: common.entList,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isModalVisible: false,
      fileViewVisible: false,
      fileInfo: {}
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'common/getEntList',
      payload: {}
    })

    this.props.dispatch({
      type: 'CO2Material/getCO2ReportList',
      payload: {}
    })
  }


  handleCancel = () => {
    this.setState({ isModalVisible: false, fileViewVisible: false });
  }

  onFileView = (fileInfo) => {
    // let suffix = fileInfo.FileName.split(".")[1];
    this.setState({ fileViewVisible: true, fileInfo: fileInfo })
  }

  // 生成报告
  onModalOk = () => {
    this.formRef.current.validateFields().then((values) => {
      this.props.dispatch({
        type: 'CO2Material/createReportCO2',
        payload: {
          EntCode: values.EntCode,
          YearTime: values.YearTime.format('YYYY')
        },
        callback: () => {
          this.setState({ isModalVisible: false });
        }
      })
    })

  }

  render() {
    const { isModalVisible, fileViewVisible, fileInfo } = this.state;
    const { CO2ReportList, entList, loading } = this.props;
    return (
      <BreadcrumbWrapper>
        <Row style={{ background: '#f0f2f5' }}>
          <Button type='primary' onClick={() => this.setState({ isModalVisible: true })}>生成排放报告</Button>
        </Row>
        <div style={{ background: '#f0f2f5', height: 'calc(100vh - 204px)', paddingTop: 20 }}>
          <Spin spinning={loading}>
            <Row gutter={16}>
              {
                CO2ReportList.map(item => {
                  return <Col span={8}> 
                    <Card
                      style={{ border: '1px solid #f0f0f0' }}
                      actions={[
                        <Tooltip title="下载">
                          <a href={item.FilePath} download onClick={(e) => {
                            e.stopPropagation()
                          }}>
                            <DownloadOutlined style={{ fontSize: 20 }} />
                          </a>
                        </Tooltip>,
                        // <Tooltip title="预览">
                        //   <FolderViewOutlined onClick={() => this.onFileView(item)} style={{ fontSize: 20 }} />
                        // </Tooltip>,
                      ]}
                    >
                      <Meta
                        avatar={<FileWordTwoTone style={{ fontSize: 36, marginBottom: 16 }} />}
                        title={<div style={{ lineHeight: '40px' }}>
                          <Tooltip title={item.FileName}>
                            <p className="textOverflow">{item.FileName}</p>
                          </Tooltip>
                        </div>}
                      // description="This is the description"
                      />
                    </Card>
                  </Col>
                })
              }

            </Row>
          </Spin>
        </div>
        <Modal title="生成温室气体排放报告" visible={isModalVisible} confirmLoading={loading} onOk={this.onModalOk} onCancel={this.handleCancel}>
          <Form
            ref={this.formRef}
            initialValues={{
              YearTime: moment(),
            }}
          >
            <Form.Item
              name="YearTime"
              label="核算年份"
              rules={[{ required: true, message: '请选择核算年份!' }]}
            >
              <DatePicker picker="year" style={{ width: '200px' }} />
            </Form.Item>
            <Form.Item
              name="EntCode"
              label="核算企业"
              rules={[{ required: true, message: '请选择企业!' }]}
            >
              <Select placeholder="请选择企业" style={{ width: '300px' }}>
                {
                  entList.map(item => {
                    return <Option value={item.EntCode} key={item.EntCode}>{item.EntName}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          width={"70vw"}
          destroyOnClose
          bodyStyle={{ height: "72vh" }}
          footer={false}
          visible={fileViewVisible}
          onCancel={this.handleCancel}
        >
          <FileViewer
            fileType={fileInfo.FileName ? fileInfo.FileName.split(".")[1] : ''}
            filePath={fileInfo.FilePath}
            // errorComponent={message.error("文件打开失败")}
            errorComponent={CustomErrorComponent}
            onError={() => {
              message.error("文件打开失败")
            }}
          />
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}

export default index;