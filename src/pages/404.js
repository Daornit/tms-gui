import React from 'react'
import { Result, Button } from 'antd'
import router from 'umi/router';

const Error = () => (
  <Result
    status="404"
    title="404"
    subTitle="Таны зочилсон хуудас алга"
    extra={
      <Button type="primary" onClick={() => router.push('/to-do')}>
        Нүүр хуудасруу буцах
      </Button>
    }
  ></Result>
)

export default Error
