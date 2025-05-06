public class RoomService
{
    private readonly Dictionary<string, Room> _rooms = new();

    public Room GetOrCreateRoom(string roomId)
    {
        if (!_rooms.ContainsKey(roomId))
        {
            _rooms[roomId] = new Room { Id = roomId };
        }

        return _rooms[roomId];
    }

    public List<Player> GetPlayers(string roomId)
    {
        return GetOrCreateRoom(roomId).Players;
    }

    public void AddPlayer(string roomId, string playerName)
    {
        var room = GetOrCreateRoom(roomId);
        if (!room.Players.Any(p => p.Name == playerName))
        {
            room.Players.Add(new Player { Name = playerName });
        }
    }

    public void SetVote(string roomId, string playerName, string vote)
    {
        var player = GetPlayers(roomId).FirstOrDefault(p => p.Name == playerName);
        if (player != null) player.Vote = vote;
    }

    public void ResetVotes(string roomId)
    {
        foreach (var player in GetPlayers(roomId))
        {
            player.Vote = null;
        }
    }
}

public class Room
{
    public string Id { get; set; }
    public List<Player> Players { get; set; } = new();
}

public class Player
{
    public string Name { get; set; }
    public string? Vote { get; set; }
    public string ConnectionId { get; set; } = string.Empty;
}

