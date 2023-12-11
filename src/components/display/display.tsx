import React, { memo } from 'react';
import styles from './display.module.css';


const Item = ({ icon, title, value, accType, id }: any) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        {icon}
      </div>
      <div className={styles.title}>
        <p className={styles.text}> {title} </p>
      </div>
      <div className={styles.value}>
        {id == 2
          ?
          <div className={styles.valueCover}>
            <p className={styles.valueCoverText}>{accType}</p>
          </div>
          :
          <p className={id == 1 ? styles.textBold : styles.textValue}> {value} </p>
        }
      </div>
    </div>

    // <div style={{flex: 1, flexDirection: 'row', display: 'flex'}}>
    //   <div style={{flex: 2, display: 'flex'}}>
    //     pp
    //   </div>
    //   <div style={{flex: 2, display: 'flex'}}>
    //     <p > {title} </p>
    //   </div>
    //   <div style={{flex: 2, display: 'flex'}}>
    //     <p> {value} </p>
    //   </div>
    // </div>

  );
}

export default memo(Item);