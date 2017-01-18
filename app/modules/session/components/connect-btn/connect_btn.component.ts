import {Component} from '@angular/core';
import {Session} from '../../models/session.model';
import setInterval = core.setInterval;

@Component({
  moduleId: module.id,
  selector: 'connect-btn',
  templateUrl: 'connect_btn.template.html',
  styleUrls: ['connect_btn.style.css']
})
export class ConnectBtnComponent {
  private session: Session = Session.getInstance();
  private checkInterval: number;

  private receiveConnectMessage(event: any): void {
    let origin = event.origin || event.originalEvent.origin;
    if (origin !== 'http://sc.menu-flow.com') {
      return;
    }
    this.connectionSuccessFul(event.data);
  }

  getConnectionUrl(): string {
    return '//soundcloud.com/connect?' +
      'client_id=abb6c1cad3f409112a5995bf922e1d1e&' +
      'redirect_uri=http://sc.menu-flow.com/connect&' +
      'response_type=code';
  }

  connect() {
    let popup = window.open(this.getConnectionUrl());
    this.checkInterval = setInterval(() => {
      popup.postMessage(null, 'http://sc.menu-flow.com');
    }, 100);
  }

  connectionSuccessFul(params: any) {
    this.session.set({
      access_token: params.access_token,
      expires_on: params.expires_on,
      refresh_token: params.refresh_token
    });
  }

  constructor() {
    window.addEventListener('message', this.receiveConnectMessage.bind(this), false);
    window.addEventListener('connectionSuccessFul', (ev: CustomEvent) => {
      let creds = ev.detail;
      if (creds) {
        try {
          creds = JSON.parse(creds);
        } catch (err) {

        }
        this.connectionSuccessFul(creds);
      }
    });
  }
}