import CommentModel from "./CommentModel";
import UserModel from "./UserModel";

/**
 * Model for locally storing posts
 */
type PostModel = {
    id: number,
    title: string,
    body: string,
    comments: Array<CommentModel>,
    user: UserModel
}

export default PostModel;