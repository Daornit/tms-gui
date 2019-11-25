import React, { PureComponent } from 'react'
import { withI18n } from '@lingui/react'
import { Card, List } from 'antd';
import store from 'store';


@withI18n()
class WorkSpace extends PureComponent {
  render() {
    let routes = store.get("routeList");
    let workSpaceRoutes = [];
    routes.forEach(x => {
      if(/\/work-space*/.exec(x.route) && x.id !== 5008){
        workSpaceRoutes.push(x);
      }
    });

    return (
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        dataSource={workSpaceRoutes}
        renderItem={item => (
          <List.Item>
            <a href={item.route}>
              <Card>{item.name}</Card>
            </a>
          </List.Item>
        )}
      />
    )
  }
}

export default WorkSpace
