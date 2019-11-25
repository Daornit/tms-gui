import React, { PureComponent } from 'react'
import { withI18n } from '@lingui/react'
import {Page} from "../../components";
import {List, Badge, Icon, Button} from "antd";
import { router } from 'utils';
import PropTypes from "prop-types";
import PrimaryLayout from "../../layouts/PrimaryLayout";
import {connect} from "dva";
import TaskView from "../../components/TaskView/TaskView";

@withI18n()
@connect(({ app, loading }) => ({ app, loading }))
class ToDo extends PureComponent {

  render() {
    return (
      <Page inner>
        <TaskView/>
      </Page>
    )
  }
}

ToDo.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}
export default ToDo
