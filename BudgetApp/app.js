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
    
    //Data Structure for each object
    var data = {
        allItems:{
            inc: [],
            exp:[]
        },
        totals:{
            inc:0,
            exp:0
        }
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
        incomeContainer:'.income__list',
        expensesContainer: '.expenses__list'
        
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
        
        //2. Return the budget
        
        // 3. Display the budget on the UI
        
        
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
            setUpEventListener();
        }
    }
})(budgetController,UIController);

Controller.init();