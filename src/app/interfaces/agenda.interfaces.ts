export interface Contato {
  nome: string;
  telefone?: string | null;
  email?: string | null;
}

export interface ContatoResponse {
  id: string;
  nome: string;
  telefone?: string | null;
  email?: string | null;
}
