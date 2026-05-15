export interface Admin {
  uid: string;
  email: string;
  role: 'admin' | 'editor';
  displayName?: string;
};
