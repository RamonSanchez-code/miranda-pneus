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
| Cor da marca | `--brand` em `app/globals.css`, `ACCENT` em `components/3d/config.ts` | vermelho do logo (ajustar se tiver o hex oficial) |
| Fotos da oficina/Instagram | `About` e `InstagramGallery` em `components/sections/Sections.tsx` | placeholders |
| Catálogo de rodas | `data/products.ts` | 4 fotos reais (`public/images/rodas`); **sem aro/medida** — preencher `rim`/`size` |
| Catálogo de pneus | `data/products.ts` | vazio |
| Domínio | variável `NEXT_PUBLIC_SITE_URL` | usado em SEO/sitemap |
| Envio do formulário | `NEXT_PUBLIC_QUOTE_ENDPOINT` (POST JSON) | sem ela, abre o WhatsApp |

Confirmado: WhatsApp/telefone (16) 99253-0832, Instagram, coordenadas do Maps, serviços (borracharia, alinhamento, balanceamento, venda de rodas/pneus/acessórios).

## 3D

- `components/3d/`: `CarScene`, `CarModel`, `WheelScene`, `ScrollCameraController` (trilho de câmera), `CarLighting`, `RoadEnvironment`, `FloatingParticles`, `WheelHighlight`, `SceneTransition`.
- **Carro:** o `public/models/car.glb` enviado era na verdade um **PNG** (recorte fotográfico do Mercedes-AMG GLA branco). Ele foi movido para `scripts/src/gla-cutout.png` e processado por `node scripts/prep-car.mjs` → `public/images/gla.webp`. O hero coloca a foto como plano dentro da cena 3D (câmera com dolly/parallax reais, shader de reflexo na pintura, faróis, piso reflexivo). Se um `.glb` **de verdade** (cabeçalho `glTF`) for colocado em `public/models/car.glb`, ele é detectado e usado no lugar (ajuste `GLB_ROT_Y` em `CarModel.tsx`).
- Efeitos: bloom, aberração cromática e FOV por velocidade, faróis com feixes, suspensão viva, luz de freio, neon vermelho, parallax por mouse/giroscópio, FOV adaptado ao aspecto da tela (retrato/paisagem).
- Linha do tempo da câmera: `KEYS` em `ScrollCameraController.tsx`. Duração da viagem: `.hero { height }` em CSS e `PIN_END` em `Hero.tsx`.
- Performance: 3D via `dynamic(ssr:false)` depois do conteúdo; DPR limitado; menos partículas/sem reflexo no mobile; sem HDRI externo.
- Fallbacks: sem WebGL / aparelho fraco → hero CSS com roda SVG ligada ao scroll; `prefers-reduced-motion` → hero estático.

## Imagens de referência

- `public/images/gla-referencia.webp`: foto do Mercedes-AMG GLA branco usada como referência visual do carro 3D (cores, teto preto, molduras pretas, grade Panamericana, rodas pretas com pinça vermelha). Uma foto não vira modelo 3D: para um GLA real, use `public/models/car.glb`.
- `scripts/prep-images.mjs` regera as imagens de rodas a partir de `Downloads/rodas.jpg`, `rodas 2.jpg` e `mercedez.png`.

## Imagens de terceiros

Rodas (Porsche, Ferrari, Renault) e "trabalhos em destaque" usam fotos do Wikimedia Commons (CC0/CC BY/CC BY-SA), com créditos em `data/wheel-credits.json`, `data/work-credits.json` e no rodapé. São **exemplos ilustrativos**: troque pelas fotos reais da Miranda quando disponíveis.
