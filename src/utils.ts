import { exec as childExec } from "child_process";
const pool = {} as Record<string, Function[]>;

const logger = {
  error: function (message: string, isNext = true) {
    console.error("error: " + message);

    if (isNext) emitter.emit("exit");
  },
  success: function (message: string) {
    console.info("success: " + message);
  }
};

const emitter = {
  on(fnName: string, fn: Function) {
    const fns = pool[fnName] || (pool[fnName] = []);
    if (!~fns.indexOf(fn)) fns.push(fn);
  },
  emit(fnName: string, ...args: any[]) {
    const fns = pool[fnName] || (pool[fnName] = []);
    fns.forEach((fn) => {
      fn(...args);
    });
  },
  off(fnName: string, fn?: Function) {
    const fns = pool[fnName] || (pool[fnName] = []);
    if (fns.length === 0) return;

    if (!isFunction(fn)) {
      fns.length = 0;
    } else {
      pool[fnName] = fns.filter((f) => f !== fn && (f as any).l !== fn);
    }
  },
  once(fnName: string, fn: Function, ...args: any[]) {
    const newFn = () => {
      fn(...args);
      this.off(fnName, fn);
    };
    newFn.l = fn;
    this.on(fnName, newFn);
  }
};

function exec(command: string, cwd: string) {
  return new Promise((resolve, reject) => {
    childExec(command, { cwd }, (error) => {
      if (error) {
        reject(error);
      } else {
        logger.success(`execute command <${command}>`);
        resolve("");
      }
    });
  });
}

const isEmpty = (value: unknown) => value == undefined || value === "";
const isFunction = (value: unknown) => typeof value === "function";

export { isEmpty, logger, exec, emitter };
