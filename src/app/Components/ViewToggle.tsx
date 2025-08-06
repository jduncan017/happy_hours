interface ViewToggleProps {
  view: 'list' | 'map';
  onViewChange: (view: 'list' | 'map') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="ViewToggle flex items-center gap-1 bg-stone-100 rounded-lg p-1 border border-stone-200">
      <button
        onClick={() => onViewChange('list')}
        className={`ViewToggleButton px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          view === 'list'
            ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
        }`}
      >
        📋 List
      </button>
      <button
        onClick={() => onViewChange('map')}
        className={`ViewToggleButton px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          view === 'map'
            ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
        }`}
      >
        🗺️ Map
      </button>
    </div>
  );
}