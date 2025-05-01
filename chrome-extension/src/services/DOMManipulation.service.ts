import { Injectable } from "@angular/core";
import $ from "jquery";

@Injectable({
  providedIn: "root",
})
export class DOMManipulationService {
  constructor() {}

  async runPrompt(): Promise<any> {
    const proseMirror = document.getElementById("prompt-textarea");
    proseMirror.innerText = "hello";
    proseMirror.dispatchEvent(new Event("input", { bubbles: true }));
  }
}
