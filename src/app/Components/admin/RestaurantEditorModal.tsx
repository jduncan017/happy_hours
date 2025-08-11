import { useState, useEffect } from "react";
import { Restaurant } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import ModalWrapper from "@/app/Components/modals/modalWrapper";
import TextInput from "@/app/Components/SmallComponents/TextInput";
import SiteButton from "@/app/Components/SmallComponents/siteButton";
import { Building2, MapPin, Globe, Menu } from "lucide-react";

interface RestaurantEditorModalProps {
  restaurant: Restaurant;
  onUpdate: (restaurant: Restaurant) => void;
  onClose: () => void;
}

export default function RestaurantEditorModal({
  restaurant,
  onUpdate,
  onClose,
}: RestaurantEditorModalProps) {
  const [formData, setFormData] = useState<Restaurant>(restaurant);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  // Update form data when restaurant prop changes
  useEffect(() => {
    setFormData(restaurant);
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
          verified: formData.verified,
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

  return (
    <ModalWrapper>
      <div className="RestaurantEditorModal w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="ModalHeader flex items-center mb-6 pb-4 border-b border-white/20">
          <div className="flex items-center">
            <div className="ModalIcon w-12 h-12 bg-po1/20 rounded-xl flex items-center justify-center mr-4">
              <Building2 className="w-6 h-6 text-po1" />
            </div>
            <div>
              <h3 className="ModalTitle text-xl font-bold text-white uppercase tracking-wide">
                Edit Restaurant
              </h3>
              <p className="ModalSubtitle text-white/70 text-sm">
                {formData.name}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="ModalForm space-y-6">
          {error && (
            <div className="ModalError bg-red-900/50 border border-red-500/30 text-red-300 p-4 rounded-xl text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="ModalSuccess bg-green-900/50 border border-green-500/30 text-green-300 p-4 rounded-xl text-sm font-medium">
              ✅ Restaurant updated successfully!
            </div>
          )}

          <TextInput
            label="Restaurant Name *"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
            icon={<Building2 className="w-5 h-5" />}
            placeholder="Enter restaurant name"
          />

          <div className="AddressField">
            <label className="AddressLabel block text-sm font-bold text-white/80 mb-2 uppercase tracking-wider">
              Address *
            </label>
            <div className="AddressWrapper relative">
              <div className="AddressIcon absolute left-3 top-3 text-white/50">
                <MapPin className="w-5 h-5" />
              </div>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
                rows={2}
                className="AddressTextarea w-full pl-10 pr-4 py-3 bg-stone-800/80 border border-white/10 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 outline-none transition-all duration-300 text-white placeholder-white/40 resize-none"
                placeholder="Enter full address"
              />
            </div>
          </div>

          <div className="FieldsRow grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Area"
              value={formData.area || ""}
              onChange={(e) => handleInputChange("area", e.target.value)}
              icon={<MapPin className="w-5 h-5" />}
              placeholder="e.g. Downtown, Capitol Hill"
            />

            <TextInput
              label="Cuisine Type"
              value={formData.cuisineType || ""}
              onChange={(e) => handleInputChange("cuisineType", e.target.value)}
              icon={<Menu className="w-5 h-5" />}
              placeholder="e.g. American, Italian"
            />
          </div>

          <div className="PriceCategoryField">
            <label className="PriceCategoryLabel block text-sm font-bold text-white/80 mb-2 uppercase tracking-wider">
              Price Category
            </label>
            <select
              value={formData.priceCategory || "2"}
              onChange={(e) =>
                handleInputChange("priceCategory", e.target.value)
              }
              className="PriceCategorySelect w-full px-4 py-3 bg-stone-800/80 border border-white/10 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 outline-none transition-all duration-300 text-white"
            >
              <option value="1">$ (Budget)</option>
              <option value="2">$$ (Moderate)</option>
              <option value="3">$$$ (Expensive)</option>
              <option value="4">$$$$ (Very Expensive)</option>
            </select>
          </div>

          <TextInput
            label="Website"
            type="url"
            value={formData.website || ""}
            onChange={(e) => handleInputChange("website", e.target.value)}
            icon={<Globe className="w-5 h-5" />}
            placeholder="https://restaurant-website.com"
          />

          <TextInput
            label="Menu URL"
            type="url"
            value={formData.menuUrl || ""}
            onChange={(e) => handleInputChange("menuUrl", e.target.value)}
            icon={<Menu className="w-5 h-5" />}
            placeholder="Link to menu or menu page"
          />

          <div className="VerifiedField">
            <label className="VerifiedCheckbox flex items-center gap-3 p-4 bg-stone-800/50 rounded-xl border border-white/10 hover:bg-stone-800/70 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={formData.verified || false}
                onChange={(e) =>
                  handleInputChange("verified", e.target.checked)
                }
                className="w-4 h-4 rounded border-white/20 text-po1 focus:ring-po1 focus:ring-offset-2 focus:ring-offset-stone-900"
              />
              <span className="text-sm font-medium text-white/80">
                Verified Restaurant
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
            </label>
          </div>

          <div className="ModalActions flex gap-3 pt-6 border-t border-white/20">
            <SiteButton
              variant={saving ? "white" : "orange"}
              text={saving ? "Saving..." : "Save Changes"}
              rounded={true}
              size="lg"
              type="submit"
              disabled={saving}
              addClasses="flex-1 flex items-center justify-center gap-2"
            />

            <button
              type="button"
              onClick={onClose}
              className="CancelButton px-6 py-3 border border-white/20 text-white/70 hover:bg-white/10 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}
