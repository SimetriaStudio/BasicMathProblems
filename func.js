function runProblems(){
   // Grab selected Length from dropdown
   var selectedLen = selectLen.value - 1;

   // Grab selected Number from dropdown
   var selectedNum = selectNum.value;

   // Grab selected Number of Problems
   probCount = selectCount.value;

   // Reset warning div to display none
   alert.style.display = 'none';

   // Check to see if Selected Length Dropdown was modified
   if( selectedLen <= 0 || selectedNum <= 0 ){
      selectNum.value = 0;
      alert.style.display = 'block';
      return false;
   }

   // How long should the problem be?
   // Ie.: 3 + 3 would be length of 2
   // Ie.: 4 + 4 - 4 would be length of 3
   function probLenght(){
      var Problength = Math.floor(Math.random() * selectedLen) + 2;
      probLen = Problength;
      return probLen;
   }

   // Generate randomn numbers for the problemConstruct
   // Between 1 and 25
   function randNumber(num){
      for(var i = 0; i < num; i++){
         var randNum = Math.floor(Math.random() * selectedNum) + 1;
         var blankNum = Math.floor(Math.random() * 15) + 1;
         if( blankNum === 3 ) {
            randNum = '____';
         }
         numsArr.push(randNum);
      }
      numsArr.sort(function(a, b){
         return a < b;
      });
   }

   // Generate randomn operation between plus and minus
   // On the last iteration the operation is an equals
   function operation(num){
      for(var i = 0; i < num; i++){
         var operation = Math.floor(Math.random() * 2) + 1;
         if(operation === 1){
            operation = ' + ';
         } else {
            operation = ' – ';
         }
         if((i + 1) === num){
            operation = ' = ';
         }
         if(i === 0){
            operation = ' + ';
         }
         operArr.push(operation);
      }
   }

   // Construct problem based on the probLenght function
   // Retreaves values from the stored arrays above
   function problemConstruct(){

      // Run function to create numbers and operations
      probLenght();
      operation(probLen);
      randNumber(probLen);

      // Set function's global variables
      var combined = '';
      var space = false;
      var firstNum;
      var added = 0;

      // Iterate through problem length and build problem
      for(var i = 0; i < probLen; i++){
         firstNum = numsArr[0];
         var rand = numsArr[i];
         var oper = operArr[i];

         // Add up all the numbers in the problem
         if(Number.isInteger(rand)){
            added += rand;
         }

         // check to see if number is space and set var to true
         if(rand === '____'){
            space = true;
         }

         // If last iteration and has space in problem create result after equals
         if((i + 1) === probLen && space === true){
            var randResult =  Math.floor(Math.random() * 8) + (added + 3);
            combined += (rand + oper + randResult);
         } else {
            combined += (rand + oper);
         }
      }

      // Reset added variable
      added = 0;

      // Push built problem to problems array
      probArr.push(combined);
   }

   // Reset the Output div to blank
   out.innerHTML = '';

   // Create and display problems based on the probCount variable above
   for(var i = 0; i < probCount; i++){
      problemConstruct();

      // Build HTML for output
      var div = document.createElement("div");
      var save = document.createElement("a");
      var saveText = document.createTextNode("Save");
      save.appendChild(saveText);
      save.className = "saveProb";
      save.setAttribute("href", "#");

      for(a of probArr){
         div.append(a);
         div.append(save);
      }
      out.appendChild(div);
      document.querySelector('.output h1').style.display = 'block';
      document.querySelector('a.random').style.display = 'block';
      probArr = [];
      operArr = [];
      numsArr = [];
      loaded = true;

      // Save problem functionality
      save.addEventListener('click', function(e){
         e.preventDefault();

         var saveDiv = document.querySelector('.saved');
         var prob = this.parentElement;
         this.remove();

         // Set into localstorage
         if(localStorage.getItem('savedProblems') === null){
            var arr = [];
            arr.push(prob.innerHTML);
            localStorage.setItem('savedProblems', JSON.stringify(arr));
         } else {
            var newArr = JSON.parse(localStorage.getItem('savedProblems'));
            newArr.push(prob.innerHTML);
            localStorage.setItem('savedProblems', JSON.stringify(newArr));
         }

         var remove = document.createElement("a");
         var removeText = document.createTextNode("Remove");
         remove.appendChild(removeText);
         remove.className = "removeProb";
         remove.setAttribute("href", "#");

         prob.append(remove);
         saveDiv.appendChild(prob);
         document.querySelector('.saved').style.display = 'block';

         // Remove saved problem functionality
         remove.addEventListener('click', function(e){
            e.preventDefault();
            removeProb(this);
         });

      });

   }
}

export default runProblems();
