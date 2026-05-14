import { state } from "./state.js";

const healthFill = document.getElementById("healthFill");
const manaFill = document.getElementById("manaFill");
const bondFill = document.getElementById("bondFill");

const healthText = document.getElementById("healthText");
const manaText = document.getElementById("manaText");
const bondText = document.getElementById("bondText");
const questText = document.getElementById("questText");

const dialogue = document.getElementById("dialogue");
const dialogueName = document.getElementById("dialogueName");
const dialogueText = document.getElementById("dialogueText");

const messageBox = document.getElementById("messageBox");
let messageTimer = null;

export function updateUI() {
  healthFill.style.width = `${state.health}%`;
  manaFill.style.width = `${state.mana}%`;
  bondFill.style.width = `${state.bond}%`;

  healthText.textContent = `${Math.round(state.health)} / ${state.maxHealth}`;
  manaText.textContent = `${Math.round(state.mana)} / ${state.maxMana}`;
  bondText.textContent = `${Math.round(state.bond)} / ${state.maxBond}`;

  questText.textContent = state.questText;
}

export function showMessage(text, duration = 2200) {
  messageBox.textContent = text;
  messageBox.classList.remove("hidden");

  if (messageTimer) clearTimeout(messageTimer);

  messageTimer = setTimeout(() => {
    messageBox.classList.add("hidden");
  }, duration);
}

export function openDialogue(speaker, lines) {
  state.dialogueOpen = true;
  state.currentSpeaker = speaker;
  state.currentDialogue = lines;
  state.dialogueIndex = 0;
  renderDialogue();
}

export function advanceDialogue() {
  if (!state.dialogueOpen) return false;

  state.dialogueIndex++;

  if (state.dialogueIndex >= state.currentDialogue.length) {
    closeDialogue();
    return true;
  }

  renderDialogue();
  return false;
}

function renderDialogue() {
  dialogue.classList.remove("hidden");
  dialogueName.textContent = state.currentSpeaker;
  dialogueText.textContent = state.currentDialogue[state.dialogueIndex];
}

export function closeDialogue() {
  state.dialogueOpen = false;
  dialogue.classList.add("hidden");
}