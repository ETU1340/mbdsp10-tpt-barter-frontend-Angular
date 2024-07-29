export const baseurl = 'http://localhost:7000/api/';
//export const baseurl = 'https://angular-m2-backend.onrender.com/api/';
export const urls = {
  students: {
    get: baseurl + 'students',
  },
  subjects: {
    get: baseurl + 'subjects',
  },
  posts:{
    post: baseurl + 'posts',
    get: baseurl + 'posts',
    put: baseurl + 'posts',
    delete: baseurl + 'posts'
  },
  stat: {
    get: baseurl + 'stat',
  },
  searchReturned: {
    get: baseurl + 'searchReturned',
  },
  searchNotReturned: {
    get: baseurl + 'searchNotReturned',
  },
  auth: {
    login: baseurl + 'auth/login',
    register:  baseurl + 'auth/register'
  },
  categories: {
    get: baseurl + 'categories',
  },
  objects: {
    post: baseurl + 'objects',
    get: baseurl + 'objects',
    put: baseurl + 'objects',
    delete: baseurl + 'objects',
  },
};
