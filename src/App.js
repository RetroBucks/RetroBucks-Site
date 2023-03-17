import React, { useState, useEffect } from 'react';
import './App.css';

import {
  apps, icons, whitepaperLink, appLink, systemSettings as systemConfig,
} from './config';
import StartBar from './components/startbar';
import Messenger from './components/messenger';
import About from './components/about';
import Roadmap from './components/roadmap';
import Socials from './components/socials';
import Settings from './components/settings';
import ShutDown from './components/shutDown';
import Screensaver from './components/screensaver';

import whitepaper from './images/whitepaper.svg';
import rocket from './images/rocket.svg';

import './css/theme.css';
import CreateComponent from './components/createComponent';

const programComponents = {
  chat: Messenger,
  create: CreateComponent,
  about: About,
  roadmap: Roadmap,
  socials: Socials,
  settings: Settings,
};

const App = () => {
  const loadSystemBackground = () => {
    const existingBackground = localStorage.getItem('background');

    if (existingBackground) {
      return systemConfig.background.find((background) => background.name === existingBackground);
    }

    localStorage.setItem('background', systemConfig.background[2].name);
    console.log('IT GOT HERE');
    return systemConfig.background[2];
  };

  const loadSystemTheme = () => {
    const existingTheme = localStorage.getItem('theme');

    if (existingTheme) {
      return systemConfig.theme.find((theme) => theme === existingTheme);
    }

    localStorage.setItem('theme', systemConfig.theme[0]);
    return systemConfig.theme[0];
  };

  const openInNewTab = (elem) => {
    const win = window.open(elem, '_blank');

    if (win) win.focus();
  };

  const linkClickListener = (e) => {
    const event = window.e || e;

    if (event.target.tagName === 'A') {
      openInNewTab(event.target.href);
    }
  };

  const [shutDown, setShutDown] = useState(false);
  const [openApps, setOpenApps] = useState([apps.messenger.toLowerCase()]);
  const [minimizedApps, setMinimizedApps] = useState([]);
  const [openStart, setOpenStart] = useState(false);
  const [currentlyActiveApp, setCurrentlyActiveApp] = useState(apps.messenger.toLowerCase());
  const [previouslyActiveApp, setPreviouslyActiveApp] = useState('');
  const [systemSettings, setSystemSettings] = useState({
    background: loadSystemBackground(),
    theme: loadSystemTheme(),
  });

  useEffect(() => {
    if (document.addEventListener) {
      document.addEventListener('click', linkClickListener, false);
    } else {
      document.attachEvent('onclick', linkClickListener);
    }
  }, []);

  const start = (status) => {
    setOpenStart(status !== 'close');
  };

  const updateActiveApp = (e, component) => {
    if (e) e.preventDefault();

    if (component === currentlyActiveApp) return;

    setPreviouslyActiveApp(currentlyActiveApp);
    setCurrentlyActiveApp(component);
  };

  const openApp = (e, component) => {
    if (e) e.preventDefault();

    const updatedMinimizedApps = [...minimizedApps];
    if (updatedMinimizedApps.indexOf(component) > -1) {
      for (let i = updatedMinimizedApps.length - 1; i >= 0; i -= 1) {
        if (updatedMinimizedApps[i] === component) {
          updatedMinimizedApps.splice(i, 1);
        }
      }
    }

    setOpenApps([...openApps, component]);
    setMinimizedApps(updatedMinimizedApps);

    updateActiveApp(null, component);
    start('close');
  };

  const closeApp = (e, component) => {
    if (e) e.preventDefault();

    setOpenApps(openApps.filter((a) => a !== component));
  };

  const updateStartbar = (component, minimizeWindow) => {
    const updatedMinimizedApps = [...minimizedApps];
    if (minimizeWindow) {
      // if we manually ask to minimize
      updatedMinimizedApps.push(component);
    } else if (updatedMinimizedApps.indexOf(component) > -1) {
      // if app is currently minimized and needs to be brought back
      const index = updatedMinimizedApps.indexOf(component);
      updatedMinimizedApps.splice(index, 1);

      updateActiveApp(null, component);
    } else {
      // Otherwise, let's just set to currently active app
      updateActiveApp(null, component);
    }

    setMinimizedApps(updatedMinimizedApps);
    start('close');
  };

  const triggerShutdown = (e, restart = false) => {
    if (e) e.preventDefault();

    setShutDown(!restart);
    setOpenStart(false);
    setOpenApps([]);
    setMinimizedApps([]);
    setCurrentlyActiveApp('');
    setPreviouslyActiveApp('');
  };

  const changeSystemSettings = (background = null, theme = null) => {
    if (background) localStorage.setItem('background', background.name);

    if (theme) localStorage.setItem('theme', theme);

    setSystemSettings({
      background: background || systemSettings.background,
      theme: theme || systemSettings.theme,
    });
  };

  return (
    <section className="desktop theme-light" style={{ backgroundImage: `url(${systemSettings.background.url})` }}>
      <div className="icons">
        <button type="button" onClick={(e) => openApp(e, apps.messenger.toLowerCase())}>
          <img
            src={icons[apps.messenger.toLowerCase()].url}
            alt={icons[apps.messenger.toLowerCase()].alt}
          />
          {' '}
          {apps.messenger}
        </button>
        <button type="button" onClick={(e) => openApp(e, apps.socials.toLowerCase())}>
          <img
            src={icons[apps.socials.toLowerCase()].url}
            alt={icons[apps.socials.toLowerCase()].alt}
          />
          {' '}
          Socials
        </button>
        <button type="button" onClick={(e) => openApp(e, apps.about.toLowerCase())}>
          <img src={icons[apps.about.toLowerCase()].url} alt={icons[apps.about.toLowerCase()].alt} />
          {' '}
          About
        </button>
        <a href={whitepaperLink} target="_blank" rel="noopener noreferrer">
          <img src={whitepaper} alt="Icon of whitepaper" />
          {' '}
          Whitepaper
        </a>
      </div>
      <div className='icons2'>

        <a href={appLink} target="_blank" rel="noopener noreferrer">
          <img src={rocket} alt="Icon of Rocket" />
          {' '}
          Launch App
        </a>
        <button type="button" onClick={(e) => openApp(e, apps.roadmap.toLowerCase())}>
          <img
            src={icons[apps.roadmap.toLowerCase()].url}
            alt={icons[apps.roadmap.toLowerCase()].alt}
          />
          {' '}
          Roadmap
        </button>
      </div>

      {
        Object.keys(programComponents).map((program) => {
          if (
            openApps.indexOf(program) === -1
            && minimizedApps.indexOf(program) === -1
          ) return null;

          const ProgramBlock = programComponents[program];

          return (
            <ProgramBlock
              key={`program-${program}`}
              updateActiveApp={updateActiveApp}
              closeApp={closeApp}
              updateStartbar={updateStartbar}
              openApps={openApps}
              minimizedApps={minimizedApps}
              currentlyActiveApp={currentlyActiveApp}
              previouslyActiveApp={previouslyActiveApp}
              activeSystemSettings={systemSettings}
              changeSystemSettings={changeSystemSettings}
            />
          );
        })
      }

      <StartBar
        updateActiveApp={updateActiveApp}
        currentlyActiveApp={currentlyActiveApp}
        openApps={openApps}
        minimizedApps={minimizedApps}
        shutDown={triggerShutdown}
        updateStartbar={updateStartbar}
        start={start}
        openStart={openStart}
        openSettings={(e) => openApp(e, apps.settings.toLowerCase())}
      />

      <div className={`shutDownPage ${shutDown ? 'visible' : ''}`}>
        <ShutDown restart={() => triggerShutdown(null, true)} />
      </div>

      <Screensaver />
    </section>
  );
};

export default App;
