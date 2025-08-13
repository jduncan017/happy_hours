// Area options for Denver restaurants
export const AREA_OPTIONS = [
  { value: "", label: "Not sure" },
  { value: "LoDo", label: "LoDo (Lower Downtown)" },
  { value: "Capitol Hill", label: "Capitol Hill" },
  { value: "RiNo", label: "RiNo (River North Art District)" },
  { value: "Highland", label: "Highland" },
  { value: "LoHi", label: "LoHi (Highlands)" },
  { value: "Cherry Creek", label: "Cherry Creek" },
  { value: "Washington Park", label: "Washington Park" },
  { value: "Uptown", label: "Uptown" },
  { value: "Five Points", label: "Five Points" },
  { value: "Berkeley", label: "Berkeley" },
  { value: "Stapleton", label: "Stapleton" },
  { value: "Glendale", label: "Glendale" },
  { value: "Downtown", label: "Downtown" },
  { value: "Union Station", label: "Union Station" },
  { value: "Ballpark", label: "Ballpark" },
  { value: "Platte Valley", label: "Platte Valley" },
  { value: "South Broadway", label: "South Broadway" },
  { value: "Cheesman Park", label: "Cheesman Park" },
  { value: "Congress Park", label: "Congress Park" },
  { value: "OTHER", label: "Other" },
];

// Comprehensive cuisine type options organized by cultural regions and style
export const CUISINE_OPTIONS = [
  // American & Western
  { value: "", label: "Select cuisine type...", disabled: true },
  { value: "header_american", label: "━━━ American & Western ━━━", disabled: true },
  { value: "American", label: "American" },
  { value: "BBQ", label: "BBQ" },
  { value: "Burger", label: "Burger" },
  { value: "Cajun", label: "Cajun/Creole" },
  { value: "Southern", label: "Southern" },
  { value: "Tex-Mex", label: "Tex-Mex" },
  
  // Asian
  { value: "header_asian", label: "━━━ Asian ━━━", disabled: true },
  { value: "Chinese", label: "Chinese" },
  { value: "Dim Sum", label: "Dim Sum" },
  { value: "Indian", label: "Indian" },
  { value: "Japanese", label: "Japanese" },
  { value: "Korean", label: "Korean" },
  { value: "Noodles", label: "Noodles" },
  { value: "Ramen", label: "Ramen" },
  { value: "Sushi", label: "Sushi" },
  { value: "Thai", label: "Thai" },
  { value: "Vietnamese", label: "Vietnamese" },
  
  // European
  { value: "header_european", label: "━━━ European ━━━", disabled: true },
  { value: "British", label: "British" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Greek", label: "Greek" },
  { value: "Irish", label: "Irish" },
  { value: "Italian", label: "Italian" },
  { value: "Mediterranean", label: "Mediterranean" },
  { value: "Polish", label: "Polish" },
  { value: "Russian", label: "Russian" },
  { value: "Spanish", label: "Spanish" },
  { value: "Tapas", label: "Tapas" },
  
  // Latin American & Caribbean
  { value: "header_latin", label: "━━━ Latin American & Caribbean ━━━", disabled: true },
  { value: "Argentinian", label: "Argentinian" },
  { value: "Brazilian", label: "Brazilian" },
  { value: "Caribbean", label: "Caribbean" },
  { value: "Latin", label: "Latin American" },
  { value: "Mexican", label: "Mexican" },
  { value: "Peruvian", label: "Peruvian" },
  
  // Middle Eastern & African
  { value: "header_middle_eastern", label: "━━━ Middle Eastern & African ━━━", disabled: true },
  { value: "Ethiopian", label: "Ethiopian" },
  { value: "Middle Eastern", label: "Middle Eastern" },
  { value: "Moroccan", label: "Moroccan" },
  
  // Dining Style & Specialty
  { value: "header_style", label: "━━━ Dining Style & Specialty ━━━", disabled: true },
  { value: "Bakery", label: "Bakery" },
  { value: "Brunch", label: "Brunch" },
  { value: "Buffet", label: "Buffet" },
  { value: "Cafe", label: "Cafe" },
  { value: "Casual Dining", label: "Casual Dining" },
  { value: "Fast Food", label: "Fast Food" },
  { value: "Fine Dining", label: "Fine Dining" },
  { value: "Food Truck", label: "Food Truck" },
  { value: "Fusion", label: "Fusion" },
  { value: "Pizza", label: "Pizza" },
  { value: "Sandwich", label: "Sandwich/Deli" },
  { value: "Seafood", label: "Seafood" },
  { value: "Steakhouse", label: "Steakhouse" },
  
  // Bars & Nightlife
  { value: "header_bars", label: "━━━ Bars & Nightlife ━━━", disabled: true },
  { value: "Brewpub", label: "Brewpub" },
  { value: "Cocktail", label: "Cocktail Bar" },
  { value: "Gastropub", label: "Gastropub" },
  { value: "Pub", label: "Pub/Bar" },
  { value: "Rooftop", label: "Rooftop" },
  { value: "Sports Bar", label: "Sports Bar" },
  { value: "Wine Bar", label: "Wine Bar" },
  
  // Health & Dietary
  { value: "header_dietary", label: "━━━ Health & Dietary ━━━", disabled: true },
  { value: "Farm to Table", label: "Farm to Table" },
  { value: "Gluten Free", label: "Gluten Free" },
  { value: "Organic", label: "Organic" },
  { value: "Raw", label: "Raw Food" },
  { value: "Vegetarian", label: "Vegetarian/Vegan" },
  
  // Other
  { value: "header_other", label: "━━━ Other ━━━", disabled: true },
  { value: "Other", label: "Other" },
];