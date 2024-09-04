export interface Invoice {
    id: number;
    title: string;
    body: string;
    user: User
    date: string

  }
   
  export interface User {
    id: number
    name: string
    email: string
    adress: string
    password: string

  }