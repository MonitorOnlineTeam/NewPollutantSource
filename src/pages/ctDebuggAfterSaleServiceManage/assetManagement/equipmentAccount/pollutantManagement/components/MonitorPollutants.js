import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Checkbox, message } from 'antd';
import styles from '../style.less';

// 定义mapStateToProps
const mapStateToProps = ({ loading, wordSupervision }) => ({
  // 如果需要其他props，在这里添加
});

class MonitorPollutants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pollutantList: [],
    };
    // 直接使用传入的ref
    if (props.forwardedRef) {
      props.forwardedRef.current = this;
    }
  }

  formRef = React.createRef();

  componentDidMount() {
    if (!this.props.dgimn) {
      message.error('请先保存监测点信息');
      return;
    }
    this.getCTPollutantList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dgimn !== this.props.dgimn) {
      this.getCTPollutantList();
    }
  }

  //获取监测因子
  getCTPollutantList = () => {
    this.props.dispatch({
      type: 'ctPollutantManger/getCTPollutantList',
      payload: {
        pointId: this.props.dgimn,
      },
      callback: res => {
        this.setState({ pollutantList: res });
        let selectedPollutantList = res.filter(item => item.IsCheck);
        this.formRef.current.setFieldsValue({
          pollutantCodeList: selectedPollutantList.map(item => item.ChildID),
        });
      },
    });
  };

  onFinish = () => {
    return new Promise((resolve, reject) => {
      const { dgimn, dispatch } = this.props;

      if (!dgimn) {
        message.error('请先保存监测点信息');
        resolve(false);
        return;
      }

      // 验证表单
      this.formRef.current
        .validateFields()
        .then(values => {
          // 调用保存接口
          dispatch({
            type: 'ctPollutantManger/addOrEditPointPollutant',
            payload: {
              pollutantCodeList: values.pollutantCodeList,
              pointId: dgimn,
            },
            callback: res => {
              if (res.IsSuccess) {
                message.success('保存成功');
                resolve(true);
              } else {
                message.error(res.Message || '保存失败');
                resolve(false);
              }
            },
          });
        })
        .catch(errorInfo => {
          message.error('请检查表单必填项');
          resolve(false);
        });
    });
  };

  render() {
    const { isDetail } = this.props;
    const { pollutantList } = this.state;

    return (
      <Form
        className={styles.noDisabledForm} // 添加自定义class
        style={{ marginTop: '10px' }}
        ref={this.formRef}
        disabled={isDetail}
        autoComplete="off"
        labelCol={{
          flex: '140px',
        }}
        wrapperCol={{
          flex: 'auto',
        }}
      >
        <Form.Item
          label="监测因子"
          name="pollutantCodeList"
          rules={[{ required: true, message: '请选择监测因子' }]}
        >
          <Checkbox.Group
            options={pollutantList.map(item => ({
              label: item.Name,
              value: item.ChildID,
            }))}
          />
        </Form.Item>
      </Form>
    );
  }
}

// 先用connect包装组件
const ConnectedMonitorPollutants = connect(mapStateToProps)(MonitorPollutants);

// 然后用forwardRef包装已连接的组件
export default React.forwardRef((props, ref) => (
  <ConnectedMonitorPollutants {...props} forwardedRef={ref} />
));
