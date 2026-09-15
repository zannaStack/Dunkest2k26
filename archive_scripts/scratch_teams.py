import json

# Historical team map from 2526
team_map = {}
with open('web/public/data/Giocatori2526.txt', 'r', encoding='utf-8') as f:
    players2526 = json.load(f)

for p in players2526:
    tname = p.get('team_name')
    tcode = p.get('team_code')
    tid = p.get('team_id')
    team_map[tname.lower()] = (tname, tcode, tid)

# Also add common variations if any
team_map['los angeles clippers'] = ('LA Clippers', 'LAC', '13')
team_map['la clippers'] = ('LA Clippers', 'LAC', '13')

print("Historical team map count:", len(team_map))
for k, v in sorted(team_map.items()):
    print(f"{k} -> {v}")
