import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { pathMatchRegexp } from 'utils'
import {
  Typography,
  Avatar,
  Button,
  Input,
  Icon,
  Select,
  Tooltip,
  Upload
} from 'antd';
import CKEditor from "ckeditor4-react";
import store from "store";
import UserComment from "../../../components/Comment/UserComment";

const {Title} = Typography

@connect(({ app, task, loading }) => ({ app, task, loading }))
class TaskDetail extends PureComponent {
  state = {
    submitting: false,
    content: '',
    users: [],
    process: 0,
    code: '',
    files: []
  }

  componentDidMount() {
    let { dispatch, location } = this.props;
    const match = pathMatchRegexp('/task/:id', location.pathname)
    if (match) {
      this.setState({code: match[1]});
      dispatch({ type: 'task/queryPromise', payload: { id: match[1] } }).
      then(task => {
        this.setState({content: task.content, process: task.process});
        dispatch({ type: 'app/getWorkPackageUsers', payload: { id: task.workPackageCode} })
          .then( data => {
            this.setState({users: data.list});
          })
      })

      console.log("queryAttachList");
      dispatch({ type: 'task/queryAttachList', payload: { id: match[1] } }).
      then(files => {
        let fls = files.list.map(x => { return {
          uid: x.id,
          status: 'done',
          type: x.contentType,
          name: x.name,
          url: 'http://localhost:7000/api/v1/download/' + x.id}
        });
        this.setState({files: fls});
      })
    }
  }

  onNameChange = ( name ) => {
    let { dispatch } = this.props;
    let { data } = this.props.task;
    data.name = name
    dispatch({type: 'task/update', payload: data}).then(()=>{
      this.refresh();
    });
  }

  onEditorChange = ( evt ) => {
    this.setState( {
      content: evt.editor.getData()
    } );
  }

  handleSave = () => {
    let { dispatch } = this.props;
    let { data } = this.props.task;

    data.content = this.state.content;
    data.process = this.state.process;
    dispatch({
      type: 'task/update',
      payload: {
        ...data,
        id: data.id
      },
    })
  }

  addComment = (e) => {
    let { dispatch } = this.props;
    let { data } = this.props.task;
    this.setState({submitting: true});
    dispatch({type: 'task/addComment', payload: {...e, id: data.code}})
      .then( addedComment => {
        this.setState({submitting: false});
        this.refresh();
      });
  };

  assignPerson = ( user, task ) => {
    let { dispatch } = this.props;
    task.assignId = user
    dispatch({type: 'task/update', payload: task}).then(()=>{
      this.refresh();
    });
  }

  changeProcess = ( process, task ) => {
    let { dispatch } = this.props;
    task.process = process.target.value
    dispatch({type: 'task/update', payload: task}).then(()=>{
      this.refresh();
    });
  }

  changeStatus = ( status, task ) => {
    let { dispatch } = this.props;
    task.taskStatus = status
    dispatch({type: 'task/update', payload: task}).then(()=>{
      this.refresh();
    });
  }

  onChangeFileList = ({ file, fileList }) => {
    let {dispatch} = this.props
    console.log(file, fileList);
    dispatch({ type: 'task/queryAttachList', payload: { id: this.state.code } }).
    then(files => {
      let fls = files.list.map(x => { return {
        uid: x.id,
        status: 'done',
        type: x.contentType,
        name: x.name,
        url: 'http://localhost:7000/api/v1/download/' + x.id}
      });
      this.setState({files: fls});
    })
  }

  refresh(){
    let { dispatch, location } = this.props;
    const match = pathMatchRegexp('/task/:id', location.pathname)
    dispatch({type: 'task/query', payload: {id: match[1]}}).then()
  }


  render() {
    let { location } = this.props;
    let { data } = this.props.task;
    let { owner } = data;
    let mode = true;
    let currentUser = store.get("user");

    if((owner && owner.id === currentUser.id) || data.assignId === currentUser.id ){
      mode = false;
    }
    let options = this.state.users ? this.state.users.map(user => <Select.Option key={user.id} value={user.id}>{user.email}</Select.Option>) : []
    console.log("task", data)
    return (
      <Page inner>
        <div>
          <Title level={4} editable={{ onChange: this.onNameChange }}>{data.name}</Title>
          <div style={{ display: "flex"}}>
            <div style={{ display: "flex" , float: "left", justifyContent: "center", paddingRight: '15px'}}>
              <Tooltip style={{backgroundColor: "white"}} placement="bottom" title={
                <Select defaultValue={data.assignId} style={{ width: 120 }} onChange={(e) => this.assignPerson(e, data)}>
                  {options}
                </Select>
              }>
                <Avatar src={data.assign ? data.assign.avatar : '/plus.svg'}/>
              </Tooltip>
            </div>
            <Select value={data.taskStatus} style={{width: '170px', marginBottom: '15px'}} onChange={(e) => this.changeStatus(e, data)}>
              <Select.Option value="new" label="Шинэ">
                <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px"}}/>
                Шинэ
              </Select.Option>
              <Select.Option value="complete" label="Дууссан">
                <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "#00d600"}}/>
                Дууссан
              </Select.Option>
              <Select.Option value="cancelled" label="Хаагдсан">
                <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "rgb(162, 162, 162)"}}/>
                Хаагдсан
              </Select.Option>
              <Select.Option value="approved" label="Баталгаажсан" disabled={true}>
                <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "#ffbf00"}}/>
                Баталгаажсан
              </Select.Option>
              <Select.Option value="process" label="Хийгдэж байгаа">
                <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "#3fa5ff"}}/>
                Хийгдэж байгаа
              </Select.Option>
            </Select>

            <div style={{display: "flex", lineHeight: '32px', marginLeft: '20px'}}>
              Гүйцэтгэлийн хувь: <Input type="number" value={this.state.process} onChange={e => this.setState({process: e.target.value})}  style={{width: '80px', marginLeft: '20px'}}/>
            </div>
          </div>
        </div>

        <CKEditor
          data={this.state.content ? this.state.content : data.content}
          type="inline"
          editorName="work-space"
          config={{ height: 600,removePlugins: 'elementspath', readOnly: mode }}
          onChange={this.onEditorChange}
        />
        <Upload action={'http://localhost:7000/api/v1/upload/' + this.state.code} fileList={this.state.files} onChange={this.onChangeFileList}
        >
          <Button>
            <Icon type="upload" /> Файл хавсаргах
          </Button>
        </Upload>
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
      </Page>
    )
  }
}

TaskDetail.propTypes = {
  task: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
}

export default TaskDetail
