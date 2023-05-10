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
    FormGroup, FormFeedback, Row
} from 'reactstrap';
import {Link} from "react-router-dom";
import {Control, LocalForm} from 'react-redux-form';
import {Loading} from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';


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
        this.props.postComment(this.props.dishId, event.rating, event.author, event.comment);
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
                <Button outline onClick={this.toggleModal}>
                    <span className="fa fa-pencil">  Submit Comment</span>
                </Button>
                <Modal
                    isOpen={this.state.isModalOpen}
                    toggle={this.toggleModal}
                    fade={false}>
                    <ModalHeader>Submit Comment</ModalHeader>
                    <ModalBody>
                            <LocalForm onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Label htmlFor='rating'>Rating</Label>
                                   <Col>
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
                                   </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor='author'>Your Name</Label>
                                    <Col lg={12}>
                                        <Control.text
                                            size={52}
                                            model=".author"
                                            type="text"
                                            id="author"
                                            name="author"
                                            placeholder="Your Name"
                                            value={this.state.author}
                                            valid={errors.author === ''}
                                            invalid={errors.author !== ''}
                                            onBlur={this.handleBlur('author')}
                                            onChange={this.handleInputChange}
                                            />
                                        <FormFeedback>
                                            {errors.author}
                                        </FormFeedback>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor='comment'>Comment</Label>
                                    <Col>
                                    <Control.textarea
                                        model=".comment"
                                        type='textarea'
                                        id='comment'
                                        rows={5}
                                        cols={55} />
                                    </Col>
                                </FormGroup>
                                    <Col>
                                        <Button type="submit" value="submit" color="primary">
                                            Submit
                                        </Button>
                                    </Col>

                            </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}
function RenderComments({comments, postComment, dishId}) {
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
                <CommentForm dishId={dishId} postComment={postComment} />
            </div>
        )
    }
    function RenderDish({dish}) {
        if (dish != null) {
            return (
                <div className=''>
                    <Card>
                        <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
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
    if(props.isLoading) {
        return (
            <div className='container'>
                <div className='row'>
                    <Loading />
                </div>
            </div>
        );
    } else if (props.errMess) {
        return (
            <div className='container'>
                <div className='row'>
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }else if (props.dish !=null) {
        return (
            <div className='container'>
                <div className='row'>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <Link to='/menu'>Menu</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            {props.dish.name}
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <div className='col-12'>
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-6 mr-0 pl-0'>
                    <RenderDish dish={props.dish} />
                    </div>
                    <div className='col-6 mr-0 pr-0'>
                        <RenderComments
                            comments={props.comments}
                            postComment={props.postComment}
                            dishId={props.dish.id} />
                    </div>
                </div>
            </div>
        );
    } else {
        return <div></div>;
    }
};


export default DishDetail;