import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Channel, Playlist } from './channels/channels.component';

@Injectable({
  providedIn: 'root',
})
export class ChannelDataService {
  baseUrl: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  public getAll(): Observable<Channel[]> {
    return this.http.get<Channel[]>(this.baseUrl + '/channel');
  }
  public getOne(id: string): Observable<Channel> {
    const url: string = this.baseUrl + '/channel/' + id;
    return this.http.get<Channel>(url);
  }

  private _handleError(err: any): Promise<any> {
    console.log('Service Error', err);
    return Promise.reject(err.message || err);
  }

  public deleteChannel(channelId: string): Promise<Channel> {
    const url: string = this.baseUrl + '/channel/' + channelId;
    return this.http.delete(url).toPromise().catch(this._handleError);
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  public addChannel(data: Channel): Observable<Channel> {
    const url: string = this.baseUrl + '/channel';
    return this.http.post<Channel>(url, data);
  }

  public updateChannel(channelId: string, data: Channel): Observable<Channel> {
    const url: string = this.baseUrl + '/channel/' + channelId;
    return this.http.put<Channel>(url, data);
  }

  public addPlaylist(data: Playlist, channelId: string): Observable<Playlist> {
    const url: string = this.baseUrl + '/channel/' + channelId + '/playlist';
    return this.http.post<Playlist>(url, data);
  }
  public updatePlaylist(
    channelId: string,
    playlistId: string,
    data: Channel
  ): Observable<Channel> {
    const url: string =
      this.baseUrl + '/channel/' + channelId + '/playlist/' + playlistId;
    return this.http.put<Channel>(url, data);
  }

  public getOnePlayList(
    channelId: string,
    playlistId: string
  ): Observable<Playlist> {
    const url: string =
      this.baseUrl + '/channel/' + channelId + '/playlist/' + playlistId;
    return this.http.get<Playlist>(url);
  }
  // public deleteChannel(channelId: string): Observable<Channel> {
  //   const url: string = this.baseUrl + '/channel/' + channelId;
  //   return this.http.delete<Channel>(url);
  // }
  public deleteChannelPlayList(
    channelId: string,
    playlistId: string
  ): Observable<Playlist> {
    const url: string =
      this.baseUrl + '/channel/' + channelId + '/playlist/' + playlistId;
    return this.http.delete<Playlist>(url);
  }
}
