// In a file like global.d.ts

export {}; // Ensure this file is treated as a module

declare global {
  interface Window {
    Paddle: any; // You can replace `any` with a more specific type if you know the structure of Paddle
  }
}
