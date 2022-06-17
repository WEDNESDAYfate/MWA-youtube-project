import { ChannelDataService } from './../channel-data.service';
import { Component, OnInit } from '@angular/core';

export class Channel {
  #_id!: string;
  #name!: string;
  #numberOfSubscribers!: number;
  #startYear!: number;
  #playlist!: Playlist[];

  get _id() {
    return this.#_id;
  }
  get name() {
    return this.#name;
  }
  get numberOfSubscribers() {
    return this.#numberOfSubscribers;
  }
  get startYear() {
    return this.#startYear;
  }
  get playlist() {
    return this.#playlist;
  }
  constructor(id: string, name: string, numberOfSubscribers: number) {
    this.#_id = id;
    this.#name = name;
    this.#numberOfSubscribers = numberOfSubscribers;
  }
}
export class Playlist {
  #_id!: string;
  #title!: string;
  #numberOfVideos!: number;

  get _id() {
    return this.#_id;
  }
  get title() {
    return this.#title;
  }
  get numberOfVideos() {
    return this.#numberOfVideos;
  }
  constructor(title: string, numberOfVideos: number) {
    this.#title = title;
    this.#numberOfVideos = numberOfVideos;
  }
}

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css'],
})
export class ChannelsComponent implements OnInit {
  channels: Channel[] = [];

  constructor(private channelService: ChannelDataService) {}

  ngOnInit(): void {
    this.channelService
      .getAll()
      .subscribe((channels) => (this.channels = channels));
  }
}
