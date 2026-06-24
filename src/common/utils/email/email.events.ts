//* Importing the EventEmitter class from the 'node:events' module to create and manage custom events in the application
import { EventEmitter } from 'node:events';
import { EmailEnum } from '../../enum/user.enum';

//* Creating an instance of EventEmitter to handle custom events related to email operations
export const Eventemitter = new EventEmitter();

//* Setting up an event listener for the 'verification' event defined in the EmailEnum, which will execute the provided callback function when the event is emitted
Eventemitter.on(EmailEnum.verification, async (fn) => {
  await fn();
});
