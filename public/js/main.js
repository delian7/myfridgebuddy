var app_id = "443bc846"
var app_key = "a696d6b8bf9139a1f1cc045bf8ee6464"
var ingredients = [];

$('#ingredientInputField').keydown(function(e){
    var ingredient = $(this).val();

    //if enter or tab is pressed
    if(e.which == 13 || e.which == 9) {
        if (ingredient === ""|| ingredient === " "){

            return false;
        }

        //if ingredient is NOT in the array
        if( $.inArray(ingredient, ingredients) == -1){
            var ingredient = $(this).val();
            $.trim(ingredient);

            $('#ingredient-display').append('<span id='+ingredient+'-button class="btn btn-primary btn-lg ingredient-pill">'+ ingredient + '&nbsp;<span id="remove-'+ ingredient + '" class="glyphicon glyphicon-remove-circle" onClick = "removespan(this,\'' + ingredient +'\');"></span>');

            //add the ingredient to the ingredients array to use it later
            ingredients.push(ingredient);
        }
        else {
            alert(ingredient + ' was already entered');
        }

        //clears the form
        $(this).val("");

        e.preventDefault();

        $("#recipe-result-table").find('tbody').empty();
        retrieveRecipes();


        //return false since we don't want the focus to 'tab' to another element
        return false;
    };
});


$("#recipeForm").submit(function(e) {
    $("#recipe-result-table").find('tbody').empty();



    if (e.which==13){

    }
    else{
        e.preventDefault();
    retrieveRecipes();
}

});
function removespan(span,ingredient){
    $('#' + ingredient + '-button').remove();
    span.parentNode.innerHTML = "";
    var itemtoRemove = ingredient;
    ingredients.splice($.inArray(itemtoRemove, ingredients),1);
    $("#recipe-result-table").find('tbody').empty();

    if(ingredients.length !=0){
            retrieveRecipes();
    }


}

function displayResults(apiArray) {

  var tbody = $("#recipe-result-table").find('tbody');

  $.each(apiArray, function(key, value) {

    recipeIngredients = [];
    $.each(value["ingredients"], function(key, ingredient) {
      recipeIngredients.push(capitalize(ingredient));



      // capitalizeMe.charAt(0).toUpperCase() + capitalizeMe.substring(1);
    });

    console.log(recipeIngredients);
    // console.log(value)
      var row = $('<tr>').append(
        //some images are given 404 error so onerror handles this
        $('<td style="width:30%"></td>').html("<img id='recipeThumb' onerror='imgError(this);' src=" + value.thumb + ">"),
        $('<td id="recipe-content-column"></td>').html("<a href=" + value.url + ">" + value.name + "</a>" + "<br><br>" + recipeIngredients.join("<br>")),
        $('<td class="middle-align"></td>').html("<br/><br/><a class='btn-lg btn btn-success' href='/'>Directions</a>")
      //call Recipe PAge Function


      );



      tbody.append(row);

  });
}


function capitalize(string) {
  return "• " + string.charAt(0).toUpperCase() + string.substring(1);
}

function imgError(image) {
    image.onerror = "";
    image.src = "/images/noimage.jpg";
    return true;
}
function RecipePage() {
bootbox.dialog({
  /**
   * @required String|Element
   */
  message: "Picture  Recipe Name\n Ingrediants \n Quantity Ingrediant \n ... \n Directions \n full directions ",
  
  /**
   * @optional String|Element
   * adds a header to the dialog and places this text in an h4
   */
  title: "Recipe",
  
  /**
   * @optional Function
   * allows the user to dismisss the dialog by hitting ESC, which
   * will invoke this function
   */
 // onEscape: function() {},
  
  
  
 
   
   // "Another label": function() {}
  
});

}

function retrieveRecipes() {
    $.ajax({
        url: "http://api.pearson.com:80/kitchen-manager/v1/recipes",
        type: "get", //send it through get method
        data: {
            "ingredients-all": String(ingredients) //API wants a comma-seperated string

        },
        success: function(response) {
            displayResults(response["results"])
        },
        error: function(err) {
            console.log(err);
        }
    });
};

