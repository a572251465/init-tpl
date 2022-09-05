import prompts from "prompts";
import { IPromptResponse, promptInfo } from "./promptTpl";
import { isEmpty, logger } from "./utils";
import * as Process from "process";
import entry from "./core";

(async () => {
  const res = (await prompts(promptInfo)) as IPromptResponse;
  if (isEmpty(res.name)) {
    logger.error("please enter the project name");
    Process.exit(1);
  }

  entry(res);
})();
