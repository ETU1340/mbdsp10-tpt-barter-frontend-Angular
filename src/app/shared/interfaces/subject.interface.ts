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
export interface IAssignment {
  _id?: string;
  dateRendu: Date;
  isHanded: Boolean;
  name: string;
  student: {
    _id: string;
    name: string;
    profile: string;
  };
  subject: {
    _id: string;
    name: string;
    picture: string;
  };
  teacher: {
    _id: string;
    fullName: string;
    picture: string;
  };
  mark?: number;
  remark?: string;
}
