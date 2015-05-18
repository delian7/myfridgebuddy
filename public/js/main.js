var app_id = "443bc846"
var app_key = "a696d6b8bf9139a1f1cc045bf8ee6464"
var ingredients = [];

$('#ingredientInputField').keydown(function(e){
    var ingredient = $(this).val();

    //if enter or tab is pressed
    if(e.which == 13 || e.which == 9) {

        var ingredient = $(this).val();

        $('#ingredient-display').append('<span class="btn btn-primary btn-lg ingredient-pill">'+ ingredient + '&nbsp;<span id="remove-'+ ingredient + '" class="glyphicon glyphicon-remove-circle"></span>');

        //clears the form
        $(this).val("");
        
        //return false since we don't want the focus to 'tab' to another element
        return false;
    };

});


$("#recipeForm").submit(function(e) {
    e.preventDefault();
    // var inputs = $(this).serializeArray(); //gets the user inputted ingredients
    //
    // $.each(inputs, function(key, value) {
    //     ingredients.push(value.value);
    // });
    //
    // ingredients.push('milk');
    //
    //
    // retrieveRecipes();
});

function retrieveRecipes() {

    $.ajax({
        url: "http://api.yummly.com/v1/api/recipes",
        type: "get", //send it through get method
        data: {
            _app_id: app_id,
            _app_key: app_key,
            requirePictures: true,
            allowedIngredient: ingredients

        },
        success: function(response) {




            $.each(response["matches"], function(key, value) {
                $("#recipe-result-table").find('tbody')
                    .append($('<tr>')
                        .append($('<td>')
                            .append(value.recipeName)
                        )
                    );
            })
        },
        error: function(err) {
            console.log(err);
        }
    });
};
