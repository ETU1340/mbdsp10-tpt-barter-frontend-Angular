export const baseurl = 'http://localhost:7000/api/';
//export const baseurl = 'https://angular-m2-backend.onrender.com/api/';
export const urls = {
  posts:{
    post: baseurl + 'posts',
    get: baseurl + 'posts',
    put: baseurl + 'posts',
    delete: baseurl + 'posts',
    suggest: baseurl + 'posts/suggestion',
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
  chats: {
    post: baseurl + 'chats',
    get: baseurl + 'chats',
    getByUser: baseurl + 'chats/user',
    continueMessage: baseurl + 'chats/continue',
    delete: baseurl + 'chats',
    patchs: baseurl + 'chats',
  }
};
