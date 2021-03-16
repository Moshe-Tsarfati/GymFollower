$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});
// window.onbeforeunload = function (e) {
//   return 'Before exit make sure you saved your workout log';
// };
class Settings {
  constructor() {
    this.settingsTab = document.querySelector("#settings");
    this.settingsBox = this.settingsTab.querySelector(".settings-box");
    this.defaultSettings = {
      barW: 0,
      curWeight: 0,
      alarm: "1_timer_alert_3_seconds",
      pat: "5",
    };
    this.getUserSettings(this.settingsTab, this.settingsBox);
    this.alertSampleTest(this.settingsBox);
    this.settingsToggle(this.settingsTab);
  }
  static settings = JSON.parse(localStorage.getItem("settings"));
  settingsToggle(settingsTab) {
    const settingsBtn = document.querySelector("#nav-settings");
    settingsBtn.style.cursor = "pointer";
    let status = "closed";
    settingsBtn.addEventListener("click", () => {
      if (status === "closed") {
        settingsTab.classList.remove("d-none");
        settingsTab.scrollIntoView({ behavior: "smooth" });
        settingsBtn.style.background = "rgba(70, 85, 131, 0.5)";
        this.closeBtnHandler(settingsTab, settingsBtn);
        // Change Status To 'open'
        status = "opened";
      } else {
        settingsTab.classList.add("d-none");
        settingsBtn.style.background = "#343a40";
        // Change Status To 'closed'
        status = "closed";
      }
    });
  }
  closeBtnHandler(settingsTab, settingsBtn) {
    const closeBtn = settingsTab.querySelector(".btn-danger");
    closeBtn.addEventListener(
      "click",
      () => {
        settingsBtn.click();
      },
      { once: true }
    );
  }
  getUserSettings(settingsTab, settingsBox) {
    if (!localStorage.getItem("settings")) {
      localStorage.setItem("settings", JSON.stringify(this.defaultSettings));
    }
    const preSettings = JSON.parse(localStorage.getItem("settings"));
    const selects = settingsTab.querySelectorAll("select");
    const [tens, tead, pat] = selects;
    const inputs = settingsTab.querySelectorAll("input");
    const [myCurWeight, barWeight] = inputs;
    // insert  the Last updated user prefrences
    tens.value = preSettings.alarm.split("alert")[0] + "alert_";
    tead.value = preSettings.alarm.split("alert_")[1];
    pat.value = preSettings.pat;
    myCurWeight.value = preSettings.curWeight;
    barWeight.value = preSettings.barW;
    // Save Object of new settings to local storage
    const saveBtn = settingsTab.querySelector(".btn-success");
    saveBtn.addEventListener("click", () => {
      const settingsObject = {
        curWeight: myCurWeight.value,
        barW: barWeight.value,
        alarm: tens.value + tead.value,
        pat: pat.value,
      };
      localStorage.setItem("settings", JSON.stringify(settingsObject));
      settingsBox.insertAdjacentHTML(
        "beforeend",
        `
      <div class="pl-5 animated fadeIn bg-light w-100 text-success"> Settings Saved (changes will apply after reloading) </div>
      `
      );
    });
  }
  alertSampleTest(settingsBox) {
    const setting = settingsBox.querySelector("#tens");
    const sampleBtn = setting.querySelector(".btn-primary");
    const select = sampleBtn.previousElementSibling;
    sampleBtn.addEventListener("click", () => {
      const value = select.value + "3_seconds";
      const audio = document.createElement("audio");
      audio.setAttribute("src", `./sounds/${value}.mp3`);
      audio.play();
    });
  }
}
class Workout {
  constructor(name, id, exercises, targetReps, sets) {
    this.name = name;
    this.id = id;
    this.exercises = exercises;
    this.targetReps = targetReps;
    this.sets = sets;
  }
}
class WorkoutList {
  constructor(shouldRender = true) {
    this.workoutsList = [];
    this.allWorkouts();
    if (shouldRender) {
      this.render();
    }
  }
  allWorkouts() {
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).includes("workout")) {
        let workout = JSON.parse(localStorage.getItem(localStorage.key(i)));
        workout.sets = workout.sets.map(Number);
        this.workoutsList.push(workout);
      }
    }
  }
  render(all = this.workoutsList) {
    if (!all) {
      return;
    }
    const renderStartPoint = document.getElementById("workout-0");
    for (const workout of all) {
      for (const key in workout) {
        if (key === "name") {
          renderStartPoint.insertAdjacentHTML(
            "afterend",
            `
          <div id="workout-${workout.id}" class="d-none workout">
          <div class="container">
            <div class="workout-name">
              <h1 class="pb-3 text-primary text-center workout-name">${workout[key]}</h1>
              <div class="mx-auto workout-options btn-toolbar pb-4">
                <div class="d-flex flex-wrap btn-group">
                <button class="btn btn-primary"><i class="fas fa-balance-scale-right"></i> Convert to lbs</button>
                <button class="btn btn-primary"><i class="fas fa-balance-scale-left"></i> Convert to Kg</button>
                <button class="btn btn-primary"><i class="fas fa-heartbeat"></i> Warm-up</button>
                <button class="btn btn-primary"><i class="fas fa-list-ul fa-rotate-180"></i> Save Log</button>
                <button class="btn btn-primary"><i class="fas fa-sticky-note"></i> Notes</button>
                 </div>
              </div>
            </div>
            <div id="workout-window" class="w-75 mx-auto">
              <ul class="workout-list">
                <ul class="warm-up">
                  <li class="warm-up-head text-center">Warm-up</li>
                  <li class="warm-up-set">1st(12 Reps - 50%): </li>
                  <li class="warm-up-set">2nd(8 Reps - 50%): </li>
                  <li class="warm-up-set">3rd(3-4 Reps - 70%): </li>
                  <li class="warm-up-set">4th(1 Rep - 90%): </li>
               </ul>
                <div class="d-none wnote">
                  <div>
                    <h5 class="d-block"> Workout Notes </h5>
                  </div>
                  <textarea></textarea>
                </div> 
              </ul>
              <small class="total-volume">
              <button type="button" class="btn btn-info" data-toggle="tooltip" data-placement="top"
              title="Resistance Bands or BodyWeight exercises are NOT included in total volume">
              <i class="fas fa-info"></i>
              </button>
              Total workout volume  : <span class="total-volume-display"></span> KG
              </small>
              <hr>
            </div>
          </div>
        </div>
          `
          );
        } else if (key === "exercises") {
          let workoutIdFollower = document
            .getElementById(`workout-${workout.id}`)
            .querySelector(".workout-list");
          const getYoutubeUrl = (i) => {
            let u = workout[key][i].split(" ");
            return u.join("+");
          };
          for (let i = 0; i < workout[key].length; i++) {
            workoutIdFollower.insertAdjacentHTML(
              "beforeend",
              `
            <ul class="exercise">
              <li class="exercise-name">
              <a target="_blank" href="https://www.youtube.com/results?search_query=How+To+${getYoutubeUrl(
                i
              )}">
              ${workout[key][i]}
              </a>
              <span class="exercise-target-reps"></span></li>
            </ul>
            `
            );
          }
        } else if (key === "targetReps") {
          let workoutIdFollower2 = document
            .getElementById(`workout-${workout.id}`)
            .querySelectorAll(".exercise-target-reps");
          for (let i = 0; i < workoutIdFollower2.length; i++) {
            workoutIdFollower2[i].insertAdjacentHTML(
              "beforeend",
              `
               - ${workout[key][i]}
            `
            );
          }
        } else if (key === "sets") {
          let exerciseSetsFollower = document
            .getElementById(`workout-${workout.id}`)
            .querySelectorAll(".exercise");
          for (let i = 0; i < workout.exercises.length; i++) {
            for (let j = 0; j < workout.sets[i]; j++) {
              exerciseSetsFollower[i].insertAdjacentHTML(
                "beforeend",
                `
                  <li class="set">
                  Weight: <input type="number"> Band: <input type="text"> Reps: <input type="number">
                  <button tabindex="-1" class="shadow-sm btn-sm btn-outline-secondary">
                  <i class="fas fa-check"></i>
                  </button>
                  <div class="d-block d-md-inline set-log">
                    <span class="reps-display">
                      <span class="reps-display-value"></span>
                    </span>
                    <span class="mx-md-0 mx-1 band-display">
                      <span class="band-display-value"></span>
                    </span>
                    <span class="weight-display">
                      <span class="weight-display-value"></span>
                    </span>
                  </div>
                  </li>
                  `
              );
            }
          }
        }
      }
    }
  }
}
class Tools {
  constructor() {
    this.settings = Settings.settings;
    this.tools = document.querySelector("#tools");
    this.lbsToKgCalc(this.tools);
    this.barbellSetupCalc(this.tools);
    this.bodyWeightExerciseCalc(this.tools);
    this.totalWeightCalc(this.tools);
  }
  static userBands = [
    { name: "Blue RB", arv: 4.5 },
    { name: "Red RB", arv: 10 },
    { name: "Black RB", arv: 18 },
    { name: "Purple RB", arv: 27 },
    { name: "Green RB", arv: 39 },
  ];
  lbsToKgCalc(tools) {
    const calc = tools.querySelector("#lbs-to-kg-calc");
    const lbsInput = calc.querySelector("input");
    const kgInput = calc.querySelector("#ltkck");
    lbsInput.addEventListener("input", (e) => {
      if (!lbsInput.value) {
        kgInput.value = kgInput.placeholder;
      } else {
        kgInput.value = (Number(lbsInput.value) / 2.205).toFixed(1);
      }
    });
    kgInput.addEventListener("input", (e) => {
      if (!kgInput.value) {
        lbsInput.value = kgInput.placeholder;
      } else {
        lbsInput.value = (Number(kgInput.value) * 2.205).toFixed(1);
      }
    });
  }
  barbellSetupCalc(tools) {
    const calc = tools.querySelector("#barbell-setup-calc");
    const inputs = calc.querySelectorAll("input");
    const [weight, percentage, barWeight] = inputs;
    barWeight.value = this.settings.barW;
    const resultDisplay = calc.querySelector("#result-each-side");
    for (const input of inputs) {
      input.addEventListener("input", () => {
        if (!weight.value) {
          resultDisplay.textContent = "";
        } else if (percentage.value == "" || barWeight.value == "") {
          resultDisplay.textContent = "Make sure all fields are set!";
        } else {
          let i =
            Number(
              weight.value * (percentage.value * 0.01).toFixed(1) -
                barWeight.value
            ) / 2;
          let result = "Result: " + i + "Kg Each Side";
          resultDisplay.textContent = result;
        }
      });
    }
  }
  bodyWeightExerciseCalc(tools) {
    const calc = tools.querySelector("#body-weight-exercise-calc");
    const inputs = calc.querySelectorAll("input");
    const select = calc.querySelector("select");
    const [addedWeightInput, percentageInput, yourWeightInput] = inputs;
    yourWeightInput.value = this.settings.curWeight;
    const resultDisplay = calc.querySelector("#bwec-result-display");
    const calculateBtn = calc.querySelector("#calculate");
    addedWeightInput.addEventListener("input", () => {
      if (addedWeightInput.value === "") {
        resultDisplay.textContent = "";
      }
    });
    calculateBtn.addEventListener("click", () => {
      const bodyWeightLiftedOnly =
        Number(yourWeightInput.value) * Number(select.value);
      let result = (
        (Number(yourWeightInput.value) * Number(select.value) +
          Number(addedWeightInput.value)) *
          (Number(percentageInput.value) * 0.01) -
        bodyWeightLiftedOnly
      ).toFixed(1);
      if (Math.sign(result) === 1) {
        resultDisplay.textContent = `You need to add ${result} Kg`;
      } else if (Math.sign(result) === -1) {
        // Generate All The Bands Data
        const rbDataArray = [];
        let limiter = 1;
        let string = "";
        for (const rbObject of Tools.userBands) {
          for (const key in rbObject) {
            if (limiter === 2) {
              const value = rbObject[key];
              string += " Average Resistance " + value + " Kg";
              rbDataArray.push(string);
              string = "";
              limiter = 0;
            } else {
              const value = rbObject[key];
              string += value + " ";
            }
            limiter++;
          }
        }
        function generateOptions() {
          let optionsHTML = "";
          for (let i = 0; i < rbDataArray.length; i++) {
            optionsHTML += `<option>${rbDataArray[i]}</option>`;
          }
          return optionsHTML;
        }
        result = result * -1;
        resultDisplay.innerHTML = `You need to <strong>decrease</strong> The Resistance in ${result} Kg with assistance Band:
          <p><select>
          ${generateOptions()}
          </select>
          `;
      }
    });
  }
  totalWeightCalc(tools) {
    const calc = tools.querySelector("#total-weight-calc");
    const inputs = calc.getElementsByTagName("input");
    const [weight, barbellW] = inputs;
    const resultDisplay = calc.querySelector("#total-weight-calc-result");
    barbellW.value = this.settings.barW;
    weight.addEventListener("input", () => {
      const result = Number(weight.value) * 2 + Number(barbellW.value);
      resultDisplay.textContent = `Total Barbell Weight is: ${result} Kg`;
      if (weight.value === "") {
        resultDisplay.textContent = "";
      }
    });
  }
}
class Navbar {
  constructor() {
    this.navbar = document.querySelector("#navbar-main");
    this.navbarLeft = this.navbar.querySelector("ul");
    this.navbarRight = this.navbar.querySelector("#navbar-right");
    this.myplanBtn = this.navbarLeft.querySelector("li");
    this.toolsBtn = this.navbarRight.querySelector("li");
    this.toolsIsOpen = false;
    this.myplanIsOpen = false;
    this.toggleTools(this.toolsBtn, this.myplanBtn);
    this.toggleMyPlan(this.myplanBtn, this.toolsBtn);
  }
  toggleTools(btn, btn2) {
    const toolsDomDiv = document.getElementById("tools");
    btn.addEventListener("click", (e) => {
      if (this.myplanIsOpen) {
        btn2.click();
      }
      if (!this.toolsIsOpen) {
        btn.style.background = "rgba(70, 85, 131, 0.5)";
        toolsDomDiv.classList.remove("slideOutUp");
        toolsDomDiv.classList.add("slideInDown");
        toolsDomDiv.classList.remove("d-none");
        // change status to open
        this.toolsIsOpen = true;
      } else if (this.toolsIsOpen) {
        toolsDomDiv.classList.add("slideOutUp");
        setTimeout(function () {
          toolsDomDiv.classList.add("d-none");
          btn.style.background = "#343a40";
        }, 700);
        // change status to closed
        this.toolsIsOpen = false;
      }
    });
    new Tools();
  }
  toggleMyPlan(btn, btn2) {
    const myplanDomDiv = document.getElementById("myplan");
    btn.addEventListener("click", (e) => {
      if (this.toolsIsOpen) {
        btn2.click();
      }
      if (!this.myplanIsOpen) {
        btn.style.background = "rgba(70, 85, 131, 0.5)";
        myplanDomDiv.classList.remove("slideOutUp");
        myplanDomDiv.classList.add("slideInDown");
        myplanDomDiv.classList.remove("d-none");
        // change status to open
        this.myplanIsOpen = true;
      } else if (this.myplanIsOpen) {
        myplanDomDiv.classList.add("slideOutUp");
        setTimeout(function () {
          myplanDomDiv.classList.add("d-none");
          btn.style.background = "#343a40";
        }, 700);
        // change status to closed
        this.myplanIsOpen = false;
      }
    });
  }
}
class MyPlan extends WorkoutList {
  constructor() {
    super(false);
    this.tpMain = document.getElementById("tp-main");
    this.renderPrograms(this.tpMain);
    this.trainingProgramManager(this.tpMain);
    this.notesManager();
    this.userPlaylists();
    this.myWorkouts();
  }
  static autocomplete = (inp, arr) => {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
      var a,
        b,
        i,
        val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) {
        return false;
      }
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function (e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[0].value;
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) {
        //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = x.length - 1;
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  };
  renderPrograms(tpMain) {
    const renderProgram = (program, isCurrent = "") => {
      const p = document.createElement("div");
      p.classList.add("row", "training-program");
      p.innerHTML = `
      <div class="col-md-2 program-name ${isCurrent}">
                    <id class="invisible">${program.id}</id>
                    <div class="content">
                      <p>
                        ${program.name}
                      </p>
                    </div>
                  </div>
                  <div class="col-md mon day">
                    <div class="content">
                    <button class="btn btn-warning">${program.mon.workout}</button>
                    <p>${program.mon.notes}</p>
                    </div>
                  </div>
                  <div class="col-md tues day">
                    <div class="content">
                    <button class="btn btn-warning">${program.tues.workout}</button>
                    <p>${program.tues.notes}</p>
                    </div>
                  </div>
                  <div class="col-md wed day">
                    <div class="content">
                    <button class="btn btn-warning">${program.wed.workout}</button>
                    <p>${program.wed.notes}</p>
                    </div>
                  </div>
                  <div class="col-md thurs day">
                    <div class="content">
                    <button class="btn btn-warning">${program.thurs.workout}</button>
                    <p>${program.thurs.notes}</p>
                    </div>
                  </div>
                  <div class="col-md fri day">
                    <div class="content">
                    <button class="btn btn-warning">${program.fri.workout}</button>
                    <p>${program.fri.notes}</p>
                    </div>
                  </div>
                  <div class="col-md sat day">
                    <div class="content">
                    <button class="btn btn-warning">${program.sat.workout}</button>
                    <p>${program.sat.notes}</p>
                    </div>
                  </div>
                  <div class="col-md sun day">
                    <div class="content">
                    <button class="btn btn-warning">${program.sun.workout}</button>
                    <p>${program.sun.notes}</p>
                    </div>
                  </div>
      `;
      // wd = workout days
      const wd = p.querySelectorAll(".day button");
      for (const day of wd) {
        day.addEventListener("click", () => {
          if (day.textContent === "Rest Day") {
            return;
          } else {
            // wn = workout name
            const wn = day.textContent;
            for (const workout of this.workoutsList) {
              if (workout.name === wn) {
                // wi = workout id
                const wi = workout.id;
                const workoutEl = document.querySelector(`#workout-${wi}`);
                workoutEl.classList.remove("d-none");
                new Log(workoutEl);
              }
            }
          }
        });
      }
      renderStartPoint.insertAdjacentElement("afterend", p);
    };
    const renderStartPoint = tpMain.querySelector("#tp-days");
    const programs = [];
    // fill programs array with program objects from local storage
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).includes("program")) {
        const p = JSON.parse(localStorage.getItem(localStorage.key(i)));
        programs.push(p);
      }
    }

    // Render Programs
    for (const program of programs) {
      if (program.isCurrent) {
        renderProgram(program, "current");
        const curProgram = document.querySelector(".current").parentElement;
        this.renderTodayWorkout(curProgram);
      } else {
        renderProgram(program);
      }
    }
  }
  trainingProgramManager(tpMain) {
    //---- add program Modal ----
    const addProgramModal = document.getElementById("add-program-modal");
    // add program modal inputs + Save program btn + event Listener
    const nameInput = addProgramModal.querySelector(".modal-body #pname");
    const addProgModBtn = addProgramModal.querySelector("#save-program");
    const workoutInputs = addProgramModal.querySelectorAll(".workout-input");
    const notesInputs = addProgramModal.querySelectorAll(".notes input");
    // add program button (the first btn under the programs table)
    const addProgramBtn = tpMain.querySelector(".fa-plus-square").parentElement;
    const restCB = addProgramModal.querySelectorAll(".rests input");
    for (const cb of restCB) {
      cb.addEventListener("input", () => {
        const id = cb.id.split("r")[1];
        if (cb.checked) {
          const wi = addProgramModal.querySelector(`#wid${id}`);
          wi.value = "Rest Day";
          wi.setAttribute("disabled", "");
        } else {
          const wi = addProgramModal.querySelector(`#wid${id}`);
          wi.value = "";
          // wi.setAttribute('disabled', '');
          wi.removeAttribute("disabled");
        }
      });
    }
    addProgramBtn.addEventListener(
      "click",
      () => {
        // Push Workout Names To get autoComplete values
        const autoCompleteArr = [];
        // wn = workouts names
        const workoutH1El = document.querySelectorAll(".workout h1");
        for (const h of workoutH1El) {
          autoCompleteArr.push(h.textContent);
        }
        // apply auto complete to all relevant inputs
        for (const input of workoutInputs) {
          MyPlan.autocomplete(input, autoCompleteArr);
        }
      },
      { once: true }
    );
    // add Save Program Btn add Event Listener
    addProgModBtn.addEventListener(
      "click",
      this.addProgram.bind(
        this,
        nameInput,
        workoutInputs,
        notesInputs,
        tpMain,
        addProgramModal
      )
    );
    //------- remove Programs functionality ------
    const delProgramBtn = tpMain.querySelector(".fa-minus-square")
      .parentElement;
    delProgramBtn.onclick = () => {
      console.log("hey");
      const programs = tpMain.querySelectorAll(".training-program");
      const programNames = tpMain.querySelectorAll(
        ".training-program .program-name"
      );
      // undo option
      const cancelBtn = document.createElement("button");
      cancelBtn.classList.add("btn", "btn-sm", "btn-danger", "ml-3");
      cancelBtn.textContent = "cancel";
      delProgramBtn.insertAdjacentElement("afterend", cancelBtn);
      cancelBtn.addEventListener(
        "click",
        () => {
          for (const p of programs) {
            p.remove();
          }
          this.renderPrograms(tpMain);
          cancelBtn.remove();
          return;
        },
        { once: true }
      );
      // delete function
      const removeProgram = (e) => {
        if (e.target.className.includes("program-name")) {
          const pName = e.target.querySelector("p").textContent;
          // remove program from storage
          for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).includes("program")) {
              const p = JSON.parse(localStorage.getItem(localStorage.key(i)));
              if (p.name == pName.trim()) {
                localStorage.removeItem(localStorage.key(i));
              }
            }
          }
          // remove program visually and render back
          for (const p of programs) {
            p.remove();
          }
          cancelBtn.remove();
          this.renderPrograms(tpMain);
        }
      };
      for (const program of programNames) {
        program.classList.toggle("ready-to-delete");
        program.onclick = (e) => removeProgram(e);
      }
    };
    // set current program functionality
    const programNames = tpMain.querySelectorAll(".program-name .content p");
    for (const btn of programNames) {
      btn.onclick = (e) => {
        function changeProgramCurrentStatus(isCurrent, programId) {
          const programObject = JSON.parse(
            localStorage.getItem(`program-${programId}`)
          );
          if (!isCurrent) {
            programObject.isCurrent = "current";
            localStorage.setItem(
              `program-${programId}`,
              JSON.stringify(programObject)
            );
          } else {
            programObject.isCurrent = "";
            localStorage.setItem(
              `program-${programId}`,
              JSON.stringify(programObject)
            );
          }
        }
        const programEl = e.target.closest(".program-name");
        let programId = Number(programEl.querySelector("id").textContent);
        if (programEl.className.includes("current")) {
          programEl.classList.remove("current");
          changeProgramCurrentStatus(true, programId);
        } else {
          programEl.classList.add("current");
          changeProgramCurrentStatus(false, programId);
        }
      };
    }
  }
  renderTodayWorkout(curProgram) {
    const days = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
    const d = new Date();
    const dayName = days[d.getDay()];
    // tw = todays workout
    const tw = curProgram.querySelector(`.${dayName}`);
    const twBtn = tw.querySelector("button");
    twBtn.click();
  }
  addProgram(nameInput, workoutInputs, notesInputs, tpMain, addProgramModal) {
    // get Program id
    let id = 0;
    do {
      id++;
    } while (localStorage.getItem(`program-${id}`));
    const renderStartingPoint = tpMain.firstElementChild;
    let isCurrent = addProgramModal.querySelector("#currentP").checked;
    if (isCurrent) {
      isCurrent = "current";
    } else {
      isCurrent = "";
    }
    const newProgramEl = document.createElement("div");
    newProgramEl.classList.add("training-program", "row");
    newProgramEl.innerHTML = `
                  <div class="col-2 program-name ${isCurrent}">
                    <id class="invisible">${id}</id> 
                    <div class="content">
                      <p>
                        ${nameInput.value}
                      </p>
                    </div>
                  </div>
                  <div class="col mon day">
                    <div class="content">
                    <button class="btn btn-warning myplanworkout">${workoutInputs[0].value}</button>
                    <p>${notesInputs[0].value}</p>
                    </div>
                  </div>
                  <div class="col tues day">
                    <div class="content">
                    <button class="btn btn-warning myplanworkout">${workoutInputs[1].value}</button>
                    <p>${notesInputs[1].value}</p>
                    </div>
                  </div>
                  <div class="col wed day">
                    <div class="content">
                    <button class="btn btn-warning myplanworkout">${workoutInputs[2].value}</button>
                    <p>${notesInputs[2].value}</p>
                    </div>
                  </div>
                  <div class="col thurs day">
                    <div class="content">
                    <button class="btn btn-warning myplanworkout">${workoutInputs[3].value}</button>
                    <p>${notesInputs[3].value}</p>
                    </div>
                  </div>
                  <div class="col fri day">
                    <div class="content">
                    <button class="btn btn-warning myplanworkout">${workoutInputs[4].value}</button>
                    <p>${notesInputs[4].value}</p>
                    </div>
                  </div>
                  <div class="col sat day">
                    <div class="content">
                    <button class="btn btn-warning myplanworkout">${workoutInputs[5].value}</button>
                    <p>${notesInputs[5].value}</p>
                    </div>
                  </div>
                  <div class="col sun day">
                    <div class="content">
                    <button class="btn btn-warning myplanworkout">${workoutInputs[6].value}</button>
                    <p>${notesInputs[6].value}</p>
                    </div>
                  </div>
    `;
    // create new program data object
    const programObject = {
      name: nameInput.value,
      isCurrent: isCurrent,
      id: id,
      mon: {
        workout: workoutInputs[0].value,
        notes: notesInputs[0].value,
      },
      tues: {
        workout: workoutInputs[1].value,
        notes: notesInputs[1].value,
      },
      wed: {
        workout: workoutInputs[2].value,
        notes: notesInputs[2].value,
      },
      thurs: {
        workout: workoutInputs[3].value,
        notes: notesInputs[3].value,
      },
      fri: {
        workout: workoutInputs[4].value,
        notes: notesInputs[4].value,
      },
      sat: {
        workout: workoutInputs[5].value,
        notes: notesInputs[5].value,
      },
      sun: {
        workout: workoutInputs[6].value,
        notes: notesInputs[6].value,
      },
    };
    localStorage.setItem(`program-${id}`, JSON.stringify(programObject));
    renderStartingPoint.insertAdjacentElement("afterend", newProgramEl);
    // after program added -close- Modal
    addProgramModal.querySelector("button").click();
  }
  notesManager() {
    const notesMain = document.querySelector("#collapseTwo");
    const editor = notesMain.querySelector("#editor");
    const editorContainer = editor.parentElement;
    // if there is notes content saved render it
    if (localStorage.getItem("notesContent")) {
      const data = localStorage.getItem("notesContent");
      editorContainer.innerHTML = localStorage.getItem("notesContent");
    }
    // activate ckeditor on the -updated- data
    InlineEditor.create(document.querySelector("#editor")).catch((error) => {
      console.error(error);
    });
    // save notes functionality
    const saveNotesBtn = notesMain.querySelector("button");
    saveNotesBtn.addEventListener("click", () => {
      const data = editorContainer.innerHTML;
      localStorage.setItem("notesContent", data);
    });
  }
  userPlaylists() {
    const playlistsBtn = document
      .querySelector("#myplan")
      .querySelector("#music")
      .querySelectorAll(".playlist");
    const [playList1, playList2, playList3] = playlistsBtn;
    const setPlaylistModal = document.getElementById("setPlaylistModal");
    const inputs = setPlaylistModal.querySelectorAll("input");
    const doneBtn = setPlaylistModal
      .querySelector(".modal-footer")
      .querySelector("button");
    const [plIn1, plIn2, plIn3] = inputs;
    for (let i = 0; i < 3; i++) {
      if (localStorage.getItem(`playList-${i}`)) {
        playlistsBtn[i].setAttribute(
          "href",
          localStorage.getItem(`playList-${i}`)
        );
      }
    }
    doneBtn.addEventListener("click", () => {
      inputs.forEach((input, i) => {
        if (input.value === "") {
          playlistsBtn[i].removeAttribute("href");
          localStorage.removeItem(`playList-${i}`);
        } else {
          playlistsBtn[i].setAttribute("href", input.value);
          localStorage.setItem(`playList-${i}`, input.value);
        }
      });
    });
  }
  myWorkouts() {
    const myWorkoutsMain = document.querySelector("#collapseThree .card-body");
    // edit Workout function
    const editWorkout = (
      workout,
      workoutEl,
      editBtn,
      addEx,
      delEx,
      exs,
      sts,
      trs,
      controls
    ) => {
      // Start: Edit function Main
      editBtn.textContent = "Done";
      editBtn.classList.remove("btn-warning");
      editBtn.classList.add("btn-success");
      // make data into inputs
      const data = workoutEl.querySelectorAll("[data-w]");
      for (const d of data) {
        d.innerHTML = `<input value="${d.textContent}" type="text">`;
      }
      // Delete and Add exercises
      // add exercises functionality
      addEx.classList.remove("d-none");
      addEx.addEventListener("click", () => {
        controls.insertAdjacentHTML(
          "beforebegin",
          `
        <div data-w class="mp-exercise">
        <input type="text">
        </div>
        `
        );
        sts.insertAdjacentHTML(
          "beforeend",
          `
        <div data-w class="mp-set">
        <input type="text">
        </div>
        `
        );
        trs.insertAdjacentHTML(
          "beforeend",
          `
        <div data-w class="mp-tr">
        <input type="text">
        </div>
        `
        );
      });
      // delete exercises functionality
      delEx.classList.remove("d-none");
      delEx.addEventListener("click", () => {
        controls.previousElementSibling.remove();
        sts.lastElementChild.remove();
        trs.lastElementChild.remove();
      });
      // save the new workout
      editBtn.addEventListener(
        "click",
        () => {
          const _name = workoutEl.querySelector("[data-w] input").value;
          // Get all Exercises
          const es = exs.querySelectorAll("[data-w] input");
          const _exercises = [];
          for (const e of es) {
            const _e = e.value;
            _exercises.push(_e);
          }
          // Get all sets
          const sets = sts.querySelectorAll("[data-w] input");
          const _sets = [];
          for (const s of sets) {
            const _s = s.value;
            _sets.push(_s);
          }
          // Get all notes
          const notes = trs.querySelectorAll("[data-w] input");
          const _notes = [];
          for (const n of notes) {
            const _n = n.value;
            _notes.push(_n);
          }
          const editedWorkout = {
            name: _name,
            id: workout.id,
            exercises: [..._exercises],
            sets: [..._sets],
            targetReps: [..._notes],
            log: workout.log,
          };
          //  save the new workout to storage
          localStorage.setItem(
            `workout-${workout.id}`,
            JSON.stringify(editedWorkout)
          );
          workoutEl.insertAdjacentHTML(
            "afterend",
            `
          <div id="edit-alert" class="animated fadeInLeft">
              <p> <i class="fas fa-exclamation-circle"></i> Please Note: Changes will apply <strong>only</strong> after app restart</p>
          </div>
        `
          );
          setTimeout(() => {
            // ea = edit alert
            const ea = document.querySelector("#edit-alert");
            ea.remove();
          }, 5000);
          addEx.classList.add("d-none");
          delEx.classList.add("d-none");
          editBtn.innerHTML = "<i class='fas fa-edit white'></i>";
          editBtn.classList.remove("btn-success");
          editBtn.classList.add("btn-warning");
        },
        { once: true }
      );
    };
    // delete Workout function
    const deleteWorkout = (workout, workoutEl) => {
      workoutEl.insertAdjacentHTML(
        "afterend",
        `
          <div id="delete-alert" class="animated fadeIn">
          <p class="animated flash"> <i class="fas fa-exclamation-circle"></i> Please Note: Changes will apply after app restarts</p>
              <p> <i class="fas fa-exclamation-circle"></i> Are you sure you want do delete this workout?</p>
              <div>
              <button class="btn btn-success">Yes</button>
              <button class="btn btn-danger">No</button>
          </div>
          </div>
        `
      );
      const delAlert = workoutEl.nextElementSibling;
      const cancelBtn = delAlert.querySelector(".btn-danger");
      const yesBtn = delAlert.querySelector(".btn-success");
      cancelBtn.addEventListener(
        "click",
        () => {
          delAlert.remove();
        },
        { once: true }
      );
      yesBtn.addEventListener(
        "click",
        () => {
          // Remove Workout from local storage
          localStorage.removeItem(`workout-${workout.id}`);
          workoutEl.remove();
          delAlert.remove();
        },
        { once: true }
      );
    };
    for (const workout of this.workoutsList) {
      const workoutEl = document.createElement("div");
      workoutEl.classList.add("row", "mp-workout");
      // get the basic workout structure
      workoutEl.innerHTML = `
      <div data-w data-workout-xs class="col-8 col-md-3">${workout.name}</div>
      <div class="mp-exrs col-md-3">
        
      </div>
      <div class="mp-sts col-md-1">     
      </div>
      <div class="mp-trs col-md-3">
      </div>
      <div class="col-md-1"><button class="btn btn-warning"><i class="fas fa-edit white"></i></button></div>
      <div class="col-md-1"><button class="btn btn-danger"><i class="fas fa-trash-alt"></i></button></div>
      `;
      // exrs = exercises , insert exercises + add exercise btn
      const exs = workoutEl.querySelector(".mp-exrs");
      for (const e of workout.exercises) {
        exs.insertAdjacentHTML(
          "beforeend",
          `
          <div data-w class="mp-exercise">${e}</div>
        `
        );
      }
      // add the add and remove exericses Btn
      exs.insertAdjacentHTML(
        "beforeend",
        `<div class="d-block controls">
          <button class=" d-none btn btn-success py-0 px-1">
            <i class="fas fa-plus"></i>
          </button>
          <button class=" d-none btn btn-danger py-0 px-1">
            <i class="fas fa-minus"></i>
          </button>
        </div>`
      );
      const controls = exs.querySelector(".controls");
      const addExrBtn = controls.querySelector(".btn-success");
      const delExrBtn = controls.querySelector(".btn-danger");
      // sts = sets ,  insert sets
      const sts = workoutEl.querySelector(".mp-sts");
      for (const s of workout.sets) {
        sts.insertAdjacentHTML(
          "beforeend",
          `
          <div data-w class="mp-set">${s}</div>
        `
        );
      }
      // trs = target reps ,  insert Target reps / notes
      const trs = workoutEl.querySelector(".mp-trs");
      for (const n of workout.targetReps) {
        trs.insertAdjacentHTML(
          "beforeend",
          `
          <div data-w class="mp-tr">${n}</div>
        `
        );
      }
      // wEditBtn = workout edit button (Dom select + addEvntLst)
      const wEditBtn = workoutEl.querySelector(".btn-warning");
      wEditBtn.addEventListener(
        "click",
        editWorkout.bind(
          null,
          workout,
          workoutEl,
          wEditBtn,
          addExrBtn,
          delExrBtn,
          exs,
          sts,
          trs,
          controls
        ),
        { once: true }
      );
      const wDelBtn = workoutEl.lastElementChild.querySelector(".btn-danger");
      wDelBtn.addEventListener(
        "click",
        deleteWorkout.bind(null, workout, workoutEl)
      );
      myWorkoutsMain.append(workoutEl);
    }
  }
}
class Timers {
  constructor() {
    this.timersUl = document.getElementById("timers");
    this.settings = Settings.settings;
    this.renderTimers(this.timersUl);
    this.prepareTimers();
    this.addTimer();
    this.deleteTimer(this.timersUl);
    this.timersInitialDurations = this.resetTimerDataHolder(this.timersUl);
    this.countDownFollower = [];
  }
  renderTimers(timersUl) {
    for (let i = 1; i < 9; i++) {
      if (localStorage.getItem(`timer-${i}`)) {
        const tDiv = timersUl.querySelector(`#timer-${i}`);
        tDiv.innerHTML = localStorage.getItem(`timer-${i}`);
      }
    }
  }
  prepareTimers() {
    const timersDiv = document.getElementById("timers");
    const preAlarm = timersDiv.querySelector("#pre-alarm");
    preAlarm.setAttribute(
      "src",
      `../dist/sounds/${this.settings.pat}sec_left.mp3`
    );
    const notification = timersDiv.querySelector("#notification");
    notification.setAttribute(
      "src",
      `../dist/sounds/${this.settings.alarm}.mp3`
    );
    this.timersUl.addEventListener("click", (e) => {
      // ------- Play Timer -------
      if (e.target.className === "fas fa-play") {
        const timer = e.target.closest("li");
        let countDown;
        const timeDisplay = timer.querySelector(".timer-display");
        const splitedTimeLogs = timeDisplay.textContent.split(":");
        const [hours, minutes, secs] = splitedTimeLogs.map(Number);
        const seconds = hours * 3600 + minutes * 60 + secs;
        const now = Date.now();
        const then = now + seconds * 1000;
        displayTimeLeft(seconds);
        // moving the progress Bar
        const progressBar = timer.querySelector(".progress-bar");
        // setInterval Function (The Function runs the timer)
        const capturedProBarWidth = Number(
          progressBar.getAttribute("style").split(/:|%/)[1]
        );
        countDown = setInterval(() => {
          const secondsLeft = Math.round((then - Date.now()) / 1000);
          // Check if we should stop it!
          if (secondsLeft < 0) {
            clearInterval(countDown);
            notification.play();
            timer.classList.remove("running");
            const timerNumber = Number(timer.id.split("-")[1]);
            timeDisplay.textContent = this.timersInitialDurations[
              timerNumber - 1
            ];
            progressBar.setAttribute("style", "width: 100%;");
            return;
          } else if (secondsLeft == this.settings.pat) {
            preAlarm.play();
          }
          let x = (capturedProBarWidth * secondsLeft) / seconds;
          progressBar.setAttribute("style", `width: ${x}%`);
          // display it
          displayTimeLeft(secondsLeft);
        }, 1000);
        function displayTimeLeft(seconds) {
          const hours = Math.floor(seconds / 3600);
          const remainderSeconds = seconds % 60;
          const minutes = Math.floor(seconds / 60) % 60;
          const display = `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
            remainderSeconds < 10 ? "0" : ""
          }${remainderSeconds}`;
          timeDisplay.textContent = display;
        }
        const countDownObject = { timerId: timer.id, countId: countDown };
        this.countDownFollower.push(countDownObject);
        timer.classList.add("running");
        timer.classList.remove("paused");
      }
      // ------- Pause Timer -------
      else if (e.target.className === "fas fa-pause") {
        const timer = e.target.closest("li");
        for (let i = 0; i < this.countDownFollower.length; i++) {
          if (this.countDownFollower[i].timerId === timer.id) {
            clearInterval(this.countDownFollower[i].countId);
            this.countDownFollower.splice(i, 1);
          }
        }
        timer.classList.add("paused");
      }
      // ------- Reset Timer -------
      else if (e.target.className === "fas fa-reply") {
        const timer = e.target.closest("li");
        // find the right setInterval id and stop counting
        for (let i = 0; i < this.countDownFollower.length; i++) {
          if (this.countDownFollower[i].timerId === timer.id) {
            clearInterval(this.countDownFollower[i].countId);
            this.countDownFollower.splice(i, 1);
          }
        }
        const progressBar = timer.querySelector(".progress-bar");
        timer.classList.remove("running", "paused");
        const display = timer.querySelector(".timer-display");
        progressBar.setAttribute("style", "width: 100%");
        const timerNumber = Number(timer.id.split("-")[1]);
        display.textContent = this.timersInitialDurations[timerNumber - 1];
      }
    });
  }
  addTimer() {
    const list = document.getElementById("timers");
    const addTimerModal = document.getElementById("add-timer-modal");
    const addTimerModalBtn = addTimerModal.querySelector("#modal-add-timer");
    const allTimers = list.getElementsByClassName("timer");
    let reservedTimersNum = list.getElementsByClassName("timer").length;
    const timerNameInput = addTimerModal.querySelector("#timer-name");
    const timerInputs = addTimerModal.querySelectorAll("#durations input");
    const [hInput, mInput, sInput] = timerInputs;
    const validErrorNote = document.createElement("span");
    const validErrorCon = addTimerModal.querySelector("small");
    function showValidationError(vErrCon, vErrNote, message, ...inputs) {
      vErrNote.innerHTML = message;
      vErrCon.append(vErrNote);
      vErrNote.classList.remove("fadeOut");
      vErrNote.classList.add("animated", "fadeIn");
      for (const input of inputs) {
        input.classList.add("input-not-valid");
      }
      setTimeout(function () {
        vErrNote.classList.remove("fadeIn");
        vErrNote.classList.add("fadeOut");
        vErrNote.textContent = "";
        for (const input of inputs) {
          input.classList.remove("input-not-valid");
        }
      }, 5000);
    }
    // check what timer Id is open (empty)
    addTimerModalBtn.addEventListener("click", () => {
      let [H, M, S] = timerInputs;
      // collect Data
      H = H.value.length === 0 ? "0" : H.value;
      M =
        M.value.length === 0
          ? "00"
          : M.value.length === 1
          ? "0" + M.value
          : M.value;
      S =
        S.value.length === 0
          ? "00"
          : S.value.length === 1
          ? "0" + S.value
          : S.value;
      const timerDurationString = H + ":" + M + ":" + S;
      // Form validations
      if (M.length > 2 || S.length > 2 || Number(M) > 59 || Number(S) > 59) {
        const message =
          "* Minutes & seconds values must be between 0-59 (Max of 2 digits allowed)";
        showValidationError(
          validErrorCon,
          validErrorNote,
          message,
          mInput,
          sInput
        );
        return;
      } else if (Number(H) > 9) {
        const message = "* Max <strong>Hours</strong> Value is 9";
        showValidationError(validErrorCon, validErrorNote, message, hInput);
        return;
      } else if (!timerNameInput.value) {
        const message = "* Timer Name Is <strong>Required</strong>";
        showValidationError(
          validErrorCon,
          validErrorNote,
          message,
          timerNameInput
        );
        return;
      } else if (reservedTimersNum >= 9) {
        const message =
          "* You have the reached the maximum Timers amount!<br> To add timer please delete one";
        showValidationError(validErrorCon, validErrorNote, message);
        return;
      }
      // when all inputs are valid add the timer and insert to localStorage
      else {
        reservedTimersNum++;
        const newTimer = document.createElement("div");
        newTimer.classList.add("timer");
        newTimer.innerHTML = `
          <div class="timer">
                    <h6>${timerNameInput.value}</h6>
                    <p>
                      <i class="fas fa-play"></i>
                      <i class="fas fa-pause"></i>
                      <i class="fas fa-reply"></i>
                      <span class="timer-display">${timerDurationString}</span>
                    </p>
                    <div class="progress justify-content-end">
                      <div class="progress-bar bg-success" style="width: 100%;" role="progressbar" aria-valuenow="100"
                        aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
          `;
        // locate The empty Id to insert the new timer
        // make sure only one timer is inserted
        let limiter = 1;
        for (let i = 1; i <= 9; i++) {
          if (
            list.querySelector(`#timer-${i}`).querySelector(".timer") ===
              null &&
            limiter === 1
          ) {
            list
              .querySelector(`#timer-${i}`)
              .insertAdjacentElement("afterbegin", newTimer);
            localStorage.setItem(`timer-${i}`, newTimer.innerHTML);
            limiter--;
          }
        }
        this.timersInitialDurations.push(timerDurationString);
      }
      // close Modal After Timer Added
      addTimerModal.querySelector(".btn-danger").click();
    });
  }
  deleteTimer(timers) {
    // const timersList = timers.querySelectorAll('.timer');
    const deleteTimersBtn = timers.querySelector("#delete-timer-btn");
    // The Function that actually delete the timers
    const deleteTimerWithClick = (e) => {
      const timer = e.target.closest(".timer");
      timer.parentElement.classList.remove("running");
      // delete timer set interval by clicking reset
      for (let i = 0; i < this.countDownFollower.length; i++) {
        if (this.countDownFollower[i].timerId === timer.parentElement.id) {
          clearInterval(this.countDownFollower[i].countId);
          this.countDownFollower.splice(i, 1);
        }
      }
      // delete Timer From local Storage
      localStorage.removeItem(`timer-${timer.parentElement.id.split("-")[1]}`);
      // delete the visual timer div
      timer.remove();
    };
    // Create The Done Btn
    const doneHtml = document.createElement("span");
    doneHtml.innerHTML =
      '<a style="cursor: pointer;" class="text-primary"> <u>Done</u></a>';
    // add event Listener to the menu delete Btn
    deleteTimersBtn.addEventListener("click", () => {
      const timersList = timers.querySelectorAll(".timer");
      for (let i = 0; i < timersList.length; i++) {
        timersList[i].classList.add("ready-to-delete", "animated", "fadeIn");
        timersList[i].addEventListener(
          "click",
          (e) => deleteTimerWithClick(e),
          { once: true }
        );
      }
      // inserts the done Btn
      deleteTimersBtn.insertAdjacentElement("afterend", doneHtml);
    });
    // done Btn Event Listener
    doneHtml.addEventListener("click", () => {
      // array do collect the timers which didnt remove
      const timersLeftEl = [];
      // catch the timers that the user didnt remove
      const timersLeft = timers.querySelectorAll(".timer");
      for (const timer of timersLeft) {
        timer.classList.remove("ready-to-delete", "animated", "fadeIn");
        let i = timer.parentElement.innerHTML;
        timersLeftEl.push(i);
        timer.remove();
      }
      // render the timers back to the dom
      for (let i = 1; i < timersLeftEl.length + 1; i++) {
        timers
          .querySelector(`#timer-${i}`)
          .insertAdjacentHTML("beforeend", timersLeftEl[i - 1]);
      }
      doneHtml.remove();
    });
  }
  resetTimerDataHolder(timersUl) {
    const originalTimes = timersUl.getElementsByClassName("timer-display");
    const otArray = [];
    for (const ot of originalTimes) {
      otArray.push(ot.textContent);
    }
    return otArray;
  }
}

class Search extends WorkoutList {
  constructor() {
    super(false);
    this.searchEl = document.getElementById("search");
    this.searchHandler(this.searchEl);
  }
  searchHandler(search) {
    const searchBar = search.querySelector("input");
    const searchBtn = search.querySelector("button");
    searchBtn.addEventListener("click", this.search.bind(this, searchBar));
    // Search operation via Enter Button
    searchBar.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        searchBtn.click();
      }
    });
  }
  search(searchBar) {
    const workoutElements = document.getElementsByClassName("workout");
    const workoutNameElements = [];
    // push workout name elements (h1) to 'workoutNameElements'
    for (const w of workoutElements) {
      const element = w.querySelector(".workout-name h1");
      workoutNameElements.push(element);
    }
    const currentSearchValue = searchBar.value;
    workoutNameElements.forEach((n, i) => {
      if (
        n.textContent
          .toLowerCase()
          .includes(currentSearchValue.toLowerCase()) &&
        currentSearchValue !== ""
      ) {
        workoutElements[i].classList.remove("d-none");
        new Log(workoutElements[i]);
      } else if (
        !n.textContent.includes(currentSearchValue) ||
        !currentSearchValue
      ) {
        workoutElements[i].classList.add("d-none");
      }
    });
  }
}
class Log extends WorkoutList {
  constructor(displayedWorkout) {
    super(false);
    this.displayedWorkout = displayedWorkout;
    this.workout = JSON.parse(localStorage.getItem(this.displayedWorkout.id));
    this.fillStorageLog(this.displayedWorkout, this.workout.log);
    this.getLogInputs();
    this.logOptionsHandler();
    this.currentWeightUnit = "kg";
  }
  fillStorageLog(workout, log) {
    // If there is no log stop function execution (avoid crash)
    if (!log) {
      return;
    }
    // Log exercises performance Results
    function logInsert(type, prefix, suffix) {
      const logOf = workout.getElementsByClassName(`${type}-display-value`);
      const data = log[type];
      if (type !== "band") {
        data.forEach((d, i) => {
          if (d && logOf[i]) {
            logOf[i].textContent = d;
            logOf[i].parentElement.firstChild.nodeValue = prefix;
            logOf[i].parentElement.lastChild.nodeValue = suffix;
          } else {
            return;
          }
        });
      } else {
        data.forEach((d, i) => {
          if (d && logOf[i]) {
            logOf[i].textContent = d;
            logOf[i].parentElement.firstChild.nodeValue = prefix;
            logOf[i].parentElement.lastChild.nodeValue = " " + type;
          } else {
            return;
          }
        });
      }
    }
    logInsert("reps", "", " Reps");
    logInsert("weight", " of ", "kg");
    logInsert("band", "with ");
    const noteEl = workout.querySelector(".wnote textarea");
    noteEl.value = log.notes;
  }
  getLogInputs() {
    const currentWorkout = this.displayedWorkout;
    currentWorkout.scrollIntoView({ behavior: "smooth" });
    const setFields = currentWorkout.getElementsByClassName("set");
    const repInputs = [];
    // get Reps Input
    for (const set of setFields) {
      let repInput = set.getElementsByTagName("input")[2];
      repInputs.push(repInput);
    }
    // Listen to Reps Target Inputs
    repInputs.forEach((element) => {
      element.onkeydown = (e) => {
        if (e.key === "Enter") {
          const reps = e.target;
          const band = reps.previousElementSibling;
          const weight = band.previousElementSibling;
          const curSet = e.target.parentElement;
          // get Error when no reps
          if (!reps.value) {
            alert("Reps input is required!");
            const repsDisplay = (curSet.querySelector(
              ".reps-display"
            ).innerHTML = ` <span class="reps-display-value"></span>`);
            const weightDisplay = (curSet.querySelector(
              ".weight-display"
            ).innerHTML = `<span class="weight-display-value"></span> `);
            const bandDisplay = (curSet.querySelector(
              ".band-display"
            ).innerHTML = ` <span class="band-display-value"></span>`);
            reps.value = "";
            band.value = "";
            weight.value = "";
            return;
          }
          // Log When reps only -- and band empty --
          else if ((!band.value && !weight.value) || weight.value == "0") {
            const repsDisplay = (curSet.querySelector(
              ".reps-display"
            ).innerHTML = ` <span class="reps-display-value">${reps.value}</span> Reps`);
            const weightDisplay = (curSet.querySelector(
              ".weight-display"
            ).innerHTML = `<span class="weight-display-value"></span>`);
            const bandDisplay = (curSet.querySelector(
              ".band-display"
            ).innerHTML = ` <span class="band-display-value"></span>`);
          }
          // log Reps + weight
          else if (!band.value && weight.value) {
            const repsDisplay = (curSet.querySelector(
              ".reps-display"
            ).innerHTML = ` <span class="reps-display-value">${reps.value}</span> Reps`);
            const weightDisplay = (curSet.querySelector(
              ".weight-display"
            ).innerHTML = ` of <span class="weight-display-value">${weight.value}</span>Kg`);
            const bandDisplay = (curSet.querySelector(
              ".band-display"
            ).innerHTML = ` <span class="band-display-value"></span>`);
            const rootWeight = Number(
              currentWorkout.querySelector(".weight-display-value").textContent
            );
            this.buildWarmUp(rootWeight);
            this.totalVolumeTracer(currentWorkout);
          }
          // leg weights8 + bands
          else if (!weight.value || (weight.value == "0" && band.value)) {
            const repsDisplay = (curSet.querySelector(
              ".reps-display"
            ).innerHTML = ` <span class="reps-display-value">${reps.value}</span> Reps`);
            const weightDisplay = (curSet.querySelector(
              ".weight-display"
            ).innerHTML = ` <span class="weight-display-value"></span>`);
            const bandDisplay = (curSet.querySelector(
              ".band-display"
            ).innerHTML = ` <span class="band-display-value">${band.value}</span>Band`);
          }
          // Log weight combined with reps
          else {
            const repsDisplay = (curSet.querySelector(
              ".reps-display"
            ).innerHTML = ` <span class="reps-display-value">${reps.value}</span> Reps`);
            const weightDisplay = (curSet.querySelector(
              ".weight-display"
            ).innerHTML = ` <span class="weight-display-value">${weight.value}</span>Kg`);
            const bandDisplay = (curSet.querySelector(
              ".band-display"
            ).innerHTML = ` <span class="band-display-value">${band.value}</span>Band`);
            const rootWeight = Number(
              currentWorkout.querySelector(".weight-display-value").textContent
            );
            this.buildWarmUp(rootWeight);
          }
          const weightDisplayValue = curSet.querySelector(
            ".weight-display-value"
          );
          const bandDisplayValue = curSet.querySelector(".band-display-value");
          const repsDisplayValue = curSet.querySelector(".reps-display-value");
        }
      };
    });
    // Get and activate Check Btn's
    const checkBtns = currentWorkout.getElementsByClassName("btn-sm");
    for (const b of checkBtns) {
      b.onclick = () => {
        b.previousElementSibling.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Enter" })
        );
      };
    }
  }
  buildWarmUp(rootWeight) {
    const currentWorkout = this.displayedWorkout;
    const warmUpSetElements = currentWorkout
      .querySelector(".warm-up")
      .getElementsByClassName("warm-up-set");
    const warmUpReferenceInput = currentWorkout.querySelector(
      ".set input:nth-child(3)"
    );
    const BARBELL_WEIGHT = Settings.settings.barW;
    const sets1_2 = (rootWeight * 0.5).toFixed();
    const set3 = (rootWeight * 0.7).toFixed();
    const set4 = (rootWeight * 0.9).toFixed();
    const barbellSetup1_2 = ((sets1_2 - BARBELL_WEIGHT) / 2).toFixed(1);
    const barbellSetup3 = ((set3 - BARBELL_WEIGHT) / 2).toFixed(1);
    const barbellSetup4 = ((set4 - BARBELL_WEIGHT) / 2).toFixed(1);
    warmUpReferenceInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        for (let set = 1; set < warmUpSetElements.length + 1; set++) {
          let counter = "1st(12 Reps - 50%): ";
          if (set === 1) {
            warmUpSetElements[set - 1].innerHTML =
              "1st(12 Reps - 50%): " +
              sets1_2 +
              "kg | Barbell Setup: " +
              barbellSetup1_2 +
              " kg each side";
          } else if (set === 2) {
            warmUpSetElements[set - 1].innerHTML =
              "2nd(8 Reps - 50%): " +
              sets1_2 +
              "kg | Barbell Setup: " +
              barbellSetup1_2 +
              " kg each side";
          } else if (set === 3) {
            warmUpSetElements[set - 1].innerHTML =
              "3rd(3-4 Reps - 70%): " +
              set3 +
              "kg | Barbell Setup: " +
              barbellSetup3 +
              " kg each side";
          } else {
            warmUpSetElements[set - 1].innerHTML =
              "4th(1 Rep - 90%): " +
              set4 +
              "kg | Barbell Setup: " +
              barbellSetup4 +
              " kg each side";
          }
        }
      }
    });
  }
  logOptionsHandler() {
    const currentWorkout = this.displayedWorkout;
    const currentWorkoutId = currentWorkout.id;
    const convertToLbsBtn = currentWorkout
      .querySelector(".btn-group")
      .querySelector("button");
    const convertToKgBtn = currentWorkout
      .querySelector(".btn-group")
      .querySelector("button:nth-child(2)");
    const foldingBtn = currentWorkout
      .querySelector(".btn-group")
      .querySelector("button:nth-child(3)");
    const logAllBtn = currentWorkout.querySelector(".fa-list-ul").parentElement;
    const notesBtn = currentWorkout.querySelector(".fa-sticky-note")
      .parentElement;
    // Convert To Lbs function + eventListener
    convertToLbsBtn.onclick = this.convertLogToLbs.bind(this, currentWorkoutId);
    // Convert To Kg's function + eventListener
    convertToKgBtn.onclick = this.convertLogToKg.bind(this, currentWorkoutId);
    // Fold / Unfold Warm-up function + eventListener
    foldingBtn.onclick = this.foldWarmUp.bind(this, currentWorkoutId);
    // Log All Handler
    logAllBtn.onclick = this.logAll.bind(this, currentWorkoutId);
    // notes Toggle Btn
    notesBtn.onclick = this.notesToggle.bind(this, currentWorkout);
  }
  notesToggle(workout) {
    const notesEl = workout.querySelector(".wnote");
    // Toogle visuality of notes
    notesEl.classList.toggle("d-none");
  }
  convertLogToLbs(id) {
    const currentWorkout = document.getElementById(id);
    const weightValueElements = currentWorkout.getElementsByClassName(
      "weight-display-value"
    );
    const kgValueArray = [];
    // If current Weight unit is Kg convert to lbs
    if (this.currentWeightUnit === "kg") {
      // get all Kg number values
      for (let i = 0; i < weightValueElements.length; i++) {
        if (weightValueElements[i].textContent === "_") {
          kgValueArray.push(0);
        } else {
          const element = Number(weightValueElements[i].textContent);
          kgValueArray.push(element);
        }
      }
      // insert in lbs
      for (let i = 0; i < kgValueArray.length; i++) {
        if (kgValueArray[i] === 0) {
          weightValueElements[i].textContent = "_";
        } else {
          weightValueElements[i].textContent = (
            kgValueArray[i] * 2.205
          ).toFixed(1);
        }
      }
      // after convert change weight unit status to "lbs"
      this.currentWeightUnit = "lbs";
      // change word "kg" to "lbs"
      const kgWords = currentWorkout.getElementsByClassName("weight-display");
      for (let i = 0; i < kgWords.length; i++) {
        kgWords[i].firstChild.nodeValue = "";
        kgWords[i].lastChild.nodeValue = " lbs";
      }
    }
    // if current weight unit is already lbs stop function
    else {
      alert("NOTE: You're already use lbs units!");
      return;
    }
  }
  convertLogToKg(id) {
    const currentWorkout = document.getElementById(id);
    const weightValueElements = currentWorkout.getElementsByClassName(
      "weight-display-value"
    );
    const lbsValueArray2 = [];
    // If current Weight unit is Kg convert to lbs
    if (this.currentWeightUnit === "lbs") {
      // get all Kg number values
      for (let i = 0; i < weightValueElements.length; i++) {
        if (weightValueElements[i].textContent === "_") {
          lbsValueArray2.push(0);
        } else {
          const element = Number(weightValueElements[i].textContent);
          lbsValueArray2.push(element);
        }
      }
      // insert in kg
      for (let i = 0; i < lbsValueArray2.length; i++) {
        if (lbsValueArray2[i] === 0) {
          weightValueElements[i].textContent = "_";
        } else {
          weightValueElements[i].textContent = (
            lbsValueArray2[i] / 2.205
          ).toFixed();
        }
      }
      // change word "lbs" to "kg"
      const kgWords = currentWorkout.getElementsByClassName("weight-display");
      for (let i = 0; i < kgWords.length; i++) {
        kgWords[i].firstChild.nodeValue = "";
        kgWords[i].lastChild.nodeValue = " Kg";
      }
      this.currentWeightUnit = "kg";
    }
    // if current weight unit is lbs stop function
    else {
      alert("NOTE: You're already use kg units!");
      return;
    }
  }
  foldWarmUp(id) {
    const currentWorkout = document.getElementById(id);
    const warmUpElement = currentWorkout.querySelector(".warm-up");
    const warmUpElementClasses = currentWorkout.querySelector(".warm-up")
      .className;
    if (!warmUpElementClasses.includes("d-none")) {
      warmUpElement.classList.add("d-none");
    } else {
      warmUpElement.classList.remove("d-none");
    }
  }
  logAll(id) {
    const currentWorkout = document.getElementById(id);
    // The visual log all action
    const logBtns = currentWorkout.querySelectorAll(
      "button.btn-outline-secondary"
    );
    for (const btn of logBtns) {
      if (btn.previousElementSibling.value) {
        btn.click();
      } else {
        continue;
      }
    }
    const accessNum = Number(id.split("-")[1]);
    const wListInx = this.workoutsList.findIndex((w) => {
      return w.id === accessNum;
    });
    const wData = this.workoutsList[wListInx];
    // save Log to local storage workout
    const notes = currentWorkout.querySelector(".wnote textarea").value;
    const localStorageLog = {
      reps: [],
      weight: [],
      band: [],
      notes: notes,
    };
    function logCollector(type) {
      const logOf = currentWorkout.getElementsByClassName(
        `${type}-display-value`
      );
      for (const t of logOf) {
        localStorageLog[type].push(t.textContent);
      }
    }
    logCollector("reps");
    logCollector("weight");
    logCollector("band");
    wData.log = localStorageLog;
    localStorage.setItem(`workout-${accessNum}`, JSON.stringify(wData));
  }
  totalVolumeTracer(workout) {
    const weightDisplaySpans = workout.getElementsByClassName(
      "weight-display-value"
    );
    const repsDisplaySpans = workout.getElementsByClassName(
      "reps-display-value"
    );
    const totalVolumeDisplay = workout.querySelector(".total-volume-display");
    const weightDisplayArray = [];
    const repsDisplayArray = [];
    // extract weights array
    for (const span of weightDisplaySpans) {
      if (!span.textContent) {
        weightDisplayArray.push(0);
      } else {
        const setWeight = Number(span.textContent);
        weightDisplayArray.push(setWeight);
      }
    }
    // extract reps array
    for (const span of repsDisplaySpans) {
      const setWeight = Number(span.textContent);
      repsDisplayArray.push(setWeight);
    }
    // multiply array Alternately and get Total volume
    const setsVolume = [];
    for (let i = 0; i < repsDisplayArray.length; i++) {
      const sv = repsDisplayArray[i] * weightDisplayArray[i];
      setsVolume.push(sv);
    }
    totalVolumeDisplay.textContent = setsVolume.reduce(
      (cur, pre) => cur + pre,
      0
    );
  }
}
class WorkoutCreator extends WorkoutList {
  /* html: id:"create-new-workout" */
  constructor() {
    super(false);
    this.fields = 3;
    this.workoutCreatorEl = document.querySelector("#create-new-workout");
    this.addExercise(this.workoutCreatorEl);
    this.subtractExercise(this.workoutCreatorEl);
    this.addWorkout(this.workoutCreatorEl);
    this.totalSetCalcHandler(this.workoutCreatorEl);
  }
  totalSetCalcHandler(workoutCreator) {
    // get current inputs
    for (let i = 1; i <= 20; i++) {
      const input = workoutCreator.querySelector(`#sets-input-${i}`);
      if (!input) {
        return;
      } else {
        input.addEventListener("input", (e) => {
          this.totalSetCalc();
        });
      }
    }
  }
  subtractExercise(workoutCreator) {
    const subtractExerciseBtn = workoutCreator.querySelector(
      "#subtract-exercise"
    );
    const workoutCreatorForm = workoutCreator.querySelector("form");
    const totalSetsDisplay = workoutCreator.querySelector(
      "#total-new-workout-sets"
    );
    subtractExerciseBtn.addEventListener("click", () => {
      if (this.fields < 4) {
        alert("Minimum of 3 exercises per workout");
        return;
      } else {
        let lastNum = Number(
          workoutCreatorForm.lastElementChild.querySelector(
            `#sets-input-${this.fields}`
          ).value
        );
        workoutCreatorForm.lastElementChild.remove();
        const totalSetsDisplayValue = Number(
          document.getElementById("total-new-workout-sets").textContent
        );
        totalSetsDisplay.textContent = totalSetsDisplayValue - lastNum;
        this.fields--;
      }
    });
  }
  addExercise(workoutCreator) {
    const addExerciseBtn = workoutCreator.querySelector("#add-exercise");
    const workoutCreatorForm = workoutCreator.querySelector("form");
    addExerciseBtn.addEventListener("click", () => {
      if (this.fields < 20) {
        const fieldEl = document.createElement("div");
        fieldEl.setAttribute("id", `form-row-${this.fields + 1}`);
        fieldEl.setAttribute("class", "form-row");
        fieldEl.innerHTML = `
          <div class="col">
            <input maxlength="40" id="exercise-name-input-${
              this.fields + 1
            }" type="text" class="form-control" placeholder="Exercise Name">
          </div>
          <div class="col">
            <input maxlength="40" id="target-reps-input-${
              this.fields + 1
            }" type="text" class="form-control" placeholder="Reps / Notes">
          </div>
          <div class="col">
            <input id="sets-input-${
              this.fields + 1
            }" min="1" type="number" class="form-control" placeholder="Amount Of Sets">
          </div>
      `;
        workoutCreatorForm.insertAdjacentElement("beforeend", fieldEl);
        // add event listener to the sets input
        fieldEl
          .querySelector(`#sets-input-${this.fields + 1}`)
          .addEventListener("input", (e) => {
            this.totalSetCalc();
          });
        this.fields++;
      } else {
        alert("Max of 20 exercises is allowed!");
        return;
      }
    });
  }
  addWorkout(workoutCreator) {
    const addWorkoutBtn = document.getElementById("add-workout");
    addWorkoutBtn.addEventListener("click", () => {
      // Validate max amount of sets is not passed
      const totalSets = Number(
        workoutCreator.querySelector("#total-new-workout-sets").textContent
      );
      if (totalSets > 50) {
        alert(
          "Looks like you have too many sets. Max amount of sets per workout is 50"
        );
        return;
      }
      const workoutName = document.getElementById("workout-name").value;
      const exercises = [];
      const targetReps = [];
      const sets = [];
      // get All exercises
      for (let i = 1; i <= this.fields; i++) {
        const exercise = document.getElementById(`exercise-name-input-${i}`)
          .value;
        exercises.push(exercise);
      }
      // get All target reps
      for (let i = 1; i <= this.fields; i++) {
        const repTarget = document.getElementById(`target-reps-input-${i}`)
          .value;
        targetReps.push(repTarget);
      }
      // get All Sets per exercise
      for (let i = 1; i <= this.fields; i++) {
        const setInput = document.getElementById(`sets-input-${i}`).value;
        sets.push(setInput);
      }
      let id;
      const ids = [];
      // Get The Highest Workout Id
      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).includes("workout")) {
          const id = localStorage.key(i).split("-")[1];
          ids.push(id);
        }
      }
      if (!ids[0]) {
        id = 1;
      } else {
        id = Math.max(...ids) + 1;
      }
      const workout = new Workout(
        workoutName,
        id,
        [...exercises],
        [...targetReps],
        [...sets]
      );
      this.workoutsList.push(workout);
      const newWorkout = localStorage.setItem(
        `workout-${id}`,
        JSON.stringify(workout)
      );
      location.reload();
    });
  }
  totalSetCalc() {
    const totalSetsDisplay = document.getElementById("total-new-workout-sets");
    const workoutCreator = document.getElementById("create-new-workout");
    const setInputs = [];
    const sum = [];
    let i = 1;
    do {
      const input = workoutCreator.querySelector(`#sets-input-${i}`);
      setInputs.push(input);
      i++;
    } while (workoutCreator.querySelector(`#sets-input-${i}`));
    // scan all Inputs value
    setInputs.forEach((element) => {
      let i = Number(element.value);
      sum.push(i);
    });
    // Display
    totalSetsDisplay.textContent = sum.reduce((pre, cur) => pre + cur, 0);
  }
}
class App {
  static init() {
    const settings = new Settings();
    const workouts = new WorkoutList();
    const workoutCreator = new WorkoutCreator();
    const search = new Search();
    const navBar = new Navbar();
    const timers = new Timers();
    const myplan = new MyPlan();
  }
}
App.init();
