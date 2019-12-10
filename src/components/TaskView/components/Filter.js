/* global document */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Trans, withI18n } from '@lingui/react'
import {Form, Button, Row, Col, DatePicker, Input, Select, Icon, AutoComplete} from 'antd'
import city from 'utils/city'

const { Option } = Select;
const { Search } = Input
const { RangePicker } = DatePicker

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

@withI18n()
@Form.create()
class Filter extends Component {

  handleSubmit = () => {
    const { onFilterChange, form } = this.props
    const { getFieldsValue } = form

    let fields = getFieldsValue()
    console.log('fields' , fields);
    onFilterChange(fields)
  }

  handleReset = () => {
    const { form } = this.props
    const { getFieldsValue, setFieldsValue } = form

    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    this.handleSubmit()
  }

  render() {
    const { filter, form, i18n, users = [] } = this.props
    const { getFieldDecorator } = form
    const { name, taskStatus, assignee } = filter

    let options = users.map(user => <Select.Option key={user.id} value={user.id}>{user.email}</Select.Option>)

    return (
      <Row gutter={24}>
        <Col {...ColProps} xl={{ span: 5 }} md={{ span: 8 }}>
          {getFieldDecorator('name', { initialValue: name })(
            <Search
              placeholder={i18n.t`Нэрээр хайх`}
              onSearch={this.handleSubmit}
            />
          )}
        </Col>
        <Col {...ColProps} xl={{ span: 5 }} md={{ span: 8 }}>
          {getFieldDecorator('taskStatus', { initialValue: taskStatus })(
            <Select style={{width: '170px'}}>
              <Option value="new" label="Шинэ">
                <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px"}}/>
                Шинэ
              </Option>
              <Option value="complete" label="Дууссан">
                <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "#00d600"}}/>
                Дууссан
              </Option>
              <Option value="cancelled" label="Хаагдсан">
                <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "rgb(162, 162, 162)"}}/>
                Хаагдсан
              </Option>
              <Option value="approved" label="Баталгаажсан" disabled={true}>
                <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "#ffbf00"}}/>
                Баталгаажсан
              </Option>
              <Option value="process" label="Хийгдэж байгаа">
                <Icon type="thunderbolt" theme="filled" style={{paddingRight: "10px", color: "#3fa5ff"}}/>
                Хийгдэж байгаа
              </Option>
            </Select>
          )}
        </Col>
        <Col {...ColProps} xl={{ span: 5 }} md={{ span: 8 }}>
          {getFieldDecorator('assignee', { initialValue: assignee })(
            <Select style={{ width: 120 }}>
              {options}
            </Select>
          )}
        </Col>
        <Col
          {...TwoColProps}
          xl={{ span: 10 }}
          md={{ span: 24 }}
          sm={{ span: 24 }}
        >
          <Row type="flex" align="middle" justify="space-between">
            <div>
              <Button
                type="primary"
                className="margin-right"
                onClick={this.handleSubmit}
              >
                <Trans>Хайх</Trans>
              </Button>
              <Button onClick={this.handleReset}>
                <Trans>Сэргээх</Trans>
              </Button>
            </div>
          </Row>
        </Col>
      </Row>
    )
  }
}

Filter.propTypes = {
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Filter
