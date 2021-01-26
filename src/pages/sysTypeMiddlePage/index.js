import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Card } from 'antd'
import { wrap } from 'lodash';

@connect(({ sysTypeMiddlePage }) => ({
  sysPollutantTypeList: sysTypeMiddlePage.sysPollutantTypeList,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getSysPollutantTypeList();
  }

  // 获取系统的污染物类型
  getSysPollutantTypeList = () => {
    this.props.dispatch({
      type: 'sysTypeMiddlePage/getSysPollutantTypeList',
    })
  }


  onSysItemClick = (item) => {
    window.open(`/sessionMiddlePage?sysInfo=${JSON.stringify(item)}`)
  }

  render() {
    const { sysPollutantTypeList } = this.props;
    const flexStyle = {
      background: '#ECECEC',
      padding: '30px',
      display: 'flex',
      flexWrap: 'wrap',
      height: '100vh',
      alignContent: 'start'
    }
    return (
      <div style={{ ...flexStyle }}>
        {
          sysPollutantTypeList.map(item => {
            return <Card onClick={() => this.onSysItemClick(item)} style={{ width: 300, flex: '0 0 300px', margin: '10px', height: '140px', cursor: 'pointer' }} bordered={false}>
              {item.Name}
            </Card>
          })
        }
      </div>
    );
  }
}

export default index;