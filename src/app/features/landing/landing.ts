import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { About } from "./about/about";
import { Programs } from './programs/programs';
import { Values } from './values/values';
import { Join } from "./join/join";
import { Community } from './community/community';
import { Advantages } from './advantages/advantages';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  imports: [Hero, About, Programs, Values, Community, Advantages, Join]
})
export class Landing {
  
}
