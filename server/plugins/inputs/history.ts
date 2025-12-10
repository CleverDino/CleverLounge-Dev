import fs from "fs";
import path from "path";
import {PluginInputHandler} from "./index";
import Config from "../../config";
import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";

const commands = ["history"];

const input: PluginInputHandler = function (network, chan, cmd, args) {
  // Optional: specify number of lines (default 50, max 200)
  const numLines = Math.min(parseInt(args[0]) || 50, 200);
  
  const baseLogPath = path.join(Config.getHomePath(), "logs", this.name);
  
  let folders: string[] = [];
  try {
    folders = fs.readdirSync(baseLogPath);
  } catch (e) {
    chan.pushMessage(this, new Msg({
      type: MessageType.ERROR,
      text: `Cannot read log directory: ${baseLogPath}`
    }));
    return;
  }
  
  // Try multiple possible folder names
  const possibleFolders = [
    network.uuid,
    folders.find(f => f.includes(network.uuid.split("-").slice(-1)[0]))
  ];
  
  let logPath = "";
  for (const folder of possibleFolders) {
    if (folder) {
      const testPath = path.join(baseLogPath, folder, `${chan.name}.log`);
      if (fs.existsSync(testPath)) {
        logPath = testPath;
        break;
      }
    }
  }
  
  if (!logPath) {
    chan.pushMessage(this, new Msg({
      type: MessageType.ERROR,
      text: `Could not find log file for ${chan.name}`
    }));
    return;
  }
  
  try {
    const logContent = fs.readFileSync(logPath, "utf8");
    const allLines = logContent.split("\n").filter(l => l.trim());
    const recentLines = allLines.slice(-numLines);
    
    chan.pushMessage(this, new Msg({
      type: MessageType.UNHANDLED,
      text: `📜 Showing last ${recentLines.length} messages:`
    }));
    
    // Display lines with proper escaping
    recentLines.forEach((line, index) => {
      chan.pushMessage(this, new Msg({
        type: MessageType.MONOSPACE_BLOCK,
        text: line || "(empty line)"
      }), true); // true = don't log this message back to file
    });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    chan.pushMessage(this, new Msg({
      type: MessageType.ERROR,
      text: `Error: ${errorMessage}`
    }));
  }
};

export default {
  commands,
  input,
  allowDisconnected: false,
};
