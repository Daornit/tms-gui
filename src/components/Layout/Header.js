import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Layout, Avatar, Popover, Badge, List, Tooltip, Modal, Input, Button, Form, AutoComplete } from 'antd'
import { Ellipsis } from 'ant-design-pro'
import { Trans, withI18n } from '@lingui/react'
import { setLocale } from 'utils'
import moment from 'moment'
import classnames from 'classnames'
import config from 'config'
import styles from './Header.less'
import { router } from 'utils'
import {connect} from "dva";
import store from "store";
const { SubMenu } = Menu
const { Option } = AutoComplete

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
}

@withI18n()
@Form.create()
@connect(({ app, loading }) => ({ app, loading }))
class Header extends PureComponent {

  state = {
    visible: false,
    value: '',
    data: [],
    users: [],
    dataSource: [],
  };

  constructor(props){
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  componentDidMount() {
    const {dispatch} = this.props
    let getUser = () => dispatch({type: 'app/queryUserGroup'});
    getUser().then(data => {
      this.setState({dataSource: data.list})
      this.setState({users: data.list.slice(0)})
    });
  }

  onSelect(value){
    let dataS = this.state.dataSource.splice(0);
    let item = dataS.find(x => x.id == value);
    this.setState({data: [...this.state.data, item]});
    let index = dataS.indexOf(item);
    if(index != -1) {
      dataS.splice(index, 1)
      this.setState({dataSource: [...dataS]});
    }
  }

  removeMember(item){
    let data = this.state.data.splice(0);
    let tempItem = data.find(x => x.id == item.id);
    this.setState({dataSource: [...this.state.dataSource, item]});
    let index = data.indexOf(tempItem);
    if(index != -1) {
      data.splice(index, 1)
      this.setState({data: [...data]});
    }
  }
  onChange = value => {
    this.setState({ value });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk(){
    const { item = {}, dispatch, form, loading } = this.props
    const { validateFields, getFieldsValue } = form

    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        members: this.state.data
      }

      console.log("data :: " ,data);
      dispatch({
        type: `app/createWorkSpace`,
        payload: data
      }).then(() => {
        dispatch({
          type: `app/queryNotification`
        }).then(() => {
          store.set('isInit', false);
          dispatch({
            type: `app/query`
          })
        })
        this.handleCancel();
      })
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleClickMenu = e => {
    e.key === 'SignOut' && this.props.onSignOut()
    e.key === 'AccountManagement' && router.push({
      pathname: '/user',
    })
  }

  routeToInbox = (item) => {
    let { dispatch } = this.props;
    dispatch({ type: 'app/readInboxByCode', payload: { code: item.code } }).then(data => {
      dispatch({ type: 'app/queryNotification' }).then(data => {
        router.push({
          pathname: item.link,
        })
      })
    })
  };

  render() {
    const {
      i18n,
      fixed,
      avatar,
      username,
      collapsed,
      notifications = [],
      onCollapseChange,
      onAllNotificationsRead,
      form,
    } = this.props

    const { getFieldDecorator } = form;

    const { dataSource, data } = this.state;
    const children = dataSource.map(item => <Option key={item.id}>{item.email}</Option>);
    const rightContent = [
        <Menu key="user" mode="horizontal" onClick={this.handleClickMenu}>
          <SubMenu
            title={
              <Fragment>
              <span style={{ color: '#999', marginRight: 4 }}>
                <Trans>Сайн уу,</Trans>
              </span>
                <span>{username}</span>
                <Avatar style={{ marginLeft: 8 }} src={avatar} />
              </Fragment>
            }
          >

            <Menu.Item key="SignOut">
              <Trans>Гарах</Trans>
            </Menu.Item>

          </SubMenu>
        </Menu>,
    ]

    if (config.i18n) {
      const { languages } = config.i18n
      const currentLanguage = languages.find(
        item => item.key === i18n._language
      )

      rightContent.unshift(
        <Menu
          key="language"
          selectedKeys={[currentLanguage.key]}
          onClick={data => {
            setLocale(data.key)
          }}
          mode="horizontal"
        >
        </Menu>
      )
    }

    rightContent.unshift(
      <Popover
        placement="bottomRight"
        trigger="click"
        key="notifications"
        overlayClassName={styles.notificationPopover}
        getPopupContainer={() => document.querySelector('#primaryLayout')}
        content={
          <div className={styles.notification}>
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              locale={{
                emptyText: <Trans>Та бүх мэдэгдэлийг уншсан байна.</Trans>,
              }}
              renderItem={item => (
                <List.Item className={styles.notificationItem}>
                  <List.Item.Meta
                    title={
                      <Ellipsis tooltip lines={1} onClick={(e) => this.routeToInbox(item)}>
                        {item.title}
                      </Ellipsis>
                    }
                    description={moment(item.date).fromNow()}
                  />
                  <Icon
                    style={{ fontSize: 10, color: '#ccc' }}
                    type="right"
                    theme="outlined"
                  />
                </List.Item>
              )}
            />
          </div>
        }
      >
        <Badge
          count={notifications.length}
          dot
          offset={[-10, 10]}
          className={styles.iconButton}
        >
          <Icon className={styles.iconFont} type="bell" />
        </Badge>
      </Popover>
    )

    return (
      <Layout.Header
        className={classnames(styles.header, {
          [styles.fixed]: fixed,
          [styles.collapsed]: collapsed,
        })}
        id="layoutHeader"
      >
        <div style={{display: "flex"}}>
          <div
            className={styles.button}
            onClick={onCollapseChange.bind(this, !collapsed)}
          >
            <Icon
              type={classnames({
                'menu-unfold': collapsed,
                'menu-fold': !collapsed,
              })}
            />
          </div>
          <Tooltip placement="topLeft" title={"Ажлын орчин үүсгэх"}>
            <div
              className={styles.button}
              onClick={this.showModal}
            >

                <Icon type="plus-circle" />

            </div>
          </Tooltip>
        </div>

        <div className={styles.rightContainer}>{rightContent}</div>
        <Modal
          title="Ажлын орчин үүсгэх"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <Form.Item label="Ажлын орчины нэр" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Ажлын орчны нэрийг заавал оруулна уу!',
                  },
                ],
              })(<Input placeholder="Ажлын орчины нэр"/>)}
            </Form.Item>
          </Form>
          <div>
            <AutoComplete
              dataSource={dataSource}
              style={{ width: '100%' }}
              onSelect={this.onSelect}
              placeholder="Email хаягаар ажлын орчинд гишүүн нэмэх"
            >
              {children}
            </AutoComplete>
          </div>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  description={item.email}
                />
                <Button onClick={() => this.removeMember(item)}>Хасах</Button>
              </List.Item>
            )}
          />
          <div style={{borderBottom: "1px solid #dedddd", paddingBottom: "15px", marginBottom: "15px"}}/>
        </Modal>
      </Layout.Header>
    )
  }
}

Header.propTypes = {
  fixed: PropTypes.bool,
  user: PropTypes.object,
  menus: PropTypes.array,
  collapsed: PropTypes.bool,
  onSignOut: PropTypes.func,
  notifications: PropTypes.array,
  onCollapseChange: PropTypes.func,
  onAllNotificationsRead: PropTypes.func,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default Header
