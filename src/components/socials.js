import React from 'react';
import PropTypes from 'prop-types';
import { apps, icons, socials } from '../config';

// Components
import Program from './program';

const Socials = ({
  updateActiveApp,
  closeApp,
  updateStartbar,
  openApps,
  minimizedApps,
  currentlyActiveApp,
  previouslyActiveApp,
}) => (
  <Program
    programName={apps.socials}
    programIcon={icons[apps.socials.toLowerCase()].url}
    contentEditable
    updateActiveApp={updateActiveApp}
    updateStartbar={updateStartbar}
    closeApp={closeApp}
    openApps={openApps}
    minimizedApps={minimizedApps}
    currentlyActiveApp={currentlyActiveApp}
    previouslyActiveApp={previouslyActiveApp}
  >
    {socials.content}
    <br />
    <br />
    <>==========================================</>
    <br />
    <br />
    {' '}
    <br />
    <a href={socials.telegram}>Telegram</a>
    {' '}
    <br />
    <a href={socials.twitter}>Twitter</a>
    {' '}
    <br />
    <a href={socials.medium}>Medium</a>
    {' '}
  </Program>
);

Socials.defaultProps = {
  updateActiveApp: () => { },
  closeApp: () => { },
  updateStartbar: () => { },
  openApps: [],
  minimizedApps: [],
  currentlyActiveApp: '',
  previouslyActiveApp: '',
};

Socials.propTypes = {
  updateActiveApp: PropTypes.func,
  closeApp: PropTypes.func,
  updateStartbar: PropTypes.func,
  openApps: PropTypes.array,
  minimizedApps: PropTypes.array,
  currentlyActiveApp: PropTypes.string,
  previouslyActiveApp: PropTypes.string,
};

export default Socials;
