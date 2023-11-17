import styles from './utils.less'
export function getPointStatusImg(record, noticeList) {
  const { stop, status, DGIMN, outPutFlag } = record;
  // if (stop) {
  //   return '';
  // }
  let imgSrc, imgWidth;
  imgWidth = 14;
  imgSrc = '/gisunline.png';
  if (status === 1) {
    imgSrc = '/gisnormal.png';
  }
  if (status === 2) {
    imgSrc = '/gisover.png';
  }
  if (status === 3) {
    imgSrc = '/gisexception.png';
  }
  if (!!noticeList.find(m => m.DGIMN === DGIMN)) {
    return <div className={styles.container} style={{ display: "inline" }}>
      {
        outPutFlag == 1 ? <span style={{ color: "#40474e", fontWeight: "bold" }}>停运</span> : <img style={{ width: imgWidth }} src={imgSrc} />
      }
      {/* <div className={styles.pulse}></div> */}
      {/* <div className={styles.pulse1}></div> */}
    </div>
  }
  if (outPutFlag == 1) {
    return <span style={{ color: "#40474e", fontWeight: "bold" }}>停运</span>
  }
  return <img style={{ width: imgWidth }} src={imgSrc} />;
}
