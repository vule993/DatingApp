import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { getPaginatedResult, getPaginationHeaders } from "./paginationHelper";
import { Message } from "../models/message";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  baseUrl = environment.apiUrl + "messages";

  constructor(private http: HttpClient) {}

  getMessages(pageNumber: number, pageSize: number, container) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append("Container", container);
    return getPaginatedResult<Message[]>(this.baseUrl, params, this.http);
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + "/thread/" + username);
  }

  sendMessage(username: string, content: string) {
    return this.http.post<Message>(this.baseUrl, {
      recipientUsername: username,
      content,
    });
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + "/" + id);
  }
}
