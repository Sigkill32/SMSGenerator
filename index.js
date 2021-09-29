"use strict";

const sendSms = document.getElementById("sendSms");
const smsType = document.getElementById("smsType");
const inputItems = document.querySelector(".input-items");
const previewButton = document.getElementById("previewSms");
const previewContainer = document.querySelector(".sms-preview");
const changeTypeButton = document.getElementById("changeType");

const debtorReminderBuilder = (
  policyNum = "606021312010001224",
  regNum = "KA-02-MH-9531",
  ballance = 0,
  company = "The New India Assurance Co Ltd, Hassan"
) => {
  const debtorReminder = `Dear Sir/Madam,\n\nYour Private Car Policy ${policyNum} for Vehicle No ${regNum} has balance amount to pay of Rs.${ballance}. Please clear it for continuous coverage of your insurance policy.\n\nRegards,\nRuschik Er\n${company}.`;
  return debtorReminder;
};

const motorPolicyReminderBuilder = (
  policyNum = "606021312010001224",
  regNum = "KA-02-MH-9531",
  expiryDate = "15-10-2021",
  company = "The New India Assurance Co Ltd, Hassan"
) => {
  const motorPolicyReminder = `Dear Sir/Madam,\n\nYour Private Car Policy ${policyNum} for Vehicle No ${regNum} will expire on ${expiryDate}. Please renew the policy before expiry for continuous coverage. You can call on 9742925297 for your renewal assist. Please ignore this message if already renewed.\n\nRegards,\n${company}.`;
  return motorPolicyReminder;
};

const types = [
  {
    name: "Motor Policy Reminder",
    id: "motorPolicyReminder",
    args: ["policyNum", "regNum", "expiryDate", "company"],
    placeHolders: ["Policy Number", "Reg Number", "Expiry Date", "Company"],
    func: motorPolicyReminderBuilder,
  },
  {
    name: "Debt Reminder",
    id: "debtorReminder",
    args: ["policyNum", "regNum", "ballance", "company"],
    placeHolders: ["Policy Number", "Reg Number", "Ballance", "Company"],
    func: debtorReminderBuilder,
  },
];

const hrefPrefixBuilder = (number) => {
  return `sms:+91${number}?body=`;
};

const hrefPrefix = "sms:+919742925297?body=";
let currentArgs = [];
let selected = types[0];
const typesContainer = document.querySelector(".types-container");

const renderTypeButtons = () => {
  typesContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();
  types.forEach((type) => {
    const button = document.createElement("button");
    button.id = type.id;
    button.textContent = type.name;
    fragment.append(button);
  });
  typesContainer.append(fragment);
};

const renderInputs = (args, placeHolders) => {
  inputItems.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const phone = document.createElement("input");
  phone.id = "phoneNum";
  phone.placeholder = "Phone Number";
  phone.type = "number";
  fragment.append(phone);
  for (let i = 0; i < args.length; i++) {
    const input = document.createElement("input");
    input.id = args[i];
    input.placeholder = placeHolders[i];
    fragment.append(input);
  }
  inputItems.append(fragment);
};

const initRender = () => {
  renderTypeButtons();
  smsType.textContent = selected.name;
  renderInputs(selected.args, selected.placeHolders);
};

initRender();

typesContainer.addEventListener("click", (e) => {
  const typeName = e.target.id;
  types.forEach((type) => {
    if (type.id === typeName) {
      smsType.textContent = type.name;
      if (type.id !== selected.id) {
        sendSms.classList.add("hidden");
        previewContainer.value = "";
        previewContainer.classList.add("hidden");
      }
      selected = type;
      renderInputs(selected.args, selected.placeHolders);
      typesContainer.classList.add("hidden");
    }
  });
});

previewButton.addEventListener("click", () => {
  let funcArgs = [];
  let isInvalid = false;
  selected.args.forEach((arg) => {
    const placeholderValue = document.getElementById(arg).value;
    if (placeholderValue === "") isInvalid = true;
    funcArgs.push(placeholderValue);
  });
  if (isInvalid) return alert("One or more fields are empty! Please fill 'em");
  const message = selected.func(...funcArgs);
  previewContainer.classList.remove("hidden");
  previewContainer.value = message;
  sendSms.classList.remove("hidden");
});

changeTypeButton.addEventListener("click", () => {
  typesContainer.classList.remove("hidden");
});

sendSms.addEventListener("click", () => {
  const message = previewContainer.value;
  const number = document.getElementById("phoneNum").value;
  const url = hrefPrefixBuilder(number) + encodeURI(message);
  window.location.href = url;
});
