import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ChannelComponent } from './channel/channel.component';
import { ChannelsComponent } from './channels/channels.component';
import { HttpClientModule } from '@angular/common/http';
import { StarsRatingComponent } from './stars-rating/stars-rating.component';
import { AddComponent } from './add/add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateComponent } from './update/update.component';
import { PlaylistAddComponent } from './playlist-add/playlist-add.component';
import { PlaylistUpdateComponent } from './playlist-update/playlist-update.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    ChannelComponent,
    ChannelsComponent,
    NavigationComponent,
    StarsRatingComponent,
    AddComponent,
    UpdateComponent,
    PlaylistAddComponent,
    PlaylistUpdateComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'channel',
        component: ChannelsComponent,
      },
      {
        path: 'channel/:channelId',
        component: ChannelComponent,
      },
      {
        path: 'add',
        component: AddComponent,
      },
      {
        path: 'update/:channelId',
        component: UpdateComponent,
      },
      {
        path: 'channel/:channelId/add',
        component: PlaylistAddComponent,
      },
      {
        path: 'channel/:channelId/update/:playlistId',
        component: PlaylistUpdateComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
