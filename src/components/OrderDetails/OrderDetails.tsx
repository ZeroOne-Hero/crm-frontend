import React, {useState} from 'react';
import {CommentInput, Order} from "../../types/order.types";
import EditOrder from "../EditOrder/EditOrder";
import './OrderDetails.css';
// @ts-ignore
import edit from "../../assets/edit.png";
// @ts-ignore
import dlt from "../../assets/delete2.png";
// @ts-ignore
import dltHover from "../../assets/delete-hover.png";
import {useDispatch} from "../../hooks/custom.hooks";
import {addCommentToOrder, deleteCommentFromOrder, fetchOrders} from "../../slices/orders.slice";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";

interface OrderDetailsProps {
    order: Order;
    commentInput: string;
    setCommentInput: React.Dispatch<React.SetStateAction<{ [orderId: string]: string }>>;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
                                                       order,
                                                   }) => {

    const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();
    const [commentInput, setCommentInput] = useState<CommentInput>({});
    const currentPage = useSelector((state: RootState) => state.orders.currentPage);
    const sortBy = useSelector((state: RootState) => state.orders.sortBy);
    const sortOrder = useSelector((state: RootState) => state.orders.sortOrder);
    const searchCriteria = useSelector((state: RootState) => state.orders.searchCriteria);
    const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

    const updateComment = (orderId: string, comment: string) => {
        setCommentInput(current => ({...current, [orderId]: comment}));
    };
    const handleAddComment = async (orderId: string) => {
        const comment = commentInput[orderId];
        if (!comment || !token) return;

        dispatch(addCommentToOrder({ orderId, comment, managerId: "managerId", token }))
            .unwrap()
            .then(() => {
                console.log('Comment added successfully');

                setCommentInput(current => ({...current, [orderId]: ''}));
                dispatch(fetchOrders({
                    page: currentPage,
                    sortBy,
                    sortOrder,
                    searchCriteria,
                }));
            })
            .catch((error) => {
                console.error('Error adding comment:', error);
            });
    };


    const handleDeleteComment = async (commentId: string, isPersisted: boolean, commentIndex: number) => {
        if (isPersisted && token) {
            try {

                await dispatch(deleteCommentFromOrder({ orderId: order._id, commentId, token })).unwrap();

                console.log("Comment deleted successfully.");
            } catch (error) {
                console.error("Failed to delete comment:", error);
            }
        } else {
        }
    };
    const handleEditClick = (orderId: string) => {
        setEditingOrderId(orderId);
    };
    return (
        <div className="additional">
            <div className="additional-info">
                <div><b>message: </b>{order.msg || 'N/A'}</div>
                <div><b>utm:</b> {order.utm || 'N/A'}</div>
            </div>
            <div className="comments-input">
                <div className="comments-section">
                    {order.comments && order.comments.map((comment, commentIndex) => (
                        <div key={comment._id} className="comment global-block">
                            <p className="comment-p">
                                {comment.comment}
                            </p>
                            <p className="date-highlight">
                                {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                                <img
                                    src={hoveredCommentId === comment._id ? dltHover : dlt}
                                    alt="delete"
                                    className="delete"
                                    onMouseEnter={() => setHoveredCommentId(comment._id)}
                                    onMouseLeave={() => setHoveredCommentId(null)}
                                    onClick={() => handleDeleteComment(comment._id, true, commentIndex)}
                                />
                            </p>
                        </div>
                    ))}

                </div>
                <div className="comment-text-area">
                    <textarea
                        className="add-comment"
                        placeholder="Add a comment"
                        value={commentInput[order._id] || ''}
                        onChange={(e) => updateComment(order._id, e.target.value)}
                    />
                    <button
                        className="global-btn add-comment-btn"
                        onClick={() => handleAddComment(order._id)}
                    >
                        Add
                    </button>
                </div>
            </div>
            <div className="edit-btn" onClick={() => handleEditClick(order._id)}>
                <img src={edit} alt="edit"/>
            </div>

            {editingOrderId === order._id && (
                <EditOrder
                    order={order}
                />
            )}
        </div>
    );
};

export default OrderDetails;
