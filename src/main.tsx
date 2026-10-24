import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Excalidraw, MainMenu, WelcomeScreen, serializeAsJSON, useHandleLibrary } from '@excalidraw/excalidraw';
import type { ExcalidrawImperativeAPI, ExcalidrawInitialDataState, ExcalidrawProps } from '@excalidraw/excalidraw/types';
import { get, set } from 'idb-keyval';
import { createAutosave } from './autosave';
import '@excalidraw/excalidraw/index.css';
import './style.css';

window.EXCALIDRAW_ASSET_PATH = `${import.meta.env.BASE_URL}assets/excalidraw/`;
const SCENE_KEY = 'militadraw.scene.v1';
const LIBRARY_KEY = 'militadraw.library.v1';

function App() {
  const [initialData, setInitialData] = useState<ExcalidrawInitialDataState>();
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const [autosave] = useState(() => createAutosave<Parameters<NonNullable<ExcalidrawProps['onChange']>>>(async ([elements, appState, files]) => {
    const scene = JSON.parse(serializeAsJSON(elements, appState, files, 'local'));
    scene.appState = { ...scene.appState, theme: appState.theme, zoom: appState.zoom,
      scrollX: appState.scrollX, scrollY: appState.scrollY, gridSize: appState.gridSize,
      gridModeEnabled: appState.gridModeEnabled, name: appState.name };
    await set(SCENE_KEY, JSON.stringify(scene));
  }, () => setError('Não foi possível salvar neste navegador. Exporte seu desenho pelo menu para manter uma cópia.')));
  useHandleLibrary({ excalidrawAPI: api });

  useEffect(() => {
    const flush = () => { void autosave.flush(); };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', flush);
    return () => {
      flush();
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', flush);
    };
  }, [autosave]);

  useEffect(() => {
    Promise.all([get(SCENE_KEY), get(LIBRARY_KEY)])
      .then(([scene, libraryItems]) => {
        setInitialData({ ...(scene ? JSON.parse(scene) : {}), libraryItems: libraryItems ?? [] });
        setReady(true);
      })
      .catch(() => setError('Não foi possível ler seus desenhos salvos. Recarregue para tentar novamente.'));
  }, []);

  const persist: NonNullable<ExcalidrawProps['onChange']> = (elements, appState, files) => {
    autosave.schedule([elements, appState, files]);
  };

  return <main aria-label="Militadraw — editor de desenhos">
    {error && <div className="storage-error" role="alert">{error}<button onClick={() => setError('')} aria-label="Fechar aviso">×</button></div>}
    {ready ? <Excalidraw
      initialData={initialData}
      onExcalidrawAPI={setApi}
      onChange={persist}
      onLibraryChange={(items) => set(LIBRARY_KEY, items).catch(() => setError('Não foi possível salvar a biblioteca. Exporte os itens para manter uma cópia.'))}
      langCode="pt-BR"
      aiEnabled={false}
      name="Militadraw"
    >
      <MainMenu>
        <MainMenu.DefaultItems.LoadScene />
        <MainMenu.DefaultItems.SaveToActiveFile />
        <MainMenu.DefaultItems.Export />
        <MainMenu.DefaultItems.SaveAsImage />
        <MainMenu.DefaultItems.CommandPalette />
        <MainMenu.DefaultItems.SearchMenu />
        <MainMenu.DefaultItems.Help />
        <MainMenu.DefaultItems.ClearCanvas />
        <MainMenu.DefaultItems.Preferences />
        <MainMenu.Separator />
        <MainMenu.DefaultItems.ToggleTheme allowSystemTheme={false} />
        <MainMenu.DefaultItems.ChangeCanvasBackground />
      </MainMenu>
      <WelcomeScreen>
        <WelcomeScreen.Hints.MenuHint />
        <WelcomeScreen.Hints.ToolbarHint />
        <WelcomeScreen.Hints.HelpHint />
        <WelcomeScreen.Center>
          <WelcomeScreen.Center.Logo><span className="brand">✎ Militadraw</span></WelcomeScreen.Center.Logo>
          <WelcomeScreen.Center.Heading>Seus desenhos são salvos neste navegador.<br/>Exporte uma cópia para guardar seu trabalho.</WelcomeScreen.Center.Heading>
          <WelcomeScreen.Center.Menu>
            <WelcomeScreen.Center.MenuItemLoadScene />
            <WelcomeScreen.Center.MenuItemHelp />
          </WelcomeScreen.Center.Menu>
        </WelcomeScreen.Center>
      </WelcomeScreen>
    </Excalidraw> : <div className="loading" role="status">{error ? 'Seus dados salvos foram preservados.' : 'Abrindo o Militadraw…'}</div>}
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
