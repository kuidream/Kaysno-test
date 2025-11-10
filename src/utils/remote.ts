const ACTIONS = ['stop', 'open', 'close', 'child_lock', 'backlight'] as const;
export type RemoteAction = (typeof ACTIONS)[number];

export interface RemoteItem {
  address: string;
  action: number; // 0-4
}

export type RemoteList = RemoteItem[];

export function decodeRemoteList(raw: string): RemoteList {
  const bytes = raw.match(/.{1,2}/g)?.map(b => parseInt(b, 16)) || [];
  const list: RemoteList = [];
  for (let i = 0; i + 4 <= bytes.length; i += 4) {
    const addressBytes = bytes.slice(i, i + 3);
    if (!addressBytes.every(b => b === 0)) {
      const addr = addressBytes.map(b => b.toString(16).padStart(2, '0')).join('');
      const action = bytes[i + 3] ?? 0;
      list.push({ address: addr, action });
    }
  }
  return list;
}

export function encodeRemoteList(list: RemoteList): string {
  if (list.length === 0) {
    return '00000000';
  }
  const arr: number[] = [];
  list.forEach(item => {
    const addrBytes = item.address.match(/.{1,2}/g)?.map(s => parseInt(s, 16)) || [];
    while (addrBytes.length < 3) addrBytes.push(0);
    arr.push(...addrBytes.slice(0, 3), item.action & 0xff);
  });
  return arr.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function actionToValue(action: RemoteAction): number {
  switch (action) {
    case 'open':
      return 1;
    case 'close':
      return 2;
    case 'child_lock':
      return 3;
    case 'backlight':
      return 4;
    case 'stop':
    default:
      return 0;
  }
}

export function valueToAction(val: number): RemoteAction {
  switch (val) {
    case 1:
      return 'open';
    case 2:
      return 'close';
    case 3:
      return 'child_lock';
    case 4:
      return 'backlight';
    case 0:
    default:
      return 'stop';
  }
}

export function encodeAddRemoteCmd(command: number, address = '000000'): string {
  const addrBytes = address.match(/.{1,2}/g)?.map(s => parseInt(s, 16)) || [];
  while (addrBytes.length < 3) addrBytes.push(0);
  const arr = [command, ...addrBytes.slice(0, 3)];
  return arr.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface AddRemoteState {
  command: number;
  address: string;
}

export function decodeAddRemoteCmd(raw: string): AddRemoteState | null {
  if (!raw) return null;
  const bytes = raw.match(/.{1,2}/g)?.map(b => parseInt(b, 16));
  if (!bytes || bytes.length < 4) return null;
  const command = bytes[0];
  const address = bytes
    .slice(1, 4)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return { command, address };
}

export function encodeRemoteFunc(address: string, action: number): string {
  const addrBytes = address.match(/.{1,2}/g)?.map(s => parseInt(s, 16)) || [];
  while (addrBytes.length < 3) addrBytes.push(0);
  const arr = [...addrBytes.slice(0, 3), action & 0xff];
  return arr.map(b => b.toString(16).padStart(2, '0')).join('');
}
