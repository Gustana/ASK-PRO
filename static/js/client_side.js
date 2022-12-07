//define font-awesome icon for prediction result

var classification_icon_map = {
  "airplane":"fa-plane", 
  "automobile":"fa-car", 
  "bird":"fa-dove", 
  "cat":"fa-cat", 
  "deer":"fa-horse-head", 
  "dog":"fa-dog", 
  "frog":"fa-frog", 
  "horse":"fa-horse", 
  "ship":"fa-ship", 
  "truck":"fa-truck"
}

var prediction_glob_class = ''

$(document).ready(function(){
  
  // -[Animasi Scroll]---------------------------
  
  $(".navbar a, footer a[href='#halamanku']").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function(){
        window.location.hash = hash;
      });
    } 
  });
  
  $(window).scroll(function() {
    $(".slideanim").each(function(){
      var pos = $(this).offset().top;
      var winTop = $(window).scrollTop();
        if (pos < winTop + 600) {
          $(this).addClass("slide");
        }
    });
  });

  $('#predict_comment').click(function(e){
    e.preventDefault()

    setTimeout(function(){
      try{
        $.ajax({
          url: '/api/sentiment_analysis_text',
          type: 'POST',
          data:{
            'comment': $('#comment').val()
          },
          success: function(res){
            console.log(res)
            alert('Sentiment: ' + res.sentiment)
          }
        })
      }catch(e){
        console.log(e)
      }
    }, 2000)

  })

  $('#brand_select').on('change', function(){
    cls = this.value

    setTimeout(function(){
      try{
        $.ajax({
          url: '/api/sentiment_analysis_brand',
          type: 'POST',
          data:{
            'class': cls
          },
          success: function(res){
            console.log(res)
            generate_brand_img(cls)
            showSentiment(res.positive_sentiment, res.negative_sentiment)
          }
        })
      }catch(e){
        console.log(e)
      }
    }, 2000)
  })


  function generate_brand_img(cls){
    $('.sentiment_col').css('display', 'block')
    img = $('#brand_img_prediction')
    if(cls=='scarlet'){
      img.attr('src', '../static/images/brand/scarlet.webp')
    }else if(cls=='wardah'){
      img.attr('src', '../static/images/brand/wardah.webp')
    }else if(cls=='mustika'){
      img.attr('src', '../static/images/brand/mustika.webp')
    }
  }

  function showSentiment(positive, negative){
    $('#positive_sentiment').text('Positive: '+positive+'%')
    $('#negative_sentiment').text('Negative: '+negative+'%')
  }
    

  //!code from dummy web
  $('#btn_explore').click(()=>{
    scrollToView($('.content_container')[0])
  })

  $('#btn_landing_section').click(()=>{
    scrollToView($('.landing_container')[0])
  })

  $('#btn_footer_section').click(()=>{
    scrollToView($('.footer')[0])
  })

  var slideImgFromLeft = {
    distance: '70%',
    origin: 'left',
    opacity: 0.2,
    duration: 2000
  };
  
  var slideImgFromRight = {
    distance: '40%',
    origin: 'right',
    opacity: 0.2,
    duration: 2000
  };
  
  var slideFruitNameFromRight = {
    distance: '30%',
    origin: 'right',
    opacity: 0,
    duration: 1000,
  };
  
  var slideFruitNameFromLeft = {
    distance: '30%',
    origin: 'left',
    opacity: 0,
    duration: 1000,
  };
  
  var slideFromBottom = {
    distance: '70%',
    origin: 'bottom',
    opacity: 0,
    duration: 2500,
  };
  
  reveal('.img_fruits_left', slideImgFromLeft)
  reveal('.label_name_right', slideFruitNameFromRight)
  
  reveal('.img_fruits_right', slideImgFromRight)
  reveal('.label_name_left', slideFruitNameFromLeft)
  
  reveal('.label_desc', slideFromBottom)
  
  
  //* hide navbar if landing page is visible
  document.addEventListener('scroll', ()=>{
    if(isInViewport($(".landing_container")[0])){
      $(".floating_btn").css('visibility', 'hidden')
    }else{
      $(".floating_btn").css('visibility', 'visible')
    }
  
  })

})

function scrollToView(destination){
  destination.scrollIntoView()
  destination.scrollIntoView(true);
  destination.scrollIntoView({block: "start"});
  destination.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}

function reveal(element, options){
  ScrollReveal().reveal(element, options)
}

function isInViewport(el) {
  
  var rect     = el.getBoundingClientRect(),
        vWidth   = window.innerWidth || document.documentElement.clientWidth,
        vHeight  = window.innerHeight || document.documentElement.clientHeight,
        efp      = function (x, y) { return document.elementFromPoint(x, y) };     

    // Return false if it's not in the viewport
    if (rect.right < 0 || rect.bottom < 0 
            || rect.left > vWidth || rect.top > vHeight)
        return false;

    // Return true if any of its four corners are visible
    return (
          el.contains(efp(rect.left,  rect.top))
      ||  el.contains(efp(rect.right, rect.top))
      ||  el.contains(efp(rect.right, rect.bottom))
      ||  el.contains(efp(rect.left,  rect.bottom))
    );
}

function onImgSelected(event){
  //show loading
  $('#predictLoad').css('display', 'block')
  // $('#predictIconPlaceholder').css('display', 'none')
  $('#predictionResTxt').css('display', 'none')
  var selectedImg = event.target.files[0]

  if(typeof selectedImg === 'undefined'){
    $('#uploadedImg').css('display', 'none')
    $('#uploadedImgPlaceholder').css('display', 'block')

    $('#predictLoad').css('display', 'none')
    $('#predictionResTxt').css('display', 'none')
  }else{
    var reader = new FileReader()

    var imgtag = $('#uploadedImg')[0]

    reader.onload = function(event){
      imgtag.src = event.target.result
    }

    reader.readAsDataURL(selectedImg)
    $('#uploadedImg').css('display', 'block')
    $('#uploadedImgPlaceholder').css('display', 'none')

    predictImg(selectedImg)
    
  }
}

function predictImg(uploadedImg){
  let formData = new FormData()
  formData.append('file', uploadedImg)

  setTimeout(()=>{
    try{
      $.ajax({
        url: 'api/deteksi',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: (response)=>{
          res_data_prediksi   = response['prediksi']
          res_gambar_prediksi = response['gambar_prediksi']
        
          // show prediction result to front-end
          generatePrediction(res_data_prediksi); 
        }
      })
    }catch(e){
      console.log('unexpected error')
    }
  }, 1000)
}

function generatePrediction(prediction_class){
  prediction_glob_class = classification_icon_map[prediction_class]
  // $('#predictIconPlaceholder').removeClass('fa-image '+prediction_glob_class).addClass(prediction_glob_class)

  $('#predictLoad').css('display', 'none')
  // $('#predictIconPlaceholder').css('display', 'block')

  //show prediction text and set the value
  $('#predictionResTxt').css('display', 'block')
  $('#predictionResTxt').text(prediction_class)

  console.log(prediction_class)
}