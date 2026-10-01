# Miranda Rodas e Pneus — site

Next.js 15 · React 19 · TypeScript · Three.js / React Three Fiber / Drei · GSAP ScrollTrigger · Lenis.

```
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Pendências (dados que NÃO puderam ser lidos das fontes oficiais)

Nada foi inventado. Preencha e o site passa a exibir automaticamente:

| Item | Onde | Situação |
|---|---|---|
| Endereço, cidade, horário | `data/company.ts` (`address`, `city`, `hours`) | oculto até preencher |
| Logo | `public/images/logo.jpg` (foto de perfil do Instagram, só 100×100 px) | **real**, mas em baixa resolução: troque por um arquivo maior com o mesmo nome |
| Cor da marca | `--brand` em `app/globals.css` | vermelho do logo (ajustar se tiver o hex oficial) |
| Fotos da oficina/Instagram | `About` e `InstagramGallery` em `components/sections/Sections.tsx` | placeholders |
| Catálogo de rodas | `data/products.ts` | 4 fotos reais (`public/images/rodas`); **sem aro/medida** — preencher `rim`/`size` |
| Catálogo de pneus | `data/products.ts` | vazio |
| Domínio | variável `NEXT_PUBLIC_SITE_URL` | usado em SEO/sitemap |
| Envio do formulário | `NEXT_PUBLIC_QUOTE_ENDPOINT` (POST JSON) | sem ela, abre o WhatsApp |

Confirmado: WhatsApp/telefone (16) 99253-0832, Instagram, coordenadas do Maps, serviços (borracharia, alinhamento, balanceamento, venda de rodas/pneus/acessórios).

## Hero: a viagem até a roda

O hero é o vídeo do Mercedes-AMG A45 conduzido pelo scroll: começa no carro inteiro de perfil e
termina no close da roda, no último quadro. Não é um `<video>` — vídeo não dá para "arrastar"
quadro a quadro com fluidez — e sim uma sequência de imagens pintada num canvas.

- `components/sequence/frames.ts`: metadados (quantidade de quadros, resolução escolhida por
  tela × DPR, ordem de download). Módulo separado de propósito, para o pôster não arrastar o
  componente pesado para o bundle inicial.
- `components/sequence/WheelSequence.tsx`: baixa, pinta e anima. O quadro atual e o seguinte são
  **misturados** por alpha, então o movimento continua contínuo mesmo rolando devagar. O plano
  vive dentro de uma perspectiva CSS 3D com rotação por mouse/giroscópio, avanço em Z e escala
  conforme a velocidade do scroll; o brilho que percorre a lataria acompanha o progresso.
- **Integração com o fundo escuro:** o quadro não tem moldura. Uma máscara radial funde as bordas
  no fundo do site, e a máscara acompanha o que foi realmente desenhado — em tela larga o quadro
  preenche (cover); em retrato vira uma faixa cinematográfica acima do centro, que ganha corpo
  conforme a câmera fecha na roda, em vez de ampliar 4× e perder nitidez.
- **Download:** primeiro e último quadro, depois varreduras cada vez mais finas, 6 em paralelo. O
  hero aparece assim que o primeiro quadro chega; enquanto o resto não chegou, usa-se o quadro
  carregado mais próximo, então o scroll nunca fica sem imagem.
- Duração da viagem: `.hero { height }` em `globals.css` e `PIN_END` em `Hero.tsx`.
- `prefers-reduced-motion` → hero estático com o quadro final (o close da roda).

### Os quadros

`python scripts/prep-sequence.py <video.gif>` → `public/sequence/roda/{w768,w1280,w1600}/NNN.webp`
(100 quadros ×3 resoluções; ~1,9 / 4,0 / 6,3 MB por conjunto). O script também remove o dither do
GIF de origem — veja o cabeçalho dele para o porquê. Se a contagem de quadros mudar, ajuste
`count` em `frames.ts`.

## 3D WebGL (não usado no momento)

`components/3d/` (`CarScene`, `CarModel`, `WheelScene`, `ScrollCameraController`, `CarLighting`,
`RoadEnvironment`, `FloatingParticles`, `WheelHighlight`, `SceneTransition`) é a cena Three.js que
ocupava o hero antes do vídeo: o recorte fotográfico do GLA como plano numa cena real, com dolly,
bloom, faróis e piso reflexivo. **Nada importa esses arquivos hoje** — ficaram no repositório caso
a cena volte a ser usada. Para removê-la de vez, apague a pasta e as dependências `three`,
`@react-three/*` e `postprocessing` do `package.json`.

## Imagens de referência

- `public/images/gla-referencia.webp`: foto do Mercedes-AMG GLA branco usada como referência visual do carro 3D (cores, teto preto, molduras pretas, grade Panamericana, rodas pretas com pinça vermelha). Uma foto não vira modelo 3D: para um GLA real, use `public/models/car.glb`.
- `scripts/prep-images.mjs` regera as imagens de rodas a partir de `Downloads/rodas.jpg`, `rodas 2.jpg` e `mercedez.png`.

## Imagens de terceiros

Rodas (Porsche, Ferrari, Renault) e "trabalhos em destaque" usam fotos do Wikimedia Commons (CC0/CC BY/CC BY-SA), com créditos em `data/wheel-credits.json`, `data/work-credits.json` e no rodapé. São **exemplos ilustrativos**: troque pelas fotos reais da Miranda quando disponíveis.
