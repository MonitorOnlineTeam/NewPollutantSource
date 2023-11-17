import React from 'react';
import { Spin } from 'antd'; // loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport

const PageLoading = (props) => (
  <div
    style={{
      paddingTop: 100,
      textAlign: 'center',
      overflow: 'hidden'
    }}
  >
    <Spin size={props.size?props.size: "large"} />
  </div>
);

export default PageLoading;
