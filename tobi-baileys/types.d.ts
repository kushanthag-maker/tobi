/**
 * TypeScript Type Definitions for Tobi-Baileys Standalone Library
 */

import { EventEmitter } from 'events';
import { Readable } from 'stream';

export interface TobiConfig {
  sessionDir?: string;
  phoneNumber?: string;
  authType?: 'pairing' | 'qr' | 'auto';
  pairingMode?: 'tobi-devv' | 'tobi-devv-full' | 'standard';
  prefixes?: string[];
  owners?: string[];
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  autoReconnect?: boolean;
}

export interface InteractiveButton {
  type?: 'reply' | 'url' | 'call' | 'copy';
  display_text?: string;
  id?: string;
  url?: string;
  phone?: string;
  code?: string;
}

export interface ListSection {
  title: string;
  highlight_label?: string;
  rows: Array<{
    id: string;
    title: string;
    description?: string;
    header?: string;
  }>;
}

export interface SerializedMessage {
  id: string;
  from: string;
  sender: string;
  isGroup: boolean;
  fromMe: boolean;
  body: string;
  command: string;
  args: string[];
  text: string;
  pushName: string;
  reply: (content: any, options?: any) => Promise<any>;
  react: (emoji: string) => Promise<any>;
  sendButtons: (options: any) => Promise<any>;
  sendList: (options: any) => Promise<any>;
  sendFile: (source: string | Readable, options?: any) => Promise<any>;
}

export class Tobi extends EventEmitter {
  constructor(config?: TobiConfig);
  sock: any;
  isConnected: boolean;
  command(name: string | string[], handler: (m: SerializedMessage, ctx: any) => Promise<any> | any, options?: any): this;
  launch(): Promise<this>;
  simulateMessage(text: string, from?: string): void;
  sendText(jid: string, text: string): Promise<any>;
  sendButtons(jid: string, options: any): Promise<any>;
  sendList(jid: string, options: any): Promise<any>;
  sendFile(jid: string, source: string | Readable, options?: any): Promise<any>;
}

export function makeWASocket(config?: any): any;
export function useMultiFileAuthState(folder: string): Promise<{ state: any; saveCreds: () => Promise<void> }>;
