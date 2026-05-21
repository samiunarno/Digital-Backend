type Session = {
  id: string;
  createdAt: number;
  filenames: string[];
};

const sessions = new Map<string, Session>();

export function createSession(params: { filenames: string[] }) {
  const id = `sess_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  sessions.set(id, { id, createdAt: Date.now(), filenames: params.filenames });
  return id;
}

export function getSession(sessionId: string) {
  return sessions.get(sessionId);
}

