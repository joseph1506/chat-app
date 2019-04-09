import {Injectable} from '@angular/core';
import {StompConfig, StompService, StompState} from '@stomp/ng2-stompjs';
import {BehaviorSubject, Observable} from 'rxjs';
import {Message} from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private stompService: StompService;
  private messages: Observable<Message>;

  constructor(socketUrl: string) {
    const stompConfig: StompConfig = {
      url: socketUrl,
      headers: {
        login: '',
        passcode: ''
      },
      heartbeat_in: 0,
      heartbeat_out: 20000,
      reconnect_delay: 5000,
      debug: true
    };

    this.stompService = new StompService(stompConfig);
  }

  subscribe(streamUrl) {
    this.messages = this.stompService.subscribe(streamUrl);
  }

  public stream(): Observable<Message> {
    return this.messages;
  }

  public send(url: string, message: any) {
    return this.stompService.publish(url, JSON.stringify(message));
  }

  public state(): BehaviorSubject<StompState> {
    return this.stompService.state;
  }

  disconnect() {
    this.stompService.disconnect();
  }

  connect() {
    this.stompService.initAndConnect();
  }

}
