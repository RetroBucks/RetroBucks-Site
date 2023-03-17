import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Draggable from 'react-draggable';
import { Configuration } from 'openai';
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


const Messenger = ({
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
  const messenger = apps.messenger.toLowerCase();
  const dataView = (openApps.indexOf(messenger) === -1 || minimizedApps.indexOf(messenger) !== -1) ? 'closed' : '';

  const messages = useRef();

  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [curatedOptions, setCuratedOptions] = useState({
    visible: false,
    links: [
      'What\'s $rBucks?',
      'Customizable Avatars?',
      'Play to Earn?'
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
    if (openApps.indexOf(apps.messenger.toLowerCase()) !== -1) {
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

  // This method listens to any failed response from the bot
  const handleError = () => {
    updateHistory('Sorry, you\'ve found a flaw in my code. I\'ll take this opportunity to grow!', botName, true);
    setIsTyping(false);
  };

  const sendMessage = async (event, directValue = null) => {
    if ((event && (event.keyCode === 13 || event.which === 13)) || directValue) {
      const message = directValue || inputValue;

      // Pass user message into state
      updateHistory(message, username);

      // Send user message to analytics
      window.dataLayer.push({ event: 'dialogflow', message });

      // Send off to bot
      setIsTyping(true);
      setInputValue('');

      if (message === curatedOptions.links[0]) {
        const dummyResponse = {
          data: {
            response: ['rBucks are the main currency to play Retro Mini games, access to social avatars & Social features, and the ability to vote. '],
          },
        };
        handleResponse(dummyResponse);
      } else if (message === curatedOptions.links[1]) {
        const dummyResponse = {
          data: {
            response: ['Users can input their preferences and characteristics such as hair color, eye shape, skin tone, clothing style, and more. Each Avatar will be completely uniquely designed and generated to fit your needs.'],
          },
        };
        handleResponse(dummyResponse);
      } else if (message === curatedOptions.links[2]) {
        const dummyResponse = {
          data: {
            response: ['In terms of rewards, Retro Mini-Games can offer a variety of different prizes. These prizes may include tokens, in-game items that can be used to enhance the user\'s gameplay experience and exclusive avatar customization.'],
          },
        };
        handleResponse(dummyResponse);
      } else {
        const prompt = `\nUser: ${message}\nAssistant: `;

        try {
          const response = await openaiApi.post('', {
            prompt,
            model: 'text-davinci-002',
            max_tokens: 4000,
            n: 1,
            stop: null,
            temperature: 0.5,
          });
          const chatGPTResponse = response.data.choices[0].text.trim();
          const cleanedResponse = chatGPTResponse.replace(/\n/g, ' ').trim();


          // Handle the response from ChatGPT
          const dummyResponse = {
            data: {
              response: [cleanedResponse],
            },
          };
          handleResponse(dummyResponse);

        } catch (error) {
          console.error(error);
          handleError();
        }
      }
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
              messenger
              program
              ${currentlyActiveApp === messenger ? 'active' : ''}
              ${previouslyActiveApp === messenger ? 'previous-active' : ''}
            `}
        onClick={(e) => updateActiveApp(e, messenger)}
        data-view={dataView}
      >
        <Toolbar
          closeApp={closeApp}
          updateStartbar={updateStartbar}
          component={messenger}
          image={icons[apps.messenger.toLowerCase()].url}
          title={apps.messenger}
        />

        <div className="messages content" ref={messages}>
          <TransitionGroup>
            {
              chatHistory.map((item) => (
                <CSSTransition key={item.message} timeout={500} classNames="message">
                  <Message
                    key={item.message}
                    type={item.bot ? 'sent' : 'received'}
                    user={item.user}
                    content={item.message}
                  />
                </CSSTransition>
              ))
            }
          </TransitionGroup>
        </div>

        <span className={`activeTyping ${isTyping ? 'visible' : ''}`}>RetroBucksBot is typing...</span>

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

Messenger.defaultProps = {
  updateActiveApp: () => { },
  closeApp: () => { },
  updateStartbar: () => { },
  openApps: [],
  minimizedApps: [],
  currentlyActiveApp: '',
  previouslyActiveApp: '',
};

Messenger.propTypes = {
  updateActiveApp: PropTypes.func,
  closeApp: PropTypes.func,
  updateStartbar: PropTypes.func,
  openApps: PropTypes.array,
  minimizedApps: PropTypes.array,
  currentlyActiveApp: PropTypes.string,
  previouslyActiveApp: PropTypes.string,
};

export default Messenger;
