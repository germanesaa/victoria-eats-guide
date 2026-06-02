import { restaurants } from '../src/data/restaurants';
import { writeFileSync } from 'fs';
const esc = (s: string) => s.replace(/'/g, "''");
const lines = ["DELETE FROM public.restaurants;"];
for (const r of restaurants) {
  const vals = [
    `'${esc(r.name)}'`,
    `'${esc(r.category)}'`,
    `'${esc(r.image || '')}'`,
    `'${esc(r.hours || '')}'`,
    `'${esc(JSON.stringify(r.detailedHours || {}))}'::jsonb`,
    `'${esc(r.location || '')}'`,
    `'${esc(r.phone || '')}'`,
    `'${esc(r.menuUrl || '')}'`,
    `'${esc(r.description || '')}'`,
    r.isHot ? 'true' : 'false',
    r.priority != null ? String(r.priority) : 'NULL',
    `'${esc(JSON.stringify(r.menuCategories || []))}'::jsonb`,
  ];
  lines.push(`INSERT INTO public.restaurants (name,category,image,hours,detailed_hours,location,phone,menu_url,description,is_hot,priority,menu_categories) VALUES (${vals.join(',')});`);
}
writeFileSync('/dev-server/tmp-seed/seed.sql', lines.join('\n'));
