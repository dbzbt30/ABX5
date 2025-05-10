/// <reference types="react" />
/// <reference types="next" />
/// <reference types="js-yaml" />

declare module '*.yaml' {
  const content: any;
  export default content;
}

declare module '*.yml' {
  const content: any;
  export default content;
} 