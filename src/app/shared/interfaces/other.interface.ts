export interface IUser {
  id: number;
  name: string;
  profilePicture: string;
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
  posts: any[]; // Vous pouvez définir une interface spécifique pour les posts si nécessaire
  suggestions: any[]; // Vous pouvez définir une interface spécifique pour les suggestions si nécessaire
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

