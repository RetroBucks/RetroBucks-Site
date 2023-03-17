import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Draggable from 'react-draggable';
import openaiApi from './api'; // Add this import at the beginning of the file

import {
  apps,
  icons,
  initialResponse,
  changeInputResponse,
  API,
} from '../config';

// Components
import Toolbar from './toolbar';
import Message from './message';

import '../css/messenger.css';


const CreateComponent = ({
  updateActiveApp,
  closeApp,
  updateStartbar,
  openApps,
  minimizedApps,
  currentlyActiveApp,
  previouslyActiveApp,
}) => {
  const botName = 'RetroBucksBot';
  const username = `Anon${Math.floor(Math.random() * (9999 - 1000) + 1000)}`;
  const create = apps.create.toLowerCase();
  const dataView = (openApps.indexOf(create) === -1 || minimizedApps.indexOf(create) !== -1) ? 'closed' : '';

  const messages = useRef();

  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [curatedOptions, setCuratedOptions] = useState({
    visible: false,
    links: [
      'Punks Style Avatar',
      'BAYC Style Avatar',
      'Doodles Style Avatar',
    ],
  });


  // This is the final frontier. All message-based functions end with a call to this one
  // It updates the local array with whatever argument was passed to it
  const updateHistory = (message, user, bot = false) => {
    setChatHistory((prevChatHistory) => ([...prevChatHistory, { user, message, bot }]));
  };

  useEffect(() => {
    // First message doesn't come from bot so we can introduce the app to the user
    setTimeout(() => {
      updateHistory(initialResponse, botName, true);
      setIsTyping(false);
      setCuratedOptions({
        ...curatedOptions,
        visible: true,
      });
    }, 2000);
  }, []);

  useEffect(() => {
    // Always keep messenger window scrolled to last message
    if (openApps.indexOf(apps.create.toLowerCase()) !== -1) {
      messages.current.scrollTop = messages.current.scrollHeight;
    }
  }, [chatHistory, openApps]);

  // This method listens to any successful response from the bot
  const handleResponse = (response) => {
    const chatbotMessages = response.data.response;
    let delay = 1000;

    for (let i = 0; i < chatbotMessages.length; i += 1) {
      delay += i > 0 ? Math.floor(Math.random() * 2000) + 1000 : 0;

      setTimeout(() => {
        updateHistory(chatbotMessages[i], botName, true);

        // If we're on the last response, trigger next step
        if (i === chatbotMessages.length - 1) {
          setIsTyping(false);

          // If user has curated options turned on, check for any new ones from the bot
          if (curatedOptions.visible && response.data.followUp) {
            setCuratedOptions({
              visible: true,
              links: response.data.followUp,
            });
          }
        }
      }, delay);
    }
  };
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  async function queryImaz(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        headers: { "Authorization": "Bearer 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", "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    console.log("HERE BRO: " + JSON.stringify(result));
    return result;
  }

  // This method listens to any failed response from the bot
  const handleError = () => {
    updateHistory('Sorry, you\'ve found a flaw in my code. I\'ll take this opportunity to grow!', botName, true);
    setIsTyping(false);
  };

  const sendMessage = (event, directValue = null) => {
    if ((event && (event.keyCode === 13 || event.which === 13)) || directValue) {
      const message = directValue || inputValue;

      // Pass user message into state
      updateHistory(message, username);

      // Send user message to analytics
      window.dataLayer.push({ event: 'dialogflow', message });

      // Send off to bot
      setIsTyping(true);
      setInputValue('');

      // if (message === curatedOptions.links[0]) {
      //   const dummyResponse = {
      //     data: {
      //       response: ['this is a dummy message just to test something out'],
      //     },
      //   };
      //   handleResponse(dummyResponse);
      // } else if (message === curatedOptions.links[1]) {
      //   const dummyResponse = {
      //     data: {
      //       response: ['this is a 2 message just to test something out'],
      //     },
      //   };
      //   handleResponse(dummyResponse);
      // } else if (message === curatedOptions.links[2]) {
      //   const dummyResponse = {
      //     data: {
      //       response: ['this is a 3 message just to test something out'],
      //     },
      //   };
      //   handleResponse(dummyResponse);
      // } else {
      //   const prompt = `\nUser: ${message}\nAssistant: `;
      // }
      setLoading(true);
      queryImaz({ "inputs": "Astronaut riding a horse" }).then((response) => {
        // Use image
        setLoading(false);
      });
    }
  };

  // Toggle for user to use preselected messages or type their own to the bot
  const changeInput = (option) => {
    updateHistory(changeInputResponse[option], botName, true);

    setCuratedOptions({
      ...curatedOptions,
      visible: !curatedOptions.visible,
    });
  };

  return (
    <Draggable
      defaultPosition={{ x: Math.random() * (150 - 50) + 50, y: Math.random() * (150 - 50) + 50 }}
      handle=".toolbar"
      cancel=".button-small"
    >
      <div
        className={`
              create
              program
              ${currentlyActiveApp === create ? 'active' : ''}
              ${previouslyActiveApp === create ? 'previous-active' : ''}
            `}
        onClick={(e) => updateActiveApp(e, create)}
        data-view={dataView}
      >
        <Toolbar
          closeApp={closeApp}
          updateStartbar={updateStartbar}
          component={create}
          image={icons[apps.create.toLowerCase()].url}
          title={apps.create}
        />

        <div className="messages content" ref={messages}>
          <TransitionGroup>
            {
              chatHistory.map((item) => (
                <CSSTransition key={item.message} timeout={500} classNames="message">
                  <div className="pixel-avatar-container">
                    <div>
                      {avatarUrl && <img src={avatarUrl} alt="Generated Pixel Avatar" />}
                    </div>
                  </div>
                </CSSTransition>
              ))
            }
          </TransitionGroup>
        </div>

        <span className={`activeTyping ${isTyping ? 'visible' : ''}`}>RetroBucks is typing...</span>

        <div className={`userInput ${isTyping ? 'hidden' : ''}`}>
          <div className="field">
            {
              curatedOptions.visible ? (
                <div className="buttonWrapper">
                  <div>
                    {
                      curatedOptions.links.map((link) => (
                        <button
                          key={link.replace(/\s+/g, '').toLowerCase()}
                          type="button"
                          className="button-medium"
                          onClick={() => sendMessage(null, link)}
                        >
                          {link}
                        </button>
                      ))
                    }
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  id="messageField"
                  autoFocus
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={sendMessage}
                />
              )
            }
          </div>
          <button
            type="button"
            onClick={() => changeInput(curatedOptions.visible ? 'free' : 'options')}
            className="button-medium option-toggle"
          >
            {
              curatedOptions.visible ? (
                'Free type'
              ) : (
                'Curated'
              )
            }
          </button>
        </div>
      </div>
    </Draggable>
  );
};

CreateComponent.defaultProps = {
  updateActiveApp: () => { },
  closeApp: () => { },
  updateStartbar: () => { },
  openApps: [],
  minimizedApps: [],
  currentlyActiveApp: '',
  previouslyActiveApp: '',
};

CreateComponent.propTypes = {
  updateActiveApp: PropTypes.func,
  closeApp: PropTypes.func,
  updateStartbar: PropTypes.func,
  openApps: PropTypes.array,
  minimizedApps: PropTypes.array,
  currentlyActiveApp: PropTypes.string,
  previouslyActiveApp: PropTypes.string,
};

export default CreateComponent;
