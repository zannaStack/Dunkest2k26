import json
import re
import unicodedata

def clean_name(fn, ln):
    text = f"{fn} {ln}".lower()
    text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^a-z0-9\s]', '', text)
    text = ' '.join(text.split())
    return text

def make_clean_slug(fn, ln):
    text = f"{fn} {ln}".lower()
    text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^a-z0-9]', '', text)
    return text

hist_map = {}
max_id = 0

for season in ['2324', '2425', '2526']:
    with open(f'web/public/data/Giocatori{season}.txt', 'r', encoding='utf-8') as f:
        players = json.load(f)
    for p in players:
        pid = int(p['id'])
        if pid > max_id:
            max_id = pid
        cname = clean_name(p.get('first_name', ''), p.get('last_name', ''))
        cslug = make_clean_slug(p.get('first_name', ''), p.get('last_name', ''))
        hist_map[cname] = p['id']
        hist_map[cslug] = p['id']

with open('web/public/data/Giocatori2627.txt', 'r', encoding='utf-8') as f:
    l2627 = json.load(f)

matched = 0
unmatched_names = []

for p in l2627:
    cname = clean_name(p['first_name'], p['last_name'])
    cslug = make_clean_slug(p['first_name'], p['last_name'])
    if cname in hist_map or cslug in hist_map:
        matched += 1
    else:
        unmatched_names.append(f"{p['first_name']} {p['last_name']}")

print(f"Total 2627 players: {len(l2627)}")
print(f"Matched with clean name/slug: {matched}")
print(f"Unmatched count: {len(unmatched_names)}")
print("\nSample unmatched names (Rookies & new entries):")
for name in unmatched_names[:25]:
    print(" -", name)
