import React, { PureComponent } from 'react'
import { withI18n } from '@lingui/react'
import {Page} from "../../components";
import {List, Badge, Icon, Button} from "antd";
import { router } from 'utils';
import PropTypes from "prop-types";
import PrimaryLayout from "../../layouts/PrimaryLayout";
import {connect} from "dva";

@withI18n()
@connect(({ app, loading }) => ({ app, loading }))
class Inbox extends PureComponent {

  state = {
    inboxes: [],
  }

  componentDidMount() {
    let { dispatch } = this.props;
    dispatch({ type: 'app/queryInbox' }).then(data => {
      this.setState({inboxes: data.list});
    })
  }

  routeToInbox = (item) => {
    let { dispatch } = this.props;
    dispatch({ type: 'app/readInboxByCode', payload: { code: item.code } }).then(data => {
      dispatch({ type: 'app/queryNotification' })
      router.push({
        pathname: item.link,
      })
    })
  };

  render() {
    return (
      <Page inner>
        <List
          itemLayout="horizontal"
          locale={{emptyText: 'Танд мэдэгдэл алга'}}
          dataSource={this.state.inboxes}
          renderItem={item => (
            <List.Item style={{width: '100%'}}>
              <List.Item.Meta
                title={<p>{item.title}</p>}
                description={<div>
                  <div>{item.content}</div>
                  <div style={{float: "right", paddingRight: '20px'}}>{item.date}</div>
                </div>}
              />
              <Badge onClick={(e) => this.routeToInbox(item)} dot={!item.notified ? true: false} >
                <a type="primary">Нээх</a>
              </Badge>
            </List.Item>
          )}
        />
      </Page>
    )
  }
}

Inbox.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}
export default Inbox
