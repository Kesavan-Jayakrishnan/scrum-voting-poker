
using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

public class PokerHub : Hub
{
    private readonly RoomService _roomService;

    public PokerHub(RoomService roomService)
    {
        _roomService = roomService;
    }

    public async Task JoinRoom(string roomId, string playerName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

        _roomService.AddPlayer(roomId, playerName);
        var players = _roomService.GetPlayers(roomId);

        await Clients.Caller.SendAsync("PlayerList", players);
        await Clients.OthersInGroup(roomId).SendAsync("PlayerJoined", playerName);
    }

    public async Task SendVote(string roomId, string playerName, string vote)
    {
        _roomService.SetVote(roomId, playerName, vote);
        await Clients.Group(roomId).SendAsync("ReceiveVote", playerName, vote);
    }

    public async Task RevealVotes(string roomId)
    {
        await Clients.Group(roomId).SendAsync("RevealVotes");
    }

    public async Task ResetVotes(string roomId)
    {
        _roomService.ResetVotes(roomId);
        await Clients.Group(roomId).SendAsync("ResetVotes");
    }
}
