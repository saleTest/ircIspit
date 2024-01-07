import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RasaServiceService } from '../rasa-service.service';
import { AppModule } from '../../app.module';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TokenServiceService } from '../../auth/token-service.service';
import { MaterialModule } from '../../material.module';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Message {
  text: string;
  isBot: boolean;
}

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, AppModule, FormsModule, AppModule, MaterialModule],
  providers: [RasaServiceService],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css',
})
export class ChatBotComponent implements OnInit {
  hideChatWidget = true;
  userInput = '';
  chatMessages: Message[] = [];
  isLoggedIn: boolean = false;
  linkHtml: SafeHtml | undefined;
  constructor(
    private http: HttpClient,
    private tokenService: TokenServiceService,
    private sanitizer: DomSanitizer
  ) {
    const delayInSeconds = 3000;
    if (this.hideChatWidget != false) {
      setTimeout(() => {
        this.chatMessages.push({
          text: 'Hello. How can I help you?',
          isBot: true,
        });
        if (this.hideChatWidget) {
          this.toggleChatWidget();
        }
      }, delayInSeconds);
    }
  }

  ngOnInit() {
    this.tokenService.getToken().subscribe((token) => {
      if (token) {
        // console.log(123);
        // this.token = token;
        this.isLoggedIn = true;
        // console.log(token);
      } else {
        if (localStorage.getItem('token')) {
          this.isLoggedIn = true;
          // console.log(localStorage.getItem('token'));
        }
      }
    });
  }

  toggleChatWidget() {
    this.hideChatWidget = !this.hideChatWidget;
  }

  sendMessage(event: KeyboardEvent) {
    if (!this.isLoggedIn) {
      this.chatMessages.push({
        text: 'Please login or register.',
        isBot: true,
      });
      this.chatMessages.push({
        text: 'Link for this is: <a href="/auth">Click on me</a>',
        isBot: true,
      });
      this.userInput = '';
      return;
    }
    if (event.key === 'Enter') {
      const userMessage = this.userInput.trim();

      if (!userMessage) {
        return;
      }

      this.userInput = '';

      this.chatMessages.push({ text: `${userMessage}`, isBot: false });

      this.http
        .post<any>('http://localhost:5005/webhooks/rest/webhook', {
          message: userMessage,
        })
        .subscribe(
          (data) => {
            if (data && data.length > 0) {
              const botResponse = data[0].text;
              this.chatMessages.push({
                text: `${botResponse}`,
                isBot: true,
              });
            } else {
              this.chatMessages.push({
                text: "Sorry, I didn't understand. Try with another question.",
                isBot: true,
              });
            }
          },
          (error) => {
            this.chatMessages.push({
              text: 'Error occurred while processing the request.',
              isBot: true,
            });
          }
        );
    }
  }
}
