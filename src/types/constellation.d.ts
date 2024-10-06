export interface StarConnection {
    startStar: number;
    endStar: number;
    thickness: number;
    color: number;
    constelation_id: number;
    connection_id: number;
}

export interface Constellation {
    name: string;
    id: number;
    color: number;
    isShown: boolean;
    isEditing: boolean;
    starCount?: number;
    connections: StarConnection[];
}