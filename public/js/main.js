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
  return "<li>" + string.charAt(0).toUpperCase() + string.substring(1) + "</li>";
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
  // var tbody = $("#recipe-result-table").find('tbody');
  var recipe_result_area = $('#recipe-result-area')

  $.each(apiArray, function(key, value) {

    recipeIngredients = [];
    $.each(value["ingredients"], function(key, ingredient) {
      recipeIngredients.push(capitalize(ingredient));
    });

    var title = $("<div class='row'><div class='col-md-12 text-center' style='margin-top: 1em'><h3>" + value.name + "</h3></div></div>");
    var row = $("<div class='row'></div>");
    var pic_col = $("<div class='col-md-5'><img id='recipeThumb' onerror='imgError(this);' src='" + value.thumb + "'></div>");
    var ingredients_col = $("<div class='col-md-offset-1 col-md-6'>" + recipeIngredients.join('') + "</div>");
    var info_button = $("<div class='row'><div class='col-md-12'><button style='margin-top: 1em' class='btn btn-primary btn-block'>Directions</button></div></div>");

    row.append(title);
    row.append(pic_col);
    row.append(ingredients_col);
    row.append(info_button);
    recipe_result_area.append(row);



    // var row = $('<tr>').append(
    //   //some images are given 404 error so onerror handles this
    //   $('<td style="width:30%"></td>').html("<img id='recipeThumb' onerror='imgError(this);' src=" + value.thumb + ">"),
    //   $('<td id="recipe-content-column"></td>').html("<a href=" + value.url + ">" + value.name + "</a>" + "<br><br>" + recipeIngredients.join("<br>")),
    //   $('<td class="middle-align"></td>').html("<br/><br/><a class='btn-lg btn btn-success' id='direction-button' href='#'>Directions</a>")
    //
    // );
    // tbody.append(row);

    retrieveRecipeSpecifics(value.url);

  });
}

function retrieveRecipeSpecifics(recipeURL) {
  $.ajax({
    url: recipeURL,
    type: "get",
    success: function(recipes) {
      var id = recipes["id"]; //string
      var name = recipes["name"]; //string
      var ingredients = recipes["ingredients"]; //array
      var directions = recipes["directions"]; //array
      var nutritional_info = recipes["nutritional_info"]; //array
      makeRecipeModal(id, name, ingredients, directions, nutritional_info)
    },
    error: function(err) {
      console.log(err);
    }
  });
};

function makeRecipeModal(id, name, ingredients, directions, nutritional_info) {

  $('#modal-areas').append('<div class="modal fade" id="'+ id + '" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="recipe-name"></h4> </div><div class="modal-body"> <div class="row"> <div class="col-lg-6"> <img src="/images/food.jpg" class="img-circle" height="200" width="200" > </div><div class="col-lg-6"> <h4 class="modal-title">Ingredients</h4> <ul id="ingredients-list"> </ul> </div></div><br><br><div class="row"> <div class="col-lg-12"> <h4 class="modal-title">Directions</h4> <ol id="directions-list"> </ol> </div></div><div class="row"> <div class="col-lg-12"> <h4 class="modal-title">Nutritional Information</h4> <ul id="nutritional_info"> </ul> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> </div></div></div>');

  $('#' + id + ' #recipe-name').html(name);
  $('#' + id + ' #ingredients-list').html("<li>Ingredients</li>");
  $('#' + id + ' #directions-list').html("<li>Directions</li>")
  $('#' + id + ' #nutritional_info').html("<li>Nutritional Information</li>")

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
            $("#modal-areas").empty(); //since we don't want to keep loading modals
            //if the recipe search starts at the beginning [at 0] (when a user enters a new ingredient or deletes ingredient)
            if (offset == 0)
              $("#recipe-result-table").find('tbody').empty();
            displayResults(response["results"]);
            setup_pagination(response["total"]);
        },
        error: function(err) {
            console.log(err);
        }
    });
};
