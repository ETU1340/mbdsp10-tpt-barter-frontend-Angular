import { Name } from './person.interface';

export interface ISubject {
  _id: string;
  title: string;
  picture: string;
  teacher: {
    _id: string;
    fullName: string;
    picture: string;
  };
}
export interface IObject {
  _id?: string;
  name: string;
  category: string;
  categoryId: string;
  owner: {
    _id: string;
    name: string;
    email: string;

  };
  photo: [string];
}
