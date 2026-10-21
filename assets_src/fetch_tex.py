import json, urllib.request, os, sys, io
from PIL import Image
TEX = ['sparse_grass','leafy_grass','withered_grass','farm_soil','stony_dirt_path','aerial_rocks_02','coast_sand_01','snow_field_aerial',
       'clay_plaster','plastered_wall','large_sandstone_blocks','stone_wall','clay_roof_tiles_02','weathered_planks','grey_roof_01','marble_01','pine_bark','dark_wooden_planks','rock_06']
out = '../www/tex'
os.makedirs(out, exist_ok=True)
def get(u):
    return urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent':'Mozilla/5.0 beylik-game'}), timeout=60).read()
for t in TEX:
    d = json.loads(get('https://api.polyhaven.com/files/' + t))
    for kind, key, size in [('diff','Diffuse',1024), ('nor','nor_gl',1024), ('arm','arm',512)]:
        if key not in d: print('missing', t, key); continue
        u = d[key]['1k']['jpg']['url']
        im = Image.open(io.BytesIO(get(u))).convert('RGB')
        if im.size[0] != size: im = im.resize((size, size), Image.LANCZOS)
        im.save(f'{out}/{t}_{kind}.jpg', quality=82, optimize=True)
    print('ok', t)
