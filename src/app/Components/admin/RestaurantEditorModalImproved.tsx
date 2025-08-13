import { useState, useEffect } from "react";
import { Restaurant } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { AREA_OPTIONS, CUISINE_OPTIONS } from "@/app/submit/formOptions";
import {
  Building2,
  MapPin,
  Globe,
  Menu,
  Phone,
  Clock,
  FileText,
  X,
  Save,
  AlertCircle,
  Loader2
} from "lucide-react";

interface RestaurantEditorModalImprovedProps {
  restaurant: Restaurant;
  onUpdate: (restaurant: Restaurant) => void;
  onClose: () => void;
}

export default function RestaurantEditorModalImproved({
  restaurant,
  onUpdate,
  onClose,
}: RestaurantEditorModalImprovedProps) {
  const [formData, setFormData] = useState<Restaurant>(restaurant);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCustomArea, setShowCustomArea] = useState(false);

  const supabase = createClient();

  // Update form data when restaurant prop changes
  useEffect(() => {
    setFormData(restaurant);
    setShowCustomArea(!AREA_OPTIONS.some(option => option.value === restaurant.area));
  }, [restaurant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error } = await supabase
        .from("restaurants")
        .update({
          name: formData.name,
          address: formData.address,
          area: formData.area,
          cuisine_type: formData.cuisineType,
          price_category: formData.priceCategory,
          website: formData.website,
          menu_url: formData.menuUrl,
          notes: formData.notes,
        })
        .eq("id", restaurant.id)
        .select()
        .single();

      if (error) throw error;

      setSuccess(true);
      onUpdate(data as Restaurant);

      // Auto-hide success message and close modal after delay
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update restaurant");
      console.error("Error updating restaurant:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Restaurant, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAreaChange = (value: string) => {
    if (value === "OTHER") {
      setShowCustomArea(true);
      setFormData(prev => ({ ...prev, area: "" }));
    } else {
      setShowCustomArea(false);
      setFormData(prev => ({ ...prev, area: value }));
    }
  };

  return (
    <div className="bg-stone-900 rounded-2xl shadow-2xl border border-white/10 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-stone-900 border-b border-white/10 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-po1/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-po1" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                  Edit Restaurant
                </h3>
                <p className="text-white/70 text-sm">{formData.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {error && (
            <div className="bg-red-900/50 border border-red-500/30 text-red-300 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/50 border border-green-500/30 text-green-300 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
              <Save className="w-4 h-4" />
              Restaurant updated successfully!
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-stone-800/50 rounded-2xl border border-white/10 p-6">
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Basic Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Restaurant Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  placeholder="Restaurant Name"
                  className="w-full px-4 py-3 bg-stone-800/80 border border-white/10 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 outline-none transition-all text-white placeholder-white/40"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  rows={2}
                  placeholder="1234 Main St, Denver, CO"
                  className="w-full px-4 py-3 bg-stone-800/80 border border-white/10 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 outline-none transition-all text-white placeholder-white/40 resize-none"
                />
              </div>

              {/* Area & Cuisine Type */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Area/Neighborhood
                </label>
                {!showCustomArea ? (
                  <select
                    value={formData.area || ""}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-800/80 border border-white/10 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 outline-none transition-all text-white"
                  >
                    {AREA_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-stone-800 text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.area || ""}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    placeholder="Enter custom area/neighborhood"
                    className="w-full px-4 py-3 bg-stone-800/80 border border-white/10 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 outline-none transition-all text-white placeholder-white/40"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Cuisine Type
                </label>
                <select
                  value={formData.cuisineType || ""}
                  onChange={(e) => handleInputChange("cuisineType", e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800/80 border border-white/10 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 outline-none transition-all text-white"
                >
                  {CUISINE_OPTIONS.map((option) => (
                    <option 
                      key={option.value} 
                      value={option.value}
                      disabled={option.disabled}
                      className={option.disabled ? "font-semibold text-gray-400 bg-stone-700" : "bg-stone-800 text-white"}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Category */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Price Category
                </label>
                <select
                  value={formData.priceCategory || "2"}
                  onChange={(e) => handleInputChange("priceCategory", e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800/80 border border-white/10 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 outline-none transition-all text-white"
                >
                  <option value="1" className="bg-stone-800 text-white">$ (Budget)</option>
                  <option value="2" className="bg-stone-800 text-white">$$ (Moderate)</option>
                  <option value="3" className="bg-stone-800 text-white">$$$ (Expensive)</option>
                  <option value="4" className="bg-stone-800 text-white">$$$$ (Very Expensive)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact & Links */}
          <div className="bg-stone-800/50 rounded-2xl border border-white/10 p-6">
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Contact & Links
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website || ""}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://restaurant.com"
                  className="w-full px-4 py-3 bg-stone-800/80 border border-white/10 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 outline-none transition-all text-white placeholder-white/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Menu URL
                </label>
                <input
                  type="url"
                  value={formData.menuUrl || ""}
                  onChange={(e) => handleInputChange("menuUrl", e.target.value)}
                  placeholder="https://menu-link.com"
                  className="w-full px-4 py-3 bg-stone-800/80 border border-white/10 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 outline-none transition-all text-white placeholder-white/40"
                />
              </div>
            </div>
          </div>


          {/* Submit Actions */}
          <div className="flex gap-3 pt-6 border-t border-white/20">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-po1 hover:bg-po1/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-white/20 text-white/70 hover:bg-white/10 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
    </div>
  );
}