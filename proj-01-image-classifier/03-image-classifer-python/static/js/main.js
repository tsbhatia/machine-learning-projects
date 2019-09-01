$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#result').hide();

    // upload preview
    function readURL(input){
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
    });

    // predict
    $('#btn-predict').click(function (){
        var form_data = new FormData($('#upload-file')[0]);

        // show loading animation
        $(this).hide();
        $('.loader').show();

        // Make prediction by calling the api /prediction
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data){
                // get and display result
                $('.loader').hide();
                $('#result').fadeIn(600);
                $('#result').text(' Best Guess: ' + data);
                console.log('Success!');
            },

        });
    });
});
