import { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const BookmarkForm = ({ 
  bookmark, 
  folders, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    folderId: "",
    tags: []
  });
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (bookmark) {
      setFormData({
        title: bookmark.title || "",
        url: bookmark.url || "",
        description: bookmark.description || "",
        folderId: bookmark.folderId || "",
        tags: bookmark.tags || []
      });
    }
  }, [bookmark]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        url: formData.url.startsWith("http") ? formData.url : `https://${formData.url}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTag(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Title" required error={errors.title}>
        <Input
          value={formData.title}
          onChange={handleInputChange("title")}
          placeholder="Enter bookmark title"
        />
      </FormField>

      <FormField label="URL" required error={errors.url}>
        <Input
          type="url"
          value={formData.url}
          onChange={handleInputChange("url")}
          placeholder="https://example.com"
        />
      </FormField>

      <FormField label="Description">
        <TextArea
          value={formData.description}
          onChange={handleInputChange("description")}
          placeholder="Optional description..."
          rows={3}
        />
      </FormField>

      <FormField label="Folder">
        <select
          value={formData.folderId}
          onChange={handleInputChange("folderId")}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Select a folder (optional)</option>
          {folders.map((folder) => (
            <option key={folder.Id} value={folder.Id}>
              {folder.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Tags">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a tag..."
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddTag}
              variant="outline"
              disabled={!newTag.trim()}
            >
              <ApperIcon name="Plus" size={16} />
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="primary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <ApperIcon name="X" size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </FormField>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            bookmark ? "Update Bookmark" : "Add Bookmark"
          )}
        </Button>
      </div>
    </form>
  );
};

export default BookmarkForm;