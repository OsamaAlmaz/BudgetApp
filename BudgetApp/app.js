


var budgetController = (function() {

    var Expense = function(id, description,value){
        this.id = id; 
        this.description = description; 
        this.value = value; 
    };

    var Income = function (id, description, value){
        this.id = id; 
        this.description = description; 
        this.value = value; 
    };

    var data  ={
        allitems: {
            exp: [],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        totalsum: 0,
        percentage:-1
    };

    var calcTotal = function(type){
        var sum = 0; 
        data.allitems[type].forEach(function(cur){
            sum+=cur.value;
        });
        data.totals[type] = sum;
        
        
    };


    return {
        addItem: function (type, des, value){

            var newItem ,ID; 
            if(data.allitems[type].length>0){
                ID = data.allitems[type][data.allitems[type].length-1].id+1;
            }else{
                ID= 0; 
            }

            if (type ==='exp'){
                newItem = new Expense(ID,des,value);
            }else if(type ==='inc'){
                newItem = new Income (ID,des,value);
            }
            data.allitems[type].push(newItem);

            return newItem; 
        },

        calcBudget: function(){
            calcTotal('exp');
            calcTotal('inc');

            data.totalsum = data.totals.inc -data.totals.exp;
            if(data.totals.inc>0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
            }else{
                data.percentage = -1;
            }

            


        },
        getBudget: function(){
            return {
                budget: data.totalsum,
                totalInc:data.totals.inc,
                totalExp: data.totals.exp, 
                percentage: data.percentage
            };
        },

        testing: function(){
            console.log(data);
        }


    };

})();


 

var UIController = (function(){
    
    
    var DOMstring = {
        inputType:'.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'

    };


     
    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMstring.inputType).value,//will be either inc or exp. 
                description: document.querySelector(DOMstring.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstring.inputValue).value)
            };
            
        },
        //Add list to the DOM. 
        addListItem: function(obj, type){
            var html,newHtml,element; 
            //create an html screen with placeholder text. 
           
           if(type==='inc'){
               element = DOMstring.incomeContainer; 
               html ='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

           }else if (type ==='exp'){
               element = DOMstring.expensesContainer;
               html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
           }

            //place the placeholder text with actual data. 
           newHtml = html.replace('%id%',obj.id);
           newHtml = newHtml.replace('%description%',obj.description);
           newHtml = newHtml.replace('%value%',obj.value);

            //insert the HTML into the DOM. 
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },
        clearFields:function(){
            var fields,fieldsArr;

            fields = document.querySelectorAll(DOMstring.inputDescription+','+DOMstring.inputValue);
            //convert the nodeList to Array.

            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,array){
                current.value = ""; 
            });

            //focus on the first item which is the description. 
            fieldsArr[0].focus();


        },
        displayBudget:function(obj){
            document.querySelector(DOMstring.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstring.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstring.expenseLabel).textContent = obj.totalExp;

            if(obj.percentage>0){
                document.querySelector(DOMstring.percentageLabel).textContent = obj.percentage+'%';
            }else{
                document.querySelector(DOMstring.percentageLabel).textContent = '---';

            }

        },
        getDOMstring: function (){
            return DOMstring;
        }
    };
})();





var controller = (function(budgetCtrl,UICtrl){
    var DOM = UICtrl.getDOMstring(); 

    var setEventListener = function(){
        document.querySelector(DOM.inputButton).addEventListener('click',cntrlAddItem());

        document.addEventListener('keypress',function(event){
            if(event.keyCode===13){
                cntrlAddItem();
            }
        });
    };

    var updateBudget = function(){

        //Calculate the budget. 
        budgetCtrl.calcBudget();

        //return the budget. 
        var budget = budgetCtrl.getBudget();
        
        //Display the budget to the UI

        UICtrl.displayBudget(budget);

    };

    var cntrlAddItem = function(){
        //Get the field input data. 
        var input, newItem; 

        input = UICtrl.getInput();
        // Add the item to the budget controller.
        
        if(input.description !=="" && !isNaN(input.value)&& input.value>0){
            
            newItem = budgetController.addItem(input.type, input.description,input.value);
            
            //Add the item to the UI

            UICtrl.addListItem(newItem,input.type);

            //clear the fields. 
            UICtrl.clearFields();
         
            //5.Calculate and update budget. 
            updateBudget();

        }
        
    }

    return {
        init: function(){
            console.log('The Initialization function has been started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc:0,
                totalExp: 0, 
                percentage: -1
            })
            setEventListener();
        } 

    };

})(budgetController,UIController);

controller.init();










