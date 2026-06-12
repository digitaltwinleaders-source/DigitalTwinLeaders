import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { About } from "./about/about";
import { Programs } from './programs/programs';
import { Values } from './values/values';
import { Join } from "./join/join";
import { Community } from './community/community';
import { Advantages } from './advantages/advantages';
import { Institute } from './institute/institute';
import { CouncilComponent } from './council/council';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  imports: [Hero, About, Programs, Values, Community, Institute, Advantages, CouncilComponent, Join]
})
export class Landing {
  
}
