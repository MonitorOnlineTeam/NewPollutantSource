import { Avatar, List,Tooltip} from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './NoticeList.less';
import moment from 'moment';

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
 const  tooltipText=(value)=>{ 
    return <div style={{color:'rgba(0, 0, 0, 0.65)',wordWrap:'break-word'}}>{value}</div>
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
              <Avatar className={styles.avatar} src={item.avatar} style={{verticalAlign:"top !important"}}/>
            ) : (
              <span className={styles.iconElement} style={{verticalAlign:"top !important"}}>{item.avatar}</span>
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
                   <h3 style={{fontWeight:"bold"}}> {item.TargetName}-{item.PointName} </h3>
                  </div>
                    {item.Description&&item.Description.length>=62?
                   <Tooltip title={tooltipText(item.Description)} color={"#fff"} overlayStyle={{maxWidth:400}}>
                   <div  style={{fontWeight:'normal','-webkit-box-orient': 'vertical'}} className="line-clamp-3">
                   {item.Description}{item.Title}
                  </div>
                  </Tooltip>:
                   <div  style={{fontWeight:'normal','-webkit-box-orient': 'vertical'}} className="line-clamp-3">
                   {item.Description}{item.Title}
                   </div>                                      
                  }


                  </>
                }
                description={
                  <div>
                    {/* <div className={styles.description}>{item.description}</div> */}
                    <div className={styles.datetime}>{  moment(item.LastAlarmTime).format("YYYY-MM-DD HH:mm")}</div>
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
