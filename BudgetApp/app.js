//Budget Controller
var budgetController = (function() {
    // Expense
    var Expense = function(id,description,value) {
      this.id = id;
      this.description = description;
      this.value = value;
  };
    // Income
    var Income = function(id,description,value){
      this.id = id;
      this.description = description;
      this.value = value;   
    };
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    
    //Data Structure for each object
    var data = {
        allItems:{
            inc: [],
            exp: []
        },
        
        totals:{
            inc: 0,
            exp: 0
        },
        
        budget: 0,
        
        percentage: -1
    };
    
    //Public Vairables
    return{
            addItem: function(type,des,val){
                var newItem,ID;
                //Create new ID
                if(data.allItems[type].length>0)
                    {
                        ID=data.allItems[type][data.allItems[type].length-1].id + 1;        
                    }
                else{
                    ID=0;
                }
                
                //Create new item based on 'inc' or 'exp'
                if(type==='inc')
                    {
                        newItem = new Income(ID,des,val);
                    }
                else if(type==='exp')
                        {
                            newItem = new Expense(ID,des,val);
                        }
                
                //Push it to data Structure
                data.allItems[type].push(newItem);
                
                //Return the new Element
                return newItem;
            },
        
        getBudget: function(){
            return{
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            };
        },
        
        calculateBudget: function(){
            //1. Calculate total income and expenses.
                calculateTotal('exp');
                calculateTotal('inc');
            
            //2. Calculate month budget: income - expenses.
                data.budget = data.totals.inc - data.totals.exp;
            
            //3. calculate the perentage of budget consumed.
                if(data.totals.inc>0)
                {
                    data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);    
                }
                else
                    {
                        alert('No Income No Expense');
                        data.percentage = -1;
                    }
                
        },
        
        testing: function(){
            console.log(data);
        }
    };
})();

//User Iterface Controller
var UIController = (function(){
    //Initializing Object to prevent unknown bugs because of strings initialization
    var DomStrings = {
        inputBtn: '.add__btn',
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
        
    };
    
    //Public Variables
   return{
       getInput: function(){
             //As we can't return three variables at once so we used an object to make it convenient.
            return{
                //+ refers to inc and - refers to exp
                type: document.querySelector(DomStrings.inputType).value,
                //Description
                description: document.querySelector(DomStrings.inputDesc).value,
                //Value
                value: parseFloat(document.querySelector(DomStrings.inputValue).value)
            };
        },
       
       displayBudget: function(obj){
           document.querySelector(DomStrings.budgetLabel).textContent = obj.budget;
           document.querySelector(DomStrings.incomeLabel).textContent = obj.totalIncome;
           document.querySelector(DomStrings.expensesLabel).textContent = obj.totalExpenses;
           if(obj.percentage > 0)
               {
                   document.querySelector(DomStrings.percentageLabel).textContent = obj.percentage + '%';
               }
           else
           {
                document.querySelector(DomStrings.percentageLabel).textContent = '---';    
           }
           /*
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
           */
           
           
       },
        
       getDomStrings: function(){
                return DomStrings;
        },
       
       addListItem: function(obj,type){
           var html, newHTML,element;
           //Create HTML sring with placeholder text
           if(type==='inc')
               {
                   element = DomStrings.incomeContainer; 
                   html =  '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"<div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';        
               }
           else if(type ==='exp')
               {
                    element = DomStrings.expensesContainer;
                    html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';        
               }
           
           //Replace the placeholder text with actual data
           newHTML = html.replace('%id%',obj.id);
           //After 1st replacement we will use newHTML for further manipulation
           newHTML = newHTML.replace('%description%',obj.description);
           newHTML = newHTML.replace('%value%',obj.value);
           //Inster HTML into the DOM
           document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
       },
       //To clear the field after we click on button or press enter to prevent repition of data
       clearField: function(){
           var fieldsList,fieldsArray;
           fieldsList = document.querySelectorAll(DomStrings.inputValue + ', ' + DomStrings.inputDesc);
           //As it will give a list and we want array so,
           fieldsArray = Array.prototype.slice.call(fieldsList);
           //Loop to clear the field
           fieldsArray.forEach(function(current,index,array){
               current.value = "";
           });
           //To place the cursor in description!
           fieldsArray[0].focus();
       }
   };
})();

//Global App Controller
var Controller = (function(budgetCtrl, UICtrl){
    var setUpEventListener = function (){
        //Initialise DOMString here
        var DOM = UICtrl.getDomStrings();
        //Button Interface
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        //Key Press Event Listener
        document.addEventListener('keypress', function(event){
            //To specify key for action.
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            };
        });
   
    };
    
    var UpdateBudget = function(){
        // 1. Calculate the budget
            budgetCtrl.calculateBudget()
        //2. Return the budget
            var budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI
            UICtrl.displayBudget(budget);
        
    };
    
    //Control Centre of Application
    var ctrlAddItem = function(){
        var input, newItem;
        //1. Get the field input data
            input = UICtrl.getInput();
            console.log(input);
        //To prevent empty inputs
        if(input.description !=="" && !isNaN(input.value) && input.value>0)
            {
                
                // 2. Add the item to the budget controller
                newItem = budgetCtrl.addItem(input.type, input.description, input.value);
                
                // 3. Add the item to the UI
                UICtrl.addListItem(newItem, input.type);
        
                //4. Clear the fields
                UICtrl.clearField();
        
                //5. Calculate and update the budget
                UpdateBudget();
            }
        else
            {
                alert('Please Check back no field can remain empty!');
            }
        
    };
    //Public Variables
    return{
        init: function(){
            console.log('Exectuted!');
            UICtrl.displayBudget({
                budget:0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            });
            setUpEventListener();
        }
    }
})(budgetController,UIController);

Controller.init();