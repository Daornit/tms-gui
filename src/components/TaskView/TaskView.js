import React from 'react'
import { Form, Tabs } from 'antd'
import Chart from "react-google-charts";
import Filter from "./components/Filter";
import ListTask from "./components/List";
const { TabPane } = Tabs;

const tasks = [
  [
    { type: 'string', label: 'Task ID' },
    { type: 'string', label: 'Task Name' },
    { type: 'string', label: 'Resource' },
    { type: 'date', label: 'Start Date' },
    { type: 'date', label: 'End Date' },
    { type: 'number', label: 'Duration' },
    { type: 'number', label: 'Percent Complete' },
    { type: 'string', label: 'Dependencies' },
  ],
  [
    '2014Spring',
    'Spring 2014',
    'spring',
    new Date(2014, 2, 22),
    new Date(2014, 5, 20),
    null,
    100,
    null,
  ],
  [
    '2014Summer',
    'Summer 2014',
    'summer',
    new Date(2014, 5, 21),
    new Date(2014, 8, 20),
    null,
    100,
    null,
  ],
  [
    '2014Autumn',
    'Autumn 2014',
    'autumn',
    new Date(2014, 8, 21),
    new Date(2014, 11, 20),
    null,
    100,
    null,
  ],
  [
    'bvbbg',
    'Winter 2014',
    'winter',
    new Date(2014, 11, 21),
    new Date(2015, 2, 21),
    null,
    100,
    null,
  ],
  [
    'xccv',
    'Winter 2014',
    'winter',
    new Date(2014, 11, 21),
    new Date(2015, 2, 21),
    null,
    100,
    null,
  ],
  [
    'oioo',
    'Winter 2014',
    'winter',
    new Date(2014, 11, 21),
    new Date(2015, 2, 21),
    null,
    100,
    null,
  ],
  [
    'bvcb',
    'Winter 2014',
    'winter',
    new Date(2014, 11, 21),
    new Date(2015, 2, 21),
    null,
    100,
    null,
  ],
  [
    'qwq',
    'Winter 2014',
    'winter',
    new Date(2014, 11, 21),
    new Date(2015, 2, 21),
    null,
    100,
    null,
  ],[
    'frfr',
    'Winter 2014',
    'winter',
    new Date(2014, 11, 21),
    new Date(2015, 2, 21),
    null,
    100,
    null,
  ],
  [
    'ffdw',
    'Winter 2014',
    'winter',
    new Date(2014, 11, 21),
    new Date(2015, 2, 21),
    null,
    100,
    null,
  ],
  [
    'fds',
    'Winter 2014',
    'winter',
    new Date(2014, 11, 21),
    new Date(2015, 2, 21),
    null,
    100,
    null,
  ],
  [
    'fdsaf',
    'Winter 2014',
    'winter',
    new Date(2014, 11, 21),
    new Date(2015, 2, 21),
    null,
    100,
    null,
  ],

  [
    '2015Spring',
    'Spring 2015',
    'spring',
    new Date(2015, 2, 22),
    new Date(2015, 5, 20),
    null,
    50,
    null,
  ],
  [
    '2015Summer',
    'Summer 2015',
    'summer',
    new Date(2015, 5, 21),
    new Date(2015, 8, 20),
    null,
    0,
    null,
  ],
  [
    '2015Autumn',
    'Autumn 2015',
    'autumn',
    new Date(2015, 8, 21),
    new Date(2015, 11, 20),
    null,
    0,
    null,
  ],
  [
    '2015Winter',
    'Winter 2015',
    'winter',
    new Date(2015, 11, 21),
    new Date(2016, 2, 21),
    null,
    0,
    null,
  ],
  [
    'Football',
    'Football Season',
    'sports',
    new Date(2014, 8, 4),
    new Date(2015, 1, 1),
    null,
    100,
    null,
  ],
  [
    'Baseball',
    'Baseball Season',
    'sports',
    new Date(2015, 2, 31),
    new Date(2015, 9, 20),
    null,
    14,
    null,
  ],
  [
    'Basketball',
    'Basketball Season',
    'sports',
    new Date(2014, 9, 28),
    new Date(2015, 5, 20),
    null,
    86,
    null,
  ],
  [
    'Hockey',
    'Hockey Season',
    'sports',
    new Date(2014, 9, 8),
    new Date(2015, 5, 21),
    null,
    89,
    null,
  ],
];

@Form.create()
class TaskView extends React.Component{

  handleRefresh = newQuery => {
    console.log('newQuery', newQuery)
  }

  get filterProps() {
    return {
      filter: {
        name: '',
        status: 'new',
        assignee: ''
      },
      onFilterChange: value => {
        this.handleRefresh({
          ...value,
        })
      },
      onAdd() {

      },
    }
  }

  render() {
    let {comments, users, currentUser, code, submitting} = this.props;

    return (
      <div>
        <Filter {...this.filterProps} />
        <Tabs defaultActiveKey="1" tabPosition={'left'}>
          <TabPane tab="Жагсаалт" key="1">
            <ListTask/>
          </TabPane>
          <TabPane tab="Гант чарт" key="2">
            <Chart
              width={'100%'}
              chartType="Gantt"
              data={tasks}
              options={{
                height: (tasks.length * 30) + 50,
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
