import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {
  Form,
} from 'antd';
import { withI18n } from '@lingui/react'

@withI18n()
@connect(({ loading }) => ({ loading }))
@Form.create()
class Confirm extends PureComponent {

  render() {
    return (
      <Fragment>
      </Fragment>
    );
  }
}

Confirm.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Confirm
