import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelDataService } from '../channel-data.service';
import { Channel, Playlist } from '../channels/channels.component';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css'],
})
export class ChannelComponent implements OnInit {
  channel!: Channel;
  playlists: Playlist[] = [];

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private channelService: ChannelDataService
  ) {
    this.channel = new Channel('', '', 0);
  }

  ngOnInit(): void {
    this.onRefresh();
  }
  onRefresh() {
    const channelId = this.route.snapshot.params['channelId'];
    this.channelService.getOne(channelId).subscribe((channel) => {
      this.channel = channel;
    });
  }

  onDelete(channelId: string) {
    this.channelService.deleteChannel(channelId);
    this._router.navigate(['channel']);
  }
  onUpdate(channelId: string) {
    this._router.navigate(['update/' + channelId]);
  }
  onAddPlayList(channelId: string) {
    this._router.navigate(['channel/' + channelId + '/add']);
  }
  onEditPlayList(channelId: string, playlistId: string) {
    this._router.navigate(['channel/' + channelId + '/update/' + playlistId]);
  }
  onPlayListDelete(channelId: string, playlistId: string) {
    this.channelService
      .deleteChannelPlayList(channelId, playlistId)
      .subscribe(() => {
        this.onRefresh();
      });
  }
}
