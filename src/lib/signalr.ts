import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection;

export const startConnection = async (roomId: string, playerName: string) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7293/pokerhub') // change to your backend URL
    .withAutomaticReconnect()
    .build();

  connection.on('PlayerJoined', (name) => {
    console.log(`${name} joined the room`);
  });

  connection.on('ReceiveVote', (name, vote) => {
    console.log(`${name} voted: ${vote}`);
  });

  connection.on('RevealVotes', () => {
    console.log('Votes revealed');
  });

  connection.on('ResetVotes', () => {
    console.log('Votes reset');
  });

  await connection.start();
  await connection.invoke('JoinRoom', roomId, playerName);
};

export const sendVote = async (roomId: string, playerName: string, vote: string) => {
  await connection.invoke('SendVote', roomId, playerName, vote);
};

export const revealVotes = async (roomId: string) => {
  await connection.invoke('RevealVotes', roomId);
};

export const resetVotes = async (roomId: string) => {
  await connection.invoke('ResetVotes', roomId);
};

export const getConnection = () => connection;
