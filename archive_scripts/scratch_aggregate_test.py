import json

# Load 26/27 players
with open('web/public/data/Giocatori2627.txt', 'r', encoding='utf-8') as f:
    players2627 = json.load(f)

# Build map by ID and by slug/name for 2627 players
players_by_id = {}
players_by_slug = {}
players_by_name = {}

for p in players2627:
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
        "seasonalData": []
    }
    players_by_id[pid] = entry
    if p.get('slug'):
        players_by_slug[p['slug']] = entry
    full = f"{p['first_name'].strip().lower()} {p['last_name'].strip().lower()}"
    players_by_name[full] = entry

print(f"26/27 Total Players: {len(players_by_id)}")

# Match historical seasons T-1 (2526), T-2 (2425), T-3 (2324)
seasons = [('2526', 'T-1'), ('2425', 'T-2'), ('2324', 'T-3')]

for season_code, tag in seasons:
    with open(f'web/public/data/Giocatori{season_code}.txt', 'r', encoding='utf-8') as f:
        hist_players = json.load(f)
    
    matched_in_season = 0
    for hp in hist_players:
        h_id = hp.get('id')
        h_slug = hp.get('slug')
        h_full = f"{hp.get('first_name','').strip().lower()} {hp.get('last_name','').strip().lower()}"
        
        target = players_by_id.get(h_id) or players_by_slug.get(h_slug) or players_by_name.get(h_full)
        if target:
            matched_in_season += 1
            pdk_val = float(hp.get('pdk', 0.0))
            gp_val = int(float(hp.get('gp', 0)))
            target['seasonalData'].append({
                "season": season_code,
                "pdk": pdk_val,
                "gp": gp_val,
                "maxGp": 82
            })
    print(f"Season {season_code} ({tag}): matched {matched_in_season} players")

# Inspect sample players with historical data
has_hist = [p for p in players_by_id.values() if len(p['seasonalData']) > 0]
no_hist = [p for p in players_by_id.values() if len(p['seasonalData']) == 0]

print(f"\nPlayers with historical data: {len(has_hist)}")
print(f"Rookies / Players without historical data: {len(no_hist)}")

print("\nSample player (Nikola Jokic):", json.dumps(players_by_id.get('6') or players_by_name.get('nikola jokic'), indent=2))
