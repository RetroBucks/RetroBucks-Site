const bot = require('./images/bot.svg').default;
const email = require('./images/email.svg').default;
const briefcase = require('./images/briefcase.svg').default;
const settings = require('./images/settings.svg').default;
const moon = require('./images/moon.svg').default;
const roadmapico = require('./images/roadmap.svg').default;
const backgroundClassic = require('./images/backgrounds/3.png').default;
const backgroundXp = require('./images/backgrounds/xp.jpg').default;
const backgroundNasa = require('./images/backgrounds/rocket.png').default;
const backgroundClouds = require('./images/backgrounds/clouds.jpg').default;
const backgroundLogo = require('./images/backgrounds/arcade.png').default;

const apps = {
  messenger: 'Chat',
  create: 'Create',
  about: 'About',
  socials: 'Socials',
  roadmap: 'Roadmap',
  shutdown: 'Shutdown',
  settings: 'Settings',
};

const icons = {
  chat: {
    url: bot,
    alt: 'Icon of bot',
  },
  create: {
    url: bot,
    alt: 'Icon of bot',
  },
  about: {
    url: briefcase,
    alt: 'Icon of briefcase',
  },
  socials: {
    url: email,
    alt: 'Icon of email',
  },
  roadmap: {
    url: roadmapico,
    alt: 'Icon of Roadmap',
  },
  shutdown: {
    url: moon,
    alt: 'Icon of moon',
  },
  settings: {
    url: settings,
    alt: 'Icon of settings',
  },
};

const whitepaperLink = 'https://retrobucks.gitbook.io/retro-bucks-whitepaper/';
const appLink = 'https://retrobucks.app';

const socials = {
  content: "Join our community and ride the AI synth-wave.",
  telegram: 'http://t.me/retrobucks',
  twitter: 'http://twitter.com/retrobuckserc',
  medium: 'http://medium.com/@retrobucks',
};

const about = [
  {
    title: 'Idea',
    copy: 'Retro bucks allows for you to revisit the old days of arcade and retro video games together with immersion in our community. The project allows you to create your own avatar that will be used in the online communities of the game to chat and to play games with. '
  },
  {
    title: 'Avatars',
    copy: 'These avatars will be made using retro bucks as currency. The creator will ask the user for the specifications of how they want to look and on the basis of both pre learned models and deep learning through algorithms an avatar is created. This way you can optimize in the best way possible how the image of yourself in the game will look like. No more wiggling with sliders like in most games, let the ai do it for you.'
  },
  {
    title: 'Apparel',
    copy: 'Furthermore you can add more spice to your online presence by buying clothing, accessories and more. On top of the usual amount of clothing that will be regularly updated there will also be a wide range of event specific items for sale on the platform.'
  },
  {
    title: 'Games',
    copy: 'You can then use your avatar in the game, play against others and win rewards. Challenge yourself to be the best and improve your standing in the game world. These will all be fun retro games, easy to play but challenging the deeper you dive into it. Both something to discover for the new generation but definitely a blast to the past for the older.'
  },
  {
    title: 'Community',
    copy: 'But most of all the goal is for the user to make new friends, you can join one of the many communities on our platform and use your avatar to stand out, make new friends, challenge others and have a good time working together on the project. It is as a community that we will push it as a platform to vote on will be released as part of our roadmap in which you can help decide the roads our project will go on.'
  },
  {
    title: 'Staking',
    copy: 'One of these roads is a program where staking will be possible within our community. Be incentivized to hold by becoming a part of revenue sharing, rewards and reduction on fees that would have been levied on most other users.'
  }
];
const roadmap = [
  {
    title: 'Phase 1: Development and Launch of Retro Bucks Token',
    copy: 'Finalize the smart contract for the Retro Bucks token and perform internal testing; Launch the Retro Bucks token on the Ethereum blockchain and list it on major decentralized exchanges; Begin marketing and community building efforts to attract early adopters and investors;'
  },
  {
    title: 'Phase 2: Avatar Creator Development',
    copy: 'Start development of the AI-powered avatar creator and user interface; Launch the beta version of the avatar creator to a limited group of users for testing and feedback;  Integrate new features and improvements based on user feedback; Launch the final version of the avatar creator to the public;'
  },
  {
    title: 'Phase 3: Retro Mini Games and Social Features',
    copy: 'Start development of Retro Mini games, which will allow users to earn Retro Bucks tokens by playing games; Integrate social features into the platform, including the ability to share avatars and connect with other users; Launch the first Retro Mini game to the public; Expand the selection of Retro Mini games and continue to improve the social features;'
  },
  {
    title: 'Phase 4: Voting and Governance Mechanisms',
    copy: 'Implement a voting and governance system to allow Retro Bucks token holders to have a say in platform decisions; Launch the first community vote on a platform decision;  Expand the voting and governance mechanisms to include more decision-making processes; Continue to develop and improve the voting and governance mechanisms to ensure transparency and fairnes;'
  }
];


const initialResponse = "Hi there, I'm RetroBucks bot, I'm here to answer your questions and let you know more about the Retro Bucks project! Thanks for stopping by for a chat. You can ask me anything using the \"Free type\" button below, but for now I've gone ahead and given you some quick select options to help get you started. Go ahead and ask me something!";

const changeInputResponse = {
  free: 'Feel free to ask me whatever you want. ',
  options: 'A wise choice indeed!',
};

// TODO: update URLs to be correct
const systemSettingsBackground = [
  {
    name: 'Classic',
    url: backgroundClassic,
  },
  {
    name: 'Arcade',
    url: backgroundLogo,
  },
  {
    name: 'Nasa',
    url: backgroundNasa,
  },
  {
    name: 'Clouds',
    url: backgroundClouds,
  },
];

const systemSettingsTheme = ['Light', 'Dark'];

module.exports = {
  apps,
  icons,
  whitepaperLink,
  appLink,
  socials,
  roadmap,
  about,
  initialResponse,
  changeInputResponse,
  systemSettings: {
    background: systemSettingsBackground,
    theme: systemSettingsTheme,
  },
};
