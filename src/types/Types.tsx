import { ReactElement } from "react";

export type ChildrenType = {
  children: ReactElement | ReactElement[];
};

export type LikedPost = {
  city: string;
  creator: string;
  id: number;
  imgsrc: string;
};

export type Comment = {
  creator: string;
  message: string;
  createdAt: string;
  id: number;
  img: string;
};

export type Post = {
  city: string;
  id: number;
  imgsrc: string;
  liked: boolean;
  comments: Comment[];
};

export type CommentsQuery = {
  cuid: string;
  postId: number;
};

export type DeleteLikedMutation = {
  id: number;
};

export type LikePostMutation = {
  e: any;
  name: string;
  src: string;
  username: string | undefined;
};

export type SnapType = {
  creator: string;
  displayDate: string;
  image: string;
  message: string;
  timestamp: object;
  userpair: string;
  id: string;
};