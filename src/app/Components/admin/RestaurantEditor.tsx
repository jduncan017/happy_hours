import { useState } from 'react';
import { Restaurant } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import CardWrapper from '@/app/Components/SmallComponents/CardWrapper';
import TextInput from '@/app/Components/SmallComponents/TextInput';
import SiteButton from '@/app/Components/SmallComponents/siteButton';
import { X, Save, Building2, MapPin, Globe, Menu } from 'lucide-react';

interface RestaurantEditorProps {
  restaurant: Restaurant;
  onUpdate: (restaurant: Restaurant) => void;
  onClose: () => void;
}

export default function RestaurantEditor({ restaurant, onUpdate, onClose }: RestaurantEditorProps) {
  const [formData, setFormData] = useState(restaurant);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error } = await supabase
        .from('restaurants')
        .update({
          name: formData.name,
          address: formData.address,
          area: formData.area,
          cuisine_type: formData.cuisineType,
          price_category: formData.priceCategory,
          website: formData.website,
          menu_url: formData.menuUrl,
          verified: formData.verified,
          notes: formData.notes
        })
        .eq('id', restaurant.id)
        .select()
        .single();

      if (error) throw error;

      setSuccess(true);
      onUpdate(data as Restaurant);
      
      // Auto-hide success message
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update restaurant');
      console.error('Error updating restaurant:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Restaurant, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <CardWrapper className="RestaurantEditor">
      <div className="EditorHeader flex items-center justify-between mb-6 border-b border-n3 pb-4">
        <div className="flex items-center">
          <div className="EditorIcon w-10 h-10 bg-po1 rounded-xl flex items-center justify-center mr-3">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="EditorTitle text-xl font-bold text-gray-800 uppercase tracking-wide">
              Edit Restaurant
            </h3>
            <p className="EditorSubtitle text-gray-600 text-sm">{formData.name}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="EditorClose p-2 hover:bg-n3 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="EditorForm space-y-6">
        {error && (
          <div className="EditorError bg-pr1/10 border-l-4 border-pr1 text-pr1 p-3 rounded text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="EditorSuccess bg-green-50 border-l-4 border-green-500 text-green-800 p-3 rounded text-sm font-medium">
            ✅ Restaurant updated successfully!
          </div>
        )}

        <TextInput
          label="Restaurant Name *"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
          icon={<Building2 className="w-5 h-5" />}
          placeholder="Enter restaurant name"
        />

        <div className="AddressField">
          <label className="AddressLabel block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider">
            Address *
          </label>
          <div className="AddressWrapper relative">
            <div className="AddressIcon absolute left-3 top-3 text-gray-500">
              <MapPin className="w-5 h-5" />
            </div>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
              rows={2}
              className="AddressTextarea w-full pl-10 pr-4 py-3 bg-white border-2 border-n3 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 resize-none"
              placeholder="Enter full address"
            />
          </div>
        </div>

        <div className="FieldsRow grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Area"
            value={formData.area || ''}
            onChange={(e) => handleInputChange('area', e.target.value)}
            icon={<MapPin className="w-5 h-5" />}
            placeholder="e.g. Downtown, Capitol Hill"
          />
          
          <TextInput
            label="Cuisine Type"
            value={formData.cuisineType || ''}
            onChange={(e) => handleInputChange('cuisineType', e.target.value)}
            icon={<Menu className="w-5 h-5" />}
            placeholder="e.g. American, Italian"
          />
        </div>

        <div className="PriceCategoryField">
          <label className="PriceCategoryLabel block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider">
            Price Category
          </label>
          <select
            value={formData.priceCategory || '2'}
            onChange={(e) => handleInputChange('priceCategory', e.target.value)}
            className="PriceCategorySelect w-full px-4 py-3 bg-white border-2 border-n3 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 outline-none transition-all duration-300 text-gray-800"
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
          value={formData.website || ''}
          onChange={(e) => handleInputChange('website', e.target.value)}
          icon={<Globe className="w-5 h-5" />}
          placeholder="https://restaurant-website.com"
        />

        <TextInput
          label="Menu URL"
          type="url"
          value={formData.menuUrl || ''}
          onChange={(e) => handleInputChange('menuUrl', e.target.value)}
          icon={<Menu className="w-5 h-5" />}
          placeholder="Link to menu or menu page"
        />

        <div className="VerifiedField">
          <label className="VerifiedCheckbox flex items-center gap-3 p-4 bg-n3 rounded-xl border-2 border-n3 hover:bg-white transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={formData.verified || false}
              onChange={(e) => handleInputChange('verified', e.target.checked)}
              className="w-4 h-4 rounded border-gray-400 text-po1 focus:ring-po1"
            />
            <span className="text-sm font-medium text-gray-800">Verified Restaurant</span>
            <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
          </label>
        </div>

        <div className="EditorActions flex gap-3 pt-6 border-t border-n3">
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
            className="CancelButton px-6 py-3 border-2 border-n3 text-gray-700 hover:bg-n3 rounded-xl transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </CardWrapper>
  );
}