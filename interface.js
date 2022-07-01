    function addTrainTestButtons() {
        let buttonTrain = document.createElement("button");
        buttonTrain.innerHTML = "🎓";
        buttonTrain.onclick = train;
        let buttonTest = document.createElement("button");
        buttonTest.innerHTML = "🎲";
        buttonTest.onclick = test;

        document.getElementById("buttons").append(buttonTrain);
        document.getElementById("buttons").append(buttonTest);
    }

    // function addSaveRemoveButtons() {
    //add save/remove buttons

        // saveButtons= document.getElementById("saveButtons");

        // var child = saveButtons.lastElementChild;
        // while (child) {
        //     saveButtons.removeChild(child);
        //     child = saveButtons.lastElementChild;
        // }

        // let buttonSave = document.createElement("button");
        //     buttonSave.innerHTML = "💾";
        //     buttonSave.onclick = saveCar;
        // let buttonRemove = document.createElement("button");
        //     buttonRemove.innerHTML = "🗑️";
        //     buttonRemove.onclick = removeCar;
        // saveButtons.append(buttonSave);
        // saveButtons.append(buttonRemove);
    // }

    function createStats() {
        // TO DO

        //Weights
        //Generations
        //Max distance
    }

