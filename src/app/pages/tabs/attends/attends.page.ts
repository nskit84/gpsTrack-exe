import { Component, OnInit } from '@angular/core';

import { BackendService } from '../../../services/backend.service';

@Component({
  selector: 'app-attends',
  templateUrl: './attends.page.html',
  styleUrls: ['./attends.page.scss'],
})
export class AttendsPage implements OnInit {

  dataSource: any;
  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.getHistLocation();
  }

  getHistLocation() {
    this.backendService.getAttendance()
        .subscribe(members => {
            this.dataSource = members;
            console.log(this.dataSource);
        });
  }
}
