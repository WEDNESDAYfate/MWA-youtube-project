import { Channel } from './../channels/channels.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelDataService } from '../channel-data.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  channelForm!: FormGroup;

  constructor(
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
  }

  save() {
    this.channelService.addChannel(this.channelForm.value).subscribe(() => {
      this._router.navigate(['channel']);
    });
  }
}
