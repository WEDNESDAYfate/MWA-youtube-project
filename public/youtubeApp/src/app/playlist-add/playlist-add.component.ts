import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelDataService } from '../channel-data.service';

@Component({
  selector: 'app-playlist-add',
  templateUrl: './playlist-add.component.html',
  styleUrls: ['./playlist-add.component.css'],
})
export class PlaylistAddComponent implements OnInit {
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
  }
  onAdd() {
    const channelId = this.route.snapshot.params['channelId'];

    this.channelService
      .addPlaylist(this.playlistForm.value, channelId)
      .subscribe(() => {
        this._router.navigate(['channel/' + channelId]);
      });
  }
}
