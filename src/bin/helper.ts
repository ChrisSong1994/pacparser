import { fileURLToPath } from "url";
import { dirname } from "path";

export const __dirname = () => {
  const __filename = fileURLToPath(import.meta.url);
  return dirname(__filename);
};
