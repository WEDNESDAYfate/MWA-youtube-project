import { ActivatedRoute, Router } from '@angular/router';
import { ChannelDataService } from './../channel-data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
  channelForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private channelService: ChannelDataService
  ) {}

  ngOnInit(): void {
    this.channelForm = this._formBuilder.group({
      name: '',
      numberOfSubscribers: '',
      startYear: '',
    });
    this.getChannel();
  }

  getChannel() {
    const channelId = this.route.snapshot.params['channelId'];
    this.channelService.getOne(channelId).subscribe((channel) => {
      this.channelForm = this._formBuilder.group({
        name: channel.name,
        numberOfSubscribers: channel.numberOfSubscribers,
        startYear: channel.startYear,
      });
    });
  }

  update() {
    const channelId = this.route.snapshot.params['channelId'];
    this.channelService
      .updateChannel(channelId, this.channelForm.value)
      .subscribe(() => {
        this._router.navigate(['channel/' + channelId]);
      });
  }
}
