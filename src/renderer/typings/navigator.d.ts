import type {ApiResponse} from "../../main/preload";

export interface TabState {
    id: number; // ID unique pour chaque onglet
    name: string;
    url: string;
    method: 'GET' | 'POST' | 'DELETE';
    requestBody: string;
    contentType: string;
    // État de la réponse propre à cet onglet
    response: ApiResponse | null;
    loading: boolean;
    error: string | null;
}