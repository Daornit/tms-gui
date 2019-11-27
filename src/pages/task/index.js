import React, { PureComponent } from 'react'
import { Typography, Tabs, Tree, Comment, Avatar, Form, Button, List, Input, Mentions } from 'antd';
import { pathMatchRegexp } from 'utils'
import { Page } from 'components'
import PropTypes from "prop-types";
import {connect} from "dva";

const { Title } = Typography;

@connect(({ app, task, loading }) => ({ app, task, loading }))
class Task extends PureComponent {

  onNameChange = ( name ) => {
    let { dispatch } = this.props;
    let { data } = this.props.task;
    data.name = name
    dispatch({type: 'task/update', payload: data}).then(()=>{
      this.refresh();
    });
  }

  refresh(){
    let { dispatch, location } = this.props;
    const match = pathMatchRegexp('/task/:id', location.pathname)
    dispatch({type: 'task/query', payload: {id: match[1]}}).then()
  }

  render() {
    let { data } = this.props.task;
    return (
      <Page inner>
        <Title level={4} editable={{ onChange: this.onNameChange }}>{data.name}</Title>
      </Page>
    )
  }
}

Task.propTypes = {
  task: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
}

export default Task
