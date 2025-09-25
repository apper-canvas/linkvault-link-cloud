import bookmarksData from "@/services/mockData/bookmarks.json";

let bookmarks = [...bookmarksData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const bookmarkService = {
  async getAll() {
    await delay();
    return [...bookmarks];
  },

  async getById(id) {
    await delay();
    return bookmarks.find(bookmark => bookmark.Id === parseInt(id));
  },

  async create(bookmarkData) {
    await delay();
    const newId = Math.max(...bookmarks.map(b => b.Id), 0) + 1;
    const newBookmark = {
      Id: newId,
      title: bookmarkData.title,
      url: bookmarkData.url,
      description: bookmarkData.description || "",
      folderId: bookmarkData.folderId || null,
      tags: bookmarkData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    bookmarks.push(newBookmark);
    return newBookmark;
  },

  async update(id, bookmarkData) {
    await delay();
    const index = bookmarks.findIndex(bookmark => bookmark.Id === parseInt(id));
    if (index !== -1) {
      bookmarks[index] = {
        ...bookmarks[index],
        title: bookmarkData.title,
        url: bookmarkData.url,
        description: bookmarkData.description || "",
        folderId: bookmarkData.folderId || null,
        tags: bookmarkData.tags || [],
        updatedAt: new Date().toISOString()
      };
      return bookmarks[index];
    }
    throw new Error("Bookmark not found");
  },

  async delete(id) {
    await delay();
    const index = bookmarks.findIndex(bookmark => bookmark.Id === parseInt(id));
    if (index !== -1) {
      const deletedBookmark = bookmarks.splice(index, 1)[0];
      return deletedBookmark;
    }
    throw new Error("Bookmark not found");
  },

  async getByFolder(folderId) {
    await delay();
    return bookmarks.filter(bookmark => bookmark.folderId === parseInt(folderId));
  },

  async getByTag(tag) {
    await delay();
    return bookmarks.filter(bookmark => 
      bookmark.tags && bookmark.tags.includes(tag)
    );
  },

  async search(query) {
    await delay();
    if (!query.trim()) return [...bookmarks];
    
    const lowercaseQuery = query.toLowerCase();
    return bookmarks.filter(bookmark =>
      bookmark.title.toLowerCase().includes(lowercaseQuery) ||
      bookmark.url.toLowerCase().includes(lowercaseQuery) ||
      (bookmark.description && bookmark.description.toLowerCase().includes(lowercaseQuery)) ||
      (bookmark.tags && bookmark.tags.some(tag => 
        tag.toLowerCase().includes(lowercaseQuery)
      ))
    );
  }
};