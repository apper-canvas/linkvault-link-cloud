import foldersData from "@/services/mockData/folders.json";

let folders = [...foldersData];

const delay = () => new Promise(resolve => setTimeout(resolve, 200));

export const folderService = {
  async getAll() {
    await delay();
    return [...folders];
  },

  async getById(id) {
    await delay();
    return folders.find(folder => folder.Id === parseInt(id));
  },

  async create(folderData) {
    await delay();
    const newId = Math.max(...folders.map(f => f.Id), 0) + 1;
    const newFolder = {
      Id: newId,
      name: folderData.name,
      color: folderData.color || "blue",
      createdAt: new Date().toISOString()
    };
    folders.push(newFolder);
    return newFolder;
  },

  async update(id, folderData) {
    await delay();
    const index = folders.findIndex(folder => folder.Id === parseInt(id));
    if (index !== -1) {
      folders[index] = {
        ...folders[index],
        name: folderData.name,
        color: folderData.color || "blue"
      };
      return folders[index];
    }
    throw new Error("Folder not found");
  },

  async delete(id) {
    await delay();
    const index = folders.findIndex(folder => folder.Id === parseInt(id));
    if (index !== -1) {
      const deletedFolder = folders.splice(index, 1)[0];
      return deletedFolder;
    }
    throw new Error("Folder not found");
  }
};