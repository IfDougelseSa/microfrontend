export interface Content {
    id: string;
    title: string;
    body: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    subcategories: Category[];
    contents: Content[];
  }
  
  export interface ApiResponse<T> {
    statusCode: string;
    statusMsg: string;
    timestamp: string;
    data: T;
  }