import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Form, Row,  } from 'antd'

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {};
  }
  render() {
    return (
      <BreadcrumbWrapper>
        <Card>
          {/* <Form
            ref={this.formRef}
            initialValues={{
              // time: [moment().subtract(29, 'days'), moment()],
            }}
          // onFieldsChange={(changedFields, allFields) => {
          //   console.log('changedFields=', changedFields)
          //   console.log('allFieldss=', allFields)
          // }}
          >
            <Row gutter={[24, 0]}>
              <Col span={10}>
                <Form.Item
                  name="time"
                  label="开始/结束时间"
                >
                  <RangePicker showTime />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="PollutantCode"
                  label="污染物"
                >
                  <Select mode="multiple" placeholder="请选择污染物">
                    {
                      pollutantList.map(item => {
                        return <Option key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Space align="baseline">
                <Button type="primary" onClick={this.getTableDataSource}>查询</Button>
                <Button type="primary" loading={exportLoading} onClick={this.onExport}>导出</Button>
              </Space>
            </Row>
          </Form> */}
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;