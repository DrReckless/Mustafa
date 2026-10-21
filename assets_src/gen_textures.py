# Oyun için özel dokuları üretir: yaprak kümesi, çam dalı, buğday, kilim, su normali, duman.
# Kullanım: python3 gen_textures.py  (çıktı: ../www/tex)
import math, random, os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops

OUT = os.path.join(os.path.dirname(__file__), '..', 'www', 'tex')
os.makedirs(OUT, exist_ok=True)
random.seed(7)

# ---------- Yaprak kümesi ----------
col = Image.open('leaf_color.png').convert('RGB')
opa = Image.open('leaf_opacity.png').convert('L')
leaf = col.copy(); leaf.putalpha(opa)
leaves = []
for cx in (280, 510, 750):
    for cy in (330, 690):
        box = (cx - 120, cy - 160, cx + 120, cy + 160)
        l = leaf.crop(box)
        bb = l.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
        if bb: leaves.append(l.crop(bb))

def tint(im, rgb, bright):
    r, g, b, a = im.split()
    gray = Image.merge('RGB', (r, g, b)).convert('L')
    gray = ImageEnhance.Contrast(gray).enhance(1.3)
    out = Image.merge('RGB', [gray.point(lambda v, c=c: min(255, int(v * c * bright))) for c in rgb])
    out.putalpha(a)
    return out

def bleed(img):
    # şeffaf alanların RGB'sini komşu renklerle doldur (mipmap kenar kararmasını önler)
    a = img.getchannel('A')
    rgb = img.convert('RGB')
    for _ in range(6):
        blur = rgb.filter(ImageFilter.BoxBlur(4))
        mask = a.point(lambda v: 255 if v > 8 else 0)
        rgb = Image.composite(rgb, blur, mask)
        a = a.filter(ImageFilter.MaxFilter(9))
    out = rgb.copy(); out.putalpha(img.getchannel('A'))
    return out

def clump(palette, path, size=512, n=1500, twig='#4a3523'):
    img = Image.new('RGBA', (size, size), (70, 100, 45, 0))
    d = ImageDraw.Draw(img)
    c = size / 2
    # dallar
    for k in range(7):
        a = random.uniform(0, math.tau)
        d.line([(c, c + 40), (c + math.cos(a) * 170, c + math.sin(a) * 150)], fill=twig, width=random.randint(3, 6))
    for k in range(n):
        t = k / n  # sonradan konanlar dışta ve aydınlık
        while True:
            x, y = random.uniform(-1, 1), random.uniform(-1, 1)
            if x * x + y * y < 1: break
        rr = 0.55 + 0.45 * t
        px, py = c + x * 215 * rr, c + y * 215 * rr
        base = random.choice(leaves)
        s = random.uniform(0.075, 0.12)
        lf = base.resize((max(4, int(base.width * s)), max(4, int(base.height * s))), Image.LANCZOS)
        lf = lf.rotate(random.uniform(0, 360), expand=True, resample=Image.BICUBIC)
        shade = 0.45 + 0.55 * t
        shade *= 1.0 - 0.25 * max(0, (py - c) / c)  # alt taraf gölgede
        rgb = random.choice(palette)
        lf = tint(lf, rgb, shade * random.uniform(0.85, 1.12))
        img.alpha_composite(lf, (int(px - lf.width / 2), int(py - lf.height / 2)))
    img = bleed(img)
    img.save(os.path.join(OUT, path), optimize=True)

clump([(0.42, 0.62, 0.26), (0.36, 0.56, 0.22), (0.48, 0.66, 0.3), (0.33, 0.5, 0.2)], 'foliage_green.png')
clump([(0.95, 0.55, 0.16), (0.85, 0.36, 0.12), (0.98, 0.72, 0.25), (0.7, 0.3, 0.1)], 'foliage_autumn.png')
clump([(0.62, 0.78, 0.32), (0.55, 0.74, 0.3), (0.7, 0.82, 0.38)], 'foliage_spring.png')
print('foliage ok')

# ---------- Çam dalı kartı ----------
def pine(path, snow=False):
    W, H = 512, 512
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for layer in range(3):
        for br in range(9):
            ang = -math.pi / 2 + (br - 4) * 0.33 + random.uniform(-0.08, 0.08)
            L = random.uniform(150, 230) * (1 - layer * 0.15)
            x0, y0 = W / 2, H * 0.92
            x1, y1 = x0 + math.cos(ang) * L, y0 + math.sin(ang) * L
            d.line([(x0, y0), (x1, y1)], fill=(70, 50, 30, 255), width=3)
            steps = int(L / 3)
            for s in range(steps):
                t = s / steps
                bx, by = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
                for side in (-1, 1):
                    na = ang + side * random.uniform(0.6, 1.1)
                    nl = random.uniform(12, 24) * (1 - t * 0.4)
                    g = random.randint(85, 135) + layer * 14
                    colr = (int(g * 0.35), g, int(g * 0.45), 255)
                    if snow and random.random() < 0.35 and side == -1:
                        colr = (235, 240, 245, 255)
                    d.line([(bx, by), (bx + math.cos(na) * nl, by + math.sin(na) * nl)], fill=colr, width=2)
    img = bleed(img.filter(ImageFilter.SMOOTH))
    img.save(os.path.join(OUT, path), optimize=True)

def pine_branch(path, snow=False):
    W, H = 512, 256
    img = Image.new('RGBA', (W, H), (50, 80, 45, 0))
    d = ImageDraw.Draw(img)
    cy = H / 2
    # hacim için koyu yeşil gölge kütlesi
    for k in range(60):
        t = random.random()
        bx = 20 + t * (W - 60); rr = (1 - t * 0.6) * random.uniform(30, 70)
        g0 = random.randint(45, 70)
        d.ellipse([bx - rr, cy - rr * 0.9, bx + rr, cy + rr * 0.9], fill=(int(g0 * 0.4), g0, int(g0 * 0.45), 255))
    # ana dal soldan (gövde) sağa uzanır, uca doğru incelir
    for sub in range(7):
        x0 = 20 + sub * 62
        ang = random.choice((-1, 1)) * random.uniform(0.35, 0.7)
        L = random.uniform(60, 110) * (1 - sub * 0.08)
        x1, y1 = x0 + math.cos(ang) * L, cy + math.sin(ang) * L
        d.line([(x0, cy), (x1, y1)], fill=(80, 58, 36, 255), width=2)
        for t in [i / 14 for i in range(14)]:
            bx, by = x0 + (x1 - x0) * t, cy + (y1 - cy) * t
            for side in (-1, 1):
                na = ang + side * random.uniform(0.7, 1.2)
                nl = random.uniform(12, 22)
                g = random.randint(80, 135)
                col = (int(g * 0.38), g, int(g * 0.42), 255)
                if snow and side == -1 and random.random() < 0.45: col = (236, 240, 246, 255)
                d.line([(bx, by), (bx + math.cos(na) * nl, by + math.sin(na) * nl)], fill=col, width=3)
    d.line([(0, cy), (W - 20, cy)], fill=(85, 60, 38, 255), width=4)
    for t in [i / 160 for i in range(160)]:
        bx = t * (W - 20)
        taper = 1 - t * 0.55
        for side in (-1, 1):
            na = side * random.uniform(0.45, 1.05)
            nl = random.uniform(18, 34) * taper
            g = random.randint(85, 140)
            col = (int(g * 0.38), g, int(g * 0.42), 255)
            if snow and side == -1 and random.random() < 0.5: col = (236, 240, 246, 255)
            d.line([(bx, cy), (bx + math.cos(na) * nl, cy + math.sin(na) * nl * 1.5)], fill=col, width=3)
    img = bleed(img.filter(ImageFilter.SMOOTH))
    img.save(os.path.join(OUT, path), optimize=True)

pine_branch('pine_card.png')
pine_branch('pine_card_snow.png', snow=True)
print('pine ok')

# ---------- Buğday ----------
def wheat(path, ripe):
    W, H = 256, 256
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for k in range(70):
        x = random.uniform(8, W - 8)
        top = random.uniform(20, 70)
        lean = random.uniform(-14, 14)
        if ripe:
            stem = (random.randint(190, 220), random.randint(160, 185), random.randint(80, 100), 255)
            head = (random.randint(205, 235), random.randint(165, 195), random.randint(70, 95), 255)
        else:
            stem = (random.randint(70, 100), random.randint(120, 150), random.randint(40, 60), 255)
            head = (random.randint(110, 140), random.randint(150, 175), random.randint(60, 80), 255)
        d.line([(x, H), (x + lean, top)], fill=stem, width=2)
        for s in range(7):
            yy = top + s * 5
            xx = x + lean * (1 - (yy - top) / (H - top))
            d.ellipse([xx - 3, yy - 3, xx + 3, yy + 4], fill=head)
        d.line([(x + lean, top), (x + lean + random.uniform(-3, 3), top - 14)], fill=head, width=1)
    img = bleed(img)
    img.save(os.path.join(OUT, path), optimize=True)

wheat('wheat_ripe.png', True)
wheat('wheat_green.png', False)
print('wheat ok')

# ---------- Kilim ----------
def kilim(path):
    W, H = 256, 384
    red, navy, ochre, cream, black, green = (150, 28, 30), (32, 45, 85), (212, 160, 60), (232, 220, 190), (30, 22, 20), (60, 100, 70)
    img = Image.new('RGB', (W, H), red)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W - 1, H - 1], outline=navy, width=22)
    d.rectangle([22, 22, W - 23, H - 23], outline=cream, width=6)
    # kenar motifleri
    for y in range(30, H - 30, 22):
        for x in (6, W - 16):
            d.polygon([(x + 5, y), (x + 10, y + 6), (x + 5, y + 12), (x, y + 6)], fill=ochre)
    for x in range(30, W - 30, 22):
        for y in (6, H - 16):
            d.polygon([(x + 5, y), (x + 10, y + 6), (x + 5, y + 12), (x, y + 6)], fill=ochre)
    # göl motifleri
    for cy in (100, 192, 284):
        cx = W // 2
        for r, c in ((70, navy), (56, ochre), (42, red), (28, cream), (14, black)):
            d.polygon([(cx, cy - r * 0.7), (cx + r, cy), (cx, cy + r * 0.7), (cx - r, cy)], fill=c)
        for sx in (-1, 1):  # çengeller
            for k in range(3):
                hx = cx + sx * (24 + k * 14); hy = cy - 30 + k * 10
                d.line([(hx, hy), (hx + sx * 8, hy - 6), (hx + sx * 14, hy)], fill=cream, width=3)
        for sx in (-1, 1):
            d.polygon([(cx + sx * 95, cy - 16), (cx + sx * 104, cy), (cx + sx * 95, cy + 16), (cx + sx * 86, cy)], fill=green)
    # dokuma dokusu
    px = img.load()
    for y in range(H):
        for x in range(W):
            n = random.randint(-14, 14) + (6 if (x + y) % 4 < 2 else -6)
            p = px[x, y]
            px[x, y] = tuple(max(0, min(255, v + n)) for v in p)
    img.save(os.path.join(OUT, path), quality=88)

kilim('kilim.jpg')
print('kilim ok')

# ---------- Su normali (döşenebilir) ----------
def water(path, S=256):
    waves = []
    for k in range(18):
        kx, ky = random.randint(-6, 6), random.randint(-6, 6)
        if kx == 0 and ky == 0: kx = 1
        amp = 1.0 / math.hypot(kx, ky) ** 1.1
        waves.append((kx, ky, amp, random.uniform(0, math.tau)))
    img = Image.new('RGB', (S, S))
    px = img.load()
    for y in range(S):
        for x in range(S):
            dx = dy = 0.0
            for kx, ky, a, ph in waves:
                arg = 2 * math.pi * (kx * x + ky * y) / S + ph
                c = math.cos(arg) * a * 2 * math.pi / S
                dx += c * kx; dy += c * ky
            nx, ny, nz = -dx * 6, -dy * 6, 1.0
            l = math.sqrt(nx * nx + ny * ny + nz * nz)
            px[x, y] = (int((nx / l * 0.5 + 0.5) * 255), int((ny / l * 0.5 + 0.5) * 255), int((nz / l * 0.5 + 0.5) * 255))
    img.save(os.path.join(OUT, path), quality=90)

water('water_nor.jpg')
print('water ok')

# ---------- Duman ----------
S = 64
img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
px = img.load()
for y in range(S):
    for x in range(S):
        r = math.hypot(x - S / 2 + 0.5, y - S / 2 + 0.5) / (S / 2)
        a = max(0.0, 1 - r) ** 1.8
        px[x, y] = (235, 235, 235, int(a * 255))
img.save(os.path.join(OUT, 'smoke.png'))

# ---------- Ot tutamı ----------
W, H = 256, 128
img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
for k in range(130):
    x = random.uniform(4, W - 4); h = random.uniform(40, 120); lean = random.uniform(-18, 18)
    g = random.randint(110, 170)
    d.line([(x, H), (x + lean * 0.5, H - h * 0.5), (x + lean, H - h)], fill=(int(g * 0.78), int(g * 0.92), int(g * 0.45), 255), width=3)
img = bleed(img)
img.save(os.path.join(OUT, 'grass_card.png'), optimize=True)
print('done')
