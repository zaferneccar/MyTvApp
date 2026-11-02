# يولّد icon.png (80x80) و largeIcon.png (130x130)
from PIL import Image, ImageDraw
for name, size in (('icon.png', 80), ('largeIcon.png', 130)):
    s = size * 4
    im = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, s - 1, s - 1], radius=s // 5, fill=(36, 52, 95))
    m = s // 5
    # بيت بسيط
    d.polygon([(s // 2, m), (s - m, s // 2), (m, s // 2)], fill=(255, 209, 102))
    d.rectangle([m + s // 10, s // 2, s - m - s // 10, s - m], fill=(255, 209, 102))
    d.rectangle([s // 2 - s // 14, s - m - s // 5, s // 2 + s // 14, s - m], fill=(36, 52, 95))
    im.resize((size, size), Image.LANCZOS).save(name)
    print('✔', name)
