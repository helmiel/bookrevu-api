import fs from "fs";

class StorageService {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  formatFilename(filename) {
    // Replace spaces with underscores
    return filename.replace(/\s+/g, "_");
  }

  writeFile(file, meta) {
    const filename = +new Date() + this.formatFilename(meta.filename);
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on("error", (error) => reject(error));
      file.pipe(fileStream);
      file.on("end", () => resolve(filename));
    });
  }

  deleteFile(filename) {
    const path = `${this._folder}/${filename}`;

    return new Promise((resolve, reject) => {
      fs.unlink(path, (error) => {
        if (error) {
          return reject(error);
        }
        resolve(`File ${filename} deleted successfully.`);
      });
    });
  }
}

export default StorageService;
