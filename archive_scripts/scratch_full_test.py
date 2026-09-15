import json

# Load 26/27 players
with open('web/public/data/Giocatori2627.txt', 'r', encoding='utf-8') as f:
    listone2627 = json.load(f)

with open('web/public/data/Giocatori2526.txt', 'r', encoding='utf-8') as f:
    data2526 = json.load(f)
with open('web/public/data/Giocatori2425.txt', 'r', encoding='utf-8') as f:
    data2425 = json.load(f)
with open('web/public/data/Giocatori2324.txt', 'r', encoding='utf-8') as f:
    data2324 = json.load(f)

playersMap = {}
slugMap = {}
nameMap = {}

for p in listone2627:
    pid = p['id']
    entry = {
        "id": pid,
        "first_name": p['first_name'],
        "last_name": p['last_name'],
        "fullname": f"{p['first_name']} {p['last_name']}",
        "role": p['position'],
        "team": p['team_code'],
        "teamName": p['team_name'],
        "cost": float(p['cr']),
        "pts": float(p.get('pts', 0)),
        "reb": float(p.get('reb', 0)),
        "ast": float(p.get('ast', 0)),
        "slug": p.get('slug', ''),
        "seasonalData": [],
        "ptsSum": 0.0,
        "rebSum": 0.0,
        "astSum": 0.0,
        "histCount": 0
    }
    playersMap[pid] = entry
    if p.get('slug'):
        slugMap[p['slug']] = entry
    nameMap[entry['fullname'].lower()] = entry

for season_data in [data2526, data2425, data2324]:
    for hp in season_data:
        h_id = hp.get('id')
        h_slug = hp.get('slug')
        h_full = f"{hp.get('first_name','').strip().lower()} {hp.get('last_name','').strip().lower()}"
        target = playersMap.get(h_id) or slugMap.get(h_slug) or nameMap.get(h_full)
        if target:
            pdk_val = float(hp.get('pdk', 0.0))
            gp_val = int(float(hp.get('gp', 0)))
            target['seasonalData'].append({
                "pdk": pdk_val,
                "gp": gp_val,
                "maxGp": 82
            })
            target['ptsSum'] += float(hp.get('pts', 0.0))
            target['rebSum'] += float(hp.get('reb', 0.0))
            target['astSum'] += float(hp.get('ast', 0.0))
            target['histCount'] += 1

print("Total 26/27 players:", len(playersMap))

top10_cost = sorted(playersMap.values(), key=lambda x: x['cost'], reverse=True)[:10]
print("\nTop 10 by 26/27 Cost:")
for p in top10_cost:
    avg_pdk = sum(s['pdk'] for s in p['seasonalData'])/len(p['seasonalData']) if p['seasonalData'] else 0
    avg_pts = p['ptsSum']/p['histCount'] if p['histCount'] else 0
    print(f"- {p['fullname']} ({p['role']}, {p['team']}): Cost={p['cost']}, Avg PDK={avg_pdk:.1f}, Avg PTS={avg_pts:.1f}, HistSeasons={len(p['seasonalData'])}")
