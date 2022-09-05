import type { PromptObject } from "prompts";

export interface IPromptResponse {
  name: string,
  version: string,
  gitUrl: string,
  author: string,
  description: string
}

/**
 * 1. please enter the project name
 * 2. please enter the version(1.0.0)
 * 3. please enter the git url
 * 4. please enter the author
 * 5. please enter the description
 */
const promptInfo = [
  {
    type: "text",
    name: "name",
    message: "please enter the project name"
  },
  {
    type: "text",
    name: "version",
    message: "please enter the version(1.0.0)"
  },
  {
    type: "text",
    name: "gitUrl",
    message: "please enter the git url"
  },
  {
    type: "text",
    name: "author",
    message: "please enter the author"
  },
  {
    type: "text",
    name: "description",
    message: "please enter the description"
  }
] as PromptObject[];

const fillTpl = {
  name: "",
  version: "1.0.0",
  description: "",
  main: "index.js",
  scripts: {},
  homepage: "",
  repository: {
    type: "git",
    url: ""
  },
  bugs: {
    url: ""
  },
  files: [],
  keywords: [],
  author: "",
  license: "MIT"
};

export {
  promptInfo,
  fillTpl
};
