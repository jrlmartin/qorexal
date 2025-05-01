import { Injectable } from "@angular/core";
import $ from "jquery";

@Injectable({
  providedIn: "root",
})
export class DOMManipulationService {
  constructor() {}

  async runPrompt(): Promise<any> {
    const $textarea = $("#prompt-textarea");
    $textarea.text("hello");
    $textarea.trigger("input");

    // Add random delay between 1-5 seconds
    const randomDelay = 1000 + Math.random() * 4000; // 1000ms to 5000ms
    await new Promise(resolve => setTimeout(resolve, randomDelay));
    
    $("#composer-submit-button").click();
  }
}
