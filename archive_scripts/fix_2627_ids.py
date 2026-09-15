import json
import re
import unicodedata

def clean_name(fn, ln):
    text = f"{fn} {ln}".lower()
    text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^a-z0-9\s]', '', text)
    text = ' '.join(text.split())
    return text

# Alias dictionary for historical names to 2627 names
aliases = {
    "nicolas claxton": "nic claxton",
    "alexander sarr": "alex sarr",
    "alex sarr": "alexander sarr",
    "robert williams iii": "robert williams",
    "robert williams": "robert williams iii",
    "cameron johnson": "cam johnson",
    "cam johnson": "cameron johnson",
    "cameron thomas": "cam thomas",
    "cam thomas": "cameron thomas",
    "cameron spencer": "cam spencer",
    "cam spencer": "cameron spencer",
    "carlton carrington": "bubs carrington",
    "bub carrington": "carlton carrington",
    "trey jemison iii": "trey jemison",
    "trey jemison": "trey jemison iii",
}

hist_map = {}
hist_by_clean = {}
max_id = 0

for season in ['2324', '2425', '2526']:
    with open(f'web/public/data/Giocatori{season}.txt', 'r', encoding='utf-8') as f:
        players = json.load(f)
    for p in players:
        pid = int(p['id'])
        if pid > max_id:
            max_id = pid
        cname = clean_name(p.get('first_name', ''), p.get('last_name', ''))
        hist_by_clean[cname] = p['id']

with open('web/public/data/Giocatori2627.txt', 'r', encoding='utf-8') as f:
    l2627 = json.load(f)

for p in l2627:
    cname = clean_name(p['first_name'], p['last_name'])
    if cname in hist_by_clean:
        p['id'] = hist_by_clean[cname]
    else:
        # Check alias
        alias = aliases.get(cname)
        if alias and alias in hist_by_clean:
            p['id'] = hist_by_clean[alias]
            print(f"Matched via alias: {p['first_name']} {p['last_name']} -> ID {hist_by_clean[alias]}")
        else:
            # Check without jr, iii, ii, sr, etc.
            stripped = re.sub(r'\b(jr|sr|iii|ii|iv)\b', '', cname).strip()
            stripped = ' '.join(stripped.split())
            found_id = None
            for hname, hid in hist_by_clean.items():
                hstripped = re.sub(r'\b(jr|sr|iii|ii|iv)\b', '', hname).strip()
                hstripped = ' '.join(hstripped.split())
                if stripped == hstripped:
                    found_id = hid
                    break
            if found_id:
                p['id'] = found_id
                print(f"Matched via stripped suffix: {p['first_name']} {p['last_name']} -> ID {found_id}")

# Save updated Giocatori2627.txt
with open('web/public/data/Giocatori2627.txt', 'w', encoding='utf-8') as f:
    json.dump(l2627, f, separators=(',', ':'))

print("Updated Giocatori2627.txt saved!")
