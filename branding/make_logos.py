"""Logo varyantlarını ve Android ikonlarını üretir.
Kullanım: python3 branding/make_logos.py  (depo kök dizininden)"""
from PIL import Image, ImageDraw, ImageFilter
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = Image.open(os.path.join(ROOT, "branding/logo_original.png")).convert("L")
W, H = src.size
S = 4  # süper örnekleme

# Dairenin sınırını bul (siyah piksellerin kapsadığı alan)
px = src.load()
xs = [x for x in range(W) if px[x, H // 2] < 128]
ys = [y for y in range(H) if px[W // 2, y] < 128]
cx, cy = (xs[0] + xs[-1]) / 2, (ys[0] + ys[-1]) / 2
r = min(xs[-1] - xs[0], ys[-1] - ys[0]) / 2

big = src.resize((W * S, H * S), Image.LANCZOS)
mask = Image.new("L", big.size, 0)
ImageDraw.Draw(mask).ellipse(((cx - r + 1) * S, (cy - r + 1) * S, (cx + r - 1) * S, (cy + r - 1) * S), fill=255)
mask = mask.resize((W, H), Image.LANCZOS)

box = (int(cx - r), int(cy - r), int(cx + r) + 1, int(cy + r) + 1)

# 1) Dairesel logo (dışı şeffaf)
circ = Image.merge("RGBA", (src, src, src, mask)).crop(box)
# 2) Sadece beyaz amblem + yazı (şeffaf zemin), koyu arka planlar için
inner = Image.new("L", big.size, 0)
ImageDraw.Draw(inner).ellipse(((cx - r * 0.93) * S, (cy - r * 0.93) * S, (cx + r * 0.93) * S, (cy + r * 0.93) * S), fill=255)
inner = inner.resize((W, H), Image.LANCZOS)
from PIL import ImageChops
alpha = ImageChops.multiply(src, inner)
white = Image.merge("RGBA", (Image.new("L", (W, H), 255),) * 3 + (alpha,)).crop(box)
black = Image.merge("RGBA", (Image.new("L", (W, H), 17),) * 3 + (alpha,)).crop(box)

out_web = os.path.join(ROOT, "web/public/img")
os.makedirs(out_web, exist_ok=True)
circ.resize((512, 512), Image.LANCZOS).save(os.path.join(out_web, "logo.png"))
white.resize((512, 512), Image.LANCZOS).save(os.path.join(out_web, "logo_white.png"))
black.resize((512, 512), Image.LANCZOS).save(os.path.join(out_web, "logo_black.png"))

# Android ikonları
res = os.path.join(ROOT, "android/app/src/main/res")
dens = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}
for d, k in dens.items():
    folder = os.path.join(res, f"mipmap-{d}")
    os.makedirs(folder, exist_ok=True)
    n = int(48 * k)
    circ.resize((n, n), Image.LANCZOS).save(os.path.join(folder, "ic_launcher.png"))
    circ.resize((n, n), Image.LANCZOS).save(os.path.join(folder, "ic_launcher_round.png"))
    # adaptive foreground: 108dp tuval, logo güvenli bölgede (66dp)
    fn = int(108 * k)
    fg = Image.new("RGBA", (fn, fn), (0, 0, 0, 0))
    ln = int(fn * 0.74)
    fg.paste(white.resize((ln, ln), Image.LANCZOS), ((fn - ln) // 2, (fn - ln) // 2))
    fg.save(os.path.join(folder, "ic_launcher_foreground.png"))
print("ok", cx, cy, r)
