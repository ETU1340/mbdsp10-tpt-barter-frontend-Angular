export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  idChat? : string;
  lastMessage? : string;
}
export interface IObject {
  id: string;
  name: string;
  category: {
    id: number;
    title: string;
  };
  description: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  photos: string[];
  deletedAt?: Date;
  createdAt: string;
  updatedAt: string;
}


export interface IObjectPost {
  id: number;
  object: IObject;
  objectId: number;
  postId: number;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISuggestion {
  id: number;
  status: string;
  postId: number;
  suggestedObject: IObject[];
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost {
  id: number;
  author: IUser;
  authorId: number;
  objects: IObjectPost[];
  suggestions: ISuggestion[];
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  id: number;
  title: string;
}


export interface IMessage {
  author: string;
  text: string;
  timestamp: Date;
}

export interface IChat {
  _id:string;
  sender: IUser;
  receiver: IUser;
  messages: IMessage[];
}
