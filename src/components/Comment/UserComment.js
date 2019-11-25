import React from 'react'
import { Button, List, Comment, Avatar, Form, Mentions} from 'antd'
import moment from "moment";
const { Option } = Mentions;
const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'сэтгэгдлүүд' : 'сэтгэгдэл'}`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

@Form.create()
class UserComment extends React.Component{

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    let {comments, users, currentUser, code, submitting, submit} = this.props;

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

        if (!values.content) {
          return;
        }

        this.setState({
          submitting: true,
        });

        submit({
          author: currentUser.id,
          avatar: currentUser.avatar,
          content: values.content,
          datetime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        });
      }
    });
  };

  render() {
    let {comments, users, currentUser, code, submitting} = this.props;

    let options = [];

    if(users) {
      options = users.map(user => <Option key={user.id} value={user.email}>{user.email}</Option>)
    }

    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div>
        {comments.length > 0 && <CommentList comments={comments} />}
        <Comment
          avatar={
            <Avatar
              src={currentUser.avatar || 'http://localhost:4000/api/v1/downloadFile/avatar.png'}
              alt={currentUser.username || 'Default'}
            />
          }
          content={
            <div>
              <Form.Item>
                <Form.Item label="" labelCol={{ span: 16 }} wrapperCol={{ span: 30 }}>
                  {getFieldDecorator('content', {
                  })(
                    <Mentions prefix={'#'} rows="3" placeholder="Та # тэмдэглэл хийснээр хэрэглэгчийн нэрээр меншиен хийх боломжтой">
                      {options}
                    </Mentions>,
                  )}
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Button style={{float: "left", position: "relative", top: "-30px"}} htmlType="submit" loading={submitting} onClick={this.handleSubmit} type="primary">
                  Сэтгэгдэл үлдээх
                </Button>
              </Form.Item>
            </div>
          }
        />
      </div>
    )
  }
}

export default UserComment
