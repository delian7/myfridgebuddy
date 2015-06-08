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
  // console.log(string)
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

function makeList(array) {
    var tmpArray = []
    $.each(array, function(i, value) {

        tmpArray.push(capitalize(value));
    });

    return tmpArray;
};


function displayResults(apiArray) {
  // var tbody = $("#recipe-result-table").find('tbody');
  var recipe_result_area = $('#recipe-result-area')

  $.each(apiArray, function(key, value) {

    var title = $("<div class='row'><div class='col-md-12 text-center'><h3>" + value.name + "</h3></div></div>");
    var row = $("<div class='row'></div>");
    var pic_col = $("<div class='col-md-5'><img id='recipeThumb' onerror='imgError(this);' src='" + value.thumb + "'></div>");
    var ingredients_col = $("<div class='col-md-offset-1 col-md-6'>" + makeList(value['ingredients']).join('') + "</div>");
    var info_button = $("<div class='row' id='"+ value.id + "-directions-button-column'></div>");

    row.append(title);
    row.append(pic_col);
    row.append(ingredients_col);
    row.append(info_button);
    recipe_result_area.append(row);

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
      var pic_url = recipes["image"] //string

      //recipe_ingredients array
      var recipe_ingredients = []
      $.each(recipes['ingredients'], function(i, value){
        recipe_ingredients.push(value['name']);
      });

      //directions array
      var directions = recipes['directions']

      ///nutritional_info array
      var nutritional_info = []
      $.each(recipes["nutritional_info"], function(i, value){
        nutritional_info.push(value);
      });

      makeRecipeModal(id, pic_url, name, recipe_ingredients, directions, nutritional_info)
    },
    error: function(err) {
      console.log(err);
    }
  });
};

function makeRecipeModal(id, pic_url, name, recipe_ingredients, directions, nutritional_info) {

  $('#modal-areas').append('<div class="modal fade" id="'+ id + '" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="recipe-name"></h4> </div><div class="modal-body"> <div class="row"> <div class="col-lg-6"> <img id="recipe-image" class="img-circle" onerror="imgError(this);" height="200" width="200" > </div><div class="col-lg-6"> <h4 class="modal-title">Ingredients</h4> <ul id="ingredients-list"> </ul> </div></div><div class="row"> <div class="col-lg-12"> <h4 class="modal-title">Directions</h4> <ol id="directions-list"> </ol> </div></div><div class="row"> <div class="col-lg-12"> <h4 class="modal-title">Nutritional Information</h4> <ul id="nutritional_info"> </ul> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> </div></div></div>');

  $('#' + id + '-directions-button-column').html("<div class='col-md-12'><button style='margin-top: 1em' class='btn btn-primary btn-block' data-toggle='modal' data-target='#"+ id + "'>Directions</button></div>");
  $('#' + id + ' #recipe-name').html(name);
  $('#' + id + ' #recipe-image').attr('src', pic_url);
  $('#' + id + ' #ingredients-list').html(makeList(recipe_ingredients).join(''));
  $('#' + id + ' #directions-list').html(makeList(directions).join(''));
  $('#' + id + ' #nutritional_info').html(makeList(nutritional_info));


  // <div class='col-md-12'><button style='margin-top: 1em' class='btn btn-primary btn-block'>Directions</button></div>

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

            //if the recipe search starts at the beginning [at 0] (when a user enters a new ingredient or deletes ingredient)
            if (offset == 0) {
              $("#modal-areas").empty(); // we don't want to keep irrelevant modals
              $("#recipe-result-area").empty(); // we don't want to keep irrelevant results
            }
            displayResults(response["results"]);
            setup_pagination(response["total"]);
        },
        error: function(err) {
            console.log(err);
        }
    });
};
