/// <reference types="next" />
/// <reference types="next/image-types/global" />
declare module "use-sound"
// Declare module for any .mp3 file
declare module "*/audio/notification.mp3" {
  const value: string; // Assuming the value is a file path or URL
  export default value;
}
// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
