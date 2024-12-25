/*
 * @Author: outman0611 jia_anbo@163.com
 * @Date: 2024-06-07 10:56:37
 * @LastEditors: outman0611 jia_anbo@163.com
 * @LastEditTime: 2024-08-12 09:03:34
 * @FilePath: \merged_master\src\components\PageLoading\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { Spin } from 'antd'; // loading components from code split
import { PropertySafetyFilled } from '@ant-design/icons';
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport

const PageLoading = (props) => (
  <div
    style={{
      paddingTop: 100,
      textAlign: 'center',
      // overflow: 'hidden'
      ...props.style
    }}
  >
    <Spin size="large" />
  </div>
);

export default PageLoading;
