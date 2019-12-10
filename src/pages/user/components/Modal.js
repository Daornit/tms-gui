import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {Form, Input, Select, Modal, Upload, Icon, message, Button} from 'antd'
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

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

@withI18n()
@Form.create()
class UserModal extends PureComponent {
  state = {
    loading: false,
    avatar: ''
  };

  componentDidMount() {
    const { item = {}, onOk, form, i18n, ...modalProps } = this.props
    this.setState({avatar: item.avatar})
  }

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
        avatar: this.state.avatar,
        groupCode: user.groupCode,
        isInvitation: true,
        key: item.key,
      }
      onOk(data)
    })
  }

  onChangeFileList = async ({ file }) => {
    const { item = {} } = this.props
    let downloadUrl = await file;
    if(downloadUrl.response != undefined){
      this.setState({avatar: downloadUrl.response.fileDownloadUri})
    }
  }

  render() {
    const { item = {}, onOk, form, i18n, ...modalProps } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Upload listType="picture-card" action={'http://localhost:7000/api/v1/upload/user'} onChange={this.onChangeFileList} showUploadList={false}
        >
          {!this.state.avatar ? <div>
            <Icon type={this.state.loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">Нүүр зураг</div>
          </div> : <img src={this.state.avatar} alt="avatar" style={{ width: '100%' }} />}
        </Upload>

        <Form layout="horizontal">
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
