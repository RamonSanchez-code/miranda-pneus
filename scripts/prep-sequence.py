"""
Gera a sequência de quadros do hero a partir do vídeo/GIF original do Mercedes-AMG A45.

    python scripts/prep-sequence.py caminho/para/video.gif

Saída: public/sequence/roda/{w768,w1280,w1600}/NNN.webp

Por que o tratamento: o arquivo original é um GIF, ou seja, 256 cores com dither ordenado.
Esse dither aparece como um xadrez de 1 px no fundo de estúdio e na lataria branca — feio na
tela e caríssimo de comprimir. Um box blur de 2 px cancela exatamente esse padrão (o período do
dither é 2 px) sem comer o detalhe real, e o unsharp devolve a nitidez das bordas. O resultado
fica mais limpo que o GIF de origem e comprime muito melhor.

Requer Pillow (pip install pillow). O número de quadros é o do arquivo de origem; se mudar,
ajuste `count` em components/sequence/frames.ts.
"""
import os
import sys

from PIL import Image, ImageEnhance, ImageFilter, ImageSequence

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "sequence", "roda")

# (pasta, largura, qualidade webp) — escolhidas em frames.ts conforme a tela × DPR
SETS = [("w1600", 1600, 86), ("w1280", 1280, 82), ("w768", 768, 76)]


def clean(im):
    im = im.filter(ImageFilter.BoxBlur(0.5)).filter(ImageFilter.UnsharpMask(1.0, 80, 2))
    return ImageEnhance.Contrast(im).enhance(1.04)


def main(src):
    frames = [clean(f.convert("RGB")) for f in ImageSequence.Iterator(Image.open(src))]
    print(f"{len(frames)} quadros de {src}")
    for name, w, q in SETS:
        d = os.path.join(OUT, name)
        os.makedirs(d, exist_ok=True)
        total = 0
        for i, im in enumerate(frames):
            out = im if im.width == w else im.resize((w, round(w * im.height / im.width)), Image.LANCZOS)
            p = os.path.join(d, f"{i:03d}.webp")
            out.save(p, "WEBP", quality=q, method=6)
            total += os.path.getsize(p)
        print(f"{name}: {total / 1048576:.2f} MB (média {total / len(frames) / 1024:.0f} KB/quadro)")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1])
