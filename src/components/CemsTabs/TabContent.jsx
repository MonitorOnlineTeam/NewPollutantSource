

import React from 'react';

class TabContent extends React.Component {

    constructor(props) {
        super(props);
    }

  render() {
    //通过传入的name属性动态得到自己需要注入的组件，TabComponent首字母要大写
    const TabComponent = this.props.name;

    return (
        <TabComponent {...this.props} />
    );
  }
}

export default TabContent;