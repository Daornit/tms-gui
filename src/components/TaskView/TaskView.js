import React from 'react'
import { Form, Tabs } from 'antd'
import Chart from "react-google-charts";
import Filter from "./components/Filter";
import ListTask from "./components/List";
import moment from "moment";
const { TabPane } = Tabs;

@Form.create()
class TaskView extends React.Component{

  state = {
    filter: {
      name: null,
      status: null,
      assignee: null
    }
  };

  handleRefresh = newQuery => {
    this.setState({filter: newQuery})
  }

  get filterProps() {
    let { users, mode } = this.props;
    return {
      users: mode === 'personal' ? []: users,
      filter: this.state.filter,
      onFilterChange: value => {
        this.handleRefresh({
          ...value,
        })
      }
    }
  }

  addDefaultTask = () => {
    let { addTask, workPackageCode = null} = this.props;
    let task = {
      name: 'Шинэ даалгавар',
      startDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      endDate: moment(new Date() + (1000 * 60 * 60 * 24) ).format("YYYY-MM-DD HH:mm:ss"),
      process: 0,
      status: 'new',
      workPackageCode: workPackageCode
    }
    addTask(task);
  };

  addSubTask = (parentId) => {
    let { addTask, workPackageCode = null} = this.props;
    let task = {
      name: 'Шинэ даалгавар',
      startDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      endDate: moment(new Date() + (1000 * 60 * 60 * 24) ).format("YYYY-MM-DD HH:mm:ss"),
      process: 0,
      status: 'new',
      workPackageCode: workPackageCode,
      parentId: parentId}
    addTask(task);
  };


  generateDataForGoogleChart = (result = [], taskList) => {
    if(result.length === 0){
      result.push([
        { type: 'string', label: 'Даалгаврын дугаар' },
        { type: 'string', label: 'Даалгаврын нэр' },
        { type: 'date', label: 'Эхлэх хугацаа' },
        { type: 'date', label: 'Дуусах хугацаа' },
        { type: 'number', label: 'Үргэлжлэх' },
        { type: 'number', label: 'Дууссан хувь' },
        { type: 'string', label: 'Холбоо хамаарал' },
      ]);
    }

    for (let i = 0; i<taskList.length; i++){
      result.push([
        taskList[i]['id'] + '',
        taskList[i]['name'],
        new Date(taskList[i]['startDate']),
        new Date(taskList[i]['endDate']),
        null,
        taskList[i]['process'],
        taskList[i]['parentId'] ? taskList[i]['parentId'] + '' : null,
      ])
      if(taskList[i]['tasks'].length !== 0) this.generateDataForGoogleChart(result, taskList[i]['tasks']);
    }
    console.log("result :: " , result);
    return result;
  }

  filterTask = (tasks = []) => {
    let result = [...tasks];
    let { filter } = this.state
    if(filter && filter !== null && filter !== undefined){
      if(filter.name) result = result.filter(x => x.name.includes(filter.name));
      if(filter.status) result = result.filter(x => x.status === filter.status);
      if(filter.assignee) result = result.filter(x => x.assignId === filter.assignee);
    }
    console.log("Filtered :: ", result, filter);
    return result
  }

  render() {
    let { tasks, users, assignPerson, onNameChange, onTaskDelete, changeDate, mode } = this.props;
    return (
      <div>
        <Filter {...this.filterProps} />
        <Tabs defaultActiveKey="1" tabPosition={'left'}>
          <TabPane tab="Жагсаалт" key="1">
            <ListTask
              addDefaultTask={this.addDefaultTask}
              addSubTask={this.addSubTask}
              tasks={this.filterTask(tasks)}
              users={users}
              mode={mode}
              assignPerson={assignPerson}
              onNameChange={onNameChange}
              onTaskDelete={onTaskDelete}
              changeDate={changeDate}
            />
          </TabPane>
          <TabPane tab="Гант чарт" key="2">
            <Chart
              width={'100%'}
              chartType="Gantt"
              data={this.generateDataForGoogleChart([], this.filterTask(tasks))}
              options={{
                height: (this.generateDataForGoogleChart([], this.filterTask(tasks)).length * 30) + 50,
                gantt: {
                  trackHeight: 30,
                },
              }}
              rootProps={{ 'data-testid': '2' }}
            />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default TaskView
