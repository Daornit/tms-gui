import React, { PureComponent } from 'react'
import { Modal, Typography, Avatar, Icon, Tooltip, Select, Tree, Row, Col, DatePicker } from 'antd'
import moment from 'moment';
import styles from './List.less';
import { router } from 'utils'

const { Paragraph } = Typography
const { TreeNode } = Tree;
const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD HH:mm:ss";

class ListTask extends PureComponent {

  state = {
    visible: false,
    item: {}
  }

  showModal = (item) => {
    this.setState({
      visible: true,
      item: item
    });
  };

  handleOk = e => {
    let { changeDate } = this.props;
    this.setState({
      visible: false,
    });
    changeDate(this.state.item);
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  onDrop = info => {
    console.log(info);
  };

  onChange = (value, dateString) => {
    let task = { ...this.state.item };
    task.startDate = dateString[0];
    task.endDate = dateString[1];
    this.setState({item: task});
  }

  openTask = (task) => {
    router.push({
      pathname: '/mn/task/' + task.code,
    })
  }
  render() {
    let { addDefaultTask, addSubTask, tasks, users =[], assignPerson, onNameChange, onTaskDelete, mode } = this.props;
    let options = users.map(user => <Select.Option key={user.id} value={user.id}>{user.email}</Select.Option>)

    const loop = data =>
      data.map(item => {
        if (item.tasks && item.tasks.length) {
          return (
            <TreeNode key={item.id} title={
              <div style={{display: "inline"}}>
                <div style={{ display: "flex" , float: "left", justifyContent: "center", paddingTop: '5px'}}>
                  {item.assign ?
                    <Tooltip placement="bottom" title={item.assign.email}>
                      <Avatar src={item.assign.avatar}/>
                    </Tooltip>
                    :
                    <Tooltip style={{backgroundColor: "white"}} placement="bottom" title={
                      <Select defaultValue="" style={{ width: 120 }} onChange={(e) => assignPerson(e, item)}>
                        {mode === 'personal' ? '':options}
                      </Select>
                    }>
                      <Avatar src="/plus.svg"/>
                    </Tooltip>}
                </div>
                <div style={{ display: "flex", marginLeft: '8px' , float: "left", justifyContent: "center", paddingTop: '5px'}}>
                  <Tooltip placement="bottom" title={
                      mode === 'personal' ? '':
                      <div className={styles.addSubTask} onClick={()=>addSubTask(item.id)}>
                        <Icon type="plus-circle" /> дэд даалгавар үүсгэх
                      </div>
                    }>
                    <div style={{display: "flex", position: "relative", top: '-7px'}}>
                      <Paragraph editable={{ onChange: (e) => onNameChange(e, item) }} >{item.name}</Paragraph>
                      <span>
                        {item.taskStatus === 'new' ? <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px"}}/> : ''}
                        {item.taskStatus === 'complete' ? <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "#00d600"}}/>: ''}
                        {item.taskStatus === 'cancelled' ? <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "rgb(162, 162, 162)"}}/>: ''}
                        {item.taskStatus === 'approved' ? <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "#ffbf00"}}/>: ''}
                        {item.taskStatus === 'process' ? <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "#3fa5ff"}}/>: ''}
                      </span>
                    </div>
                  </Tooltip>
                </div>
                <div style={{float: "right", lineHeight: '50px'}}>
                  <a key="changeDate" onClick={() => this.showModal(item)}>
                    {item.startDate.substr(0,10)} - {item.endDate.substr(0,10)}
                  </a> | <a key="open" onClick={() => this.openTask(item)}> орох</a> | <a style={{color: "red"}} key="delete" onClick={() => onTaskDelete(item.id)}> устгах</a>
                </div>
               </div>
            }>
              {loop(item.tasks)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={
          <div style={{display: "inline"}}>
            <div style={{ display: "flex" , float: "left", justifyContent: "center", paddingTop: '5px'}}>
              {item.assign ?
                <Tooltip placement="bottom" title={item.assign.email}>
                  <Avatar src={item.assign.avatar}/>
                </Tooltip>
                :
                <Tooltip style={{backgroundColor: "white"}} placement="bottom" title={
                  <Select defaultValue="" style={{ width: 120 }} onChange={(e) => assignPerson(e, item)}>
                    {options}
                  </Select>
                }>
                  <Avatar src="/plus.svg"/>
                </Tooltip>}
            </div>
            <div style={{ display: "flex", marginLeft: '8px' , float: "left", justifyContent: "center", paddingTop: '5px'}}>
              <Tooltip placement="bottom" title={
                <div className={styles.addSubTask} onClick={()=>addSubTask(item.id)}>
                  <Icon type="plus-circle" /> дэд даалгавар үүсгэх
                </div>}>

                <div style={{display: "flex", position: "relative", top: '-7px'}}>
                  <Paragraph editable={{ onChange: (e) => onNameChange(e, item) }} >{item.name}</Paragraph>
                  <span>
                    {item.taskStatus === 'new' ? <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px"}}/> : ''}
                    {item.taskStatus === 'complete' ? <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "#00d600"}}/>: ''}
                    {item.taskStatus === 'cancelled' ? <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "rgb(162, 162, 162)"}}/>: ''}
                    {item.taskStatus === 'approved' ? <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "#ffbf00"}}/>: ''}
                    {item.taskStatus === 'process' ? <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "#3fa5ff"}}/>: ''}
                  </span>
                </div>

              </Tooltip>
            </div>
            <div style={{float: "right", lineHeight: '50px'}}>
              <a key="changeDate" onClick={() => this.showModal(item)}>
                {item.startDate.substr(0,10)} - {item.endDate.substr(0,10)}
              </a> | <a key="open" onClick={() => this.openTask(item)}> орох</a> | <a style={{color: "red"}} key="delete" onClick={() => onTaskDelete(item.id)}> устгах</a>
            </div>
          </div>
        } />;
      });

    return (
      <div>
        {mode === 'personal' ? '': <div className={styles.addTask} onClick={()=>addDefaultTask()}><Icon type="plus-circle" /> шинэ даалгавар</div>}
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Tree
              className="draggable-tree"
              draggable
              blockNode
              defaultExpandAll={true}
              onDragEnter={this.onDragEnter}
              onDrop={this.onDrop}
            >
              {loop(tasks)}
            </Tree>
          </Col>
        </Row>
        <Modal
          title="Хугацаа тохируулах"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            defaultValue={[moment(this.state.item.startDate, dateFormat), moment(this.state.item.endDate, dateFormat)]}
            onChange={this.onChange}
            format={dateFormat}
          />
        </Modal>
      </div>
    )
  }
}

export default ListTask
