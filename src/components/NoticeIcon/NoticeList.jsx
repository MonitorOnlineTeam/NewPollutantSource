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

  const linkClick = (record) => {
    const date = record.FirstTime;

    const code = [...new Set(record.PollutantCode.split(","))].join()
    const startTime = moment(date).format("YYYY-MM-DD 00:00:00")
    const endTime = date;
    if (record.AlarmType == 13) {

    } else {
      return <>
          {record.AlarmType === "2" ? // 数据超标
             
             <Link to={`/dataSearch/monitor/alarm/overrecord?type=alarm&dgimn=${record.DGIMN}&startTime=${startTime}&endTime=${endTime}&dataType=${record.DataDtype}&title=${`${record.ParentName}-${record.PointName}`}&code=${code}`} >查看</Link> :
             record.AlarmType === "0" ? //数据异常
               <Link to={`/dataSearch/monitor/alarm/exceptionRecord?type=alarm&dgimn=${record.DGIMN}&startTime=${startTime}&endTime=${endTime}&dataType=${record.DataDtype}&title=${`${record.ParentName}-${record.PointName}`}&code=${code}`} >查看</Link> : 
               record.AlarmType === "12" ? //备案不符
                 <Link to={`/dynamicControl/dynamicDataManage/controlData/historyparame?type=alarm&dgimn=${record.DGIMN}&startTime=${startTime}&endTime=${endTime}&title=${`${record.ParentName}-${record.PointName}`}&code=${code}`} >查看</Link> :
                  <></>
 
           }
      </>
    }
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
                            {linkClick(item)}
                          </>
                          :
                          <>
                            {item.AlarmMsg && item.AlarmMsg.length >= 62 ?
                              <div style={{ overflow: "hidden" }}>

                                <Tooltip title={tooltipText([...new Set(item.AlarmMsg.split(";"))].join(";"))} color={"#fff"} overlayStyle={{ maxWidth: 400 }}>
                                  <span style={{ fontWeight: 'normal', '-webkit-box-orient': 'vertical', width: "auto", float: "left" }} className="line-clamp-3">

                                    <span> {[...new Set(item.AlarmMsg.split(";"))].join(";")} </span>

                                  </span>
                                </Tooltip>
                                <span style={{ float: "left" }}> {linkClick(item)} </span>
                              </div>
                              :
                              <div style={{ fontWeight: 'normal' }}>
                                <span style={{ paddingLeft: 5 }}>{item.AlarmMsg} </span>
                                <>

                                  {linkClick(item)}

                                </>
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
