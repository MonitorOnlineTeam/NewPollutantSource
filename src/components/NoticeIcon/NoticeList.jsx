import { Avatar, List, Tooltip } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './NoticeList.less';
import moment from 'moment';
import Link from 'umi/link';
const NoticeList = ({
  data = [],
  onClick,
  onClear,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
}) => {
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          alt="not found"
        />
        <div>{emptyText}</div>
      </div>
    );
  }
  const tooltipText = (value) => {
    return <div style={{ color: 'rgba(0, 0, 0, 0.65)', wordWrap: 'break-word' }}>{value}</div>
  }
  return (
    <div>
      <List
        className={styles.list}
        dataSource={data}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          }); // eslint-disable-next-line no-nested-ternary

          const leftIcon = item.avatar ? (
            typeof item.avatar === 'string' ? (
              <Avatar className={styles.avatar} src={item.avatar} style={{ verticalAlign: "top !important" }} />
            ) : (
                <span className={styles.iconElement} style={{ verticalAlign: "top !important" }}>{item.avatar}</span>
              )
          ) : null;
          return (
            <List.Item
              className={itemCls}
              key={item.key || i}
              onClick={() => onClick && onClick(item)}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={
                  <>
                    <div className={styles.title}>
                      <h3 style={{ fontWeight: "bold" }}> {item.ParentName}-{item.PointName} </h3>
                    </div>
                    <div>
                      {
                        item.AlarmType == 13 ? //质控核查报警
                          <>
                          // /dataSearch/qca/zeroCheck
                          // /dataSearch/qca/rangeCheck
                          // /dataSearch/qca/blindCheck
                          // /dataSearch/qca/linearCheck
                          // /dataSearch/qca/resTimeCheck
                          </>
                          :
                          <>
                            {item.AlarmMsg && item.AlarmMsg.length >= 62 ?
                              <div style={{ overflow: "hidden" }}>

                                <Tooltip title={tooltipText(item.AlarmMsg)} color={"#fff"} overlayStyle={{ maxWidth: 400 }}>
                                  <div style={{ fontWeight: 'normal', '-webkit-box-orient': 'vertical',width:"auto",float: "left"}} className="line-clamp-3">
                               
                                    <span> {item.AlarmMsg} </span>
                  
                                  </div>
                                </Tooltip>
                                <span style={{ float: "left" }}>
                                  {item.AlarmType === "5" ?

                                    <Link to={`/dataSearch/monitor/alarm/overrecord?code=${item.PollutantCode}&type=alarm`} >查看</Link> :// 数据超标
                                    item.AlarmType === "0" ?
                                      <Link to={`/dataSearch/monitor/alarm/exceptionRecord?code=${item.PollutantCode}&type=alarm`} >查看</Link> : //数据异常
                                      item.AlarmType === "12" ?
                                        <Link to={`/dynamicControl/dynamicDataManage/controlData/historyparame?code=${item.PollutantCode}&type=alarm`} >查看</Link> : //备案不符
                                        <></>

                                  }
                                </span>
                              </div>
                              :
                              <div style={{ fontWeight: 'normal' }}>
                                {item.AlarmMsg}
                                <span>

                                  {item.AlarmType === "2" ?

                                    <Link to={`/dataSearch/monitor/alarm/overrecord?code=${item.PollutantCode}&type=alarm`} >查看</Link> :// 数据超标
                                    item.AlarmType === "0" ?
                                      <Link to={`/dataSearch/monitor/alarm/exceptionRecord?code=${item.PollutantCode}&type=alarm`} >查看</Link> : //数据异常
                                      item.AlarmType === "12" ?
                                        <Link to={`/dynamicControl/dynamicDataManage/controlData/historyparame?code=${item.PollutantCode}&type=alarm`} >查看</Link> : //备案不符
                                        <></>

                                  }
                                </span>
                              </div>
                            }
                          </>

                      }

                    </div>

                  </>
                }
                description={
                  <div>
                    {/* <div className={styles.description}>{item.description}</div> */}
                    <div className={styles.datetime}>{moment(item.FirstTime).format("YYYY-MM-DD HH:mm")}</div>
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {clearText} {title}
          </div>
        ) : null}
        {showViewMore ? (
          <div
            onClick={e => {
              if (onViewMore) {
                onViewMore(e);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NoticeList;
