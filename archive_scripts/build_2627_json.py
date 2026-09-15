import json
import re
import unicodedata

# 1. Load historical players
id_by_name = {}
id_by_slug = {}
max_id = 0

for season in ['2324', '2425', '2526']:
    with open(f'web/public/data/Giocatori{season}.txt', 'r', encoding='utf-8') as f:
        players = json.load(f)
    for p in players:
        pid = int(p['id'])
        if pid > max_id:
            max_id = pid
        fn = p.get('first_name', '').strip().lower()
        ln = p.get('last_name', '').strip().lower()
        full = f"{fn} {ln}"
        id_by_name[full] = p['id']
        if 'slug' in p:
            id_by_slug[p['slug']] = p['id']

print(f"Loaded historical players: max_id={max_id}, unique_names={len(id_by_name)}")

# Team map
team_map = {}
with open('web/public/data/Giocatori2526.txt', 'r', encoding='utf-8') as f:
    players2526 = json.load(f)

for p in players2526:
    tname = p.get('team_name')
    tcode = p.get('team_code')
    tid = p.get('team_id')
    team_map[tname.lower()] = (tname, tcode, tid)

team_map['los angeles clippers'] = ('LA Clippers', 'LAC', '13')
team_map['la clippers'] = ('LA Clippers', 'LAC', '13')

pos_map = {
    'guard': ('G', '1'),
    'forward': ('F', '2'),
    'center': ('C', '3')
}

def make_slug(fn, ln):
    text = f"{fn}-{ln}".lower()
    text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^a-z0-9\-]', '', text)
    return text

raw_input = """First Name	Last Name	Position	Team	Cr 26/27
Nikola	Jokic	Center	Denver Nuggets	30,0
Victor	Wembanyama	Center	San Antonio Spurs	28,0
Luka	Doncic	Guard	Los Angeles Lakers	27,0
Giannis	Antetokounmpo	Forward	Miami Heat	25,0
Shai	Gilgeous-Alexander	Guard	Oklahoma City Thunder	22,0
Cade	Cunningham	Guard	Detroit Pistons	21,0
Jalen	Johnson	Forward	Atlanta Hawks	19,0
Jayson	Tatum	Forward	Boston Celtics	18,0
Joel	Embiid	Center	Philadelphia 76ers	18,0
Domantas	Sabonis	Center	Sacramento Kings	18,0
Alperen	Sengun	Center	Houston Rockets	17,5
Scottie	Barnes	Forward	Toronto Raptors	17,0
Tyrese	Maxey	Guard	Philadelphia 76ers	17,0
Karl-anthony	Towns	Center	New York Knicks	16,5
Anthony	Edwards	Guard	Minnesota Timberwolves	16,5
Cooper	Flagg	Forward	Dallas Mavericks	16,5
Anthony	Davis	Forward	Washington Wizards	16,0
Kevin	Durant	Forward	Houston Rockets	16,0
Jalen	Brunson	Guard	New York Knicks	16,0
LeBron	James	Forward	Philadelphia 76ers	16,0
Josh	Giddey	Guard	Chicago Bulls	15,5
Trae	Young	Guard	Washington Wizards	15,5
Kawhi	Leonard	Forward	Toronto Raptors	15,0
Amen	Thompson	Guard	Houston Rockets	15,0
Stephen	Curry	Guard	Golden State Warriors	15,0
Bam	Adebayo	Center	Miami Heat	15,0
Jamal	Murray	Guard	Denver Nuggets	14,5
Jalen	Duren	Center	Detroit Pistons	14,5
Tyrese	Haliburton	Guard	Indiana Pacers	14,5
Lamelo	Ball	Guard	Minnesota Timberwolves	14,5
Deni	Avdija	Forward	Portland Trail Blazers	14,5
Austin	Reaves	Guard	Los Angeles Lakers	14,5
Julius	Randle	Forward	Brooklyn Nets	14,5
Evan	Mobley	Forward	Cleveland Cavaliers	14,0
Paolo	Banchero	Forward	Orlando Magic	14,0
Jaylen	Brown	Forward	Philadelphia 76ers	14,0
AJ	Dybantsa	Forward	Washington Wizards	14,0
James	Harden	Guard	Cleveland Cavaliers	14,0
Donovan	Mitchell	Guard	Cleveland Cavaliers	14,0
Devin	Booker	Guard	Phoenix Suns	14,0
Caleb	Wilson	Forward	Chicago Bulls	13,5
Chet	Holmgren	Forward	Oklahoma City Thunder	13,5
Michael	Porter Jr	Forward	Brooklyn Nets	13,0
Darius	Garland	Guard	Los Angeles Clippers	13,0
Donovan	Clingan	Center	Portland Trail Blazers	13,0
Damian	Lillard	Guard	Portland Trail Blazers	13,0
Stephon	Castle	Guard	San Antonio Spurs	13,0
Jalen	Williams	Forward	Oklahoma City Thunder	13,0
Ja	Morant	Guard	Portland Trail Blazers	13,0
Darryn	Peterson	Guard	Utah Jazz	12,5
Lauri	Markkanen	Forward	Utah Jazz	12,5
Jarrett	Allen	Center	Cleveland Cavaliers	12,5
Cameron	Boozer	Forward	Memphis Grizzlies	12,5
Og	Anunoby	Forward	New York Knicks	12,5
Pascal	Siakam	Forward	Indiana Pacers	12,5
Ivica	Zubac	Center	Indiana Pacers	12,5
Zion	Williamson	Forward	New Orleans Pelicans	12,5
Kyrie	Irving	Guard	Dallas Mavericks	12,0
Dyson	Daniels	Guard	Atlanta Hawks	12,0
Onyeka	Okongwu	Center	Atlanta Hawks	12,0
Tyler	Herro	Guard	Milwaukee Bucks	12,0
Dejounte	Murray	Guard	New Orleans Pelicans	12,0
Josh	Hart	Forward	New York Knicks	12,0
Franz	Wagner	Forward	Orlando Magic	12,0
Vj	Edgecombe	Guard	Philadelphia 76ers	12,0
Jaren	Jackson Jr	Forward	Utah Jazz	12,0
Payton	Pritchard	Guard	Boston Celtics	11,5
Paul	George	Forward	Boston Celtics	11,5
Trey	Murphy III	Forward	New Orleans Pelicans	11,5
Ryan	Rollins	Guard	Milwaukee Bucks	11,5
Rudy	Gobert	Center	Minnesota Timberwolves	11,5
Desmond	Bane	Guard	Orlando Magic	11,5
Keyonte	George	Guard	Utah Jazz	11,5
Nickeil	Alexander-Walker	Guard	Atlanta Hawks	11,0
Mike	Brown	Head Coach	New York Knicks	11,0
Mark	Daigneault	Head Coach	Oklahoma City Thunder	11,0
Mitch	Johnson	Head Coach	San Antonio Spurs	11,0
Neemias	Queta	Center	Boston Celtics	11,0
Brandon	Miller	Forward	Charlotte Hornets	11,0
Kon	Knueppel	Guard	Charlotte Hornets	11,0
Matas	Buzelis	Forward	Chicago Bulls	11,0
De'Aaron	Fox	Guard	San Antonio Spurs	11,0
Miles	Bridges	Forward	Phoenix Suns	11,0
Derrick	White	Guard	Boston Celtics	10,5
Brandin	Podziemski	Guard	Golden State Warriors	10,5
Jabari	Smith Jr	Forward	Houston Rockets	10,5
Andrew	Wiggins	Forward	Miami Heat	10,5
Isaiah	Hartenstein	Center	Oklahoma City Thunder	10,5
Tobias	Harris	Forward	San Antonio Spurs	10,5
Nick	Nurse	Head Coach	Philadelphia 76ers	10,5
Walker	Kessler	Center	Los Angeles Lakers	10,5
Nikola	Vucevic	Center	Orlando Magic	10,0
Kel'el	Ware	Center	Milwaukee Bucks	10,0
CJ	Mccollum	Guard	Atlanta Hawks	10,0
Moussa	Diabate	Center	Charlotte Hornets	10,0
Ausar	Thompson	Forward	Detroit Pistons	10,0
Andrew	Nembhard	Guard	Indiana Pacers	10,0
Brandon	Ingram	Forward	Los Angeles Clippers	10,0
Kevin	Porter Jr	Guard	Milwaukee Bucks	10,0
Ayo	Dosunmu	Guard	Minnesota Timberwolves	10,0
Wendell	Carter Jr	Center	Orlando Magic	10,0
Maxime	Raynaud	Center	Sacramento Kings	10,0
Devin	Vassell	Guard	San Antonio Spurs	10,0
Dylan	Harper	Guard	San Antonio Spurs	10,0
RJ	Barrett	Forward	Toronto Raptors	10,0
Immanuel	Quickley	Guard	Toronto Raptors	10,0
Jusuf	Nurkic	Center	Utah Jazz	10,0
Fred	Vanvleet	Guard	Houston Rockets	10,0
David	Adelman	Head Coach	Denver Nuggets	10,0
Chris	Finch	Head Coach	Minnesota Timberwolves	10,0
Naz	Reid	Forward	Charlotte Hornets	10,0
Jalen	Green	Guard	Phoenix Suns	9,5
Mark	Williams	Center	Phoenix Suns	9,5
Nicolas	Claxton	Center	Chicago Bulls	9,5
John	Collins	Forward	Detroit Pistons	9,5
Jimmy	Butler	Forward	Golden State Warriors	9,5
Cam	Spencer	Guard	Memphis Grizzlies	9,5
Jaden	Mcdaniels	Forward	Minnesota Timberwolves	9,5
Saddiq	Bey	Forward	New Orleans Pelicans	9,5
Mikal	Bridges	Forward	New York Knicks	9,5
Toumani	Camara	Forward	Portland Trail Blazers	9,5
Julian	Champagnie	Forward	San Antonio Spurs	9,5
Jakob	Poeltl	Center	Toronto Raptors	9,5
Deandre	Ayton	Center	Washington Wizards	9,5
Kenny	Atkinson	Head Coach	Cleveland Cavaliers	9,5
J.B.	Bickerstaff	Head Coach	Detroit Pistons	9,5
Kyle	Filipowski	Center	Utah Jazz	9,5
Kristaps	Porzingis	Center	Golden State Warriors	9,5
Coby	White	Guard	Charlotte Hornets	9,0
Davion	Mitchell	Guard	Miami Heat	9,0
Jaime	Jaquez Jr	Forward	Milwaukee Bucks	9,0
Jalen	Suggs	Guard	Orlando Magic	9,0
Tre	Jones	Guard	Chicago Bulls	9,0
Daniel	Gafford	Center	Dallas Mavericks	9,0
P.J.	Washington	Forward	Dallas Mavericks	9,0
Demar	Derozan	Forward	Denver Nuggets	9,0
Cameron	Johnson	Forward	Denver Nuggets	9,0
Gui	Santos	Forward	Golden State Warriors	9,0
Yaxel	Lendeborg	Forward	Golden State Warriors	9,0
Myles	Turner	Center	Milwaukee Bucks	9,0
Derik	Queen	Center	New Orleans Pelicans	9,0
Collin	Gillespie	Guard	Phoenix Suns	9,0
Dillon	Brooks	Forward	Phoenix Suns	9,0
Jrue	Holiday	Guard	Portland Trail Blazers	9,0
Precious	Achiuwa	Forward	Sacramento Kings	9,0
Darius	Acuff Jr	Guard	Sacramento Kings	9,0
Zach	Edey	Center	Memphis Grizzlies	9,0
Ime	Udoka	Head Coach	Houston Rockets	9,0
Erik	Spoelstra	Head Coach	Miami Heat	9,0
Norman	Powell	Guard	Chicago Bulls	9,0
Jordan	Poole	Guard	New Orleans Pelicans	8,5
Jeremiah	Fears	Guard	New Orleans Pelicans	8,5
Collin	Murray-boyles	Forward	Toronto Raptors	8,5
Mikel	Brown Jr.	Guard	Brooklyn Nets	8,5
Peyton	Watson	Guard	Cleveland Cavaliers	8,5
Aaron	Gordon	Forward	Denver Nuggets	8,5
Christian	Braun	Guard	Denver Nuggets	8,5
Tari	Eason	Forward	Houston Rockets	8,5
Jerami	Grant	Forward	Memphis Grizzlies	8,5
Cason	Wallace	Guard	Oklahoma City Thunder	8,5
Ace	Bailey	Forward	Utah Jazz	8,5
Isaiah	Collier	Guard	Utah Jazz	8,5
Dereck	Lively II	Center	Dallas Mavericks	8,5
Quin	Snyder	Head Coach	Atlanta Hawks	8,5
Rick	Carlisle	Head Coach	Indiana Pacers	8,5
Rui	Hachimura	Forward	Los Angeles Clippers	8,5
Alex	Sarr	Center	Washington Wizards	8,5
Day'ron	Sharpe	Center	Brooklyn Nets	8,5
Bradley	Beal	Guard	Los Angeles Clippers	8,5
Dennis	Schroder	Guard	Charlotte Hornets	8,2
Shaedon	Sharpe	Guard	Portland Trail Blazers	8,0
Kelly	Oubre Jr	Forward	Indiana Pacers	8,0
Keaton	Wagler	Guard	Los Angeles Clippers	8,0
Santi	Aldama	Forward	Dallas Mavericks	8,0
Royce	O'Neale	Forward	Charlotte Hornets	8,0
Ajay	Mitchell	Guard	Oklahoma City Thunder	8,0
Brice	Sensabaugh	Forward	Utah Jazz	8,0
Carlton	Carrington	Guard	Washington Wizards	8,0
Cedric	Coward	Guard	Memphis Grizzlies	8,0
Donte	DiVincenzo	Guard	Minnesota Timberwolves	8,0
Naji	Marshall	Forward	Dallas Mavericks	8,0
Draymond	Green	Forward	Golden State Warriors	8,0
Brook	Lopez	Center	Los Angeles Clippers	8,0
Bobby	Portis	Forward	Miami Heat	8,0
Bennedict	Mathurin	Guard	New Orleans Pelicans	8,0
Robert	Williams III	Center	Portland Trail Blazers	8,0
Bilal	Coulibaly	Guard	Washington Wizards	8,0
Kyshawn	George	Forward	Washington Wizards	8,0
Scotty	Pippen Jr	Guard	Memphis Grizzlies	8,0
JJ	Redick	Head Coach	Los Angeles Lakers	8,0
Joe	Mazzulla	Head Coach	Boston Celtics	8,0
Darko	Rajakovic	Head Coach	Toronto Raptors	8,0
Keegan	Murray	Forward	Sacramento Kings	8,0
Anfernee	Simons	Guard	Philadelphia 76ers	8,0
Oso	Ighodaro	Center	Phoenix Suns	7,5
Ryan	Kalkbrenner	Center	Charlotte Hornets	7,5
Leonard	Miller	Forward	Chicago Bulls	7,5
Jarace	Walker	Forward	Indiana Pacers	7,5
Olivier	Maxence-Prosper	Forward	Memphis Grizzlies	7,5
Cody	Williams	Forward	Minnesota Timberwolves	7,5
Max	Christie	Guard	Dallas Mavericks	7,5
Kingston	Flemings	Guard	Atlanta Hawks	7,5
Aaron	Nesmith	Forward	Indiana Pacers	7,5
Morez	Johnson	Forward	Dallas Mavericks	7,5
Duncan	Robinson	Forward	Detroit Pistons	7,5
Moses	Moody	Guard	Golden State Warriors	7,5
Reed	Sheppard	Guard	Houston Rockets	7,5
Kris	Dunn	Guard	Los Angeles Clippers	7,5
Collin	Sexton	Guard	Los Angeles Lakers	7,5
Sandro	Mamukelashvili	Forward	Los Angeles Lakers	7,5
Pelle	Larsson	Guard	Miami Heat	7,5
A.J.	Green	Guard	Milwaukee Bucks	7,5
Luke	Kennard	Guard	Phoenix Suns	7,5
Zach	Lavine	Guard	Sacramento Kings	7,5
Justin	Champagnie	Guard	Washington Wizards	7,5
Ty	Jerome	Guard	Memphis Grizzlies	7,5
Jason	Kidd	Head Coach	Dallas Mavericks	7,5
Jamahl	Mosley	Head Coach	Orlando Magic	7,5
Tiago	Splitter	Head Coach	Portland Trail Blazers	7,5
Brian	Keefe	Head Coach	Washington Wizards	7,5
Quentin	Grimes	Guard	Los Angeles Lakers	7,0
Jay	Huff	Center	Indiana Pacers	7,0
Sam	Hauser	Forward	Boston Celtics	7,0
Brandon	Williams	Guard	Golden State Warriors	7,0
Oscar	Tshiebwe	Center	Houston Rockets	7,0
T.J.	Mcconnell	Guard	Indiana Pacers	7,0
Jericho	Sims	Center	Milwaukee Bucks	7,0
Will	Riley	Forward	Washington Wizards	7,0
Marvin	Bagley III	Forward	Denver Nuggets	7,0
Grayson	Allen	Guard	Charlotte Hornets	7,0
Hannes	Steinbach	Center	Charlotte Hornets	7,0
Jalen	Smith	Center	Chicago Bulls	7,0
Gary	Payton II	Guard	Golden State Warriors	7,0
De'Anthony	Melton	Guard	Golden State Warriors	7,0
Marcus	Smart	Guard	Houston Rockets	7,0
Jordan	Miller	Guard	Los Angeles Clippers	7,0
Gregory	Jackson	Forward	Memphis Grizzlies	7,0
Jaylen	Wells	Forward	Memphis Grizzlies	7,0
Kyle	Kuzma	Forward	Milwaukee Bucks	7,0
Brayden	Burries	Guard	Milwaukee Bucks	7,0
Nate	Ament	Forward	Milwaukee Bucks	7,0
Jonathan	Kuminga	Forward	Minnesota Timberwolves	7,0
Anthony	Black	Guard	Orlando Magic	7,0
Jordan	Goodwin	Guard	Phoenix Suns	7,0
Nique	Clifford	Guard	Sacramento Kings	7,0
Ja'kobe	Walter	Guard	Toronto Raptors	7,0
Jake	Laravia	Forward	Los Angeles Lakers	7,0
Doc	Rivers	Head Coach	Milwaukee Bucks	7,0
Charles	Lee	Head Coach	Charlotte Hornets	7,0
Steve	Kerr	Head Coach	Golden State Warriors	7,0
Jordan	Ott	Head Coach	Phoenix Suns	7,0
Ousmane	Dieng	Forward	Milwaukee Bucks	7,0
Yves	Missi	Center	New Orleans Pelicans	7,0
Aday	Mara	Center	Oklahoma City Thunder	7,0
Keldon	Johnson	Forward	San Antonio Spurs	7,0
Keon	Ellis	Guard	Brooklyn Nets	6,9
Micah	Potter	Center	Portland Trail Blazers	6,5
Noah	Clowney	Forward	Brooklyn Nets	6,5
Al	Horford	Center	Golden State Warriors	6,5
Jalen	Slawson	Forward	Indiana Pacers	6,5
Derrick	Jones Jr	Forward	Los Angeles Clippers	6,5
Javon	Small	Guard	Memphis Grizzlies	6,5
Tim	Hardaway Jr	Forward	Miami Heat	6,5
Alex	Caruso	Guard	Oklahoma City Thunder	6,5
Scoot	Henderson	Guard	Portland Trail Blazers	6,5
Malik	Monk	Guard	Sacramento Kings	6,5
Dylan	Cardwell	Center	Sacramento Kings	6,5
Malachi	Smith	Guard	Toronto Raptors	6,5
Jamal	Shead	Guard	Toronto Raptors	6,5
Isaiah	Stewart	Forward	Memphis Grizzlies	6,5
De'Andre	Hunter	Forward	Sacramento Kings	6,5
Herbert	Jones	Forward	New Orleans Pelicans	6,5
Billy	Donovan	Head Coach	Chicago Bulls	6,5
Tyronn	Lue	Head Coach	Los Angeles Clippers	6,5
Will	Hardy	Head Coach	Utah Jazz	6,5
James	Borrego	Head Coach	New Orleans Pelicans	6,5
Mitchell	Robinson	Center	Boston Celtics	6,5
Aaron	Wiggins	Guard	Atlanta Hawks	6,5
Jordan	Walsh	Guard	Boston Celtics	6,5
Nikola	Jovic	Forward	Miami Heat	6,5
Jose	Alvarado	Guard	New York Knicks	6,5
Miles	McBride	Guard	New York Knicks	6,5
Adem	Bona	Forward	Philadelphia 76ers	6,5
Jeremy	Sochan	Forward	Portland Trail Blazers	6,5
Kevin	Huerter	Guard	Detroit Pistons	6,5
Jared	Mccain	Guard	Oklahoma City Thunder	6,2
Devin	Carter	Guard	Boston Celtics	6,0
Daniss	Jenkins	Guard	Detroit Pistons	6,0
Paul	Reed	Forward	Detroit Pistons	6,0
Taurean	Prince	Forward	Detroit Pistons	6,0
Sharife	Cooper	Guard	Washington Wizards	6,0
Baylor	Scheierman	Guard	Boston Celtics	6,0
Jock	Landale	Center	Atlanta Hawks	6,0
Egor	Demin	Guard	Brooklyn Nets	6,0
Danny	Wolf	Forward	Brooklyn Nets	6,0
Bruce	Brown	Guard	Denver Nuggets	6,0
Obi	Toppin	Forward	Indiana Pacers	6,0
Kobe	Brown	Forward	Indiana Pacers	6,0
Max	Strus	Guard	Los Angeles Clippers	6,0
Klay	Thompson	Guard	Miami Heat	6,0
Kasparas	Jakucionis	Guard	Milwaukee Bucks	6,0
Ben	Simmons	Guard	Sacramento Kings	6,0
Andre	Drummond	Center	New York Knicks	6,0
Jaylin	Williams	Forward	Oklahoma City Thunder	6,0
Goga	Bitadze	Center	Orlando Magic	6,0
Tristan	Da Silva	Forward	Orlando Magic	6,0
Bez	Mbeng	Guard	Utah Jazz	6,0
Jaxson	Hayes	Center	Utah Jazz	6,0
Anthony	Gill	Forward	Washington Wizards	6,0
Khris	Middleton	Forward	Washington Wizards	6,0
Taylor	Hendricks	Forward	Memphis Grizzlies	6,0
Isaiah	Joe	Guard	Detroit Pistons	6,0
Carter	Bryant	Forward	San Antonio Spurs	6,0
Jordi	Fernandez	Head Coach	Brooklyn Nets	6,0
Tuomas	Iisalo	Head Coach	Memphis Grizzlies	6,0
Doug	Christie	Head Coach	Sacramento Kings	6,0
Luguentz	Dort	Guard	Atlanta Hawks	6,0
Hugo	Gonzalez	Guard	Boston Celtics	6,0
Michael	Ajayi	Guard	Brooklyn Nets	6,0
Steven	Adams	Center	Houston Rockets	6,0
Bogdan	Bogdanovic	Guard	Houston Rockets	6,0
Jordan	Clarkson	Guard	New York Knicks	6,0
Ebuka	Okorie	Guard	Detroit Pistons	6,0
Mike	Conley	Guard	Boston Celtics	6,0
Simone	Fontecchio	Forward	Miami Heat	6,0
Meleek	Thomas	Guard	Cleveland Cavaliers	6,0
Svi	Mykhailiuk	Guard	Utah Jazz	6,0
Sergio	De Larrea	Guard	Dallas Mavericks	5,5
Ryan	Nembhard	Guard	Atlanta Hawks	5,5
Nolan	Traore	Guard	Brooklyn Nets	5,5
Chaney	Johnson	Forward	Brooklyn Nets	5,5
E.J.	Liddell	Forward	Brooklyn Nets	5,5
Ben	Saraf	Guard	Brooklyn Nets	5,5
Isaac	Okoro	Forward	Chicago Bulls	5,5
Dailyn	Swain	Forward	Chicago Bulls	5,5
Sam	Merrill	Guard	Cleveland Cavaliers	5,5
Quenton	Jackson	Guard	Indiana Pacers	5,5
Ziaire	Williams	Forward	Los Angeles Lakers	5,5
Karim	Lopez	Forward	Memphis Grizzlies	5,5
Karlo	Matkovic	Forward	New Orleans Pelicans	5,5
Bennett	Stirtz	Guard	Oklahoma City Thunder	5,5
Jayden	Quaintance	Forward	San Antonio Spurs	5,5
Tre	Johnson	Guard	Washington Wizards	5,5
Jamir	Watkins	Forward	Washington Wizards	5,5
Cameron	Carr	Guard	Los Angeles Lakers	5,5
Patrick	Williams	Forward	Chicago Bulls	5,5
Zaccharie	Risacher	Forward	Dallas Mavericks	5,5
Clint	Capela	Center	Houston Rockets	5,5
Caleb	Love	Guard	Philadelphia 76ers	5,5
Gabe	Vincent	Guard	Atlanta Hawks	5,2
Gradey	Dick	Guard	Toronto Raptors	5,0
Mario	Hezonja	Forward	Cleveland Cavaliers	5,0
Chris	Cenac Jr.	Forward	Boston Celtics	5,0
Josh	Minott	Forward	Brooklyn Nets	5,0
Terance	Mann	Guard	Brooklyn Nets	5,0
Christian	Anderson	Guard	Charlotte Hornets	5,0
Spencer	Jones	Forward	Denver Nuggets	5,0
Elijah	Harkless	Guard	Detroit Pistons	5,0
Charles	Bassey	Center	Golden State Warriors	5,0
Ben	Sheppard	Guard	Indiana Pacers	5,0
Kobe	Sanders	Guard	Los Angeles Clippers	5,0
Isaiah	Jackson	Forward	Los Angeles Clippers	5,0
Jaden	Hardy	Guard	Los Angeles Lakers	5,0
Walter	Clayton Jr.	Guard	Memphis Grizzlies	5,0
Jahmai	Mashack	Guard	Memphis Grizzlies	5,0
Nick	Richards	Center	Miami Heat	5,0
Caris	Levert	Guard	Milwaukee Bucks	5,0
Pete	Nance	Forward	Milwaukee Bucks	5,0
Jordan	Hawkins	Guard	New Orleans Pelicans	5,0
Landry	Shamet	Guard	New York Knicks	5,0
Dominick	Barlow	Forward	Philadelphia 76ers	5,0
Dean	Wade	Forward	Philadelphia 76ers	5,0
Labaron	Philon	Guard	Philadelphia 76ers	5,0
Pat	Spencer	Guard	Phoenix Suns	5,0
Luke	Kornet	Center	San Antonio Spurs	5,0
Blake	Hinson	Forward	Utah Jazz	5,0
Tristan	Vukcevic	Forward	Washington Wizards	5,0
Bronny	James	Guard	Los Angeles Lakers	5,0
D'angelo	Russell	Guard	Memphis Grizzlies	5,0
Johni	Broome	Forward	Los Angeles Clippers	5,0
Josh	Green	Guard	Utah Jazz	5,0
Jalen	Wilson	Forward	Atlanta Hawks	4,5
Zuby	Ejiofor	Forward	Atlanta Hawks	4,5
Luka	Garza	Center	Boston Celtics	4,5
Joshua	Jefferson	Forward	Brooklyn Nets	4,5
Grant	Williams	Forward	Charlotte Hornets	4,5
Sion	James	Guard	Charlotte Hornets	4,5
Rob	Dillingham	Guard	Chicago Bulls	4,5
Jaylon	Tyson	Guard	Cleveland Cavaliers	4,5
Dwight	Powell	Center	Dallas Mavericks	4,5
Moussa	Cisse	Center	Dallas Mavericks	4,5
Georges	Niang	Forward	Golden State Warriors	4,5
Kevon	Looney	Center	Los Angeles Lakers	4,5
Quinten	Post	Center	Memphis Grizzlies	4,5
Dru	Smith	Guard	Miami Heat	4,5
Kam	Jones	Guard	Milwaukee Bucks	4,5
Gary	Trent Jr	Guard	Milwaukee Bucks	4,5
Terrence	Shannon	Guard	Minnesota Timberwolves	4,5
Micah	Peavy	Guard	New Orleans Pelicans	4,5
Jamal	Cain	Forward	Orlando Magic	4,5
Rayan	Rupert	Guard	Philadelphia 76ers	4,5
Koa	Peat	Forward	Phoenix Suns	4,5
Sidy	Cissoko	Guard	Portland Trail Blazers	4,5
Alex	Karaban	Forward	Sacramento Kings	4,5
Tarris	Reed Jr	Center	San Antonio Spurs	4,5
Allen	Graves	Forward	Toronto Raptors	4,5
Alijah	Martin	Guard	Toronto Raptors	4,5
Nate	Bittle	Center	Toronto Raptors	4,5
Jaden	Bradley	Guard	Toronto Raptors	4,5
Kevin	Love	Forward	Utah Jazz	4,5
Tamar	Bates	Guard	Utah Jazz	4,5
Felix	Okpara	Center	Washington Wizards	4,5
Tre	Mann	Guard	Washington Wizards	4,5
Trey	Alexander	Guard	Utah Jazz	4,5
Tony	Bradley	Center	Atlanta Hawks	4,0
Keaton	Wallace	Guard	Atlanta Hawks	4,0
Buddy	Hield	Guard	Atlanta Hawks	4,0
Asa	Newell	Forward	Atlanta Hawks	4,0
Mouhamed	Gueye	Forward	Atlanta Hawks	4,0
Corey	Kispert	Forward	Atlanta Hawks	4,0
Rayj	Dennis	Guard	Atlanta Hawks	4,0
Henri	Veesaar	Center	Atlanta Hawks	4,0
Max	Shulga	Guard	Boston Celtics	4,0
Amari	Williams	Forward	Boston Celtics	4,0
Ron	Harper Jr.	Guard	Boston Celtics	4,0
Dillon	Mitchell	Forward	Boston Celtics	4,0
Milos	Uzan	Guard	Boston Celtics	4,0
Drake	Powell	Guard	Brooklyn Nets	4,0
Moritz	Wagner	Forward	Brooklyn Nets	4,0
Tyler	Bilodeau	Forward	Brooklyn Nets	4,0
Kylan	Boswell	Guard	Brooklyn Nets	4,0
Dorian	Finney-Smith	Forward	Charlotte Hornets	4,0
Antonio	Reeves	Guard	Charlotte Hornets	4,0
Pj	Hall	Center	Charlotte Hornets	4,0
Pat	Connaughton	Guard	Charlotte Hornets	4,0
Xavier	Tillman	Forward	Charlotte Hornets	4,0
Tidjane	Salaun	Forward	Charlotte Hornets	4,0
Liam	Mcneeley	Forward	Charlotte Hornets	4,0
Zach	Collins	Forward	Chicago Bulls	4,0
Noa	Essengue	Forward	Chicago Bulls	4,0
Tobe	Awaka	Forward	Chicago Bulls	4,0
Thomas	Bryant	Center	Cleveland Cavaliers	4,0
Craig	Porter	Guard	Cleveland Cavaliers	4,0
Tyrese	Proctor	Guard	Cleveland Cavaliers	4,0
Nae'qwan	Tomlin	Forward	Cleveland Cavaliers	4,0
Riley	Minix	Forward	Cleveland Cavaliers	4,0
Tristan	Enaruna	Forward	Cleveland Cavaliers	4,0
Ernest	Udeh Jr.	Center	Cleveland Cavaliers	4,0
Marcus	Sasser	Guard	Dallas Mavericks	4,0
Jett	Howard	Guard	Dallas Mavericks	4,0
Caleb	Martin	Forward	Dallas Mavericks	4,0
John	Poulakidas	Guard	Dallas Mavericks	4,0
Tobias	Lawal	Forward	Dallas Mavericks	4,0
Tarik	Biberovic	Forward	Dallas Mavericks	4,0
Vsevolod	Ishchenko	Guard	Dallas Mavericks	4,0
Julian	Strawther	Guard	Denver Nuggets	4,0
Tyus	Jones	Guard	Denver Nuggets	4,0
Daron	Holmes II	Forward	Denver Nuggets	4,0
Zeke	Nnaji	Forward	Denver Nuggets	4,0
Kj	Simpson	Guard	Denver Nuggets	4,0
David	Roddy	Forward	Denver Nuggets	4,0
Curtis	Jones	Guard	Denver Nuggets	4,0
Trevon	Brazile	Forward	Denver Nuggets	4,0
Alpha	Diallo	Forward	Denver Nuggets	4,0
Isaac	Jones	Forward	Detroit Pistons	4,0
Ron	Holland II	Forward	Detroit Pistons	4,0
Gary	Harris	Guard	Detroit Pistons	4,0
Wendell	Moore	Guard	Detroit Pistons	4,0
Chaz	Lanier	Guard	Detroit Pistons	4,0
Javonte	Green	Guard	Detroit Pistons	4,0
Tolu	Smith	Forward	Detroit Pistons	4,0
Ugonna	Onyenso	Center	Detroit Pistons	4,0
Will	Richard	Guard	Golden State Warriors	4,0
Nate	Williams	Guard	Golden State Warriors	4,0
Alex	Toohey	Forward	Golden State Warriors	4,0
Seth	Curry	Guard	Golden State Warriors	4,0
LJ	Cryer	Guard	Golden State Warriors	4,0
Lajae	Jones	Forward	Golden State Warriors	4,0
Malevy	Leons	Forward	Golden State Warriors	4,0
Julian	Phillips	Forward	Houston Rockets	4,0
Jae'Sean	Tate	Forward	Houston Rockets	4,0
Jeff	Green	Forward	Houston Rockets	4,0
Isaiah	Crawford	Forward	Houston Rockets	4,0
Sean	Pedulla	Guard	Houston Rockets	4,0
Bruce	Thornton	Guard	Houston Rockets	4,0
Quadir	Copeland	Guard	Houston Rockets	4,0
Johnny	Furphy	Guard	Indiana Pacers	4,0
Larry	Nance Jr	Forward	Indiana Pacers	4,0
Braden	Smith	Guard	Indiana Pacers	4,0
Yuki	Kawamura	Guard	Los Angeles Clippers	4,0
TyTy	Washington	Guard	Los Angeles Clippers	4,0
Yanic Konan	Niederhauser	Center	Los Angeles Clippers	4,0
Cam	Christie	Guard	Los Angeles Clippers	4,0
Jalen	Pickett	Guard	Los Angeles Clippers	4,0
Nicolas	Batum	Forward	Los Angeles Clippers	4,0
Jamarion	Sharp	Center	Los Angeles Clippers	4,0
Norchad	Omier	Forward	Los Angeles Clippers	4,0
Baba	Miller	Forward	Los Angeles Clippers	4,0
Nick	Martinelli	Forward	Los Angeles Clippers	4,0
Narcisse	Ngoy	Center	Los Angeles Clippers	4,0
Matisse	Thybulle	Forward	Los Angeles Lakers	4,0
Adou	Thiero	Forward	Los Angeles Lakers	4,0
Jarred	Vanderbilt	Forward	Los Angeles Lakers	4,0
Dalton	Knecht	Guard	Los Angeles Lakers	4,0
Chris	Manon	Guard	Los Angeles Lakers	4,0
AK	Okereke	Forward	Los Angeles Lakers	4,0
Arthur	Kaluma	Forward	Los Angeles Lakers	4,0
Aj	Johnson	Guard	Memphis Grizzlies	4,0
Kris	Murray	Forward	Memphis Grizzlies	4,0
Taj	Gibson	Forward	Memphis Grizzlies	4,0
Richie	Saunders	Guard	Memphis Grizzlies	4,0
Keshad	Johnson	Forward	Miami Heat	4,0
Jahmir	Young	Guard	Miami Heat	4,0
Myron	Gardner	Forward	Miami Heat	4,0
Trevor	Keels	Guard	Miami Heat	4,0
Ryan	Conwell	Guard	Miami Heat	4,0
Tre	Donaldson	Forward	Miami Heat	4,0
Vladislav	Goldin	Center	Miami Heat	4,0
Thanasis	Antetokounmpo	Forward	Milwaukee Bucks	4,0
Bogoljub	Markovic	Forward	Milwaukee Bucks	4,0
Cormac	Ryan	Guard	Milwaukee Bucks	4,0
Malique	Lewis	Forward	Milwaukee Bucks	4,0
Nah'shon	Hyland	Guard	Minnesota Timberwolves	4,0
Jaylen	Clark	Guard	Minnesota Timberwolves	4,0
Joan	Beringer	Forward	Minnesota Timberwolves	4,0
Enrique	Freeman	Forward	Minnesota Timberwolves	4,0
Trey	Kaufman-Renn	Forward	Minnesota Timberwolves	4,0
Zyon	Pullin	Guard	Minnesota Timberwolves	4,0
Isaiah	Evans	Forward	Minnesota Timberwolves	4,0
Trey	Lyles	Forward	Minnesota Timberwolves	4,0
Rocco	Zikarsky	Center	Minnesota Timberwolves	4,0
Caleb	Houstan	Guard	New Orleans Pelicans	4,0
Deandre	Jordan	Center	New Orleans Pelicans	4,0
Christian	Koloko	Center	New Orleans Pelicans	4,0
Bryce	McGowens	Guard	New Orleans Pelicans	4,0
Trendon	Watford	Forward	New Orleans Pelicans	4,0
Kobe	Bufkin	Guard	New Orleans Pelicans	4,0
Jaron	Pierre Jr	Guard	New Orleans Pelicans	4,0
Pacome	Dadiet	Forward	New York Knicks	4,0
Kevin	Mccullar Jr	Guard	New York Knicks	4,0
Tyler	Kolek	Guard	New York Knicks	4,0
Mohamed	Diawara	Forward	New York Knicks	4,0
Dillon	Jones	Forward	New York Knicks	4,0
Jack	Kayil	Guard	New York Knicks	4,0
Tyler	Nickel	Forward	New York Knicks	4,0
Kenrich	Williams	Guard	Oklahoma City Thunder	4,0
Brooks	Barnhizer	Forward	Oklahoma City Thunder	4,0
Nikola	Topic	Guard	Oklahoma City Thunder	4,0
Thomas	Sorber	Center	Oklahoma City Thunder	4,0
Otega	Oweh	Guard	Oklahoma City Thunder	4,0
Jonathan	Isaac	Forward	Orlando Magic	4,0
Jevon	Carter	Guard	Orlando Magic	4,0
Jase	Richardson	Guard	Orlando Magic	4,0
Colin	Castleton	Center	Orlando Magic	4,0
Noah	Penda	Guard	Orlando Magic	4,0
Izaiyah	Nelson	Forward	Orlando Magic	4,0
Alex	Morales	Guard	Orlando Magic	4,0
Kentavious	Caldwell-Pope	Guard	Philadelphia 76ers	4,0
Kyle	Lowry	Guard	Philadelphia 76ers	4,0
Justin	Edwards	Forward	Philadelphia 76ers	4,0
Marjon	Beauchamp	Forward	Philadelphia 76ers	4,0
Tyrese	Martin	Forward	Philadelphia 76ers	4,0
Jabari	Walker	Forward	Philadelphia 76ers	4,0
Ariel	Hukporti	Center	Philadelphia 76ers	4,0
Duke	Miles	Guard	Philadelphia 76ers	4,0
Ryan	Dunn	Forward	Phoenix Suns	4,0
Amir	Coffey	Guard	Phoenix Suns	4,0
Haywood	Highsmith	Forward	Phoenix Suns	4,0
Khaman	Maluach	Center	Phoenix Suns	4,0
Jamaree	Bouyea	Guard	Phoenix Suns	4,0
Isaiah	Livers	Forward	Phoenix Suns	4,0
Rasheer	Fleming	Forward	Phoenix Suns	4,0
Koby	Brea	Guard	Phoenix Suns	4,0
CJ	Huntley	Forward	Phoenix Suns	4,0
Blake	Wesley	Guard	Portland Trail Blazers	4,0
Chris	Youngblood	Guard	Portland Trail Blazers	4,0
Branden	Carlson	Center	Portland Trail Blazers	4,0
Yang	Hansen	Center	Portland Trail Blazers	4,0
Vit	Krejci	Guard	Portland Trail Blazers	4,0
John	Tonje	Guard	Portland Trail Blazers	4,0
Jayson	Kent	Forward	Portland Trail Blazers	4,0
Jonathan	Mogbo	Forward	Sacramento Kings	4,0
Adam	Flagler	Guard	Sacramento Kings	4,0
Daeqwon	Plowden	Guard	Sacramento Kings	4,0
Emanuel	Sharp	Guard	Sacramento Kings	4,0
Taelon	Peter	Guard	San Antonio Spurs	4,0
Jordan	McLaughlin	Guard	San Antonio Spurs	4,0
David Jones	Garcia	Guard	San Antonio Spurs	4,0
Harrison	Barnes	Forward	San Antonio Spurs	4,0
Ja'Kobi	Gillespie	Guard	San Antonio Spurs	4,0
Maliq	Brown	Forward	San Antonio Spurs	4,0
A.j.	Lawson	Guard	Toronto Raptors	4,0
Kyle	Anderson	Forward	Toronto Raptors	4,0
Trayce	Jackson-Davis	Forward	Toronto Raptors	4,0
Andre	Jackson Jr	Guard	Toronto Raptors	4,0
Jamison	Battle	Forward	Toronto Raptors	4,0
Chucky	Hepburn	Guard	Toronto Raptors	4,0
Trey	Jemison III	Center	Toronto Raptors	4,0
Mo	Bamba	Center	Utah Jazz	4,0
Josh	Okogie	Guard	Utah Jazz	4,0
Harrison	Ingram	Forward	Utah Jazz	4,0
Hayden	Gray	Guard	Utah Jazz	4,0
"""

lines = [l.strip() for l in raw_input.strip().split('\n') if l.strip()]
rows = lines[1:]

next_new_id = max_id + 1
output_players = []

matched_count = 0
new_count = 0

for line in rows:
    parts = line.split('\t')
    if len(parts) < 5:
        continue
    first_name, last_name, position, team, cr_str = parts[0].strip(), parts[1].strip(), parts[2].strip(), parts[3].strip(), parts[4].strip()
    
    # Filter out Head Coaches
    if position.lower() == 'head coach':
        continue
    
    pos_key = position.lower()
    if pos_key not in pos_map:
        print(f"Warning: unknown position {position} for {first_name} {last_name}")
        continue
    
    role, pos_id = pos_map[pos_key]
    
    team_key = team.lower()
    if team_key not in team_map:
        print(f"Warning: unknown team {team} for {first_name} {last_name}")
        continue
    team_name, team_code, team_id = team_map[team_key]
    
    cr_val = cr_str.replace(',', '.')
    
    full_name = f"{first_name.lower()} {last_name.lower()}"
    slug = make_slug(first_name, last_name)
    
    if full_name in id_by_name:
        pid = id_by_name[full_name]
        matched_count += 1
    elif slug in id_by_slug:
        pid = id_by_slug[slug]
        matched_count += 1
    else:
        pid = str(next_new_id)
        next_new_id += 1
        new_count += 1
    
    player_obj = {
        "id": pid,
        "gp": "0",
        "first_name": first_name,
        "last_name": last_name,
        "team_id": team_id,
        "team_code": team_code,
        "team_name": team_name,
        "position": role,
        "position_id": pos_id,
        "cr": str(cr_val),
        "pdk": "0.0",
        "min": "0.0",
        "starter": "0",
        "pts": "0.0",
        "ast": "0.0",
        "reb": "0.0",
        "stl": "0.0",
        "blk": "0.0",
        "blka": "0.0",
        "fgm": "0.0",
        "fgm_tot": "0.00",
        "fga": "0.0",
        "fga_tot": "0.00",
        "tpm": "0.0",
        "tpm_tot": "0.00",
        "tpa": "0.0",
        "tpa_tot": "0.00",
        "ftm": "0.0",
        "ftm_tot": "0.00",
        "fta": "0.0",
        "fta_tot": "0.00",
        "oreb": "0.0",
        "dreb": "0.0",
        "tov": "0.0",
        "pf": "0.0",
        "fouls_received": "0.0",
        "plus_minus": "0.0",
        "fgp": "0.0",
        "tpp": "0.0",
        "ftp": "0.0",
        "slug": slug
    }
    output_players.append(player_obj)

print(f"Total players generated: {len(output_players)}")
print(f"Matched historical IDs: {matched_count}")
print(f"New player IDs assigned: {new_count}")

with open('web/public/data/Giocatori2627.txt', 'w', encoding='utf-8') as f:
    json.dump(output_players, f, separators=(',', ':'))

print("Saved successfully to web/public/data/Giocatori2627.txt")
