export interface Vendor {
  name: string;
  address: string;
  country: string;
  phone: string;
  email: string;
}

export interface Item {
  description: string;
  quantity: number;
  unit_price: number;
  category: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  date: string;  // YYYY-MM-DD formatında tarih
  total_amount: number;
  currency: string;
  qr_data: string;
  vendor: Vendor;
  items: Item[];
  status: string | null;
  created_at: string | null;
}
   
  export interface User {
    id: number
    name: string
    email: string
    adress: string
    password: string

  }

export  interface AddButtonProps {
  darkMode: boolean;
}

export interface User {
  email: string;
  name: string;
  surname: string;
  password: string;
  username: string;
  user_id: string;
  gender: string;
  date_of_birth: string;
}

export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface CreateAccountInputs {
  
  name: string;
  surname: string;
  username: string;
  email: string;
  password_hash: string;
  confirmPassword: string;
  gender: string;
  date_of_birth: string;
}