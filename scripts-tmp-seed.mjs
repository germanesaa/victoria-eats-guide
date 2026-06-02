import { createClient } from '@supabase/supabase-js';
import { restaurants } from '/dev-server/src/data/restaurants.ts';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('missing env'); process.exit(1); }
const supa = createClient(url, key);

// Clear existing (idempotent seed)
await supa.from('restaurants').delete().neq('id', '00000000-0000-0000-0000-000000000000');

const rows = restaurants.map(r => ({
  name: r.name,
  category: r.category,
  image: r.image || '',
  hours: r.hours || '',
  detailed_hours: r.detailedHours || {},
  location: r.location || '',
  phone: r.phone || '',
  menu_url: r.menuUrl || '',
  description: r.description || '',
  is_hot: !!r.isHot,
  priority: r.priority ?? null,
  menu_categories: r.menuCategories || [],
}));

const { error, data } = await supa.from('restaurants').insert(rows).select('id,name');
if (error) { console.error(error); process.exit(1); }
console.log('inserted', data.length, 'restaurants');
