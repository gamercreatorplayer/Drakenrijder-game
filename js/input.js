export function createInput() {
  const input = {
    keys: {},
    interact: false,
    attack: false,
    magic: false,
    summon: false,
    jump: false
  };

  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    input.keys[k] = true;

    if (k === "e") input.interact = true;
    if (k === "f") input.attack = true;
    if (k === "r") input.magic = true;
    if (k === "q") input.summon = true;
    if (k === " ") input.jump = true;
  });

  window.addEventListener("keyup", (e) => {
    input.keys[e.key.toLowerCase()] = false;
  });

  input.consumeInteract = function () {
    if (!this.interact) return false;
    this.interact = false;
    return true;
  };

  input.consumeAttack = function () {
    if (!this.attack) return false;
    this.attack = false;
    return true;
  };

  input.consumeMagic = function () {
    if (!this.magic) return false;
    this.magic = false;
    return true;
  };

  input.consumeSummon = function () {
    if (!this.summon) return false;
    this.summon = false;
    return true;
  };

  input.consumeJump = function () {
    if (!this.jump) return false;
    this.jump = false;
    return true;
  };

  return input;
}