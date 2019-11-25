import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { router } from 'utils'
import { stringify } from 'qs'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import {Skeleton, notification, Card, Icon, Avatar, List, Button, AutoComplete, Form, Input, Popconfirm, Row, Col, Collapse} from 'antd';
import ListWorkPackage from '../components/List'
import Filter from '../components/Filter'
import Modal from '../components/Modal'
const { Meta } = Card;
const { Option } = AutoComplete
const { Panel }  = Collapse

const customPanelStyle = {
  background: 'white',
  borderRadius: 4,
  border: 0,
  overflow: 'hidden',
};
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
@withI18n()
@Form.create()
@connect(({ app, spaceDetail, loading }) => ({ app, spaceDetail, loading }))
class WorkSpaceDetail extends PureComponent {
  state = {
    value: '',
    data: [],
    users: [],
    dataSource: [],
  };

  constructor(props){
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.removeMember = this.removeMember.bind(this);
  }

  componentDidMount() {
    const {dispatch} = this.props
    let getUser = () => dispatch({type: 'app/queryUserGroup'});

    getUser().then(users => {
      const { spaceDetail } = this.props
      const { data } = spaceDetail

      data.team.members.forEach(e => {
        let tempItem = users.list.find(x => x.id == e.id)
        let index = users.list.indexOf(tempItem);
        if(index != -1) {
          users.list.splice(index, 1)
        }
      });
      this.setState({dataSource: users.list})
      this.setState({users: users.list.slice(0)})
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { spaceDetail, dispatch } = this.props
    const { data } = spaceDetail

    this.props.form.validateFields((err, values) => {
      if (!err) {
        data.name = values.name
        dispatch({type: 'spaceDetail/update', payload: data}).then(()=>{ notification.success({message: "Амжилттай хадгаллаа"})
        })
      }
    });
  };

  removeMember(item){
    const { spaceDetail } = this.props
    const { data } = spaceDetail
    let tempItem = data.team.members.find(x => x.id == item.id);
    this.setState({dataSource: [...this.state.dataSource, item]});
    let index = data.team.members.indexOf(tempItem);
    if(index != -1) {
      data.team.members.splice(index, 1)
    }
  }

  handleDeleteItems = () => {
    const { dispatch, spaceDetail } = this.props
    const { data } = spaceDetail

    dispatch({
      type: 'spaceDetail/delete',
      payload: {
        id: data.id,
      },
    }).then(() => {

    })
  }

  onSelect(value){
    const { spaceDetail } = this.props
    const { data } = spaceDetail

    let dataS = this.state.dataSource.splice(0);

    let tmpSpace = {...this.state.space};
    let item = dataS.find(x => x.id == value);

    data.team.members = [...data.team.members, item]

    let index = dataS.indexOf(item);
    if(index != -1) {
      dataS.splice(index, 1)
      this.setState({dataSource: [...dataS]});
    }
  }

  handleRefresh = newQuery => {
    const { location } = this.props
    const { query, pathname, data } = location
    console.log(location);
    router.push({
      pathname,
      search: stringify(
        {
          ...query,
          ...newQuery,
        },
        { arrayFormat: 'repeat' }
      ),
    })
  }

  get modalProps() {
    const { dispatch, spaceDetail, loading, i18n } = this.props
    const { currentItem, modalVisible, modalType, data } = spaceDetail
    console.log("Current space: " , data);
    return {
      item: modalType === 'createWorkPackage' ? {} : currentItem,
      visible: modalVisible,
      destroyOnClose: true,
      maskClosable: false,
      workSpaceCode: data.code,
      members: data.team ? data.team.members: [],
      confirmLoading: loading.effects[`spaceDetail/${modalType}`],
      title: `${
        modalType === 'createWorkPackage' ? i18n.t`Шинэ төсөл` : i18n.t`Төсөл засах`
      }`,
      centered: true,
      onOk: data => {
        dispatch({
          type: `spaceDetail/${modalType}`,
          payload: data,
        }).then(() => {
          this.handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'spaceDetail/hideModal',
        })
      },
    }
  }

  get filterProps() {
    const { location, dispatch } = this.props
    const { query } = location

    return {
      filter: {
        ...query,
      },
      onFilterChange: value => {
        this.handleRefresh({
          ...value,
        })
      },
      onAdd() {
        dispatch({
          type: 'spaceDetail/showModal',
          payload: {
            modalType: 'createWorkPackage',
          },
        })
      },
    }
  }

  get listProps() {
    const { dispatch, spaceDetail } = this.props
    const { data, selectedRowKeys } = spaceDetail

    return {
      dataSource: data.workPackages,
      onDeleteItem: id => {
        dispatch({
          type: 'spaceDetail/deleteWorkPackage',
          payload: id,
        }).then(() => {
          this.handleRefresh({})
        })
      },
      onEditItem(item) {
        dispatch({
          type: 'spaceDetail/showModal',
          payload: {
            modalType: 'updateWorkPackage',
            currentItem: item,
          },
        })
      },
    }
  }

  render() {
    const { location, i18n, form, spaceDetail } = this.props

    const { query } = location
    const { data } = spaceDetail
    const { getFieldDecorator } = form;

    const { dataSource } = this.state

    const children = dataSource.map(item => <Option key={item.id}>{item.email}</Option>);

    return (
      <Page inner>
        <Form onSubmit={this.handleSubmit} style={{paddingBottom: '25px'}}>
          <Form.Item label="Ажлын орчины нэр" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: data.name ? data.name: "",
              rules: [
                {
                  required: true,
                  message: 'Ажлын орчны нэрийг заавал оруулна уу!',
                },
              ],
            })(<Input placeholder="Ажлын орчины нэр"/>)}
          </Form.Item>
          <Collapse
            bordered={false}
            defaultActiveKey={['2']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="БАГИЙН УДИРДЛАГА" key="1" style={customPanelStyle}>
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
                  dataSource={data.team !== undefined ? data.team.members : []}
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

            </Panel>
            <Panel header="ТӨСӨЛ УДИРДЛАГА" key="2" style={customPanelStyle}>
              <div>
                <Filter {...this.filterProps} />
                <ListWorkPackage {...this.listProps} />
                <Modal {...this.modalProps} />
              </div>
            </Panel>
          </Collapse>
          <div style={{float: "right"}}>
            <Button type="primary" htmlType="submit" style={{marginRight: "15px"}}>Хадгалах</Button>
            <Popconfirm
              title="Та энэхүү ажлын орчныг устгахдаа итгэлтэй байна уу?"
              placement="left"
              onConfirm={this.handleDeleteItems}
            >
              <Button type="danger" style={{ marginLeft: 8 }}>
                Утсгах
              </Button>
            </Popconfirm>
          </div>
        </Form>
      </Page>
    )
  }
}

WorkSpaceDetail.propTypes = {
  spaceDetail: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
}

export default WorkSpaceDetail
