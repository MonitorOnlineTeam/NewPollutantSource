import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import {Icon} from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import logo from '../../public/sdlicon.png';
import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '污染源智能分析平台',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const copyright = (
    <Fragment>
      Copyright <Icon type="copyright" />
      {

        '污染源智能分析平台  2019 SDL'

      }
    </Fragment>
  );
  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        formatMessage,
        ...props,
      })}
    >
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>污染源智能分析平台</span>
              </Link>
            </div>
            <div className={styles.desc}>SDL 一流的污染源监控专家</div>
          </div>
          {children}
        </div>
        <DefaultFooter copyright={'污染源智能分析平台  2019 SDL'} links={[]}/>
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
