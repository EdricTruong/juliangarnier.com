/*
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/.
 * Copyright (c) 2016 Julian Garnier
 */

window.onload = function() {

  const messagesEl = document.querySelector('.messages');
  const typingSpeed = 20;
  const loadingText = '<b>•</b><b>•</b><b>•</b>';
  let messageIndex = 0;

  const getCurrentTime = function () {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const current = hours + (minutes * .01);
    if (current >= 5 && current < 19) return 'Have a nice day';
    if (current >= 19 && current < 22) return 'Have a nice evening';
    if (current >= 22 || current < 5) return 'Have a good night';
  };

  const messages = [
    'Hi 👋',
    'I\'m Edric',
    'I code things',
    'I\'m self-studying<br> You can contact me at <a href="mailto:contact@edrict.me">contact@edrict.me</a>',
    '<a target="_blank" href="https://github.com/EdricTruong">github.com/EdricTruong</a>',
    getCurrentTime()
  ];

  const getFontSize = function () {
    return parseInt(getComputedStyle(document.body).getPropertyValue('font-size'));
  };

  const pxToRem = function (px) {
    return px / getFontSize() + 'rem';
  };

  const createBubbleElements = function (message, position) {
    const bubbleEl = document.createElement('div');
    const messageEl = document.createElement('span');
    const loadingEl = document.createElement('span');
    bubbleEl.classList.add('bubble');
    bubbleEl.classList.add('is-loading');
    bubbleEl.classList.add('cornered');
    bubbleEl.classList.add(position === 'right' ? 'right' : 'left');
    messageEl.classList.add('message');
    loadingEl.classList.add('loading');
    messageEl.innerHTML = message;
    loadingEl.innerHTML = loadingText;
    bubbleEl.appendChild(loadingEl);
    bubbleEl.appendChild(messageEl);
    bubbleEl.style.opacity = 0;
    return {
      bubble: bubbleEl,
      message: messageEl,
      loading: loadingEl
    }
  };

  const getDimensions = function (elements) {
    return dimensions = {
      loading: {
        w: '4rem',
        h: '2.25rem'
      },
      bubble: {
        w: pxToRem(elements.bubble.offsetWidth + 4),
        h: pxToRem(elements.bubble.offsetHeight)
      },
      message: {
        w: pxToRem(elements.message.offsetWidth + 4),
        h: pxToRem(elements.message.offsetHeight)
      }
    }
  };

  const sendMessage = function (message, position) {
    const loadingDuration = (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + 500;
    const elements = createBubbleElements(message, position);
    messagesEl.appendChild(elements.bubble);
    messagesEl.appendChild(document.createElement('br'));
    const dimensions = getDimensions(elements);
    elements.bubble.style.width = '0rem';
    elements.bubble.style.height = dimensions.loading.h;
    elements.message.style.width = dimensions.message.w;
    elements.message.style.height = dimensions.message.h;
    elements.bubble.style.opacity = 1;
    const bubbleOffset = elements.bubble.offsetTop + elements.bubble.offsetHeight;
    if (bubbleOffset > messagesEl.offsetHeight) {
      const scrollMessages = anime({
        targets: messagesEl,
        scrollTop: bubbleOffset,
        duration: 750
      });
    }
    const bubbleSize = anime({
      targets: elements.bubble,
      width: ['0rem', dimensions.loading.w],
      marginTop: ['2.5rem', 0],
      marginLeft: ['-2.5rem', 0],
      duration: 800,
      easing: 'easeOutElastic'
    });
    const loadingLoop = anime({
      targets: elements.bubble,
      scale: [1.05, .95],
      duration: 1100,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });
    const dotsStart = anime({
      targets: elements.loading,
      translateX: ['-2rem', '0rem'],
      scale: [.5, 1],
      duration: 400,
      delay: 25,
      easing: 'easeOutElastic',
    });
    const dotsPulse = anime({
      targets: elements.bubble.querySelectorAll('b'),
      scale: [1, 1.25],
      opacity: [.5, 1],
      duration: 300,
      loop: true,
      direction: 'alternate',
      delay: function (i) {
        return (i * 100) + 50
      }
    });
    setTimeout(function () {
      loadingLoop.pause();
      dotsPulse.restart({
        opacity: 0,
        scale: 0,
        loop: false,
        direction: 'forwards',
        update: function (a) {
          if (a.progress >= 65 && elements.bubble.classList.contains('is-loading')) {
            elements.bubble.classList.remove('is-loading');
            anime({
              targets: elements.message,
              opacity: [0, 1],
              duration: 300,
            });
          }
        }
      });
      bubbleSize.restart({
        scale: 1,
        width: [dimensions.loading.w, dimensions.bubble.w],
        height: [dimensions.loading.h, dimensions.bubble.h],
        marginTop: 0,
        marginLeft: 0,
        begin: function () {
          if (messageIndex < messages.length) elements.bubble.classList.remove('cornered');
        }
      })
    }, loadingDuration - 50);
  };

  const sendMessages = function () {
    const message = messages[messageIndex];
    if (!message) return;
    sendMessage(message);
    ++messageIndex;
    setTimeout(sendMessages, (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + anime.random(900, 1200));
  };

  sendMessages();

}
