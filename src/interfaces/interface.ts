export interface jwtPayLoad {
  uID: string;
  username: string;
}

export interface BlogtDTO {
  title: string;
  snippet: string;
  body: string;
  image: string;
  likes: string[];
  comments: CommentDTO[];
  author: UserDTO;
}

export interface UserDTO {
  id: string;
  name: string;
  username: string;
  email: string;
  profile_image?: string;
  isVerified: boolean;
  posts: BlogtDTO[];
}

export interface CommentDTO {
  user: UserDTO;
  content: string;
}
