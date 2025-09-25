import { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FolderForm = ({ 
  folder, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    color: "blue"
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const colors = [
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "green", label: "Green", class: "bg-green-500" },
    { value: "purple", label: "Purple", class: "bg-purple-500" },
    { value: "red", label: "Red", class: "bg-red-500" },
    { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
    { value: "gray", label: "Gray", class: "bg-gray-500" }
  ];

  useEffect(() => {
    if (folder) {
      setFormData({
        name: folder.name || "",
        color: folder.color || "blue"
      });
    }
  }, [folder]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Folder name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Folder Name" required error={errors.name}>
        <Input
          value={formData.name}
          onChange={handleInputChange("name")}
          placeholder="Enter folder name"
        />
      </FormField>

      <FormField label="Color">
        <div className="grid grid-cols-3 gap-3">
          {colors.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
              className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                formData.color === color.value
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${color.class}`} />
              <span className="text-sm">{color.label}</span>
            </button>
          ))}
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
            folder ? "Update Folder" : "Create Folder"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FolderForm;