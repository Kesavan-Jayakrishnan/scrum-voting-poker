interface Player {
    name: string;
    vote?: string;
  }
  
  interface PlayerListProps {
    players: Player[];
  }
  
  export default function PlayerList({ players }: PlayerListProps) {
    return (
      <div className="flex flex-col gap-2">
        {players.map((player, index) => (
          <div key={index} className="flex items-center gap-4 border p-2 rounded">
            <span className="font-bold">{player.name}</span>
            <span>{player.vote ? `Voted: ${player.vote}` : 'Waiting...'}</span>
          </div>
        ))}
      </div>
    );
  }
  