
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
  photo: string[];
  posts: any[]; // Vous pouvez définir une interface spécifique pour les posts si nécessaire
  suggestions: any[]; // Vous pouvez définir une interface spécifique pour les suggestions si nécessaire
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: number;
  title: string;
}


