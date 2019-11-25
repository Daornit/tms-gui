import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Modal } from 'antd'
import { withI18n } from '@lingui/react'
import store from 'store';

const { Option } = Select
const FormItem = Form.Item

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
class UserModal extends PureComponent {
  handleOk = () => {
    const { item = {}, onOk, form } = this.props
    const { validateFields, getFieldsValue } = form
    const user = store.get('user');
    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        groupCode: user.groupCode,
        isInvitation: true,
        key: item.key,
      }
      onOk(data)
    })
  }

  render() {
    const { item = {}, onOk, form, i18n, ...modalProps } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label={i18n.t`Avatar`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('avatar', {
              initialValue: item.avatar || 'http://localhost:4000/api/v1/downloadFile/avatar.png',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input/>)}
          </FormItem>
          <FormItem label={i18n.t`Last name`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('lastName', {
              initialValue: item.lastName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`First Name`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('firstName', {
              initialValue: item.firstName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Phone`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: item.phone,
              rules: [
                {
                  required: true,
                  pattern: /\d{8}$/,
                  message: i18n.t`The input is not valid phone!`,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Email`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: item.email,
              rules: [
                {
                  required: true,
                  pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  message: i18n.t`The input is not valid E-mail!`,
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem label={i18n.t`Role`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('role', {
              initialValue: "member",
              rules: [
                {
                  required: true,
                  message: i18n.t`please select your role!`,
                },
              ],
            })(<Select style={{ width: 120 }}>
                <Option value="manager">Manager</Option>
                <Option value="leader">Leader</Option>
                <Option value="member">Member</Option>
              </Select>)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

UserModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default UserModal
