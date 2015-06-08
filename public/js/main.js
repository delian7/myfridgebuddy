var app_id = "443bc846"
var app_key = "a696d6b8bf9139a1f1cc045bf8ee6464"
var ingredients = [];
var last_recipe_displayed = 0;

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

            last_recipe_displayed = 0;
            //add the ingredient to the ingredients array to use it later
            ingredients.push(ingredient);
        }
        else {
            alert(ingredient + ' was already entered');
        }

        //clears the form
        $(this).val("");

        e.preventDefault();

        retrieveRecipes(0);


        //return false since we don't want the focus to 'tab' to another element
        return false;
    };
});


$("#recipeForm").submit(function(e) {



    if (e.which==13){

    }
    else{
        e.preventDefault();
    retrieveRecipes(0);
}

});
function removespan(span,ingredient){
    $('#' + ingredient + '-button').remove();
    span.parentNode.innerHTML = "";
    var itemtoRemove = ingredient;
    ingredients.splice($.inArray(itemtoRemove, ingredients),1);


    if(ingredients.length !=0){
            retrieveRecipes(0);
    }


}

function capitalize(string) {
  return "• " + string.charAt(0).toUpperCase() + string.substring(1);
}

function setup_pagination(total_results) {
  $('#next-button').removeAttr('style'); //unhides the next button


  if(last_recipe_displayed < total_results - 10) {
    last_recipe_displayed += 10;
    $('#next-button').attr('onclick', 'retrieveRecipes(' + last_recipe_displayed + ')')
  }
  else {
    $('#next-button').attr('style', 'display:none');
  }

}

function imgError(image) {
    image.onerror = "";
    image.src = "/images/noimage.jpg";
    return true;
}


function displayResults(apiArray) {
  var tbody = $("#recipe-result-table").find('tbody');
  $.each(apiArray, function(key, value) {

    recipeIngredients = [];
    $.each(value["ingredients"], function(key, ingredient) {
      recipeIngredients.push(capitalize(ingredient));
    });

    var row = $('<tr>').append(
      //some images are given 404 error so onerror handles this
      $('<td style="width:30%"></td>').html("<img id='recipeThumb' onerror='imgError(this);' src=" + value.thumb + ">"),
      $('<td id="recipe-content-column"></td>').html("<a href=" + value.url + ">" + value.name + "</a>" + "<br><br>" + recipeIngredients.join("<br>")),
      $('<td class="middle-align"></td>').html("<br/><br/><a class='btn-lg btn btn-success' id='direction-button' href='#'>Directions</a>")

    );
    tbody.append(row);

    retrieveRecipeSpecifics(value.url);

  });
}

function retrieveRecipeSpecifics(recipeURL) {
  $.ajax({
    url: recipeURL,
    type: "get",
    success: function(response) {
      makeRecipeModal(response);
    },
    error: function(err) {
      console.log(err);
    }
  });
};

function makeRecipeModal(recipes) {
  var name = recipes["name"]; //string
  var ingredients = recipes["ingredients"]; //array
  var directions = recipes["directions"]; //array
  var nutritional_info = recipes["nutritional_info"]; //array

};

function retrieveRecipes(offset) {
    $.ajax({
        url: "http://api.pearson.com:80/kitchen-manager/v1/recipes",
        type: "get", //send it through get method
        data: {
            "ingredients-all": String(ingredients), //API wants a comma-seperated string
            "offset": offset //for pagination purposes, at what recipe should the display results return the (next 10) recipes

        },
        success: function(response) {
            $("#recipe-result-table").find('tbody').empty();
            displayResults(response["results"]);
            setup_pagination(response["total"]);
        },
        error: function(err) {
            console.log(err);
        }
    });
};
