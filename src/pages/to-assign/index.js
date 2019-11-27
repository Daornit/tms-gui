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
@connect(({ app, toAssign, loading }) => ({ app, toAssign, loading }))
class ToAssign extends PureComponent {

  onNameChange = ( name, task ) => {
    let { dispatch } = this.props;
    task.name = name
    dispatch({type: 'toAssign/updateTask', payload: task}).then(()=>{
      this.refresh();
    });
  }

  onTaskDelete = (taskId) => {
    let { dispatch } = this.props;

    dispatch({
      type: 'toAssign/deleteTask',
      payload: taskId,
    }).then(() => {
      this.refresh()
    })
  }

  changeDate = (task) => {
    let { dispatch } = this.props;
    dispatch({
      type: 'toAssign/updateTask',
      payload: task,
    }).then(() => {
      this.refresh()
    })
  }

  refresh = () => {
    let { dispatch } = this.props;
    dispatch({
      type: 'toAssign/query',
      payload: {},
    })
  }

  render() {
    let {data} = this.props.toAssign;
    return (
      <Page inner>
        <TaskView
          onNameChange={this.onNameChange}
          onTaskDelete={this.onTaskDelete}
          changeDate={this.changeDate}
          mode={'personal'}
          tasks={data.tasks || []}/>
      </Page>
    )
  }
}

ToAssign.propTypes = {
  toAssign: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}
export default ToAssign
