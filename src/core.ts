import { fillTpl, IPromptResponse } from "./promptTpl";
import { emitter, exec, isEmpty, logger } from "./utils";
import * as path from "path";
import fs from "fs-extra";

async function initialGit(cwd: string, url: string) {
  try {
    // copy file
    fs.writeFileSync(`${cwd}/.gitignore`, `node_modules \r\ndist \r\n \r\n.idea \r\n.vscode`)

    // git init
    await exec("git init", cwd);

    // add origin
    await exec(`git remote add origin ${url}.git`, cwd);
    // git add .
    await exec("git add .", cwd);
    // git commit
    await exec(`git commit -m "feat: init project"`, cwd);
    // git push
    await exec("git push -u origin master", cwd);
  } catch (e) {
    logger.error(e as string, false);
    process.exit(1);
  }
}

function initBefore(name: string) {
  const dir = path.join(process.cwd(), name);
  emitter.once("exit", function () {
    if (fs.existsSync(dir)) {
      fs.removeSync(dir);
    }
  });
}

async function entry(argv: IPromptResponse) {
  initBefore(argv.name);

  const cwd = process.cwd();

  const { name, gitUrl, version, author, description } = argv;
  let url = isEmpty(gitUrl) ? "" : gitUrl.slice(0, -4);
  const tpl = Object.assign({}, fillTpl, {
    name,
    version,
    author,
    description
  });
  if (isEmpty(url)) {
    (["repository", "homepage", "bugs"] as const).forEach((name) => {
      Reflect.deleteProperty(tpl, name);
    });
  } else {
    tpl.homepage = url;
    tpl.repository.url = `${url}.git`;
    tpl.bugs.url = `${url}/issues`;
  }

  const dirPath = path.join(cwd, name);
  if (fs.existsSync(dirPath)) {
    logger.error(`path <${dirPath}> already exists`, false);
    process.exit(1);
  } else {
    fs.mkdirsSync(dirPath);
  }

  try {
    await fs.writeJSON(`${dirPath}/package.json`, tpl, {
      spaces: " ".repeat(2)
    });
    logger.success(`${name}/package.json file created successfully`);
  } catch (e) {
    logger.error(e as string);
    process.exit(1);
  }

  if (url) await initialGit(dirPath, url);
  logger.success(`project<${name}> project Initialization succeeded`);
}

export default entry;
