import { axiosInstance } from './axios';

interface CommentCreateData {
  commenter_id: string;
  content: string;
}

export const commentAPI = {
  getAllComments: () => {
    return axiosInstance.get('/v1/comment');
  },

  createComment: (data: CommentCreateData) => {
    return axiosInstance.post('/v1/comment', data);
  },

  getCommentsByCommenter: (commenterId: string) => {
    return axiosInstance.get(`/v1/comment/${commenterId}`);
  },

  deleteComment: (commentId: number, currentUser: string) => {
    return axiosInstance.delete(`/v1/comment/${commentId}`, {
      params: { current_user: currentUser },
    });
  },
};
