import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar } from 'antd'
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'
import Link from 'umi/link'
import styles from './List.less'
import router from "umi/router";

const { confirm } = Modal

@withI18n()
class List extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem, i18n } = this.props

    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: i18n.t`Энэхүү төслийг устгахдаа итгэлтэй байна уу?`,
        onOk() {
          onDeleteItem(record.id)
        },
      })
    } else if(e.key === '3') {
      router.push('/work-package/' + record.code)
    }
  }

  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props

    const columns = [
      {
        title: <Trans>Нэр</Trans>,
        dataIndex: 'name',
        key: 'name',
        width: 150,
        render: (text, record) =>  <span style={{color : !record.isDeleted ? "green": "red"}}>{text}</span>,
      },
      {
        title: <Trans>Харагдац</Trans>,
        dataIndex: 'defaultView',
        key: 'defaultView',
        render: (text) => <span>
          {(text === 'list' ? 'Жагсаалт': '')}
          {(text === 'grantChart' ? 'Гант чарт': '')}
          {(text === 'board' ? 'Самбар': '')}
        </span>
      },
      {
        title: <Trans>Эхлэх хугацаа</Trans>,
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: <Trans>Дуусах хугацаа</Trans>,
        dataIndex: 'endDate',
        key: 'endDate',
        width: 150,
      },
      {
        title: <Trans>Гүйцэтгэл</Trans>,
        dataIndex: 'percentage',
        key: 'percentage',
      },
      {
        title: <Trans>Үйлдэл</Trans>,
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: i18n.t`Засах` },
                { key: '2', name: i18n.t`Устгах` },
                { key: '3', name: i18n.t`Орох` },
              ]}
            />
          )
        },
      },
    ]

    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => i18n.t`Total ${total} Items`,
        }}
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
