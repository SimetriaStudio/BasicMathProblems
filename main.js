var selectLen = document.querySelector('.mathProb');
var selectNum = document.querySelector('.mathNum');
var selectCount = document.querySelector('.mathCount');
var alert = document.querySelector('.alert');
var out = document.querySelector('.outputWrapper');
var randomBtn = document.querySelector('.random');
var numsArr = [];
var operArr = [];
var probLen;
var probCount;
var probArr = [];
var loaded = false;

selectLen.addEventListener('change', function(){
   if(selectNum.value != 0 && selectCount.value != 0){
      runProblems();
   }
});

selectNum.addEventListener('change', function(){
   if(selectCount.value != 0){
      runProblems();
   }
});

selectCount.addEventListener('change', function(){
   runProblems();
});

randomBtn.addEventListener('click', function(e){
   e.preventDefault();
   runProblems();
});

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

// If localstorage is not empty display problems
if(localStorage.getItem('savedProblems') != null){
   var problemsArray = JSON.parse(localStorage.getItem('savedProblems'));
   for(var i =0; i < problemsArray.length; i++){
      var saveDiv = document.querySelector('.saved');
      var prob = document.createElement("div");
      var probText = document.createTextNode(problemsArray[i]);
      var remove = document.createElement("a");
      var removeText = document.createTextNode("Remove");

      prob.appendChild(probText);
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
   }
}

// Saved clear button functionality
var clear = document.querySelector('.saved .clearSaved');
clear.addEventListener('click', function(e){
   e.preventDefault();
   var par = document.querySelectorAll('.saved div');
   var conf = confirm('Are you sure you want to clear these saved problems?');
   if(conf){
      for(var i = 0; i < par.length; i++){
         par[i].remove();
      }
      document.querySelector('.saved').style.display = 'none';
      localStorage.removeItem('savedProblems');
   }
});

function removeProb(el){
   var conf = confirm('Are you sure you want to delete this problem?');
   if(conf){
      el.parentElement.remove();
      console.log(el.parentElement);
   }

   localStorage.removeItem('savedProblems');

   var par = document.querySelectorAll('.saved div');
   var ls = [];
   el.remove();
   for(var i = 0; i < par.length; i++){
      var btn = par[i].lastChild;
      btn.remove();
      ls.push(par[i].innerHTML);
      par[i].appendChild(btn);
   }
   localStorage.setItem('savedProblems', JSON.stringify(ls));

   // Hide saved div if there are no problems
   var par = document.querySelectorAll('.saved div');
   if(par.length <= 0){
      document.querySelector('.saved').style.display = 'none';
      localStorage.removeItem('savedProblems');
   }
}


