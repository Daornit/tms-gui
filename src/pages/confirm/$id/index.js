import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less'
import {Button, Result} from "antd";
import router from "umi/router";

@connect(({ confirmDetail }) => ({ confirmDetail }))
class ConfirmDetail extends PureComponent {

  render() {

    const { confirmDetail } = this.props

    console.log(confirmDetail);
    let renderHtml;
    if(confirmDetail.data.hasOwnProperty('statusCode')){
      renderHtml = <Result
        status="success"
        title="Та амжилттай бүртгэлээ баталгаажууллаа."
        extra={
          <Button type="primary" onClick={() => router.push('/en/login')}>
            Нэвтрэх
          </Button>
        }
      ></Result>
    } else {
      renderHtml = <Result
        status="404"
        title="Таны баталгаажуулах код буруу байна."
        extra={
          <Button type="primary" onClick={() => router.push('/en/login')}>
            Нэвтрэх
          </Button>
        }
      ></Result>
    }
    return (
      renderHtml
    )
  }
}

ConfirmDetail.propTypes = {
  confirmDetail: PropTypes.object,
}

export default ConfirmDetail
