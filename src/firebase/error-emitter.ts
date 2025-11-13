
import { EventEmitter } from 'events';

// It's important to use a single, shared instance of the EventEmitter.
export const errorEmitter = new EventEmitter();
