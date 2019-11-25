import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Modal, DatePicker, Radio } from 'antd'
import { withI18n } from '@lingui/react'
import store from 'store';
import moment from 'moment';
import { formatDate } from 'utils';

const { Option } = Select
const { RangePicker } = DatePicker
const FormItem = Form.Item


const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const dateFormat = 'YYYY-MM-DD';

@withI18n()
@Form.create()
class UserModal extends PureComponent {
  handleOk = () => {
    const { item = {}, onOk, form , workSpaceCode} = this.props
    const { validateFields, getFieldsValue } = form
    const user = store.get('user');
    validateFields(errors => {
      if (errors) {
        return
      }
      let tmp = getFieldsValue();

      console.log("tmp :: " ,tmp)
      item.name = tmp.name;
      item.defaultView = tmp.defaultView;
      item.startDate = formatDate(tmp.date[0]);
      item.endDate = formatDate(tmp.date[1]);
      item.ownerId = tmp.ownerId;
      item.workSpaceCode = workSpaceCode;
      const data = {
        ...item
      };

      console.log("data ::: ", data);
      onOk(data)
    })
  }

  render() {
    const { item = {}, onOk, form, i18n, members, ...modalProps } = this.props
    const { getFieldDecorator } = form

    let options = members.map(x => <Option key={x.email} value={x.id}>{x.email}</Option>)

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label={i18n.t`Нэр`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name || '',
              rules: [
                {
                  required: true,
                  message: 'Төслын нэрыг заавал оруулна уу!'
                },
              ],
            })(<Input/>)}
          </FormItem>
          <FormItem label={i18n.t`Хугацаа`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('date', {
              initialValue: item.startDate ? [moment(item.startDate), moment(item.endDate)]:[],
              rules: [
                {
                  type: 'array',
                  required: true,
                  message: 'Төслын эхлэх болон дуусах хугацааг заавал оруулна уу!',
                  format: dateFormat
                }],
            })
            (<RangePicker/>)}
          </FormItem>

          <FormItem label={i18n.t`Харагдац`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('defaultView', {
              initialValue: item.defaultView || 'list',
              rules: [
                {
                  required: true,
                  message: 'Харагдац аа сонгоно уу!'
                },
              ],
            })(<Radio.Group>
                <Radio.Button value="list">Жагсаалт</Radio.Button>
                <Radio.Button value="grantChart">Гант чарт</Radio.Button>
              </Radio.Group>)}
          </FormItem>

          <FormItem label={i18n.t`Томилолт`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('ownerId', {
              initialValue: item.ownerId || null,
              rules: [
                {
                  required: true,
                  message: 'Томилолт хийх ажилтана сонгоно уу!'
                },
              ],
            })(<Select style={{ width: 120 }}>
                {options}
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
