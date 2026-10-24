# Militadraw

Editor de desenhos em React + TypeScript + Vite, usando o núcleo oficial do Excalidraw (MIT). Sem login, controle de acesso ou servidor de dados.

## Executar

Requer Node.js 22.18+ (ou 24+) e npm.

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:5173. Para produção, `npm run build` gera `dist/`, que pode ser servido em qualquer hospedagem estática. `npm run preview` permite verificar esse build localmente. `npm test` verifica o salvamento automático.

## Ferramentas

O editor oficial fornece seleção e laço, retângulos, losangos, elipses, setas (incluindo conectores dobrados), linhas, desenho livre, texto, notas adesivas, borracha, imagens, quadros, páginas incorporadas, reconhecimento de formas, balde e laser. Inclui propriedades de estilo, cores, preenchimentos, fontes, opacidade, camadas, alinhamento, agrupamento, bloqueio, atalhos, zoom, navegação, desfazer/refazer, biblioteca, pesquisa, paleta de comandos, grade, modo zen, tema escuro e conversão Mermaid.

Importação/exportação `.excalidraw`, PNG/SVG e área de transferência usam os recursos do editor. Permissões e formatos disponíveis podem variar conforme o navegador.

Desenhos, imagens e biblioteca são salvos em IndexedDB neste navegador/origem. Limpar os dados do navegador remove esses arquivos: mantenha também uma exportação. O histórico de desfazer/refazer é da sessão atual. Abas simultâneas compartilham o mesmo desenho salvo; a última gravação prevalece.

## Referência e decisões

- Referência inspecionada: https://excalidraw.com em 23/10/2026.
- Núcleo fixado em `0.18.0-17d8904` (publicado em 19/10/2026). Essa versão inclui as ferramentas novas presentes no site; a versão estável antiga não incluía todas. O lockfile torna a instalação reproduzível.
- A interface e as ferramentas são do próprio Excalidraw; a marca é Militadraw e o idioma inicial é português. Algumas ferramentas recentes ainda têm nomes em inglês no pacote original.
- Fontes hospedadas localmente, copiadas pelo script `postinstall`.
- Sem colaboração em tempo real, links de compartilhamento hospedados, Excalidraw+ ou geração por IA que depende de serviços externos. Mermaid funciona localmente. Esses serviços não são necessários para as ferramentas de desenho.
- Overrides de dependências transitivas corrigem alertas do npm audit. KaTeX 0.19 substitui versões antigas vulneráveis; nanoid 5 substitui a dependência ESM 4 usada pelo conversor Mermaid.
- Licença do editor em `EXCALIDRAW-LICENSE`. Fontes redistribuídas sem alterações a partir do pacote oficial; fontes e atribuições de origem: https://github.com/excalidraw/excalidraw/tree/17d8904/packages/excalidraw/fonts.

## Validação

Build TypeScript/Vite e testes de salvamento: coalescência de eventos, ordem de gravação e recuperação após falha de armazenamento. Verificações manuais no Safari: ferramentas e propriedades, desenho de formas/seta/texto/notas, persistência ao recarregar, conversão Mermaid, biblioteca restaurada e exportação PNG (arquivo gerado e inspecionado). `npm audit` sem vulnerabilidades reportadas na instalação validada.
