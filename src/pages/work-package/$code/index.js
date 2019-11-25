import React, { PureComponent } from 'react'
import CKEditor from 'ckeditor4-react';
import Chart from "react-google-charts";
import PropTypes from 'prop-types'
import { connect } from 'dva'
import store from 'store'
import { Page } from 'components'
import { pathMatchRegexp } from 'utils'
import moment  from 'moment'
import { Typography, Tabs, Tree, Comment, Avatar, Form, Button, List, Input, Mentions } from 'antd';
import UserComment from "../../../components/Comment/UserComment";
import TaskView from "../../../components/TaskView/TaskView";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Mentions;
const { TreeNode, DirectoryTree } = Tree;
const { TabPane } = Tabs;

@connect(({ app, workPackageDetail, loading }) => ({ app, workPackageDetail, loading }))
class WorkPackageDetail extends PureComponent {
  state = {
    name: '',
    content: '',
    comments: [],
    submitting: false,
    value: '',
    users: [],
  }

  componentDidMount() {
    let { dispatch, location } = this.props;
    const match = pathMatchRegexp('/work-package/:id', location.pathname)
    if (match) {
      dispatch({ type: 'workPackageDetail/queryWorkPackage', payload: { id: match[1] } }).
      then(workPackage => {
        this.setState({name: workPackage.name, content: workPackage.content});
        dispatch({ type: 'app/getWorkSpaceUsers', payload: { id: workPackage.workSpaceCode} })
          .then( data => {
            this.setState({users: data});
          })
      })
    }
  }

  onEditorChange = ( evt ) => {
    this.setState( {
      content: evt.editor.getData()
    } );
  }

  onTitleChange = str => {
    this.setState({name: str});
  };

  addComment = (e) => {
    let { dispatch, location } = this.props;
    let { data } = this.props.workPackageDetail;
    this.setState({submitting: true});
    dispatch({type: 'workPackageDetail/addComment', payload: {...e, id: data.code}})
      .then( addedComment => {
        this.refreshPage();
        this.setState({submitting: false});
      });
  };

  refreshPage = () => {
    let { dispatch, location } = this.props;
    const match = pathMatchRegexp('/work-package/:id', location.pathname)
    if (match) {
      dispatch({ type: 'workPackageDetail/query', payload: { id: match[1] } }).
      then(workPackage => { console.log("com ref")})
    }
  }

  handleSave = () => {
    let { dispatch } = this.props;
    let { data } = this.props.workPackageDetail;

    data.name = this.state.name;
    data.content = this.state.content;
    dispatch({
      type: 'workPackageDetail/update',
      payload: {
        ...data,
        id: data.id
      },
    })
  }

  render() {
    let { data } = this.props.workPackageDetail;
    let { content, name } = this.state;
    let { owner } = data;
    let mode = true;
    let currentUser = store.get("user");

    if(owner && owner.id === currentUser.id){
      mode = false;
    }

    return (
      <Page inner>
        <Title level={4} editable={{ onChange: this.onTitleChange }}>{this.state.name ? this.state.name : data.name}</Title>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Агууллага" key="1">
            <CKEditor
              data={this.state.content ? this.state.content : data.content}
              type="inline"
              editorName="work-space"
              config={{ height: 600,removePlugins: 'elementspath', readOnly: mode }}
              onChange={this.onEditorChange}
            />
            {this.state.users ?
              <UserComment
                users={this.state.users.list}
                comments={data.comments || []}
                currentUser={store.get('user')}
                code={''}
                submitting={this.state.submitting}
                submit={this.addComment}/>: ''}
            <Button style={{float: "right", position: "relative", top: "-30px"}} onClick={this.handleSave} type="primary">
              Хадгалах
            </Button>
          </TabPane>
          <TabPane tab="Даалгавар" key="2">
            <TaskView></TaskView>
          </TabPane>
          <TabPane tab="Файл сан" key="3">
            <DirectoryTree multiple defaultExpandAll onSelect={this.onSelect} onExpand={this.onExpand}>
              <TreeNode title="parent 0" key="0-0">
                <TreeNode title="leaf 0-0" key="0-0-0" isLeaf />
                <TreeNode title="leaf 0-1" key="0-0-1" isLeaf />
              </TreeNode>
              <TreeNode title="parent 1" key="0-1">
                <TreeNode title="leaf 1-0" key="0-1-0" isLeaf />
                <TreeNode title="leaf 1-1" key="0-1-1" isLeaf />
              </TreeNode>
            </DirectoryTree>
          </TabPane>
        </Tabs>
      </Page>
    )
  }
}

WorkPackageDetail.propTypes = {
  workPackageDetail: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
}

export default WorkPackageDetail
