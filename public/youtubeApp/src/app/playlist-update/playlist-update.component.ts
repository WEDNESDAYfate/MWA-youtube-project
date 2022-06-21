import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelDataService } from '../channel-data.service';

@Component({
  selector: 'app-playlist-update',
  templateUrl: './playlist-update.component.html',
  styleUrls: ['./playlist-update.component.css'],
})
export class PlaylistUpdateComponent implements OnInit {
  playlistForm!: FormGroup;
  constructor(
    private channelService: ChannelDataService,
    private _router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.playlistForm = this._formBuilder.group({
      title: '',
      numberOfVideos: '',
    });
    this.getPlaylist();
  }

  getPlaylist() {
    const channelId = this.route.snapshot.params['channelId'];
    const playListId = this.route.snapshot.params['playlistId'];
    this.channelService
      .getOnePlayList(channelId, playListId)
      .subscribe((playlist) => {
        this.playlistForm = this._formBuilder.group({
          title: playlist.title,
          numberOfVideos: playlist.numberOfVideos,
        });
      });
  }
  updatePlaylist() {
    const channelId = this.route.snapshot.params['channelId'];
    const playListId = this.route.snapshot.params['playlistId'];

    this.channelService
      .updatePlaylist(channelId, playListId, this.playlistForm.value)
      .subscribe(() => {
        this._router.navigate(['channel/' + channelId]);
      });
  }
}
