import React, {Component} from 'react';
import {
    Card,
    CardImg,
    CardText,
    CardBody,
    CardTitle,
    Breadcrumb,
    BreadcrumbItem,
    Modal,
    ModalHeader,
    ModalBody,
    Button,
    Col,
    Label,
    Form,
    FormGroup,
    Input, FormFeedback
} from 'reactstrap';
import {Link} from "react-router-dom";
import { Control } from 'react-redux-form';
import Menu from "./MenuComponent";


class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.toggleModal = this.toggleModal.bind(this);
        this.state = {
            isModalOpen: false,
            rating: '',
            author: '',
            message: '',
            touched: {
                rating: false,
                author: false,
                message: false
            }
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked :
            target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

    }
    handleSubmit(event) {
        this.props.addComment(this.props.dishId, event.rating,
            event.author, event.comment);
        event.preventDefault();
    }
    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true }
        });
    }
    validate(author) {
        const errors = {
            author: ''
        };
        if (this.state.touched.author && author.length < 3)
            errors.author = 'Name should be >= 3 characters';
        else if (this.state.touched.author && author.length > 15)
            errors.author = 'Name should be <= 15 characters';
        return errors;

    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
        });
    }

    render(){
        const errors = this.validate(this.state.author);

        return(
            <div>

                <Button type="submit" onClick={this.toggleModal} className="btn btn-outline-secondary">
                    <span className="fa fa-pencil">  Submit Comment</span>
                </Button>
                <Modal
                    isOpen={this.state.isModalOpen}
                    toggle={this.toggleModal}
                    fade={false}>
                    <ModalHeader>Submit Comment</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label htmlFor='rating'>Rating</Label>
                                <Control.select
                                    model='.rating'
                                    id='rating'
                                    name='rating'
                                    className='form-control'>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </Control.select>
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor='author'>Your Name</Label>
                                <Input type="text" id="author"
                                       name="author"
                                       placeholder="Your Name"
                                       value={this.state.author}
                                       valid={errors.author === ''}
                                       invalid={errors.author !== ''}
                                       onBlur={this.handleBlur('author')}
                                       onChange={this.handleInputChange}
                                       style={{borderColor: "#ced4da"}}
                                />
                                <FormFeedback>
                                    {errors.author}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor='comment'>Comment</Label>
                                <Input
                                    type='textarea'
                                    id='comment'
                                    rows={5}/>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={{size: 10, offset: 2}}>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}
function RenderComments({comments, addComment, dishId}) {
        if (comments == null) {
            return (<div></div>)
        }
        const remarks = comments.map(comment => {
            return (
                <li key={comment.id}>
                    <p>{comment.comment}</p>
                    <p>-- {comment.author},
                        &nbsp;
                        {new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit'
                        }).format(new Date(comment.date))}
                    </p>
                </li>
            )
        })
        return (
            <div className=''>
                <h4> Comments </h4>
                <ul className='list-unstyled'>
                    {remarks}
                </ul>
                <CommentForm dishId={dishId} addComment={addComment} />
            </div>
        )
    }
    function RenderDish({dish}) {
        if (dish != null) {
            return (
                <div className=''>
                    <Card>
                        <CardImg width="100%" src={dish.image} alt={dish.name} />
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                </div>
            )
        }
        else {
            return (<div></div>)
        }
    }

const DishDetail=(props)=>{
    if(props.dish!=null)
        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <Link to="/home">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Link to="/menu">Menu</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem
                            active>{props.dish.name}
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row m-2">
                    <div className="col-6 ml-0 pl-0">
                        <RenderDish dish={props.dish} />
                    </div>
                    <div className="col-6 mr-0 pr-0">
                        <RenderComments comments={props.comments}
                                        addComment={props.addComment}
                                        dishId={props.dish.id}
                        />

                    </div>
                </div>
            </div>
        );
    else {
        return <div>{Menu}</div>
    }
}




export default DishDetail;