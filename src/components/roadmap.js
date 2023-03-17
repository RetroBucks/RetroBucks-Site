import React from 'react';
import PropTypes from 'prop-types';
import Linkify from 'react-linkify';
import { apps, icons, roadmap } from '../config';

// Components
import Program from './program';

const componentDecorator = (href, text, key) => (
  <a href={href} key={key} target="_blank" rel="noreferrer">
    {text}
  </a>
);

const Roadmap = ({
  updateActiveApp,
  updateStartbar,
  closeApp,
  openApps,
  minimizedApps,
  currentlyActiveApp,
  previouslyActiveApp,
}) => (
  <Program
    programName={apps.roadmap}
    programRights="[Read Only]"
    programIcon={icons[apps.roadmap.toLowerCase()].url}
    updateActiveApp={updateActiveApp}
    updateStartbar={updateStartbar}
    closeApp={closeApp}
    openApps={openApps}
    minimizedApps={minimizedApps}
    currentlyActiveApp={currentlyActiveApp}
    previouslyActiveApp={previouslyActiveApp}
  >
    <Linkify componentDecorator={componentDecorator}>
      {
          roadmap.map((item) => (
            <div key={`item-${item.title}`}>
              <h3>{item.url ? <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a> : item.title}</h3>
              <p>{item.copy}</p>
            </div>
          ))
        }
    </Linkify>
  </Program>
);

Roadmap.defaultProps = {
  updateActiveApp: () => {},
  updateStartbar: () => {},
  closeApp: () => {},
  openApps: [],
  minimizedApps: [],
  currentlyActiveApp: '',
  previouslyActiveApp: '',
};

Roadmap.propTypes = {
  updateActiveApp: PropTypes.func,
  updateStartbar: PropTypes.func,
  closeApp: PropTypes.func,
  openApps: PropTypes.array,
  minimizedApps: PropTypes.array,
  currentlyActiveApp: PropTypes.string,
  previouslyActiveApp: PropTypes.string,
};

export default Roadmap;
